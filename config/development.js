module.exports = {
  port: 9000,
  log : {
    level: 'silly',
    disabled: false
  },

  cors: {
    origins: ['http://localhost:3000'],
    maxAge: 3 * 60 * 60,
  },

  database: {
    host : 'vichogent.be',
    port : 40043,
    database : '186204mc',
    client: 'mysql2'
  }
}