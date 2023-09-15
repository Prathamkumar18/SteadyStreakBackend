const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const db=require('./db');
const ip='0.0.0.0';

const app = express();
const port = process.env.PORT || 8082;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(port,ip, () => {
  console.log(`Server is running on port ${port}`);
});
