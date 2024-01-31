const mongoose = require('mongoose');

const Salesschema = new mongoose.Schema({
    data_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'data'
      },
data_Sales_prdct2:{type : []},
MILK_qnty : { type : Number},
MEAT_qnty : {type : Number},
EGG_qnty : {type : Number},
Sales_MANURE_qnty : {type : Number},
FEED_qnty : {type : Number},
male_buffalo_calf_qnty : {type : Number},
Gras_fooder_qnty : {type : Number},
tree_fooder_qnty : {type : Number},
kid_qnty : {type : Number},
day_old_chick_qnty : {type : Number},
pullets_qnty : {type : Number},
calf_qnty : {type : Number},
beifer_qnty : {type : Number},
//data_Sales_quntum2:{type :Number},

data_Sales_salesmethod:{type :[]},
PARENT_KEY:{
    type: String,
  },
  KEY: {
    type: String,
  },
    },
    
{timestamps:true});
module.exports = mongoose.model('sales', Salesschema)