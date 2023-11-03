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

// Require- It is used for importing the external modules or files into your JavaScript code.
// express - It is the framework for the nodejs ..it simplifies the process.
// BodyParser- It is a middleware.It extracts data from the request body and makes it accessible in your Express routes.
// app.use(req,res,next)- Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle
// node_modules is a directory in a Node.js project that typically contains all the third-party libraries and packages (also known as modules) that your project depends on.