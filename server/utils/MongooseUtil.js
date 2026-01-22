const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri =
  `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}` +
  `@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}` +
  `?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log('✅ CONNECTED DB:', MyConstants.DB_DATABASE);
  })
  .catch(err => {
    console.error('❌ DB ERROR', err.message);
  });

module.exports = mongoose;
