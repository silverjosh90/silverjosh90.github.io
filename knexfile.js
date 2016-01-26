require('dotenv')

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/faceit'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + "?ssl=true"
  }
};
