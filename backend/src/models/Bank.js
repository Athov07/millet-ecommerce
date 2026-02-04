// models/Bank.js
const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({

cardNumber: 
{
    type: String, 
    required: true, 
    unique: true 
},

expiry: 
{
    type: String, 
    required: true 
}, // MM/YY

cvv: 
{
    type: String, 
    required: true
},

nameOnCard: 
{
    type: String, 
    required: true
},

balance: 
{
    type: Number,
    required: true,
    default: 10000 
}, // amount available

});

module.exports = mongoose.model("Bank", bankSchema);
