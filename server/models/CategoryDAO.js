require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
    // GET ALL
    async selectAll() {
        const query = {};
        const categories = await Models.Category.find(query).exec();
        return categories;
    },

    // ADD
    async insert(category) {
        const mongoose = require('mongoose');
        category._id = new mongoose.Types.ObjectId();
        const result = await Models.Category.create(category);
        return result;
    },

    // UPDATE  ✅ (BẠN ĐANG THIẾU)
    async update(category) {
        const newvalues = { name: category.name };
        const result = await Models.Category.findByIdAndUpdate(
            category._id,
            newvalues,
            { new: true }   // 🔥 bắt buộc
        );
        return result;
    },

    // DELETE ✅ (Mongoose 6+)
    async delete(_id) {
        const result = await Models.Category.findOneAndDelete({ _id });
        return result;
    }
};

module.exports = CategoryDAO;
