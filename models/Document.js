const mongoose =
require('mongoose');

const documentSchema =
new mongoose.Schema({

    fileName:String,

    encryptedPath:String,

    hash:String,

    signature:String,

    verified:{

        type:Boolean,

        default:false

    },

    owner:{

        type:mongoose.Schema.Types.ObjectId,

        ref:'User'

    },

    uploadedAt:{

        type:Date,

        default:Date.now

    }

});

module.exports =
mongoose.model(

    'Document',

    documentSchema

);