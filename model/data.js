const mongoose = require('mongoose');

const dataschema = new mongoose.Schema({
  data_district: {
    type: String,
   
  },
  data_Block: {
    type: String,
  
  },
  data_Panchayath: {
    type: String,
  
  },
  data_Ward: {
    type: Number,
   
  },
  data_Name: {
    type: String,
   
  },
  data_Address: {
    type: String,

  },
  data_Phonenumber: {
    type: Number,
   
  },
  data_Class: {
    type: String,
  
  },
  data_Class2: {
    type: String,
   
  },
  data_Class3: {
    type: [],
  
  },
  data_familyincome: {
    type: String,
   
  },
  data_NameofNG: {
    type: String,
 
  },
  data_NameofNGmember: {
    type: String,
   
  },
  data_roleinNG: {
    type: String,
   
  },
  data_houseOwnership:{
    type:String,
    
  },
 
  data_landdetails_landarea:{
    type:Number, 
  },
  data_landdetails_agricultureland:{
    type:Number,
  
  },
  data_Animalhusbendary_businesstype:{ 
    type : []
},
  data_Animalhusbendary_others0:
  { type : String
},
  data_Animalhusbendary_cdsregistration : {
    type : String
},
    data_Animalhusbendary_regdetails_regnumber:{
        type :String
    },
    data_Animalhusbendary_regdetails_cdsunitname:{
        type : String
    },
    data_enterpisetype :{
         type :String ,
        },
    data_noofgroupmembers:{
        type :Number
     },
    data_Yearofstartingagriculture: {
        type :String,
     },
    data_yearofstartingbussiness:{
        type :String,
     },
    data_amountinvested:{
        type : Number,
    },
    data_Sourceofinvestment:
    {
      type : []
    },
    data_supportrecived: { 
        type : String
    },
    data_loan : {
        type : String
    },
    data_loandetails_totalinvestment: { 
        type : Number
    },
    data_loandetails_DateofLoanApplication : {
        type :Date
     },
    data_businessidea : {
        type : String,
    },
    data_Infra_Infrastructure:{ 
        type : String
    },
    data_Infra_Shed : {
        type : String
    },
    data_Infra_wastage :{
        type : String
    },
    data_Infra_biogas:{
        type : String
    },
    data_Infra_equipments:{
        type : String,
    },
    data_Infra_others:{
        type : String
    },
    data_support:{
        type :[]
    },
    data_others2:{
        type :String
    },
    data_MGNREGAsupport:{
        type :[]
    },
    data_landdetails1_landforgrass:{
        type :String
    },
    data_landdetails1_qtyofownland:{
        type :Number
    },
    data_landdetails1_qtyofleasedland:{
        type :Number
    },
    data_landdetails2_siteforworkshed:{
        type :String
    },
    data_landdetails2_qtyofownland:{
        type :Number
    },
    data_others4:{
        type :String
    },
    data_Trainingsrequired:{
        type :[],
    },
    data_others3:{
        type :String,
    },
    data_comments:{
        type :String
    },
    data_nameofcrp:{
        type :String
    },
    Phonenumber_ofCRP : {
      type :Number
    },
    data_Nameofrespondent:{
        type :String
    },
    data_dateofsurvey:{
        type :Date
    },
    data_Starttime:{
        type :String
    },
    KEY:String
},
    {timestamps:true});




module.exports = mongoose.model('data', dataschema)
