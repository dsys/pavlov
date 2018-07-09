import Dropzone from 'react-dropzone';
import Icon from './Icon';
import React from 'react';
import S3Upload from 'react-s3-uploader/s3upload';
import colors from '../colors';

const MAX_SIZE = 1024 * 1024 * 1024 * 1; // 1 GiB
const S3_BUCKET_URL = 'https://pavlov-data-drop.s3.amazonaws.com/';

export default class DataDrop extends React.Component {
  state = {
    progress: null
  };

  handleDrop = files => {
    if (this.state.progress == null) {
      this.setState({ progress: 0 });
      this.s3Upload = new S3Upload({
        files,
        s3Url: S3_BUCKET_URL,
        signingUrl: '/s3/sign',
        contentDisposition: 'auto',
        uploadRequestHeaders: { 'x-amz-acl': 'private' },
        onFinishS3Put: this.handleFinish,
        onProgress: this.handleProgress,
        onError: this.handleError,
        preprocess: (file, next) => next(file)
      });
    }
  };

  handleProgress = progress => {
    this.setState({ progress });
  };

  handleFinish = e => {
    this.setState({ progress: null });
    this.s3Upload = null;

    alert(
      `${e.filename}\n\nThanks! We've received your file. Please send the above file reference to the Pavlov team. Your file will automatically be deleted in 3 days.`
    );
  };

  handleError = e => {
    this.setState({ progress: null });
    this.s3Upload = null;
    alert(`Oops! That file failed to upload. Try again?\n\n${e}`);
  };

  handleCancel = e => {
    e.preventDefault();
    this.s3Upload.abortUpload();
    this.s3Upload = null;
    this.setState({ progress: null });
  };

  render() {
    const { progress } = this.state;

    return (
      <div className="wrapper">
        <Dropzone
          disableClick={progress != null}
          accept={progress == null ? '' : 'not/a-mime-type'}
          multiple={false}
          className={progress == null ? 'not-uploading' : 'uploading'}
          activeClassName="active"
          rejectClassName="reject"
          maxSize={MAX_SIZE}
          onDropAccepted={this.handleDrop}
        >
          <div className="icon">
            <Icon name="drop" />
          </div>
          <p>
            {progress == null ? 'SECURE DATA DROP' : `Uploading ${progress}%`}
          </p>
          <p>
            {progress == null ? (
              'Drag a file here.'
            ) : (
              <a href="#" onClick={this.handleCancel}>
                cancel
              </a>
            )}
          </p>
        </Dropzone>
        <style jsx>{`
          .wrapper > :global(div) {
            border: dashed 2px ${colors.gray1};
            border-radius: 8px;
            position: relative;
            cursor: pointer;
            padding: 20px;
            text-align: center;
            color: ${colors.black};
            font-size: 14px;
          }

          .wrapper > :global(.active) {
            border: solid 2px ${colors.gray1};
          }

          .wrapper > :global(.reject) {
            border: solid 2px ${colors.red};
          }

          .wrapper > :global(.uploading) {
            border: solid 2px ${colors.purple3};
            background: white;
            box-shadow: 0 1px 5px ${colors.white};
            animation-duration: 4s;
            animation-name: glow;
            animation-iteration-count: infinite;
          }

          .icon {
            display: flex;
            justify-content: center;
          }

          a {
            color: ${colors.gray1};
          }

          @keyframes glow {
            0% {
              box-shadow: 0 1px 8px transparent;
            }

            50% {
              box-shadow: 0 1px 8px ${colors.purple3};
            }

            100% {
              box-shadow: 0 1px 8px transparent;
            }
          }
        `}</style>
      </div>
    );
  }
}
