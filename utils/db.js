const mongoose = require('mongoose');
const { isVolatile } = require('./volatile');

const connectionString = isVolatile()
  ? process.env.DB_CONNECTION_VOLATILE
  : process.env.DB_CONNECTION;

function connect() {
  mongoose
    .set('useNewUrlParser', true)
    .set('useFindAndModify', false)
    .set('useCreateIndex', true)
    .connect(connectionString)
    .then(() => console.log('Connected to the database'))
    .catch((err) => {
      console.log('An error occured while trying to connect to the database.');
      console.log(`${err.name}: ${err.message}`);
    });
}

module.exports = connect;
