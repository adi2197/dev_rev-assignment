const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const { Schema } = mongoose;


// USER-> 
// name location followers
const UserSchema = new Schema
    ({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        first_name: {
            type: String,
            required: true,
            lowercase:true,
            max:20
        },
        last_name: {
            type: String,
            lowercase:true,
            required: true
        },
        email: {
            type: String,
            required: true,

        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        age:{
            type:Number,
            default:18
        },
        isAdmin:
        {
            type: Boolean,
            default: false
        },
        city:
        {
            type: String,
            lowercase:true,
            required:true,
            max: 50
        }
    },
        { timestamps: true }
    )
const User = mongoose.model('User', UserSchema);

module.exports = User;