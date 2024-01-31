const mongoose = require('mongoose');

const purchaseofrawmaterialsschema = new mongoose.Schema({
    data_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'data'
      },


        data_purchaseofrawmaterials_itemtype: { type : [] } ,
       INGREDIENTS_FOR_POULTRY_FEED_qnty:{ type : Number },
        INGREDIENTS_FOR_CTTLE_FEED_qnty : { type : Number },
        CHEMICAL_FERTILIZERS_qnty : { type : Number},
        FODDER_SEEDS_qnty : { type : Number},
        Grass_fooder_qnty : { type : Number},
        Tree_fooder_qnty : { type : Number},
        MALABARI_GOAT_KIDS_qnty : { type : Number},
        MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty : { type : Number},
        
        Urea_treated_Straw_qnty : { type : Number},
        urea_molass_block_qnty :  { type : Number},
        PULLETS_List :{type :[]},
        BV380_qnty : { type : Number},
        GRAMALAKSHMI_qnty : { type : Number},
        GRAMAPRIYA_qnty :  { type : Number},
        OTHER:{ type : String},
        OTHER_qnty : { type : Number},
        MANURE_List : { type : []},
        COW_DUNG_qnty :{ type : Number},
        GOAT_MANURE_qnty :{ type : Number},
        POULTRY_MANURE_qnty :{ type : Number},
        VERMY_COMPOST_qnty :{ type : Number},
        FODDER_SLIPS_List : { type : []},
        NAPIER_qnty : { type : Number},
        CO4_qnty : { type : Number},
        CO5_qnty : { type : Number},
        RED_NAPIER_qnty : { type : Number},
        SUPER_NAPIER_qnty : { type : Number},
        GUINEA_GRASS_qnty : { type : Number},
        PARA_GRASS_qnty : { type : Number},
        CONGO_SIGNAL_qnty : { type : Number},

        MALE_BUFFALO_CALVES_qnty:{ type : Number},
        CALVES_List : {type : []},
        CALVES_HF_qnty:{ type : Number},
        CALVES_GERSEY_qnty:{ type : Number},
       
        HEIPERS_List : {type :[] },
        HEIPERS_HF_qnty : {type : Number},
        HEIPERS_GERSEY_qnty : {type : Number},
        COWS_List : {type : [] } ,
        COWS_HF_qnty : {type : Number},
        COWS_GERSEY_qnty : {type : Number},
        MALABARI_GOATS_qnty: { type : Number},
      //  MATERIAL_FOR_POULTRY_qnty: { type : Number},
        EGG_TRAYS_qnty : { type : Number},
        POULTRY_FEED_qnty : {type : Number},
        LAYER_List : { type : String },
        LAYER_qnty : { type : Number},
        CATTLE_FEED_List : {type : String },
        CATTLE_FEED_qnty :{ type : Number},
        MILK_REPLACER_List : {type:String },
        MILK_REPLACER_qnty :{type:Number},
        ENERGY_RICH_FEED_List: {type : String },
        ENERGY_RICH_FEED_qnty : { type : Number},
        BY_PASS_PROTEIN_qnty : {type : Number},
        BY_PASS_FAT_qnty : { type : Number},
        TMR_qnty : { type : Number},
        SILAGE_qnty : { type : Number},
        HAY_qnty : { type : Number},
       // UREA_TREATED_STRAW_qnty : { type : Number},
        GOAT_FEEDqnty : { type : Number},
        KID_STARTER_qnty : { type : Number},
        GROWER_qnty : {type : Number},
        Total_mixed_ration_qnty :  {type : Number},


        CAFF_STARTER_qnty :  {type : Number},

        
        Mode_purchaseofrawmaterials:{type : []},
      
        data_purchaseofrawmaterials_brand: {type :String} ,
        BRAND_qnty:{type : Number},
      
        PARENT_KEY:{
            type: String,
          },
          KEY: {
            type: String,
          },
    },
        
{timestamps:true});
module.exports = mongoose.model('purchaseofrawmaterials', purchaseofrawmaterialsschema)