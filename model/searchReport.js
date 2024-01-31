const mongoose = require('mongoose')

const searchReportSchema = new mongoose.Schema({
    data_purchaseofrawmaterials_itemtype:{
      type:String,
    },
    pulletsList: {
        type: String,
     
    },
    manureType: {
        type: String,
        
    },
    fodderSlipsList:{
        type: String,
       
    },
    CALVESList:{
        type: String,
       
    },
    HEIPERSList:{
        type: String,
        
    },
    COWSList:{
        type: String,
       
    },
    MILKREPLACERDList:{
        type: String,
        
    },
    ENERGYRICHFEEDList:{
        type: String,
      
    },
    data_Sales_salesmethod:{
        type: String,
       
    },
    data_support:{
        type: String,
        
    },
    data_MGNREGAsupport:{
        type: String,
       
    },
    data_Trainingsrequired:{
        type: String,
       
    },
    data_livelihood_incomesource:{
        type : String,
    },
    livelihood_cows_list:{
        type : String,
    },
    livelihood_calf_list:{
        type: String,
    },
    livelihood_goat_list:{
        type : String,
    },
    livelihood_poultry_list:{
        type : String,
    },
    livelihood_manure_list:{
        type : String,
    },
    livelihood_fodder_list:{
        type : String,
    },
    

   
}, { timestamps: true })
module.exports = mongoose.model('searchreport', searchReportSchema)