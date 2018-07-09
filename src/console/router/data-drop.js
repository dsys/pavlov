import s3Router from 'react-s3-uploader/s3router';

export default s3Router({
  bucket: 'pavlov-data-drop',
  region: 'us-west-2',
  headers: { 'Access-Control-Allow-Origin': '*' },
  ACL: 'private'
});
