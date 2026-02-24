const mongoose = require('mongoose');
var configResolve = require("../common/configResolver");
// Prefer MONGODB_URI env var (set by Docker); fall back to dev.json
var monogodb_url = process.env.MONGODB_URI || configResolve.getConfig().monogodb_url;

// mongoose-unique-validator uses the old callback API (countDocuments(query, cb))
// which Mongoose 8 removed. Replace it with a no-op — MongoDB native unique
// indexes already enforce uniqueness at the DB level.
try {
    const uvKey = require.resolve('mongoose-unique-validator');
    require.cache[uvKey] = { id: uvKey, filename: uvKey, loaded: true, exports: function() {} };
} catch(e) {}

// Patch Connection.prototype.useDb so every workspace connection auto-inherits
// all globally registered models. Without this, calling .model(name) on a
// useDb() connection throws "Schema hasn't been registered for model X".
const _originalUseDb = mongoose.Connection.prototype.useDb;
mongoose.Connection.prototype.useDb = function(dbName, options) {
    const workspaceDb = _originalUseDb.call(this, dbName, { useCache: true, ...options });
    mongoose.modelNames().forEach(function(name) {
        if (!workspaceDb.modelNames().includes(name)) {
            workspaceDb.model(name, mongoose.model(name).schema);
        }
    });
    return workspaceDb;
};

//Connect to MongoDB.
mongoose.Promise = global.Promise;
console.log("mongo url: " + monogodb_url);
mongoose.connect(monogodb_url)
    .then(() => console.log('MongoDB Connected successfully'))
    .catch((err) => {
        console.log(err);
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    });

module.export = { mongoose };
