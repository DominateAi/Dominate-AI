const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var uniqueValidator = require('mongoose-unique-validator');
var EmailProviders = require('../../common/constants/EmailProviders');
var ConnectStatus = require('../../common/constants/ConnectStatus');
var configResolve = require("../../common/configResolver");
var master_schema = configResolve.getConfig().master_schema;

var modelName = 'Connects';

const connectSchema = new mongoose.Schema({
    _id: {
         type: String, 
         default: uuid.v1
        },
    userId:{
            type: String
        },
    workspaceId:{ 
        type : String, 
        required:true 
    },
    user_email:{ 
        type :String, 
        required:true 
    },
    integrated_email:{ 
        type : String, 
        required:true 
    },
    access_token:{ 
        type : String, 
        required : true 
    },
    refresh_token:{ 
        type : String, 
        required:true 
    },
    tokens:{ 
        type : Object, 
        required:true 
    },
    isConnectDefaultClient:{ 
        type : Boolean, 
        default : false, 
        required : true 
    },
    provider:{
        type : String,
        required:true,
        enum:Object.values(EmailProviders)
    },
    status:{
        type : String,
        required:true,
        enum:Object.values(ConnectStatus)
    },
    profile:{
        type :Object
    }
}, { timestamps: true });

connectSchema.plugin(uniqueValidator);

connectSchema.statics = {
    findAccounts: function ( query, options ){
        var context = currentContext.getCurrentContext();
        var conn = this.db.useDb(context.workspaceId).model(modelName);
        return conn.find(query, options);
        //return this.db.useDb(master_schema).model(modelName).find(query, options); 
    },
    createAccounts: function ( data ){
        console.log("in connect model"); 
        var context = currentContext.getCurrentContext();
        var entityModel = this.db.useDb(context.workspaceId).model(modelName);
        var entity = new entityModel(data);
        return entity.save();
    },
    updateAccounts: function( query, updateData ){
        var options = { new: true, multi : true };
        var context = currentContext.getCurrentContext();
        var conn = this.db.useDb(context.workspaceId).model(modelName);
        return conn.updateMany(query, updateData, options);
        //return this.db.useDb( master_schema ).model( modelName ).updateMany(query, updateData, options);
    }
};

const Connect = mongoose.model(modelName, connectSchema);

module.exports = Connect;
 