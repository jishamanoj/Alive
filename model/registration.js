const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
    district:{
      type:String,
      required:true
    },
    block:{
        type:String,
        required:true
      },
      panchayath:{
        type:String,
        required:true
      },
      name:{
        type:String,
        required:true
      },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roll:{
        type: String,
        required:true
    },
    isRegisterdUser:{
        type: Boolean,
        require: true

    }


    

}, { timestamps: true })

module.exports= mongoose.model('registration', registrationSchema)
