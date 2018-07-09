/* eslint-disable no-console */

import _ from 'lodash';
import fetch from 'node-fetch';
import fs from 'fs';
import google from 'googleapis';
import promiseRetry from 'promise-retry';
import sharp from 'sharp';
import vision from '@google-cloud/vision';

const ml = google.ml('v1');
const visionClient = vision();

const MAX_ALIASES = 1000;
const RANDOM_REVIEW = 0.005;
const MIN_GCP_MODEL_SCORE = 0.95;
const MIN_GCV_LOGO_SCORE = 0.5;
const GCP_KEY = JSON.parse(fs.readFileSync('key.json'));
const GCP_AUTO_DENY = ['confederate', 'swastika'];
const GCP_JWT_CLIENT = new google.auth.JWT(
  GCP_KEY.client_email,
  null,
  GCP_KEY.private_key,
  ['https://www.googleapis.com/auth/cloud-platform'],
  null
);

const GCV_BLACKLIST = fs
  .readFileSync('gcv-blacklist.txt')
  .toString()
  .split('\n');

function roundScore(score) {
  return Math.round(score * 100) / 100;
}

function processGCPModelResponse(data) {
  if (typeof data === 'string') {
    console.log(`Fixing string response from Google Cloud ML: ${data}`);
    const fixed = JSON.parse(data.replace('-Infinity', '1.0'));
    return processGCPModelResponse(fixed);
  } else if (data.predictions && data.predictions.length === 1) {
    const str = JSON.stringify(data);
    console.log(`Received response from Google Cloud ML: ${str}`);
    const out = data.predictions[0];
    const label = out.output_class;
    const score = roundScore(out.output_prob);
    if (label === 'background') {
      return { label: 'background', score };
    } else if (score < MIN_GCP_MODEL_SCORE) {
      return { label: 'background', score: 1 - score };
    } else {
      return { label, score };
    }
  } else if (data.error) {
    console.error(`Received error from Google Cloud ML: ${data.error}`);
    return { label: 'background', score: 0 };
  } else {
    console.error(`Received invalid response from Google Cloud ML: ${data}`);
    return { label: 'background', score: 0 };
  }
}

function callGCPModel(project, model, buffer) {
  const body = {
    instances: [{ input_bytes: { b64: buffer.toString('base64') } }]
  };
  return new Promise((resolve, reject) => {
    ml.projects.predict(
      {
        name: `projects/${project}/models/${model}`,
        resource: body,
        auth: GCP_JWT_CLIENT
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(processGCPModelResponse(data));
        }
      }
    );
  });
}

async function callGCV(buffer) {
  try {
    const [
      { logoAnnotations }
      // { logoAnnotations, safeSearchAnnotation }
    ] = await visionClient.annotateImage({
      image: { content: buffer.toString('base64') },
      features: [
        { type: vision.v1.types.Feature.Type.LOGO_DETECTION }
        // { type: vision.v1.types.Feature.Type.SAFE_SEARCH_DETECTION }
      ]
    });
    let label = '';
    let score = 0;
    const reasons = [];

    console.log(
      'Received response from Google Cloud Vision:',
      JSON.stringify({ logoAnnotations })
      // JSON.stringify({ logoAnnotations, safeSearchAnnotation })
    );

    const filteredLogoAnnotations = logoAnnotations.filter(
      a =>
        a.score >= MIN_GCV_LOGO_SCORE &&
        GCV_BLACKLIST.indexOf(a.description) === -1
    );
    if (filteredLogoAnnotations.length > 0) {
      label = filteredLogoAnnotations[0].description;
      score = Math.max(score, roundScore(filteredLogoAnnotations[0].score));
      reasons.push('may contain a copyrighted asset');
    }

    // for (const k of ['adult', 'violence', 'spoof', 'medical']) {
    //   if (safeSearchAnnotation[k] === 'VERY_LIKELY') {
    //     score = Math.max(score, 0.9);
    //     reasons.push('may contain inappropriate content');
    //   }
    // }

    return score === 0 ? null : { label, score, reasons };
  } catch (err) {
    console.error('Received error from Google Cloud Vision:', err);
    return null;
  }
}

async function preprocessImage(raw, size) {
  try {
    return await sharp(raw)
      .trim()
      .resize(size, size)
      .background({ r: 170, g: 170, b: 170, alpha: 1 })
      .flatten()
      .embed()
      .withoutEnlargement()
      .toBuffer();
  } catch (err) {
    if (err.message.indexOf('trimming') === -1) {
      throw err;
    } else {
      console.log(
        `Error trimming image to size ${size}x${size}: ${err.message}`
      );

      return sharp(raw)
        .resize(size, size)
        .background({ r: 170, g: 170, b: 170, alpha: 1 })
        .flatten()
        .embed()
        .withoutEnlargement()
        .toBuffer();
    }
  }
}

function process(url, prevState, aliases) {
  return promiseRetry(
    async (retry, number) => {
      try {
        console.log(`Attempt ${number} to process ${url}`);
        const imageRes = await fetch(url, { timeout: 10000 });
        const rawBuffer = await imageRes.buffer();
        const image139 = await preprocessImage(rawBuffer, 139);

        const moderationTag = await callGCPModel(
          'pavlov-mono',
          'moderation',
          image139
        );

        let label =
          moderationTag.label === 'background'
            ? 'APPROVE'
            : GCP_AUTO_DENY.indexOf(moderationTag.label) === -1
              ? 'REVIEW'
              : 'DENY';

        let score = moderationTag.score;
        let reasons = [];
        let state = prevState || {};

        if (moderationTag.label !== 'background') {
          reasons.push('may contain problematic content');
        }

        state.moderationTag = moderationTag;

        if (label === 'APPROVE') {
          if (!('gcvTag' in state)) {
            state.gcvTag = await callGCV(rawBuffer);
          }

          if (state.gcvTag) {
            label = 'REVIEW';
            score = state.gcvTag.score;
            reasons = reasons.concat(state.gcvTag.reasons);
          } else if (Math.random() < RANDOM_REVIEW) {
            label = 'REVIEW';
            reasons = reasons.concat('randomly selected for review');
          }
        }

        return { label, score, reasons, state, aliases };
      } catch (err) {
        return retry(err);
      }
    },
    {
      retries: 1
    }
  );
}

