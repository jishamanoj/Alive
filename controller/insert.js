

const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();
const Data = require('../model/data');
const FamilyDetails = require('../model/familydetails');
const Livelihood = require('../model/livelihood');
const Products = require('../model/products');
const PurchaseOfRawMaterials = require('../model/purchaseofrowmaterials');
const Sales = require('../model/sales');
const verifyToken = require('../verifytoken')
const Kerala = require('../model/kerala');


router.get('/district', async (req, res) => {
  try {
    const district = await Kerala.distinct('District').exec();
    res.json( district );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/blocks/:district', async (req, res) => {
  const { district } = req.params;

  try {
    const blocks = await Kerala.distinct('Block', { District: district }).exec();
    res.json( blocks );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/Panchayat/:block', async (req, res) => {
  const { block } = req.params;

  try {
    const Panchayat = await Kerala.distinct('Panchayat', { Block: block }).exec();
    res.json( Panchayat );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/supportList', async (req, res) => {
  try {
    const data_support = await Data.distinct('data_support').exec();
    res.json( data_support );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/insert', async (req, res) => {
  const {
  data_district,
  data_Block,
  data_Panchayath,
  data_Ward,
  data_Name,
  data_Address,
  data_Phonenumber,
  data_Class,
  data_Class2,
  data_Class3,
  data_familyincome,
  data_NameofNG,
  data_NameofNGmember,
  data_roleinNG,
  data_houseOwnership,
  data_landdetails_landarea,
  data_landdetails_agricultureland,
  data_Animalhusbendary_businesstype,
  data_Animalhusbendary_others0,
  data_Animalhusbendary_cdsregistration ,
    data_Animalhusbendary_regdetails_regnumber,
    data_Animalhusbendary_regdetails_cdsunitname,
    data_enterpisetype,
    data_noofgroupmembers,
    data_Yearofstartingagriculture,
    data_yearofstartingbussiness,
    data_amountinvested,
    data_Sourceofinvestment,
    data_supportrecived,
    data_loan,
    data_loandetails_totalinvestment,
    data_loandetails_DateofLoanApplication ,
    data_businessidea ,
    data_Infra_Infrastructure,
    data_Infra_Shed,
    data_Infra_wastage ,
    data_Infra_biogas,
    data_Infra_equipments,
    data_Infra_others,
    data_support,
    data_others2,
    data_MGNREGAsupport,
    data_landdetails1_landforgrass,
    data_landdetails1_qtyofownland,
    data_landdetails1_qtyofleasedland,
    data_landdetails2_siteforworkshed,
    data_landdetails2_qtyofownland,
    data_others4,
    data_Trainingsrequired,
    data_others3,
    data_comments,
    data_nameofcrp,
    Phonenumber_ofCRP,
    data_Nameofrespondent,
    data_dateofsurvey,
    data_Starttime,
  data_Sales_prdct2,
  MILK_qnty,
  MEAT_qnty,
  EGG_qnty,
  Sales_MANURE_qnty,
  FEED_qnty,
  male_buffalo_calf_qnty,
  Gras_fooder_qnty,
  tree_fooder_qnty,
  kid_qnty,
  day_old_chick_qnty,
  pullets_qnty,
  calf_qnty,
  beifer_qnty,  
  CAFF_STARTER_qnty,
  data_Sales_salesmethod,
  data_products_prdct,data_products_quantum,data_products_price2,
 
  data_livelihood_incomesource,
  livelihood_cows_list,
  livelihood_cows_HF_qnty,
  livelihood_cows_JERSEY_qnty,
  livelihood_cows_INDIGENOUS_qnty,
  livelihood_calf_list,
  livelihood_calf_FEMALE_qnty,
  livelihood_calf_MALE_qnty,
  livelihood_goat_list,
  livelihood_goat_MALABARI_qnty,
  livelihood_goat_MALABARI_KID_qnty,
  livelihood_goat_ATTAPADI_BLACK_qnty,
  livelihood_goat_ATTAPADI_BLACK_KID_qnty,
  livelihood_goat_OTHERS,
  livelihood_goat_OTHERS_qnty,
  livelihood_poultry_list,
  livelihood_poultry_EGG_PRODUCTION_qnty,
  livelihood_poultry_MARKETING_qnty,
  livelihood_manure_list,
  livelihood_manure_DRY_qnty,
  livelihood_manure_FRESH_qnty,
  livelihood_fodder_list,
  livelihood_fodder_OWN_USE_qnty,
  livelihood_fodder_FOR_SALE_qnty,
  livelihood_BUFFALO_qnty,
  livelihood_POULTRY_MANURE_qnty,
  livelihood_DUCK_qnty,

  data_purchaseofrawmaterials_itemtype,


  INGREDIENTS_FOR_POULTRY_FEED_qnty,
  INGREDIENTS_FOR_CTTLE_FEED_qnty,
  CHEMICAL_FERTILIZERS_qnty,
  FODDER_SEEDS_qnty,
  Grass_fooder_qnty,
  Tree_fooder_qnty,
  MALABARI_GOAT_KIDS_qnty,
  MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty,
  Urea_treated_Straw_qnty,


  PULLETS_List,
  BV380_qnty,
  GRAMALAKSHMI_qnty,
  GRAMAPRIYA_qnty,
  OTHER,
  OTHER_qnty,
  MANURE_List,
  COW_DUNG_qnty,
  GOAT_MANURE_qnty,
  POULTRY_MANURE_qnty,
  VERMY_COMPOST_qnty,
  FODDER_SLIPS_List ,
  NAPIER_qnty,
  CO4_qnty,
  CO5_qnty,
  RED_NAPIER_qnty,
  SUPER_NAPIER_qnty,
  GUINEA_GRASS_qnty,
  PARA_GRASS_qnty,
  CONGO_SIGNAL_qnty,
  MALE_BUFFALO_CALVES_qnty,
  CALVES_List,
  CALVES_HF_qnty,
  CALVES_GERSEY_qnty,
  HEIPERS_List,
  HEIPERS_HF_qnty,
  HEIPERS_GERSEY_qnty,
  COWS_List,
  COWS_HF_qnty,
  COWS_GERSEY_qnty,
  MALABARI_GOATS_qnty,
 // MATERIAL_FOR_POULTRY_qnty,
  EGG_TRAYS_qnty ,
  POULTRY_FEED_qnty,
  LAYER_List,


  LAYER_qnty ,


  CATTLE_FEED_List,
  CATTLE_FEED_qnty,
  MILK_REPLACER_List,
  MILK_REPLACER_qnty ,
  ENERGY_RICH_FEED_List,
  ENERGY_RICH_FEED_qnty,
  BY_PASS_PROTEIN_qnty,
  BY_PASS_FAT_qnty,
  TMR_qnty,
  SILAGE_qnty,
  HAY_qnty,
  //UREA_TREATED_STRAW_qnty,
  GOAT_FEEDqnty,
  KID_STARTER_qnty,


  GROWER_qnty ,
  Total_mixed_ration_qnty ,


  Mode_purchaseofrawmaterials,

  data_purchaseofrawmaterials_brand,
  BRAND_qnty,
  familyDetails
} = req.body;
   
  try {
    // Create new data document
    const newData = new Data({
      data_district: data_district || '',
      data_Block: data_Block || '',
      data_Panchayath: data_Panchayath || '',
      data_Ward: data_Ward || 0,
      data_Name: data_Name || '',
      data_Address: data_Address || '',
      data_Phonenumber: data_Phonenumber || 0,
      data_Class: data_Class || '',
      data_Class2: data_Class2 || '',
      data_Class3: data_Class3 || '',
      data_familyincome: data_familyincome || '',
      data_NameofNG: data_NameofNG || '',
      data_NameofNGmember: data_NameofNGmember || '',
      data_roleinNG: data_roleinNG || '',
      data_houseOwnership: data_houseOwnership || '',
      data_landdetails_landarea: data_landdetails_landarea || 0,
      data_landdetails_agricultureland: data_landdetails_agricultureland || 0,
      data_Animalhusbendary_businesstype: data_Animalhusbendary_businesstype || '',
      data_Animalhusbendary_others0: data_Animalhusbendary_others0 || '',
      data_Animalhusbendary_cdsregistration: data_Animalhusbendary_cdsregistration || '',
      data_Animalhusbendary_regdetails_regnumber: data_Animalhusbendary_regdetails_regnumber || '',
      data_Animalhusbendary_regdetails_cdsunitname: data_Animalhusbendary_regdetails_cdsunitname || '',
      data_enterpisetype: data_enterpisetype || '',
      data_noofgroupmembers: data_noofgroupmembers || 0,
      data_Yearofstartingagriculture: data_Yearofstartingagriculture || '',
      data_yearofstartingbussiness: data_yearofstartingbussiness || '',
      data_amountinvested: data_amountinvested || 0,
      data_Sourceofinvestment: data_Sourceofinvestment || '',
      data_supportrecived: data_supportrecived || '',
      data_loan: data_loan || '',
      data_loandetails_totalinvestment: data_loandetails_totalinvestment || 0,
      data_loandetails_DateofLoanApplication: data_loandetails_DateofLoanApplication || new Date(),
      data_businessidea: data_businessidea || '',
      data_Infra_Infrastructure: data_Infra_Infrastructure || '',
      data_Infra_Shed: data_Infra_Shed || '',
      data_Infra_wastage: data_Infra_wastage || '',
      data_Infra_biogas: data_Infra_biogas || '',
      data_Infra_equipments: data_Infra_equipments || '',
      data_Infra_others: data_Infra_others || '',
      data_support: data_support || '',
      data_others2: data_others2 || '',
      data_MGNREGAsupport: data_MGNREGAsupport || '',
      data_landdetails1_landforgrass: data_landdetails1_landforgrass || '',
      data_landdetails1_qtyofownland: data_landdetails1_qtyofownland || 0,
      data_landdetails1_qtyofleasedland: data_landdetails1_qtyofleasedland || 0,
      data_landdetails2_siteforworkshed: data_landdetails2_siteforworkshed || '',
      data_landdetails2_qtyofownland: data_landdetails2_qtyofownland || 0,
      data_others4: data_others4 || '',
      data_Trainingsrequired: data_Trainingsrequired || '',
      data_others3: data_others3 || '',
      data_comments: data_comments || '',
      data_nameofcrp: data_nameofcrp || '',
      Phonenumber_ofCRP : Phonenumber_ofCRP || 0,
      data_Nameofrespondent: data_Nameofrespondent || '',
      data_dateofsurvey: data_dateofsurvey || new Date(),
      data_Starttime: data_Starttime || ''
    });
    const savedData = await newData.save();
    //console.log(savedData);
  // Update the "key" field with the ID of the document
  savedData.KEY = savedData._id;
  const KEY = savedData._id;
  // Save the updated document
  await savedData.save();
  //console.log(savedData);

     // Create new sales document with the parentKey
     const newSales = new Sales({
      PARENT_KEY: KEY,
      data_Sales_prdct2:data_Sales_prdct2  || '',
      MILK_qnty : MILK_qnty  || 0,
      MEAT_qnty : MEAT_qnty  || 0,
      EGG_qnty : EGG_qnty  || 0,
      Sales_MANURE_qnty : Sales_MANURE_qnty  || 0,
      FEED_qnty : FEED_qnty  || 0,
      male_buffalo_calf_qnty : male_buffalo_calf_qnty  || 0,
      Gras_fooder_qnty : Gras_fooder_qnty  || 0,
      tree_fooder_qnty : tree_fooder_qnty  || 0,
      kid_qnty : kid_qnty  || 0,
      day_old_chick_qnty : day_old_chick_qnty  || 0,
      pullets_qnty : pullets_qnty  || 0,
      calf_qnty : calf_qnty  || 0,
      beifer_qnty : beifer_qnty  || 0,
      data_Sales_salesmethod:data_Sales_salesmethod  || ''
      // Include sales data properties here
    });
    const newProducts = new Products({
      PARENT_KEY: KEY,
      data_products_prdct:data_products_prdct  || '',
      data_products_quantum:data_products_quantum  || 0,
      data_products_price2:data_products_price2  || 0,
    })
    const newLivelihood = new Livelihood({
      PARENT_KEY: KEY,
      data_livelihood_incomesource:data_livelihood_incomesource  || '',
      livelihood_cows_list : livelihood_cows_list || '',
      livelihood_cows_HF_qnty : livelihood_cows_HF_qnty || 0,
      livelihood_cows_JERSEY_qnty : livelihood_cows_JERSEY_qnty || 0,
      livelihood_cows_INDIGENOUS_qnty : livelihood_cows_INDIGENOUS_qnty || 0,
      livelihood_calf_list : livelihood_calf_list || '',
      livelihood_calf_FEMALE_qnty : livelihood_calf_FEMALE_qnty || 0,
      livelihood_calf_MALE_qnty : livelihood_calf_MALE_qnty || 0,
      livelihood_goat_list : livelihood_goat_list || '',
      livelihood_goat_MALABARI_qnty : livelihood_goat_MALABARI_qnty || 0,
      livelihood_goat_MALABARI_KID_qnty : livelihood_goat_MALABARI_KID_qnty || 0,
      livelihood_goat_ATTAPADI_BLACK_qnty : livelihood_goat_ATTAPADI_BLACK_qnty || 0,
      livelihood_goat_ATTAPADI_BLACK_KID_qnty : livelihood_goat_ATTAPADI_BLACK_KID_qnty || 0,
      livelihood_goat_OTHERS : livelihood_goat_OTHERS || '',
      livelihood_goat_OTHERS_qnty : livelihood_goat_OTHERS_qnty || 0,
      livelihood_poultry_list : livelihood_poultry_list || '',
      livelihood_poultry_EGG_PRODUCTION_qnty : livelihood_poultry_EGG_PRODUCTION_qnty || 0,
      livelihood_poultry_MARKETING_qnty : livelihood_poultry_MARKETING_qnty || 0,
      livelihood_manure_list : livelihood_manure_list || '',
      livelihood_manure_DRY_qnty : livelihood_manure_DRY_qnty || 0,
      livelihood_manure_FRESH_qnty : livelihood_manure_FRESH_qnty || 0,
      livelihood_fodder_list : livelihood_fodder_list || '',
      livelihood_fodder_OWN_USE_qnty : livelihood_fodder_OWN_USE_qnty || 0,
      livelihood_fodder_FOR_SALE_qnty : livelihood_fodder_FOR_SALE_qnty || 0,
      livelihood_BUFFALO_qnty : livelihood_BUFFALO_qnty || 0,
      livelihood_POULTRY_MANURE_qnty : livelihood_POULTRY_MANURE_qnty || 0,
      livelihood_DUCK_qnty:livelihood_DUCK_qnty || 0
     
    });
    const newpurchaseofrawmaterials = new PurchaseOfRawMaterials({
      PARENT_KEY: KEY,
      data_purchaseofrawmaterials_itemtype:data_purchaseofrawmaterials_itemtype  || '',
     
  INGREDIENTS_FOR_POULTRY_FEED_qnty : INGREDIENTS_FOR_POULTRY_FEED_qnty || 0,
  INGREDIENTS_FOR_CTTLE_FEED_qnty : INGREDIENTS_FOR_CTTLE_FEED_qnty || 0,
  CHEMICAL_FERTILIZERS_qnty :CHEMICAL_FERTILIZERS_qnty || 0,
  FODDER_SEEDS_qnty : FODDER_SEEDS_qnty || 0  ,
  Grass_fooder_qnty : Grass_fooder_qnty || 0,
  Tree_fooder_qnty : Tree_fooder_qnty || 0,
  MALABARI_GOAT_KIDS_qnty :MALABARI_GOAT_KIDS_qnty || 0,
  MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty : MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty || 0,
  Urea_treated_Straw_qnty : Urea_treated_Straw_qnty || 0,
      PULLETS_List :PULLETS_List  || '',
      BV380_qnty: BV380_qnty || 0,
  GRAMALAKSHMI_qnty : GRAMALAKSHMI_qnty || 0,
  GRAMAPRIYA_qnty : GRAMAPRIYA_qnty || 0,
  OTHER : OTHER || '',
  OTHER_qnty: OTHER_qnty || 0,
            MANURE_List : MANURE_List  || '',
            COW_DUNG_qnty:COW_DUNG_qnty  || 0,
        GOAT_MANURE_qnty : GOAT_MANURE_qnty  || 0,
        POULTRY_MANURE_qnty : POULTRY_MANURE_qnty  || 0,
        VERMY_COMPOST_qnty :  VERMY_COMPOST_qnty  || 0,
            FODDER_SLIPS_List : FODDER_SLIPS_List  || '',
            NAPIER_qnty:NAPIER_qnty  || 0,
        CO4_qnty:CO4_qnty  || 0,
        CO5_qnty:CO5_qnty  || 0,
        RED_NAPIER_qnty:RED_NAPIER_qnty  || 0,
        SUPER_NAPIER_qnty:SUPER_NAPIER_qnty  || 0,
        GUINEA_GRASS_qnty:GUINEA_GRASS_qnty  || 0,
        PARA_GRASS_qnty:PARA_GRASS_qnty  || 0,
        CONGO_SIGNAL_qnty:CONGO_SIGNAL_qnty  || 0,
            MALE_BUFFALO_CALVES_qnty:MALE_BUFFALO_CALVES_qnty  || 0,
            CALVES_List :CALVES_List  || '',
            CALVES_HF_qnty :CALVES_HF_qnty  || 0,
            CALVES_GERSEY_qnty : CALVES_GERSEY_qnty  || 0,
            HEIPERS_List : HEIPERS_List  || '',
            HEIPERS_HF_qnty : HEIPERS_HF_qnty  || 0,
            HEIPERS_GERSEY_qnty : HEIPERS_GERSEY_qnty  || 0,
            COWS_List : COWS_List  || '',
            COWS_HF_qnty : COWS_HF_qnty  || 0,
            COWS_GERSEY_qnty : COWS_GERSEY_qnty  || 0,
            MALABARI_GOATS_qnty : MALABARI_GOATS_qnty  || 0,
         //   MATERIAL_FOR_POULTRY_qnty : MATERIAL_FOR_POULTRY_qnty  || 0,
            EGG_TRAYS_qnty : EGG_TRAYS_qnty  || 0,
            POULTRY_FEED_qnty : POULTRY_FEED_qnty  || 0,
            LAYER_List : LAYER_List  || '',
            LAYER_qnty :  LAYER_qnty || 0 ,
            CATTLE_FEED_List : CATTLE_FEED_List  || '',
            CATTLE_FEED_qnty : CATTLE_FEED_qnty  || 0,
            MILK_REPLACER_List : MILK_REPLACER_List  || '',
            MILK_REPLACER_qnty:MILK_REPLACER_qnty  || 0,
            ENERGY_RICH_FEED_List : ENERGY_RICH_FEED_List  || '',
            ENERGY_RICH_FEED_qnty : ENERGY_RICH_FEED_qnty  || 0,
            BY_PASS_PROTEIN_qnty : BY_PASS_PROTEIN_qnty  || 0,
            BY_PASS_FAT_qnty : BY_PASS_FAT_qnty  || 0,
            TMR_qnty : TMR_qnty  || 0,
            SILAGE_qnty : SILAGE_qnty  || 0,
            HAY_qnty : HAY_qnty  || 0,
          //  UREA_TREATED_STRAW_qnty : UREA_TREATED_STRAW_qnty  || 0,
            GOAT_FEEDqnty : GOAT_FEEDqnty  || 0,
            KID_STARTER_qnty : KID_STARTER_qnty  || 0,
            GROWER_qnty : GROWER_qnty || 0,
            Total_mixed_ration_qnty : Total_mixed_ration_qnty || 0,
            Mode_purchaseofrawmaterials : Mode_purchaseofrawmaterials  || '',
           data_purchaseofrawmaterials_brand:data_purchaseofrawmaterials_brand  || '',
           BRAND_qnty:BRAND_qnty  || 0,
           CAFF_STARTER_qnty:CAFF_STARTER_qnty || 0,
  });

  const updatedData = familyDetails.map(obj => ({
    ...obj,
    PARENT_KEY: KEY,
  }));

  //console.log(updatedData)
  
    await Promise.all([
      FamilyDetails.insertMany(updatedData),  
      newSales.save(),
      newProducts.save(),
      newLivelihood.save(),
      newpurchaseofrawmaterials.save()
    ]);
  res.status(201).json({ message: 'Data created successfully' });
} catch (error) {
  console.log(error);
  res.status(500).json({ message: 'Internal server error' });
}
});
router.post('/logout', async(req, res) => {
  // Perform logout logic here

  // Invalidate token (example using JWT)
  // Assuming the token is passed in the Authorization header as a Bearer token
  const token = req.headers.authorization.split(' ')[1];

  // Add logic to invalidate the token, such as adding it to a blacklist or revoking it

  res.status(200).json({ message: 'Logged out successfully' });
});

router.put('/update/:id',async (req, res) => {
  console.log("........enter........");
  try {
    const { id } = req.params;
    const {
      data_district,
      data_Block,
      data_Panchayath,
      data_Ward,
      data_Name,
      data_Address,
      data_Phonenumber,
      data_Class,
      data_Class2,
      data_Class3,
      data_familyincome,
      data_NameofNG,
      data_NameofNGmember,
      data_roleinNG,
      data_houseOwnership,
      data_landdetails_landarea,
      data_landdetails_agricultureland,
      data_Animalhusbendary_businesstype,
      data_Animalhusbendary_others0,
      data_Animalhusbendary_cdsregistration ,
        data_Animalhusbendary_regdetails_regnumber,
        data_Animalhusbendary_regdetails_cdsunitname,
        data_enterpisetype,
        data_noofgroupmembers,
        data_Yearofstartingagriculture,
        data_yearofstartingbussiness,
        data_amountinvested,
        data_Sourceofinvestment,
        data_supportrecived,
        data_loan,
        data_loandetails_totalinvestment,
        data_loandetails_DateofLoanApplication ,
        data_businessidea ,
        data_Infra_Infrastructure,
        data_Infra_Shed,
        data_Infra_wastage ,
        data_Infra_biogas,
        data_Infra_equipments,
        data_Infra_others,
        data_support,
        data_others2,
        data_MGNREGAsupport,
        data_landdetails1_landforgrass,
        data_landdetails1_qtyofownland,
        data_landdetails1_qtyofleasedland,
        data_landdetails2_siteforworkshed,
        data_landdetails2_qtyofownland,
        data_others4,
        data_Trainingsrequired,
        data_others3,
        data_comments,
        data_nameofcrp,
        Phonenumber_ofCRP,
        data_Nameofrespondent,
        data_dateofsurvey,
        data_Starttime,
        data_Sales_prdct2,
        MILK_qnty,
        MEAT_qnty,
        EGG_qnty,
        Sales_MANURE_qnty,
        FEED_qnty,
        male_buffalo_calf_qnty,
        Gras_fooder_qnty,
        tree_fooder_qnty,
        kid_qnty,
        day_old_chick_qnty,
        pullets_qnty,
        calf_qnty,
        beifer_qnty,  
        data_Sales_salesmethod,
     // data_products_prdct,data_products_quantum,data_products_price2,
      data_livelihood_incomesource,
      livelihood_cows_list,
      livelihood_cows_HF_qnty,
      livelihood_cows_JERSEY_qnty,
      livelihood_cows_INDIGENOUS_qnty,
      livelihood_calf_list,
      livelihood_calf_FEMALE_qnty,
      livelihood_calf_MALE_qnty,
      livelihood_goat_list,
      livelihood_goat_MALABARI_qnty,
      livelihood_goat_MALABARI_KID_qnty,
      livelihood_goat_ATTAPADI_BLACK_qnty,
      livelihood_goat_ATTAPADI_BLACK_KID_qnty,
      livelihood_goat_OTHERS,
      livelihood_goat_OTHERS_qnty,
      livelihood_poultry_list,
      livelihood_poultry_EGG_PRODUCTION_qnty,
      livelihood_poultry_MARKETING_qnty,
      livelihood_manure_list,
      livelihood_manure_DRY_qnty,
      livelihood_manure_FRESH_qnty,
      livelihood_fodder_list,
      livelihood_fodder_OWN_USE_qnty,
      livelihood_fodder_FOR_SALE_qnty,
      livelihood_BUFFALO_qnty,
      livelihood_POULTRY_MANURE_qnty,
      livelihood_DUCK_qnty,
    
      data_purchaseofrawmaterials_itemtype,

      INGREDIENTS_FOR_POULTRY_FEED_qnty,
      INGREDIENTS_FOR_CTTLE_FEED_qnty,
      CHEMICAL_FERTILIZERS_qnty,
      FODDER_SEEDS_qnty,
      Grass_fooder_qnty,
      Tree_fooder_qnty,
      MALABARI_GOAT_KIDS_qnty,
      MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty,
      Urea_treated_Straw_qnty,

      PULLETS_List,
            MANURE_List,
            COW_DUNG_qnty,
            GOAT_MANURE_qnty,
            POULTRY_MANURE_qnty,
            VERMY_COMPOST_qnty,
            FODDER_SLIPS_List,
            NAPIER_qnty,
            CO4_qnty,
            CO5_qnty,
            RED_NAPIER_qnty,
            SUPER_NAPIER_qnty,
            GUINEA_GRASS_qnty,
            PARA_GRASS_qnty,
            CONGO_SIGNAL_qnty,
             MALE_BUFFALO_CALVES_qnty,
            CALVES_List ,
            CALVES_HF_qnty,
            CALVES_GERSEY_qnty,
            HEIPERS_List,
            HEIPERS_HF_qnty,
            HEIPERS_GERSEY_qnty,
            COWS_List,
            COWS_HF_qnty,
            COWS_GERSEY_qnty,
             MALABARI_GOATS_qnty,
          //  MATERIAL_FOR_POULTRY_qnty,
            EGG_TRAYS_qnty,
            POULTRY_FEED_qnty,
            LAYER_List,
            LAYER_qnty ,
            CATTLE_FEED_List,
            CATTLE_FEED_qnty,
            MILK_REPLACER_List,
            MILK_REPLACER_qnty,
            ENERGY_RICH_FEED_List,
            ENERGY_RICH_FEED_qnty,
            BY_PASS_PROTEIN_qnty,
            BY_PASS_FAT_qnty,
            TMR_qnty,
            SILAGE_qnty,
            HAY_qnty,
           // UREA_TREATED_STRAW_qnty,
            GOAT_FEEDqnty,
            KID_STARTER_qnty,
            GROWER_qnty ,
            Total_mixed_ration_qnty ,
            Mode_purchaseofrawmaterials,
            CAFF_STARTER_qnty,
      
      data_purchaseofrawmaterials_brand,
      BRAND_qnty,
      familyDetails
    
    } = req.body;

      const data = await Data.findByIdAndUpdate(id, { 
        data_district ,
        data_Block,
        data_Panchayath,
        data_Ward,
        data_Name,
        data_Address,
        data_Phonenumber,
        data_Class,
        data_Class2,
        data_Class3,
        data_familyincome,
        data_NameofNG,
        data_NameofNGmember,
        data_roleinNG,
        data_houseOwnership,
        data_landdetails_landarea,
        data_landdetails_agricultureland,
        data_Animalhusbendary_businesstype,
        data_Animalhusbendary_others0,
        data_Animalhusbendary_cdsregistration ,
          data_Animalhusbendary_regdetails_regnumber,
          data_Animalhusbendary_regdetails_cdsunitname,
          data_enterpisetype,
          data_noofgroupmembers,
          data_Yearofstartingagriculture,
          data_yearofstartingbussiness,
          data_amountinvested,
          data_Sourceofinvestment,
          data_supportrecived,
          data_loan,
          data_loandetails_totalinvestment,
          data_loandetails_DateofLoanApplication ,
          data_businessidea ,
          data_Infra_Infrastructure,
          data_Infra_Shed,
          data_Infra_wastage ,
          data_Infra_biogas,
          data_Infra_equipments,
          data_Infra_others,
          data_support,
          data_others2,
          data_MGNREGAsupport,
          data_landdetails1_landforgrass,
          data_landdetails1_qtyofownland,
          data_landdetails1_qtyofleasedland,
          data_landdetails2_siteforworkshed,
          data_landdetails2_qtyofownland,
          data_others4,
          data_Trainingsrequired,
          data_others3,
          data_comments,
          data_nameofcrp,
          Phonenumber_ofCRP,
          data_Nameofrespondent,
          data_dateofsurvey,
          data_Starttime,
         }, { new: true });
    if (!data) {
      const newData = new Data({
        data_district: data_district || '',
        data_Block: data_Block || '',
        data_Panchayath: data_Panchayath || '',
        data_Ward: data_Ward || 0,
        data_Name: data_Name || '',
        data_Address: data_Address || '',
        data_Phonenumber: data_Phonenumber || 0,
        data_Class: data_Class || '',
        data_Class2: data_Class2 || '',
        data_Class3: data_Class3 || '',
        data_familyincome: data_familyincome || '',
        data_NameofNG: data_NameofNG || '',
        data_NameofNGmember: data_NameofNGmember || '',
        data_roleinNG: data_roleinNG || '',
        data_houseOwnership: data_houseOwnership || '',
        data_landdetails_landarea: data_landdetails_landarea || 0,
        data_landdetails_agricultureland: data_landdetails_agricultureland || 0,
        data_Animalhusbendary_businesstype: data_Animalhusbendary_businesstype || '',
        data_Animalhusbendary_others0: data_Animalhusbendary_others0 || '',
        data_Animalhusbendary_cdsregistration: data_Animalhusbendary_cdsregistration || '',
        data_Animalhusbendary_regdetails_regnumber: data_Animalhusbendary_regdetails_regnumber || '',
        data_Animalhusbendary_regdetails_cdsunitname: data_Animalhusbendary_regdetails_cdsunitname || '',
        data_enterpisetype: data_enterpisetype || '',
        data_noofgroupmembers: data_noofgroupmembers || 0,
        data_Yearofstartingagriculture: data_Yearofstartingagriculture || '',
        data_yearofstartingbussiness: data_yearofstartingbussiness || '',
        data_amountinvested: data_amountinvested || 0,
        data_Sourceofinvestment: data_Sourceofinvestment || '',
        data_supportrecived: data_supportrecived || '',
        data_loan: data_loan || '',
        data_loandetails_totalinvestment: data_loandetails_totalinvestment || 0,
        data_loandetails_DateofLoanApplication: data_loandetails_DateofLoanApplication || new Date(),
        data_businessidea: data_businessidea || '',
        data_Infra_Infrastructure: data_Infra_Infrastructure || '',
        data_Infra_Shed: data_Infra_Shed || '',
        data_Infra_wastage: data_Infra_wastage || '',
        data_Infra_biogas: data_Infra_biogas || '',
        data_Infra_equipments: data_Infra_equipments || '',
        data_Infra_others: data_Infra_others || '',
        data_support: data_support || '',
        data_others2: data_others2 || '',
        data_MGNREGAsupport: data_MGNREGAsupport || '',
        data_landdetails1_landforgrass: data_landdetails1_landforgrass || '',
        data_landdetails1_qtyofownland: data_landdetails1_qtyofownland || 0,
        data_landdetails1_qtyofleasedland: data_landdetails1_qtyofleasedland || 0,
        data_landdetails2_siteforworkshed: data_landdetails2_siteforworkshed || '',
        data_landdetails2_qtyofownland: data_landdetails2_qtyofownland || 0,
        data_others4: data_others4 || '',
        data_Trainingsrequired: data_Trainingsrequired || '',
        data_others3: data_others3 || '',
        data_comments: data_comments || '',
        data_nameofcrp: data_nameofcrp || '',
        Phonenumber_ofCRP : Phonenumber_ofCRP || 0,
        data_Nameofrespondent: data_Nameofrespondent || '',
        data_dateofsurvey: data_dateofsurvey || new Date(),
        data_Starttime: data_Starttime || ''
      });
      await newData.save();
      //console.log(data)
    }
    let sales = await Sales.findOne({ PARENT_KEY: data.KEY });
    if (!sales) {
      sales = new Sales({
        PARENT_KEY: KEY,
        data_Sales_prdct2:data_Sales_prdct2  || '',
        MILK_qnty : MILK_qnty  || 0,
        MEAT_qnty : MEAT_qnty  || 0,
        EGG_qnty : EGG_qnty  || 0,
        Sales_MANURE_qnty : Sales_MANURE_qnty  || 0,
        FEED_qnty : FEED_qnty  || 0,
        male_buffalo_calf_qnty : male_buffalo_calf_qnty  || 0,
        Gras_fooder_qnty : Gras_fooder_qnty  || 0,
        tree_fooder_qnty : tree_fooder_qnty  || 0,
        kid_qnty : kid_qnty  || 0,
        day_old_chick_qnty : day_old_chick_qnty  || 0,
        pullets_qnty : pullets_qnty  || 0,
        calf_qnty : calf_qnty  || 0,
        beifer_qnty : beifer_qnty  || 0,
        data_Sales_salesmethod:data_Sales_salesmethod  || ''
      });
    }
     else {
        sales.data_Sales_prdct2=data_Sales_prdct2 || '',
        sales.MILK_qnty=MILK_qnty || 0,
        sales.MEAT_qnty=MEAT_qnty || 0,
        sales.EGG_qnty = EGG_qnty || 0,
        sales.Sales_MANURE_qnty = Sales_MANURE_qnty || 0,
        sales.FEED_qnty = FEED_qnty || 0,
        sales.male_buffalo_calf_qnty = male_buffalo_calf_qnty || 0,
        sales.Gras_fooder_qnty = Gras_fooder_qnty || 0,
        sales.tree_fooder_qnty = tree_fooder_qnty || 0,
        sales.kid_qnty = kid_qnty || 0,
        sales.day_old_chick_qnty = day_old_chick_qnty || 0,
        sales.pullets_qnty=pullets_qnty || 0,
        sales.calf_qnty = calf_qnty || 0,
        sales.beifer_qnty= beifer_qnty || 0,  
        sales.data_Sales_salesmethod=data_Sales_salesmethod || ''
    }

    await sales.save();
    let products = await Products.findOne({ PARENT_KEY: data.KEY });

    // if (products) {
    //   products.data_products_prdct = data_products_prdct || '',
    //   products.data_products_quantum = data_products_quantum || 0,
    //   products.data_products_price2 = data_products_price2 || 0
    // }
    // else{
    //     products = new Products({
    //       PARENT_KEY: KEY,
    //       data_products_prdct:data_products_prdct  || '',
    //       data_products_quantum:data_products_quantum  || 0,
    //       data_products_price2:data_products_price2  || 0,
    //   })
    // }
    // await products.save();

   let livelihood = await Livelihood.findOne({PARENT_KEY:data.KEY});
   if(livelihood){
    livelihood.data_livelihood_incomesource=data_livelihood_incomesource || '',
    livelihood.livelihood_cows_list = livelihood_cows_list || '',
    livelihood.livelihood_cows_HF_qnty = livelihood_cows_HF_qnty || 0,
    livelihood.livelihood_cows_JERSEY_qnty = livelihood_cows_JERSEY_qnty || 0,
    livelihood.livelihood_cows_INDIGENOUS_qnty = livelihood_cows_INDIGENOUS_qnty || 0,
    livelihood.livelihood_calf_list = livelihood_calf_list || '',
    livelihood.livelihood_calf_FEMALE_qnty = livelihood_calf_FEMALE_qnty || 0,
    livelihood.livelihood_calf_MALE_qnty = livelihood_calf_MALE_qnty || 0,
    livelihood.livelihood_goat_list = livelihood_goat_list || '',
    livelihood.livelihood_goat_MALABARI_qnty = livelihood_goat_MALABARI_qnty || 0,
    livelihood.livelihood_goat_MALABARI_KID_qnty = livelihood_goat_MALABARI_KID_qnty || 0,
    livelihood.livelihood_goat_ATTAPADI_BLACK_qnty = livelihood_goat_ATTAPADI_BLACK_qnty || 0,
    livelihood.livelihood_goat_ATTAPADI_BLACK_KID_qnty = livelihood_goat_ATTAPADI_BLACK_KID_qnty || 0,
    livelihood.livelihood_goat_OTHERS = livelihood_goat_OTHERS || '',
    livelihood.livelihood_goat_OTHERS_qnty = livelihood_goat_OTHERS_qnty || 0,
    livelihood.livelihood_poultry_list = livelihood_poultry_list || '',
    livelihood.livelihood_poultry_EGG_PRODUCTION_qnty = livelihood_poultry_EGG_PRODUCTION_qnty || 0,
    livelihood.livelihood_poultry_MARKETING_qnty = livelihood_poultry_MARKETING_qnty || 0,
    livelihood.livelihood_manure_list = livelihood_manure_list || '',
    livelihood.livelihood_manure_DRY_qnty = livelihood_manure_DRY_qnty || 0,
    livelihood.livelihood_manure_FRESH_qnty = livelihood_manure_FRESH_qnty || 0,
    livelihood.livelihood_fodder_list = livelihood_fodder_list || '',
    livelihood.livelihood_fodder_OWN_USE_qnty = livelihood_fodder_OWN_USE_qnty || 0,
    livelihood.livelihood_fodder_FOR_SALE_qnty = livelihood_fodder_FOR_SALE_qnty || 0,
    livelihood.livelihood_BUFFALO_qnty = livelihood_BUFFALO_qnty || 0,
    livelihood.livelihood_POULTRY_MANURE_qnty = livelihood_POULTRY_MANURE_qnty || 0,
    livelihood.livelihood_DUCK_qnty = livelihood_DUCK_qnty || 0
    

   }
   else{
     livelihood = new Livelihood({
      PARENT_KEY: KEY,
      data_livelihood_incomesource:data_livelihood_incomesource  || '',
      livelihood_cows_list : livelihood_cows_list || '',
      livelihood_cows_HF_qnty : livelihood_cows_HF_qnty || 0,
      livelihood_cows_JERSEY_qnty : livelihood_cows_JERSEY_qnty || 0,
      livelihood_cows_INDIGENOUS_qnty : livelihood_cows_INDIGENOUS_qnty || 0,
      livelihood_calf_list : livelihood_calf_list || '',
      livelihood_calf_FEMALE_qnty : livelihood_calf_FEMALE_qnty || 0,
      livelihood_calf_MALE_qnty : livelihood_calf_MALE_qnty || 0,
      livelihood_goat_list : livelihood_goat_list || '',
      livelihood_goat_MALABARI_qnty : livelihood_goat_MALABARI_qnty || 0,
      livelihood_goat_MALABARI_KID_qnty : livelihood_goat_MALABARI_KID_qnty || 0,
      livelihood_goat_ATTAPADI_BLACK_qnty : livelihood_goat_ATTAPADI_BLACK_qnty || 0,
      livelihood_goat_ATTAPADI_BLACK_KID_qnty : livelihood_goat_ATTAPADI_BLACK_KID_qnty || 0,
      livelihood_goat_OTHERS : livelihood_goat_OTHERS || '',
      livelihood_goat_OTHERS_qnty : livelihood_goat_OTHERS_qnty || 0,
      livelihood_poultry_list : livelihood_poultry_list || '',
      livelihood_poultry_EGG_PRODUCTION_qnty : livelihood_poultry_EGG_PRODUCTION_qnty || 0,
      livelihood_poultry_MARKETING_qnty : livelihood_poultry_MARKETING_qnty || 0,
      livelihood_manure_list : livelihood_manure_list || '',
      livelihood_manure_DRY_qnty : livelihood_manure_DRY_qnty || 0,
      livelihood_manure_FRESH_qnty : livelihood_manure_FRESH_qnty || 0,
      livelihood_fodder_list : livelihood_fodder_list || '',
      livelihood_fodder_OWN_USE_qnty : livelihood_fodder_OWN_USE_qnty || 0,
      livelihood_fodder_FOR_SALE_qnty : livelihood_fodder_FOR_SALE_qnty || 0,
      livelihood_BUFFALO_qnty : livelihood_BUFFALO_qnty || 0,
      livelihood_POULTRY_MANURE_qnty : livelihood_POULTRY_MANURE_qnty || 0,
      livelihood_DUCK_qnty : livelihood_DUCK_qnty || 0
    });

   }
   await livelihood.save();

   let purchaseofrowmaterials = await PurchaseOfRawMaterials.findOne({PARENT_KEY : data.KEY});
   if(purchaseofrowmaterials){
    purchaseofrowmaterials.data_purchaseofrawmaterials_itemtype= data_purchaseofrawmaterials_itemtype || '',
    purchaseofrowmaterials.INGREDIENTS_FOR_POULTRY_FEED_qnty=INGREDIENTS_FOR_POULTRY_FEED_qnty || 0,
    purchaseofrowmaterials.INGREDIENTS_FOR_CTTLE_FEED_qnty = INGREDIENTS_FOR_CTTLE_FEED_qnty || 0 ,
    purchaseofrowmaterials.CHEMICAL_FERTILIZERS_qnty = CHEMICAL_FERTILIZERS_qnty || 0,
    purchaseofrowmaterials.FODDER_SEEDS_qnty = FODDER_SEEDS_qnty || 0,
    purchaseofrowmaterials.Grass_fooder_qnty = Grass_fooder_qnty || 0,
    purchaseofrowmaterials.Tree_fooder_qnty = Tree_fooder_qnty || 0,
    purchaseofrowmaterials.MALABARI_GOAT_KIDS_qnty = MALABARI_GOAT_KIDS_qnty || 0,
    purchaseofrowmaterials.MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty = MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty || 0,
    purchaseofrowmaterials.Urea_treated_Straw_qnty = Urea_treated_Straw_qnty || 0,
    purchaseofrowmaterials.PULLETS_List =PULLETS_List || '' ,
    purchaseofrowmaterials.MANURE_List = MANURE_List || '',
    purchaseofrowmaterials.COW_DUNG_qnty=COW_DUNG_qnty || 0 ,
    purchaseofrowmaterials.GOAT_MANURE_qnty = GOAT_MANURE_qnty || 0,
    purchaseofrowmaterials.POULTRY_MANURE_qnty = POULTRY_MANURE_qnty || 0,
    purchaseofrowmaterials.VERMY_COMPOST_qnty =  VERMY_COMPOST_qnty || 0,
    purchaseofrowmaterials.FODDER_SLIPS_List = FODDER_SLIPS_List || 0,
    purchaseofrowmaterials.NAPIER_qnty=NAPIER_qnty || 0,
    purchaseofrowmaterials.CO4_qnty=CO4_qnty || 0,
    purchaseofrowmaterials.CO5_qnty=CO5_qnty || 0,
    purchaseofrowmaterials.RED_NAPIER_qnty=RED_NAPIER_qnty || 0,
    purchaseofrowmaterials.SUPER_NAPIER_qnty=SUPER_NAPIER_qnty || 0,
    purchaseofrowmaterials.GUINEA_GRASS_qnty=GUINEA_GRASS_qnty || 0,
    purchaseofrowmaterials.PARA_GRASS_qnty=PARA_GRASS_qnty || 0,
    purchaseofrowmaterials.CONGO_SIGNAL_qnty=CONGO_SIGNAL_qnty || 0,
    purchaseofrowmaterials.MALE_BUFFALO_CALVES_qnty=MALE_BUFFALO_CALVES_qnty || 0,
    purchaseofrowmaterials.CALVES_List =CALVES_List || '',
    purchaseofrowmaterials.CALVES_HF_qnty =CALVES_HF_qnty || 0,
    purchaseofrowmaterials.CALVES_GERSEY_qnty = CALVES_GERSEY_qnty || 0,
    purchaseofrowmaterials.HEIPERS_List = HEIPERS_List || '',
    purchaseofrowmaterials.HEIPERS_HF_qnty = HEIPERS_HF_qnty || 0,
    purchaseofrowmaterials.HEIPERS_GERSEY_qnty = HEIPERS_GERSEY_qnty || 0,
    purchaseofrowmaterials.COWS_List = COWS_List || '',
    purchaseofrowmaterials.COWS_HF_qnty = COWS_HF_qnty || 0,
    purchaseofrowmaterials.COWS_GERSEY_qnty = COWS_GERSEY_qnty || 0,
    purchaseofrowmaterials.MALABARI_GOATS_qnty = MALABARI_GOATS_qnty || 0,
    // purchaseofrowmaterials.MATERIAL_FOR_POULTRY_qnty = MATERIAL_FOR_POULTRY_qnty || 0,
    purchaseofrowmaterials.EGG_TRAYS_qnty = EGG_TRAYS_qnty || 0,
    purchaseofrowmaterials.POULTRY_FEED_qnty = POULTRY_FEED_qnty || 0,
    purchaseofrowmaterials.LAYER_List = LAYER_List || '',
    purchaseofrowmaterials.LAYER_qnty = LAYER_qnty || 0,

    purchaseofrowmaterials.CATTLE_FEED_List = CATTLE_FEED_List || '',
    purchaseofrowmaterials.CATTLE_FEED_qnty = CATTLE_FEED_qnty || 0,
    purchaseofrowmaterials.MILK_REPLACER_List = MILK_REPLACER_List || '',
    purchaseofrowmaterials.MILK_REPLACER_qnty=MILK_REPLACER_qnty || 0,
    purchaseofrowmaterials.ENERGY_RICH_FEED_List = ENERGY_RICH_FEED_List || '',
    purchaseofrowmaterials.ENERGY_RICH_FEED_qnty = ENERGY_RICH_FEED_qnty || 0,
    purchaseofrowmaterials.BY_PASS_PROTEIN_qnty = BY_PASS_PROTEIN_qnty || 0,
    purchaseofrowmaterials.BY_PASS_FAT_qnty = BY_PASS_FAT_qnty || 0,
    purchaseofrowmaterials.TMR_qnty = TMR_qnty || 0,
    purchaseofrowmaterials.SILAGE_qnty = SILAGE_qnty || 0,
    purchaseofrowmaterials.HAY_qnty = HAY_qnty || 0,
    // purchaseofrowmaterials.UREA_TREATED_STRAW_qnty = UREA_TREATED_STRAW_qnty || 0,
    purchaseofrowmaterials.GOAT_FEEDqnty = GOAT_FEEDqnty || 0,
    purchaseofrowmaterials.KID_STARTER_qnty = KID_STARTER_qnty || 0,
    purchaseofrowmaterials.GROWER_qnty = GROWER_qnty ,
    purchaseofrowmaterials.Total_mixed_ration_qnty = Total_mixed_ration_qnty,
    purchaseofrowmaterials.Mode_purchaseofrawmaterials = Mode_purchaseofrawmaterials || '',
    purchaseofrowmaterials.data_purchaseofrawmaterials_brand=data_purchaseofrawmaterials_brand || '',
    purchaseofrowmaterials.BRAND_qnty=BRAND_qnty || 0 ,
    purchaseofrowmaterials.CAFF_STARTER_qnty = CAFF_STARTER_qnty || 0
   }
   else{
     purchaseofrowmaterials = new PurchaseOfRawMaterials({
      PARENT_KEY: data.KEY,
      data_purchaseofrawmaterials_itemtype:data_purchaseofrawmaterials_itemtype  || '',
      INGREDIENTS_FOR_POULTRY_FEED_qnty : INGREDIENTS_FOR_POULTRY_FEED_qnty || 0,
      INGREDIENTS_FOR_CTTLE_FEED_qnty : INGREDIENTS_FOR_CTTLE_FEED_qnty || 0,
      CHEMICAL_FERTILIZERS_qnty :CHEMICAL_FERTILIZERS_qnty || 0,
      FODDER_SEEDS_qnty : FODDER_SEEDS_qnty || 0  ,
      Grass_fooder_qnty : Grass_fooder_qnty || 0,
      Tree_fooder_qnty : Tree_fooder_qnty || 0,
      MALABARI_GOAT_KIDS_qnty :MALABARI_GOAT_KIDS_qnty || 0,
      MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty : MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty || 0,
      Urea_treated_Straw_qnty : Urea_treated_Straw_qnty || 0,
      PULLETS_List :PULLETS_List  || '',
            MANURE_List : MANURE_List  || '',
            COW_DUNG_qnty:COW_DUNG_qnty  || 0,
        GOAT_MANURE_qnty : GOAT_MANURE_qnty  || 0,
        POULTRY_MANURE_qnty : POULTRY_MANURE_qnty  || 0,
        VERMY_COMPOST_qnty :  VERMY_COMPOST_qnty  || 0,
            FODDER_SLIPS_List : FODDER_SLIPS_List  || '',
            NAPIER_qnty:NAPIER_qnty  || 0,
        CO4_qnty:CO4_qnty  || 0,
        CO5_qnty:CO5_qnty  || 0,
        RED_NAPIER_qnty:RED_NAPIER_qnty  || 0,
        SUPER_NAPIER_qnty:SUPER_NAPIER_qnty  || 0,
        GUINEA_GRASS_qnty:GUINEA_GRASS_qnty  || 0,
        PARA_GRASS_qnty:PARA_GRASS_qnty  || 0,
        CONGO_SIGNAL_qnty:CONGO_SIGNAL_qnty  || 0,
            MALE_BUFFALO_CALVES_qnty:MALE_BUFFALO_CALVES_qnty  || 0,
            CALVES_List :CALVES_List  || '',
            CALVES_HF_qnty :CALVES_HF_qnty  || 0,
            CALVES_GERSEY_qnty : CALVES_GERSEY_qnty  || 0,
            HEIPERS_List : HEIPERS_List  || '',
            HEIPERS_HF_qnty : HEIPERS_HF_qnty  || 0,
            HEIPERS_GERSEY_qnty : HEIPERS_GERSEY_qnty  || 0,
            COWS_List : COWS_List  || '',
            COWS_HF_qnty : COWS_HF_qnty  || 0,
            COWS_GERSEY_qnty : COWS_GERSEY_qnty  || 0,
            MALABARI_GOATS_qnty : MALABARI_GOATS_qnty  || 0,
           // MATERIAL_FOR_POULTRY_qnty : MATERIAL_FOR_POULTRY_qnty  || 0,
            EGG_TRAYS_qnty : EGG_TRAYS_qnty  || 0,
            POULTRY_FEED_qnty : POULTRY_FEED_qnty  || 0,
            LAYER_List : LAYER_List  || '',
            LAYER_qnty :  LAYER_qnty || 0 ,
            CATTLE_FEED_List : CATTLE_FEED_List  || '',
            CATTLE_FEED_qnty : CATTLE_FEED_qnty  || 0,
            MILK_REPLACER_List : MILK_REPLACER_List  || '',
            MILK_REPLACER_qnty:MILK_REPLACER_qnty  || 0,
            ENERGY_RICH_FEED_List : ENERGY_RICH_FEED_List  || '',
            ENERGY_RICH_FEED_qnty : ENERGY_RICH_FEED_qnty  || 0,
            BY_PASS_PROTEIN_qnty : BY_PASS_PROTEIN_qnty  || 0,
            BY_PASS_FAT_qnty : BY_PASS_FAT_qnty  || 0,
            TMR_qnty : TMR_qnty  || 0,
            SILAGE_qnty : SILAGE_qnty  || 0,
            HAY_qnty : HAY_qnty  || 0,
          //  UREA_TREATED_STRAW_qnty : UREA_TREATED_STRAW_qnty  || 0,
            GOAT_FEEDqnty : GOAT_FEEDqnty  || 0,
            KID_STARTER_qnty : KID_STARTER_qnty  || 0,
            GROWER_qnty : GROWER_qnty || 0,
            Total_mixed_ration_qnty : Total_mixed_ration_qnty || 0,
            Mode_purchaseofrawmaterials : Mode_purchaseofrawmaterials  || '',
           data_purchaseofrawmaterials_brand:data_purchaseofrawmaterials_brand  || '',
           BRAND_qnty:BRAND_qnty  || 0,
           CAFF_STARTER_qnty : CAFF_STARTER_qnty || 0
  });
   }
   await purchaseofrowmaterials.save();

  
// if (familyDetails && Array.isArray(familyDetails)) {
//   for (const updatedFamilyDetail of familyDetails) {
//     const { _id, ...updatedFields } = updatedFamilyDetail;
//     if (_id) {
//       await FamilyDetails.findByIdAndUpdate(_id, updatedFields);
//     } else {
//       console.log("enter else case");
//       //await FamilyDetails.create(updatedFields);
//       const updatedData = familyDetails.map(obj => ({
//         ...obj,
//         PARENT_KEY: KEY,
//       }));
//       FamilyDetails.insertMany(updatedData);
//     }
     
//   }
// }
console.log('line number 1041',familyDetails)
if (familyDetails && Array.isArray(familyDetails)) {
  for (const updatedFamilyDetail of familyDetails) {
    const { _id, ...updatedFields } = updatedFamilyDetail;
    if (_id) {
      // If _id exists, update the existing document with the updatedFields
      await FamilyDetails.findByIdAndUpdate(_id, updatedFields);
    } else {
      // If _id doesn't exist, insert a new document with the updatedFields
      console.log("enter else case");
      const updatedData = {
        ...updatedFields,
        PARENT_KEY: Data.KEY, // Assuming KEY is defined elsewhere
      };
    
      try{
      
    
    // const session = await FamilyDetails.startSession();
    // await session.withTransaction(async () => {
        
   await FamilyDetails.create(updatedData);
    // })
      console.log(updatedFields);
      }
      catch(error){
        console.log(error);
      }}
    }
  
}


res.json({ message: 'Data updated successfully' });

 } catch (error) {
  console.log(error);
  res.status(500).json({ message: 'Internal server error' });
}
    });
   




module.exports = router;


