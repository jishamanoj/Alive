const mongoose = require('mongoose')

const keralaSchema = new mongoose.Schema({
    State:{
      type:String,
      required:true
    },
    District: {
        type: String,
        required: true
    },
    Block: {
        type: String,
        required: true
    },
    Panchayat:{
        type: String,
        required:true
    },
   


    

}, { timestamps: true })

module.exports= mongoose.model('kerala', keralaSchema)
