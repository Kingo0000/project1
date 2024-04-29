module.exports = {
    development: {
      client: 'mysql2',
      connection: {
        host: 'localhost',
        user: 'root',
        password: 'king35761',
        database: 'nilefa',
        port: '3306'
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }
 };
  