const mongoose = require('mongoose');

const DeliveryRouteSchema = new mongoose.Schema({
  deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveries: [
    {
      customerName: String,
      address: String,
      product: String,
      status: { type: String, enum: ['pending', 'delivered'], default: 'pending' }
    }
  ],
  date: { type: Date, default: Date.now },
  earnings: Number
});

module.exports = mongoose.model('DeliveryRoute', DeliveryRouteSchema);
