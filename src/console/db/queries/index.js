import pgPromise from 'pg-promise';

export default pgPromise.utils.enumSql(
  __dirname,
  { recursive: true },
  f => new pgPromise.QueryFile(f)
);
