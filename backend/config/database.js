const mongoose = require('mongoose');
var configResolve = require("../common/configResolver");
var monogodb_url = configResolve.getConfig().monogodb_url;

//Connect to MongoDB.
mongoose.Promise = global.Promise;
console.log("mongo url: " + monogodb_url);
mongoose.connect(monogodb_url, { useNewUrlParser: true , useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.log(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    });

module.export = { mongoose };
