const mongouri="mongodb://localhost:27017/walmart";
const mongoose = require('mongoose');
const contomongo=()=>{mongoose.connect(mongouri)
  .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
}
module.exports = contomongo;