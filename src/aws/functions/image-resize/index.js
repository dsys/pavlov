/* eslint-disable no-console */

const im = require('imagemagick');
const URL = require('url');
const fs = require('fs');
const http = require('http');
const https = require('https');

const MAX_SIZE = 512;
const MIN_SIZE = 16;

function successResponse(body) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/octet-stream' },
    isBase64Encoded: true,
    body: body.toString('base64')
  };
}

function clientErrorResponse(err) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: err.message })
  };
}

function serverErrorResponse(err, cb) {
  console.error(err);
  return {
    statusCode: 500,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: err.message })
  };
}

function processSize(size) {
  return Math.max(Math.min(parseInt(size, 10) || MAX_SIZE, MAX_SIZE), MIN_SIZE);
}

function getRequestAdapter(url) {
  const protocol = URL.parse(url).protocol;
  if (protocol === 'http:') return http;
  else if (protocol === 'https:') return https;
  else return null;
}

function downloadFile(url, filename, callback) {
  const adapter = getRequestAdapter(url);
  if (!adapter) {
    return callback(new Error('unknown protocol'));
  }

  const output = fs.createWriteStream(filename);
  output.on('error', err => {
    callback(err);
  });

  adapter
    .get(url, res => {
      if (res.statusCode >= 400) {
        output.end();
        return callback(new Error(`error fetching image: ${res.statusCode}`));
      }

      let imageDataLength = 0;

      // res.setEncoding('binary');
      res.on('data', chunk => {
        imageDataLength += chunk.length;
        output.write(chunk);
      });
      res.on('end', () => {
        output.end();
        if (imageDataLength > 0) {
          output.once('finish', () => {
            callback(null, imageDataLength);
          });
        } else {
          // retry after 5 seconds
          console.log(`Retrying fetch of image ${url} in 5 seconds`);
          setTimeout(() => downloadFile(url, filename, callback), 5000);
        }
      });
    })
    .on('error', err => {
      output.end();
      callback(err, null);
    });
}

function unlinkAll(files, callback) {
  if (files.length === 0) {
    callback(null);
  } else {
    fs.unlink(files[0], err => {
      if (err) {
        callback(err);
      } else {
        unlinkAll(files.slice(1), callback);
      }
    });
  }
}

exports.handle = function(e, ctx, cb) {
  const inputFile = `/tmp/${ctx.invokeid}.raw`;
  const outputFile = `/tmp/${ctx.invokeid}.png`;
  const url = e.queryStringParameters.url;
  const size = processSize(e.queryStringParameters.size);

  function cleanup(callback) {
    return unlinkAll([inputFile, outputFile], callback);
  }

  console.log(`Downloading image ${url}`);
  downloadFile(url, inputFile, (err, imageDataLength) => {
    if (err) {
      return cleanup(() => {
        cb(null, serverErrorResponse(err));
      });
    }

    console.log(`Received image ${inputFile} (len: ${imageDataLength})`);

    im.convert(
      ['-resize', `${size}x${size}>`, '-strip', inputFile, outputFile],
      err => {
        if (err) {
          return cleanup(() => {
            console.log(`Error resizing image ${inputFile}: ${err.message}`);
            cb(null, clientErrorResponse(err));
          });
        }

        fs.readFile(outputFile, 'binary', (err, output) => {
          return cleanup(() => {
            if (err) {
              console.log(`Error reading image ${inputFile}: ${err.message}`);
              return cb(null, clientErrorResponse(err));
            }

            console.log(`Sending resized PNG ${outputFile}`);
            const body = Buffer.from(output, 'binary');
            cb(null, successResponse(body));
          });
        });
      }
    );
  });
};
