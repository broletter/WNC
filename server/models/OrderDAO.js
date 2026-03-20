require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  // insert order
  async insert(order) {
    const mongoose = require('mongoose');

    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);

    return result;
  },

  // lấy danh sách order theo customer id
  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();

    return orders;
  }
};

module.exports = OrderDAO;