
const mongoose = require('mongoose');

const familydetailsschema = new mongoose.Schema({
    data_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'data'
    },

data_familydetails_nameoffailyfmember: {
   type:{ type: String},
    
  },
  data_familydetails_relation: {
   type:{ type: String},
  
  },
  data_familydetails_ageoffamilymember: {
    type:{type: Number} ,
  
  },
  data_familydetails_education: {
   type:{ type: String},
  
  },
  data_familydetails_job: {
   type:{ type: String},
   
  },
  data_familydetails_skill: {
   type:{ type: String},
  
  },
  PARENT_KEY:{
   type:{ type: String},
  },
  KEY: {
   type:{ type: String},
  },
},
  {timestamps:true});


module.exports = mongoose.model('familydetails', familydetailsschema)
