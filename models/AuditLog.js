const mongoose =
require('mongoose');

const auditLogSchema =
new mongoose.Schema({

    user:{
        type:String
    },

    action:{
        type:String
    },

    details:{
        type:String
    },

    timestamp:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model(
    'AuditLog',
    auditLogSchema
);