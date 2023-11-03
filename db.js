const mongoose = require('mongoose');
const dbUrl="mongodb+srv://pratham_18:ConsistencyBackend123@cluster0.kakriwy.mongodb.net/?retryWrites=true&w=majority";

const dbConnection=mongoose.connect(dbUrl).then(()=>{
  console.log("MongoDb connected");
}).catch((e)=>{
  console.log(e);
});

module.exports = dbConnection;

//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a way to interact with MongoDB
//Mongoose allows you to define structures, or schemas, for your MongoDB documents. 
//Promise are the used for the asyncronous operation.. it will wait for some time to complete without blocking the main thread.
//Promise improve readability by using then() and catch() and also used for error handling using catch()
//module.exports is used to make the code available to other part of the application.