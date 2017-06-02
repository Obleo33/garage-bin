
module.exports = {
  test: {
   client: 'pg',
   connection: process.env.DATABASE_URL || 'postgres://localhost/garage_bin_test',
   migrations: {
     directory: __dirname + '/db/migrations'
   },
   seeds: {
     directory: __dirname + '/db/seeds/test'
   }
 },
  development: {
    client: 'pg',
    connection: 'postgress://localhost/garage_bin',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },
    production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
};
