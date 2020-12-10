const mongoose = require("mongoose");

require("dotenv").config({path:"variables.env"});

mongoose.Promise = global.Promise;

//conectar ao mongoDB via heroku
mongoose.connect(process.env.MONGODB_URI || process.env.LOCALHOST, { useNewUrlParser: true });

module.exports = mongoose;
