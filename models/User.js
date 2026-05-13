const mongoose =
require('mongoose');

const userSchema =
new mongoose.Schema({

    username:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    role:{

        type:String,

        enum:[

            'admin',

            'manager',

            'user'

        ],

        default:'user'
    },

    // =====================================
    // TWO FACTOR AUTHENTICATION
    // =====================================

    twoFactorSecret:{
        type:String,
        default:''
    },

    is2FAEnabled:{
        type:Boolean,
        default:false
    }

});

module.exports =
mongoose.model(

    'User',

    userSchema

);