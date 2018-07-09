import q from './queries';
import { rowToAuthToken, rowToDatabase, rowToUser } from './structs';
import { withSandbox } from './postgres';

// TODO: This file has the legacy sandbox abstraction, and should be removed over time. Please do not add to it, and instead opt for using the QueryContext abstraction found in this directory at context.js.

export default class StorageSandbox {
  constructor(auth) {
    this.auth = auth;
  }

  /**
   * Runs a read-only query in the sandbox.
   */
  query(query) {
    return null;
  }

  /**
   * Finds the current User.
   * @returns {Promise<?User>} the User
   */
  findMe() {
    return withSandbox(this.auth, async t => {
      const row = await t.oneOrNone(q.findMe);
      return row ? rowToUser(row) : null;
    });
  }

  /**
   * Finds all AuthTokens for a User.
   * @returns {Promise<Array<AuthToken>>} the AuthTokens
   */
  findAllAuthTokens() {
    return withSandbox(this.auth, async t => {
      const rows = await t.manyOrNone(q.findAllAuthTokens);
      return rows.map(rowToAuthToken);
    });
  }

  /**
   * Finds an AuthToken.
   * @param {string} id the identifier of the AuthToken
   * @returns {Promise<?AuthToken>} the AuthToken
   */
  findAuthToken(id) {
    return withSandbox(this.auth, async t => {
      const row = await t.oneOrNone(q.findAuthToken, { id });
      return row ? rowToAuthToken(row) : null;
    });
  }

  /**
   * Deletes an AuthToken.
   * @param {string} id the identifier of the AuthToken
   * @returns {Promise<Boolean>} whether or not the AuthToken was deleted
   */
  deleteAuthToken(id) {
    return withSandbox(this.auth, async t => {
      const row = await t.oneOrNone(q.deleteAuthToken, { id });
      return !!row;
    });
  }

  /**
   * Finds all Databases a User can access.
   * @returns {Promise<Array<Database>>} the Databases
   */
  findAllDatabases() {
    return withSandbox(this.auth, async t => {
      const rows = await t.manyOrNone(q.findAllDatabases);
      return rows.map(rowToDatabase);
    });
  }

  /**
   * Finds a Database.
   * @param {string} id the identifier of the Database
   * @returns {Promise<?Database>} the Database
   */
  findDatabase(id) {
    return withSandbox(this.auth, async t => {
      const row = await t.oneOrNone(q.findDatabase, { id });
      return row ? rowToDatabase(row) : null;
    });
  }

  /**
   * Finds the user's default Database.
   * @returns {Promise<?Database>} the default Database
   */
  findDefaultDatabase() {
    return withSandbox(this.auth, async t => {
      const row = await t.oneOrNone(q.findDefaultDatabase);
      return row ? rowToDatabase(row) : null;
    });
  }

  /**
   * Retrieves the Database's schema.
   * @param {Database|string} database the Database
   * @returns {Promise<?DatabaseSchema>} the DatabaseSchema
   */
  async findDatabaseSchema(database) {
    return withSandbox(this.auth, async t => {
      // const databaseId = typeof database === 'string' ? database : database.id;
      const rows = await t.manyOrNone(q.findDatabaseSchema);
      const tables = {};
      for (const row of rows) {
        const tableKey = row.table_name;
        const tableValue = tables[tableKey] || { columns: [] };
        tableValue.columns.push({
          name: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable
        });
        tables[tableKey] = tableValue;
      }

      const sortedTableNames = Object.keys(tables).sort();
      return {
        tables: sortedTableNames.map(tableName => {
          const tableValue = tables[tableName];
          return {
            name: tableName,
            ...tableValue
          };
        })
      };
    });
  }
}
