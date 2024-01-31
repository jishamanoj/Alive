const mongoose = require('mongoose');

const livelihoodschema = new mongoose.Schema({
    data_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'data'
      },

data_livelihood_incomesource : {
    type : []
},

livelihood_cows_list:{
  type : [],
},
livelihood_cows_HF_qnty : {
  type : Number,
},

livelihood_cows_JERSEY_qnty : {
  type : Number,
},
livelihood_cows_INDIGENOUS_qnty : {
  type : Number,
},

livelihood_calf_list : {
  type: [],
},
livelihood_calf_FEMALE_qnty : {
  type : Number,
},
livelihood_calf_MALE_qnty : {
  type : Number,
},

livelihood_goat_list:{
  type : [],
},
livelihood_goat_MALABARI_qnty : {
  type : Number,
},
livelihood_goat_MALABARI_KID_qnty : {
  type : Number,
},
livelihood_goat_ATTAPADI_BLACK_qnty : {
  type : Number,
},
livelihood_goat_ATTAPADI_BLACK_KID_qnty : {
  type : Number,
},
livelihood_goat_OTHERS : {
  type : String,
},
livelihood_goat_OTHERS_qnty : {
  type : Number,
},
livelihood_poultry_list:{
  type : [],
},
livelihood_poultry_EGG_PRODUCTION_qnty : {
  type : Number,
},
livelihood_poultry_MARKETING_qnty : {
  type : Number,
},

livelihood_manure_list:{
  type : [],
},
livelihood_manure_DRY_qnty : {
  type : Number,
},
livelihood_manure_FRESH_qnty : {
  type : Number,
},
livelihood_fodder_list:{
  type : [],
},
livelihood_fodder_OWN_USE_qnty : {
  type : Number,
},
livelihood_fodder_FOR_SALE_qnty : {
  type : Number,
},
livelihood_BUFFALO_qnty : {
  type : Number,
},
livelihood_POULTRY_MANURE_qnty : {
  type : Number,
},
livelihood_DUCK_qnty : {
  type : Number,

},


PARENT_KEY:{
    type: String,
  },
  KEY: {
    type: String,
  },
},

{timestamps:true});
module.exports = mongoose.model('livelihood', livelihoodschema)