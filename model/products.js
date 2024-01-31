const mongoose = require('mongoose');

const productsschema = new mongoose.Schema({
    data_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'data'
      },
data_products_prdct:{type :String},
data_products_quantum:{type :Number},
data_products_price2:{type :Number},
PARENT_KEY:{
    type: String,
  },
  KEY: {
    type: String,
  },
    },
    
    {timestamps:true});
    module.exports = mongoose.model('products', productsschema) 

