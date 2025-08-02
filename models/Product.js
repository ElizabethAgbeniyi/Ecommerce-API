
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  productName: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cost: Number,
  productImages: [String],
  description: String,
  stockStatus: String,
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
