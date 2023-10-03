const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const customerSchema = new Schema({
   customerName : {
        type : String , 
        required : true
           },
    customerEmail:{
            type : String,
            required : true
           },
    password: {
        type : String , 
        required : true
           } ,
    customerPhoneNo : 
    {
        type : Number , 
        required : true
    } ,
   isBlock : {
    type : Boolean , 
    default  : false
   },
    token: {
        type : String , 
         },
    resetToken :{
            type : String
   
       },
    resetTokenExpiry:{
            type: Date,
       } 

    });

module.exports = mongoose.model('customer', customerSchema);

