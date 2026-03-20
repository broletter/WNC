const Models = require('./Models');

const CustomerDAO = {

  async selectByUsernameOrEmail(username, email) {

    const query = {
      $or: [
        { username: username },
        { email: email }
      ]
    };

    return await Models.Customer.findOne(query);
  },

  async selectByUsernameAndPassword(username, password) {

    const query = {
      username: username,
      password: password
    };

    return await Models.Customer.findOne(query);
  },

  async insert(customer) {

    return await Models.Customer.create(customer);
  },

  async active(id, token, active) {

    const query = {
      _id: id,
      token: token
    };

    const newValues = {
      active: active
    };

    return await Models.Customer.findOneAndUpdate(query, newValues);
  },

  async update(id, customer) {

    const result = await Models.Customer.findByIdAndUpdate(
      id,
      {
        username: customer.username,
        password: customer.password,
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      },
      { new: true }
    );

    return result;
  }

};

module.exports = CustomerDAO;