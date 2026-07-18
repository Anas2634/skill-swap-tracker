const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skill', require('./routes/skillRoutes'));
app.use('/api', require('./routes/requestRoutes')); // matches, request, requests, accept, reject
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Skill Swap Backend is Running 🚀"
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));