exports.run = function(req, res) {
  if (req.body.errors) {
    console.error(
      'Error receiving workflow function data:',
      JSON.stringify(req.body.errors)
    );

    res.send({
      label: 'APPROVE',
      score: 0,
      reasons: [],
      state: null,
      aliases: []
    });
    return;
  } else if (!('data' in req.body)) {
    console.error('Invalid workflow function data:', JSON.stringify(req.body));
    res.send({
      label: 'APPROVE',
      score: 0,
      reasons: [],
      state: null,
      aliases: []
    });
    return;
  }

  console.log('Received workflow function input:', JSON.stringify(req.body));

  const { decisions, image } = req.body.data.target;

  // support adding and removing aliases.
  let aliases = req.body.data.target.aliases || [];
  let state = req.body.data.target.state || {};
  state.lastRun = new Date().toISOString();

  if (
    req.body.args &&
    req.body.args.addAlias &&
    typeof req.body.args.addAlias === 'string'
  ) {
    aliases = _.union(aliases, [req.body.args.addAlias]);
  }

  if (
    req.body.args &&
    req.body.args.removeAlias &&
    typeof req.body.args.removeAlias === 'string'
  ) {
    _.remove(aliases, a => a === req.body.args.removeAlias);
  }

  /*
  If a new alias provided by addAlias would cause the target's number of
  aliases to exceed MAX_ALIASES, older aliases will be dropped to make room.
  Alias ordering ensures that the oldest aliases are those at the beginning
  of the array.
  */
  if (aliases.length > MAX_ALIASES) {
    console.log(`Aliases exceeding MAX_ALIASES of ${MAX_ALIASES}`);
    aliases = _.takeRight(aliases, MAX_ALIASES);
  }

  if (
    req.body.args &&
    req.body.args.setLabel &&
    typeof req.body.args.setLabel === 'string' &&
    ['APPROVE', 'DENY'].indexOf(req.body.args.setLabel) !== -1
  ) {
    res.send({
      label: req.body.args.setLabel,
      score: null,
      reasons: ['set via label override'],
      state,
      aliases
    });

    return;
  }

  if (decisions.length > 0) {
    const latestConsoleDecision = decisions.filter(d => !d.externalTask)[0];
    const externalDecisions = decisions.filter(d => d.externalTask);
    if (latestConsoleDecision) {
      console.log(
        'Using latest console decision:',
        JSON.stringify(latestConsoleDecision)
      );
      res.send({
        label: latestConsoleDecision.label,
        score: latestConsoleDecision.score,
        reasons: latestConsoleDecision.reasons,
        state,
        aliases
      });

      return;
    } else {
      const countDecisions = _.countBy(externalDecisions, 'label');

      if (countDecisions.APPROVE >= 1) {
        console.log('Using quorum(1) of external decisions (APPROVE)');
        res.send({
          label: 'APPROVE',
          score: null,
          reasons: [],
          state,
          aliases
        });

        return;
      } else if (countDecisions.DENY >= 1) {
        if (
          !state.moderationTag ||
          state.moderationTag.label === 'background'
        ) {
          console.log('Using quorum(1) of external decisions (ESCALATE)');
          res.send({
            label: 'ESCALATE',
            score: null,
            reasons: [],
            state,
            aliases
          });
        } else {
          console.log('Using quorum(1) of external decisions (DENY)');
          res.send({
            label: 'DENY',
            score: null,
            reasons: [],
            state,
            aliases
          });
        }

        return;
      }
    }
  }

  if (
    req.body.data.target.reasons.length === 1 &&
    req.body.data.target.reasons[0] === 'set via label override'
  ) {
    res.send({
      label: req.body.data.target.label,
      score: null,
      reasons: ['set via label override'],
      state,
      aliases
    });

    return;
  }

  if (!image) {
    console.error('Invalid workflow function input:', req.body);
    res.send({ label: 'APPROVE', score: 0, reasons: [], state, aliases });
    return;
  }

  const similarTargets = image.similarImagesWithLabel
    ? image.similarImagesWithLabel.map(
        s => (s.image.targets.length ? s.image.targets[0] : [])
      )
    : [];
  for (const similarTarget of similarTargets) {
    if (similarTarget.label === 'DENY') {
      const reasons =
        similarTarget.reasons.length === 0
          ? ['a previous target of a similar image was found']
          : similarTarget.reasons.map(
              r => `a previous target of a similar image ${r}`
            );

      res.send({
        label: 'DENY',
        score: similarTarget.score,
        reasons,
        state,
        aliases
      });
      return;
    }
  }

  const url = image.square512URL || image.rawURL;
  process(url, state, aliases)
    .then(output => {
      console.log(`Processed image ${image.id}: ${JSON.stringify(output)}`);
      res.send(output);
    })
    .catch(err => {
      console.error(err);
      res.send({ error: err.message });
    });
};
