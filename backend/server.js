const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const locationsRouter = require('./routes/location');

const app = express();
const PORT = process.env.PORT || 5002;

// MongoDB connection setup (make sure to set up your MongoDB URI)
mongoose.connect('mongodb+srv://destroyer:Portable@locationapp.w4vxggn.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/locations', locationsRouter);
app.get('/user-location', async (req, res) => {
  // Get the user's IP address from the request (you may need to adjust this depending on your setup)
  const userIp = req.ip;

  // Fetch the user's location based on their IP
  const location = await getIpLocation(userIp);

  // Send the location data as a JSON response
  res.json(location);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
