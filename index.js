const express = require('express');
const app = express();
const connectToMongo = require('./db');
const cors = require('cors');
port=5000;
// Middleware
app.use(cors());
app.use(express.json());

connectToMongo();

app.get('/', (req, res) => {
  res.send('API is running');
});

// Route imports
app.use('/api/admin', require('./Routes/admin'));
// app.use('/api/delivery', require('./routes/delivery'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
