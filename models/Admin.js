const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const { Schema } = mongoose;


// USER-> 
// name location followers
const AdminSchema = new Schema
    ({
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        vac_center_name: {
            type: String,
            required: true,
            lowercase:true,
        },
        contact:{
        type:Number,
        required :true,
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
        isAdmin:
        {
            type: Boolean,
            default: true
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
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;