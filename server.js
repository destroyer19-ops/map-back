const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const locationsRouter = require('./routes/location');
const requestIp = require('request-ip'); // Import request-ip middleware



const app = express();
// ...

app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Your routes and other middleware here...
app.use(requestIp.mw()); // Add the middleware to capture the user's IP
const PORT = process.env.PORT || 5002;

// MongoDB connection setup (make sure to set up your MongoDB URI)
mongoose.connect('mongodb+srv://destroyer:Portable@locationapp.w4vxggn.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
// app.use(cors());s
app.use(express.json());
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is missing.' });
  }

  try {
    // You can customize the URL to use any geocoding service that suits your needs.
    // Here, we use Nominatim as an example.
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error('Error fetching location data.');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.use('/api/locations', locationsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
