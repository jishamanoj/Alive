const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();
const Data = require('../model/data');
const FamilyDetails = require('../model/familydetails');
const Livelihood = require('../model/livelihood');
const Products = require('../model/products');
const PurchaseOfRawMaterials = require('../model/purchaseofrowmaterials');
const Sales = require('../model/sales');
const registration = require('../model/registration');
const pdf = require("pdfkit");
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { Console } = require('console');
//const font = require('../RobotoSlab-VariableFont_wght.ttf')
const verifyToken = require('../verifytoken')
const iconv = require('iconv-lite');

router.get('/listBlocksByCRP', async (req, res) => {
  try {
    const { data_nameofcrp } = req.query;
    console.log(data_nameofcrp);

    // Create a query object to filter based on data_district and non-null data_Block
    const query = {
      data_nameofcrp: data_nameofcrp,
      data_Block: { $ne: null }
    };

    const blocks = await Data.distinct('data_Block', query).exec();

    res.json(blocks);
    console.log(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/listPanchayatsByCRP', async (req, res) => {
  try {
    const { data_nameofcrp } = req.query;
    const query = {
      data_nameofcrp : data_nameofcrp,
      data_Panchayath: { $ne: null }
    };

   // const blocks = await Data.distinct('data_Block', query).exec();

    const panchayats = await Data.distinct('data_Panchayath', query).exec();

    res.json(panchayats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/listDistrictsByCRP', async (req, res) => {
  try {
    const { data_nameofcrp } = req.query;
    const query = {
      data_nameofcrp : data_nameofcrp,
      data_district: { $ne: null }
    };

   // const blocks = await Data.distinct('data_Block', query).exec();

    const districts = await Data.distinct('data_district', query).exec();

    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/listDistricts', async (req, res) => {
  try {
    const districts = await Data.distinct('data_district', { data_district: { $ne: null } }).exec();
    res.json(districts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  

// Get list of data_block values based on data_district
router.get('/listBlocks', async (req, res) => {
  try {
    const { data_district } = req.query;
    console.log(data_district);

    // Create a query object to filter based on data_district and non-null data_Block
    const query = {
      data_district: data_district,
      data_Block: { $ne: null }
    };

    const blocks = await Data.distinct('data_Block', query).exec();

    res.json(blocks);
    console.log(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get list of data_Panchayath values by data_Block
router.get('/listPanchayats', async (req, res) => {
  try {
    const { data_Block } = req.query;
    const query = {
      data_Block: data_Block,
      data_Panchayath: { $ne: null }
    };

   // const blocks = await Data.distinct('data_Block', query).exec();

    const panchayats = await Data.distinct('data_Panchayath', query).exec();

    res.json(panchayats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  router.get('/listWards', async (req, res) => {
    try {
      const { data_Panchayath } = req.query;
      const wards = await Data.distinct('data_ward', { data_Panchayath }).exec();
  
      res.json(wards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.get('/listCRPNames', async (req, res) => {
    try {
      const { data_panchayath } = req.query;
      const crpNames = await Data.distinct('data_nameofcrp', { data_Panchayath: data_panchayath }).exec();
  
      res.json(crpNames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  // Get list of data_Ward values by data_Panchayath
  router.get('/listWards', async (req, res) => {
    try {
      const { data_Panchayath } = req.query;
      const wards = await Data.distinct('data_ward', { data_Panchayath }).exec();
  
      res.json(wards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  
// Search data by phone number
router.get('/searchByPhone', async (req, res) => {
  console.log("......................enter......................");
  const data_Phonenumber = req.query.data_Phonenumber;
  console.log(data_Phonenumber);
  try {
    const data = await Data.findOne({ data_Phonenumber }).exec();
    console.log(data);

    if (data !== null) {
      const { key } = data;

      const familyDetails = await FamilyDetails.findOne({ parentKey: key }).exec();
      const livelihood = await Livelihood.findOne({ parentKey: key }).exec();
      const products = await Products.findOne({ parentKey: key }).exec();
      const purchaseOfRawMaterials = await PurchaseOfRawMaterials.findOne({ parentKey: key }).exec();
      const sales = await Sales.findOne({ parentKey: key }).exec();

      const responseData = {
        data,
        familyDetails,
        livelihood,
        products,
        purchaseOfRawMaterials,
        sales
      };

      res.json(responseData);
    } else {
      res.status(404).json({ message: 'Data not found for the provided phone number' });
    
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/searchByDistrict', async (req, res) => {
  const data_district = req.query.data_district;

  try {
    const data = await Data.find({ data_district }).exec();

    if (data.length !== 0) {
      const responseData = [];
      for (const item of data) {
        const { key } = item;

        const familyDetails = await FamilyDetails.findOne({ parentKey: key }).exec();
        const livelihood = await Livelihood.findOne({ parentKey: key }).exec();
        const products = await Products.findOne({ parentKey: key }).exec();
        const purchaseOfRawMaterials = await PurchaseOfRawMaterials.findOne({ parentKey: key }).exec();
        const sales = await Sales.findOne({ parentKey: key }).exec();

        const itemData = {
          data: item,
          familyDetails,
          livelihood,
          products,
          purchaseOfRawMaterials,
          sales
        };

        responseData.push(itemData);
      }

      res.json(responseData);
    } else {
      res.status(404).json({ message: 'Data not found for the provided district' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Search by data_nameofcrp to display data from multiple schemas


router.get('/searchByDataNameOfCrp', async (req, res) => {
  const data_nameofcrp = req.query.data_nameofcrp;

  try {
    const data = await Data.find({ data_nameofcrp }).exec();
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Data not found for the provided data_nameofcrp' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/downloadByCpr',async (req, res) => {
  const { data_nameofcrp, page = 1, limit = 15 } = req.query;

  try {
    const dataQuery = { data_nameofcrp: data_nameofcrp };

    const totalResults = await Data.countDocuments(dataQuery);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(dataQuery)
      .select('data_district data_Block data_Panchayath data_ward data_Name data_Address data_Phonenumber data_Class data_Class2 data_Class3 data_familyincome data_NameofNG data_NameofNGmember data_roleinNG data_houseownership data_landdetails_landarea data_landdetails_agricultureland data_Animalhusbendary_businesstype data_Animalhusbendary_others0 data_Animalhusbendary_cdsregistration data_Animalhusbendary_regdetails_regnumber data_Animalhusbendary_regdetails_cdsunitname data_enterpisetype data_noofgroupmembers data_Yearofstartingagriculture data_yearofstartingbussiness data_amountinvested data_Sourceofinvestment data_supportrecived data_loan data_loandetails_totalinvestment data_loandetails_DateofLoanApplication data_businessidea data_Infra_Infrastructure data_Infra_Shed data_Infr_wastage data_Infra_biogas data_Infra_equipments data_Infra_others data_support data_others2 data_MGNREGAsupport data_landdetails1_landforgrass data_landdetails1_qtyofownland data_landdetails1_qtyofleasedland data_landdetails2_siteforworkshed data_landdetails2_qtyofownland data_others4 data_Trainingsrequired data_others3 data_comments data_nameofcrp data_Nameofrespondent data_dateofsurvey data_Starttime KEY')
      .skip(startIndex)
      .limit(limit);

    const parentKeys = searchData.map((data) => data.KEY);

    const productQuery = { PARENT_KEY: { $in: parentKeys } };
    const productData = await Products.find(productQuery)
      .select('data_products_prdct data_products_quantum data_products_price2 PARENT_KEY')
      .exec();

      const salesQuery = { PARENT_KEY: { $in: parentKeys } };
      const salesData = await Sales.find(salesQuery)
        .select('data_Sales_prdct2 data_Sales_quntum2 data_Sales_salesmethod PARENT_KEY')
        .exec();

        const livelihoodQuery = { PARENT_KEY: { $in: parentKeys } };
        const livelihoodData = await Livelihood.find(livelihoodQuery)
          .select('data_livelihood_incomesource data_livelihood_numbers data_livelihood_capitalsource data_livelihood_revenue PARENT_KEY')
          .exec();
  
          const purchaseOfRawMaterialsQuery = { PARENT_KEY: { $in: parentKeys } };
          const purchaseOfRawMaterialsData = await PurchaseOfRawMaterials.find(purchaseOfRawMaterialsQuery)
            .select('data_purchaseofrawmaterials_itemtype data_purchaseofrawmaterials_quantity data_purchaseofrawmaterials_price data_purchaseofrawmaterials_brand data_purchaseofrawmaterials_own data_purchaseofrawmaterials_retail data_purchaseofrawmaterials_p2 data_purchaseofrawmaterials_wholesale data_purchaseofrawmaterials_p3 data_purchaseofrawmaterials_group data_purchaseofrawmaterials_p4 data_purchaseofrawmaterials_subsidy data_purchaseofrawmaterials_p5 PARENT_KEY')
            .exec();
          const mergedData = searchData.map((data) => {
            const matchedProduct = productData.find((product) => product.PARENT_KEY === data.KEY);
            const matchedSale = salesData.find((sale) => sale.PARENT_KEY === data.KEY);
            const matchedLivelihood = livelihoodData.find((livelihood) => livelihood.PARENT_KEY === data.KEY);
            const matchedPurchaseOfRawMaterials = purchaseOfRawMaterialsData.find((purchaseOfRawMaterials) => purchaseOfRawMaterials.PARENT_KEY === data.KEY);
      
      // Add a check to handle undefined matchedProduct
      // if (matchedProduct && matchedSale && matchedLivelihood && matchedpurchaseOfRawMaterials) {
      //   const { data_products_prdct, data_products_quantum, data_products_price2 } = matchedProduct;
      //  const isProductMatched = Array.isArray(data_products_prdct) && data_products_prdct.includes(products_Name);
        //if (matchedProduct) {
          if (matchedProduct && matchedSale && matchedLivelihood && matchedPurchaseOfRawMaterials) {
         
        return {
          data_district: data.data_district,
          data_Block: data.data_Block,
          data_Panchayath: data.data_Panchayath,
          data_ward: data.data_ward,
          data_Name: data.data_Name,
          data_Address: data.data_Address,
          data_Class: data.data_Class,
         data_Class2: data.data_Class2,
         data_Class3:data.data_Class3,
          data_Phonenumber: data.data_Phonenumber,
          data_familyincome: data.data_familyincome,
          data_NameofNG: data.data_NameofNG,
          data_roleinNG: data.data_roleinNG,
        data_houseownership: data.data_houseOwnership,
        data_landdetails_landarea: data.data_landdetails_landarea,
        data_landdetails_agricultureland: data.data_landdetails_agricultureland,
        data_Animalhusbendary_businesstype: data.data_Animalhusbendary_businesstype,
        data_Animalhusbendary_others0: data.data_Animalhusbendary_others0,
        data_Animalhusbendary_cdsregistration: data.data_Animalhusbendary_cdsregistration,
        data_Animalhusbendary_regdetails_regnumber: data.data_Animalhusbendary_regdetails_regnumber,
        data_Animalhusbendary_regdetails_cdsunitname: data.data_Animalhusbendary_regdetails_cdsunitname,
        data_enterpisetype: data.data_enterpisetype,
        data_noofgroupmembers: data.data_noofgroupmembers,
        data_Yearofstartingagriculture: data.data_Yearofstartingagriculture,
        data_yearofstartingbussiness: data.data_yearofstartingbussiness,
        data_amountinvested: data.data_amountinvested,
        data_Sourceofinvestment: data.data_Sourceofinvestment,
        data_supportrecived: data.data_supportrecived,
        data_loan: data.data_loan,
        data_loandetails_totalinvestment: data.data_loandetails_totalinvestment,
        data_loandetails_DateofLoanApplication: data.data_loandetails_DateofLoanApplication,
        data_businessidea:data.data_businessidea,
        data_Infra_Infrastructure:data.data_Infra_Infrastructure,
      data_Infra_Shed: data.data_Infra_Shed,
      data_Infr_wastage: data.data_Infr_wastage,
      data_Infra_biogas: data.data_Infra_biogas,
      data_Infra_equipments: data.data_Infra_equipments,
      data_Infra_others: data.data_Infra_others,
      data_support: data.data_support,
      data_others2: data.data_others2,
      data_MGNREGAsupport: data.data_MGNREGAsupport,
      data_landdetails1_landforgrass: data.data_landdetails1_landforgrass,
      data_landdetails1_qtyofownland: data.data_landdetails1_qtyofownland,
      data_landdetails1_qtyofleasedland: data.data_landdetails1_qtyofleasedland,
      data_landdetails2_siteforworkshed: data.data_landdetails2_siteforworkshed,
      data_landdetails2_qtyofownland: data.data_landdetails2_qtyofownland,
      data_others4: data.data_others4,
      data_Trainingsrequired: data.data_Trainingsrequired,
      data_others3: data.data_others3,
      data_comments: data.data_comments,
      data_nameofcrp: data.data_nameofcrp,
      data_Nameofrespondent: data.data_Nameofrespondent,
      data_dateofsurvey: data.data_dateofsurvey,
      data_Starttime: data.data_Starttime,    
      data_products_prdct: matchedProduct.data_products_prdct,
      data_products_quantum: matchedProduct.data_products_quantum,
      data_products_price2: matchedProduct.data_products_price2,
      data_Sales_prdct2: matchedSale.data_Sales_prdct2,
      MILK_qnty: matchedSale.MILK_qnty,
      MEAT_qnty: matchedSale.MEAT_qnty,
      EGG_qnty: matchedSale.EGG_qnty,
      Sales_MANURE_qnty: matchedSale.Sales_MANURE_qnty,
      FEED_qnty: matchedSale.FEED_qnty,
      male_buffalo_calf_qnty: matchedSale.male_buffalo_calf_qnty,
      Gras_fooder_qnty: matchedSale.Gras_fooder_qnty,
      tree_fooder_qnty: matchedSale.tree_fooder_qnty,
      day_old_chick_qnty: matchedSale.day_old_chick_qnty,
      pullets_qnty: matchedSale.pullets_qnty,
      calf_qnty: matchedSale.calf_qnty,
      beifer_qnty: matchedSale.beifer_qnty,
      data_Sales_salesmethod: matchedSale.data_Sales_salesmethod,
      data_livelihood_incomesource: matchedLivelihood.data_livelihood_incomesource,
      data_livelihood_numbers : matchedLivelihood.data_livelihood_numbers,
      data_livelihood_capitalsource : matchedLivelihood.data_livelihood_capitalsource,
      data_livelihood_revenue : matchedLivelihood.data_livelihood_revenue,
      data_purchaseofrawmaterials_itemtype: matchedPurchaseOfRawMaterials.data_purchaseofrawmaterials_itemtype,
      PULLETS_List: matchedPurchaseOfRawMaterials.PULLETS_List,
      MANURE_List: matchedPurchaseOfRawMaterials.MANURE_List,
      COW_DUNG_qnty: matchedPurchaseOfRawMaterials.COW_DUNG_qnty,
      GOAT_MANURE_qnty: matchedPurchaseOfRawMaterials.GOAT_MANURE_qnty,
      POULTRY_MANURE_qnty: matchedPurchaseOfRawMaterials.POULTRY_MANURE_qnty,
      VERMY_COMPOST_qnty: matchedPurchaseOfRawMaterials.VERMY_COMPOST_qnty,
      FODDER_SLIPS_List: matchedPurchaseOfRawMaterials.FODDER_SLIPS_List,
      NAPIER_qnty: matchedPurchaseOfRawMaterials.NAPIER_qnty,
      CO4_qnty: matchedPurchaseOfRawMaterials.CO4_qnty,
      CO5_qnty: matchedPurchaseOfRawMaterials.CO5_qnty,
      RED_NAPIER_qnty: matchedPurchaseOfRawMaterials.RED_NAPIER_qnty,
      SUPER_NAPIER_qnty: matchedPurchaseOfRawMaterials.SUPER_NAPIER_qnty,
      GUINEA_GRASS_qnty: matchedPurchaseOfRawMaterials.GUINEA_GRASS_qnty,
      PARA_GRASS_qnty: matchedPurchaseOfRawMaterials.PARA_GRASS_qnty,
      CONGO_SIGNAL_qnty: matchedPurchaseOfRawMaterials.CONGO_SIGNAL_qnty,
      MALE_BUFFALO_CALVES_qnty: matchedPurchaseOfRawMaterials.MALE_BUFFALO_CALVES_qnty,
      CALVES_List: matchedPurchaseOfRawMaterials.CALVES_List,
      CALVES_HF_qnty: matchedPurchaseOfRawMaterials.CALVES_HF_qnty,
      CALVES_GERSEY_qnty: matchedPurchaseOfRawMaterials.SUPER_NAPIER_qnty,
      HEIPERS_List: matchedPurchaseOfRawMaterials.HEIPERS_List,
      HEIPERS_HF_qnty: matchedPurchaseOfRawMaterials.HEIPERS_HF_qnty,
      COWS_List: matchedPurchaseOfRawMaterials.COWS_List,
      COWS_HF_qnty: matchedPurchaseOfRawMaterials.COWS_HF_qnty,
      COWS_GERSEY_qnty: matchedPurchaseOfRawMaterials.COWS_GERSEY_qnty,
      MALABARI_GOATS_qnty: matchedPurchaseOfRawMaterials.MALABARI_GOATS_qnty,
     // MATERIAL_FOR_POULTRY_qnty: matchedPurchaseOfRawMaterials.MATERIAL_FOR_POULTRY_qnty,
      EGG_TRAYS_qnty: matchedPurchaseOfRawMaterials.EGG_TRAYS_qnty,
      POULTRY_FEED_qnty: matchedPurchaseOfRawMaterials.POULTRY_FEED_qnty,
      LAYER_List: matchedPurchaseOfRawMaterials.LAYER_List,
      CATTLE_FEED_List: matchedPurchaseOfRawMaterials.CATTLE_FEED_List,
      CATTLE_FEED_qnty: matchedPurchaseOfRawMaterials.CATTLE_FEED_qnty,
      MILK_REPLACER_List: matchedPurchaseOfRawMaterials.MILK_REPLACER_List,
      MILK_REPLACER_qnty: matchedPurchaseOfRawMaterials.MILK_REPLACER_qnty,
      ENERGY_RICH_FEED_List: matchedPurchaseOfRawMaterials.ENERGY_RICH_FEED_List,
      ENERGY_RICH_FEED_qnty: matchedPurchaseOfRawMaterials.ENERGY_RICH_FEED_qnty,
      BY_PASS_PROTEIN_qnty: matchedPurchaseOfRawMaterials.BY_PASS_PROTEIN_qnty,
      BY_PASS_FAT_qnty: matchedPurchaseOfRawMaterials.BY_PASS_FAT_qnty,
      TMR_qnty: matchedPurchaseOfRawMaterials.TMR_qnty,
      SILAGE_qnty: matchedPurchaseOfRawMaterials.SILAGE_qnty,
      HAY_qnty: matchedPurchaseOfRawMaterials.HAY_qnty,
      Urea_treated_Straw_qnty: matchedPurchaseOfRawMaterials.Urea_treated_Straw_qnty,
      GOAT_FEEDqnty: matchedPurchaseOfRawMaterials.GOAT_FEEDqnty,
      KID_STARTER_qnty: matchedPurchaseOfRawMaterials.KID_STARTER_qnty,
      Mode_purchaseofrawmaterials: matchedPurchaseOfRawMaterials.Mode_purchaseofrawmaterials,
      data_purchaseofrawmaterials_brand: matchedPurchaseOfRawMaterials.data_purchaseofrawmaterials_brand,
      BRAND_qnty: matchedPurchaseOfRawMaterials.BRAND_qnty,
      
         // KEY: data.KEY,
          // data_products_prdct: matchedProduct.data_products_prdct,
          // data_products_quantum: matchedProduct.data_products_quantum,
          // data_products_price2: matchedProduct.data_products_price2
        };
      } else {
        return null;
      }
    
    });
 console.log(mergedData);
    if (searchData.length !== 0) {
      try {
        var tempList = []
        for(var i=0; i< mergedData.length; i++){
          try{
            var obj = new Object();
            obj.District = mergedData[i].data_district
            obj.Block = mergedData[i].data_Block
            obj.Panchayath= mergedData[i].data_Panchayath
            obj.data_ward= mergedData[i].data_ward
            obj.Name = mergedData[i].data_Name
            obj.data_Address = mergedData[i].data_Address
            obj.Phonenumber =mergedData[i].data_Phonenumber
            obj.data_Class = mergedData[i].data_Class
            obj.data_Class2 = mergedData[i].data_Class2
            obj.data_Class3 = mergedData[i].data_Class3
            obj.data_familyincome = mergedData[i].data_familyincome
            obj.Name_of_NHG = mergedData[i].data_NameofNG
            obj.data_NameofNGmember = mergedData[i].data_NameofNGmember
            obj.data_roleinNG =mergedData[i].data_roleinNG
            obj.data_houseownership=  mergedData[i].data_houseOwnership,
            obj.data_landdetails_landarea=  mergedData[i].data_landdetails_landarea,
            obj.data_landdetails_agricultureland=  mergedData[i].data_landdetails_agricultureland,
            obj.data_Animalhusbendary_businesstype=  mergedData[i].data_Animalhusbendary_businesstype,
            obj.data_Animalhusbendary_others0=  mergedData[i].data_Animalhusbendary_others0,
            obj.data_Animalhusbendary_cdsregistration=  mergedData[i].data_Animalhusbendary_cdsregistration,
            obj.data_Animalhusbendary_regdetails_regnumber=  mergedData[i].data_Animalhusbendary_regdetails_regnumber,
            obj.data_Animalhusbendary_regdetails_cdsunitname=  mergedData[i].data_Animalhusbendary_regdetails_cdsunitname,
            obj.data_enterpisetype=  mergedData[i].data_enterpisetype,
            obj.data_noofgroupmembers=  mergedData[i].data_noofgroupmembers,
            obj.data_Yearofstartingagriculture=  mergedData[i].data_Yearofstartingagriculture,
            obj.data_yearofstartingbussiness=  mergedData[i].data_yearofstartingbussiness,
            obj.data_amountinvested=  mergedData[i].data_amountinvested,
            obj.data_Sourceofinvestment=  mergedData[i].data_Sourceofinvestment,
            obj.data_supportrecived=  mergedData[i].data_supportrecived,
            obj.data_loan=  mergedData[i].data_loan,
            obj.data_loandetails_totalinvestment=  mergedData[i].data_loandetails_totalinvestment,
            obj.data_loandetails_DateofLoanApplication=  mergedData[i].data_loandetails_DateofLoanApplication,
            obj.data_businessidea= mergedData[i].data_businessidea,
            obj.data_Infra_Infrastructure= mergedData[i].data_Infra_Infrastructure,
            obj.data_Infra_Shed=  mergedData[i].data_Infra_Shed,
            obj.data_Infr_wastage=  mergedData[i].data_Infr_wastage,
            obj.data_Infra_biogas=  mergedData[i].data_Infra_biogas,
            obj.data_Infra_equipments=  mergedData[i].data_Infra_equipments,
            obj.data_Infra_others=  mergedData[i].data_Infra_others,
            obj.data_support=  mergedData[i].data_support,
            obj.data_others2=  mergedData[i].data_others2,
            obj.data_MGNREGAsupport=  mergedData[i].data_MGNREGAsupport,
            obj.data_landdetails1_landforgrass=  mergedData[i].data_landdetails1_landforgrass,
            obj.data_landdetails1_qtyofownland=  mergedData[i].data_landdetails1_qtyofownland,
            obj.data_landdetails1_qtyofleasedland=  mergedData[i].data_landdetails1_qtyofleasedland,
            obj.data_landdetails2_siteforworkshed=  mergedData[i].data_landdetails2_siteforworkshed,
            obj.data_landdetails2_qtyofownland=  mergedData[i].data_landdetails2_qtyofownland,
            obj.data_others4=  mergedData[i].data_others4,
            obj.data_Trainingsrequired=  mergedData[i].data_Trainingsrequired,
            obj.data_others3=  mergedData[i].data_others3,
            obj.data_comments=  mergedData[i].data_comments,
            obj.data_nameofcrp=  mergedData[i].data_nameofcrp,
            obj.data_Nameofrespondent=  mergedData[i].data_Nameofrespondent,
            obj.data_dateofsurvey=  mergedData[i].data_dateofsurvey,
            obj.data_Starttime=  mergedData[i].data_Starttime, 
            obj.products_Name = mergedData[i].data_products_prdct,
            obj.products_quantity = mergedData[i].data_products_quantum,
            obj.products_price2 = mergedData[i].data_products_price2,
            obj.data_Sales_prdct2= mergedData[i].data_Sales_prdct2,
            obj.MILK_qnty= mergedData[i].MILK_qnty,
            obj.MEAT_qnty= mergedData[i].MEAT_qnty,
            obj.EGG_qnty= mergedData[i].EGG_qnty,
            obj.Sales_MANURE_qnty= mergedData[i].Sales_MANURE_qnty,
            obj.FEED_qnty= mergedData[i].FEED_qnty,
            obj.male_buffalo_calf_qnty= mergedData[i].male_buffalo_calf_qnty,
            obj.Gras_fooder_qnty= mergedData[i].Gras_fooder_qnty,
            obj.tree_fooder_qnty= mergedData[i].tree_fooder_qnty,
            obj.day_old_chick_qnty= mergedData[i].day_old_chick_qnty,
            obj.pullets_qnty= mergedData[i].pullets_qnty,
            obj.calf_qnty= mergedData[i].calf_qnty,
            obj.beifer_qnty= mergedData[i].beifer_qnty,
            obj.data_Sales_salesmethod = mergedData[i].data_Sales_salesmethod, 
            obj.data_livelihood_incomesource = mergedData[i].data_livelihood_incomesource,
            obj.data_livelihood_numbers = mergedData[i].data_livelihood_numbers,
            obj.data_livelihood_capitalsource = mergedData[i].data_livelihood_capitalsource,
            obj.data_livelihood_revenue = mergedData[i].data_livelihood_revenue,
            obj.data_purchaseofrawmaterials_itemtype= mergedData[i].data_purchaseofrawmaterials_itemtype,
            obj.PULLETS_List= mergedData[i].PULLETS_List,
            obj.MANURE_List= mergedData[i].MANURE_List,
            obj.COW_DUNG_qnty= mergedData[i].COW_DUNG_qnty,
            obj.GOAT_MANURE_qnty= mergedData[i].GOAT_MANURE_qnty,
            obj.POULTRY_MANURE_qnty= mergedData[i].POULTRY_MANURE_qnty,
            obj.VERMY_COMPOST_qnty= mergedData[i].VERMY_COMPOST_qnty,
            obj.FODDER_SLIPS_List= mergedData[i].FODDER_SLIPS_List,
            obj.NAPIER_qnty= mergedData[i].NAPIER_qnty,
            obj.CO4_qnty= mergedData[i].CO4_qnty,
            obj.CO5_qnty= mergedData[i].CO5_qnty,
            obj.RED_NAPIER_qnty= mergedData[i].RED_NAPIER_qnty,
            obj.SUPER_NAPIER_qnty= mergedData[i].SUPER_NAPIER_qnty,
            obj.GUINEA_GRASS_qnty= mergedData[i].GUINEA_GRASS_qnty,
            obj.PARA_GRASS_qnty= mergedData[i].PARA_GRASS_qnty,
            obj.CONGO_SIGNAL_qnty= mergedData[i].CONGO_SIGNAL_qnty,
            obj.MALE_BUFFALO_CALVES_qnty= mergedData[i].MALE_BUFFALO_CALVES_qnty,
            obj.CALVES_List= mergedData[i].CALVES_List,
            obj.CALVES_HF_qnty= mergedData[i].CALVES_HF_qnty,
            obj.CALVES_GERSEY_qnty= mergedData[i].SUPER_NAPIER_qnty,
            obj.HEIPERS_List= mergedData[i].HEIPERS_List,
            obj.HEIPERS_HF_qnty= mergedData[i].HEIPERS_HF_qnty,
            obj.COWS_List= mergedData[i].COWS_List,
            obj.COWS_HF_qnty= mergedData[i].COWS_HF_qnty,
            obj.COWS_GERSEY_qnty= mergedData[i].COWS_GERSEY_qnty,
            obj.MALABARI_GOATS_qnty= mergedData[i].MALABARI_GOATS_qnty,
         //   obj.MATERIAL_FOR_POULTRY_qnty= mergedData[i].MATERIAL_FOR_POULTRY_qnty,
            obj.EGG_TRAYS_qnty= mergedData[i].EGG_TRAYS_qnty,
            obj.POULTRY_FEED_qnty= mergedData[i].POULTRY_FEED_qnty,
            obj.LAYER_List= mergedData[i].LAYER_List,
            obj.CATTLE_FEED_List= mergedData[i].CATTLE_FEED_List,
            obj.CATTLE_FEED_qnty= mergedData[i].CATTLE_FEED_qnty,
            obj.MILK_REPLACER_List= mergedData[i].MILK_REPLACER_List,
            obj.MILK_REPLACER_qnty= mergedData[i].MILK_REPLACER_qnty,
            obj.ENERGY_RICH_FEED_List= mergedData[i].ENERGY_RICH_FEED_List,
            obj.ENERGY_RICH_FEED_qnty= mergedData[i].ENERGY_RICH_FEED_qnty,
            obj.BY_PASS_PROTEIN_qnty= mergedData[i].BY_PASS_PROTEIN_qnty,
            obj.BY_PASS_FAT_qnty= mergedData[i].BY_PASS_FAT_qnty,
            obj.TMR_qnty= mergedData[i].TMR_qnty,
            obj.SILAGE_qnty= mergedData[i].SILAGE_qnty,
            obj.HAY_qnty= mergedData[i].HAY_qnty,
            obj.Urea_treated_Straw_qnty= mergedData[i].Urea_treated_Straw_qnty,
            obj.GOAT_FEEDqnty= mergedData[i].GOAT_FEEDqnty,
            obj.KID_STARTER_qnty= mergedData[i].KID_STARTER_qnty,
            obj.Mode_purchaseofrawmaterials= mergedData[i].Mode_purchaseofrawmaterials,
            
            obj.data_purchaseofrawmaterials_brand= mergedData[i].data_purchaseofrawmaterials_brand,
            obj.BRAND_qnty= mergedData[i].BRAND_qnty,
            

    
  
            tempList.push(obj)
          }catch(e){
            console.log("error")
          }
        }
                    // Prepare headers for the Excel file
                    const headers = Object.keys(tempList[0]);
  
                    // Prepare values for the Excel file
                    const values = [headers, ...tempList.map(obj => Object.values(obj))];
          
                    // Generate the Excel file
                    const worksheet = XLSX.utils.aoa_to_sheet(values);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
                    // Convert the workbook to a buffer
                    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          
                    // Set the appropriate headers for the response
                    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
                    res.setHeader('Content-Length', buffer.length);
          
                    // Send the buffer as the response
                    res.send(buffer);
               
              } catch (error) {
                console.error('Failed to fetch data from MongoDB:', error);
                res.status(500).send('Failed to fetch data from MongoDB');
              }

      // res.json({
      //   data: mergedData,
      //   currentPage: parseInt(page),
      //   totalPages,
      //   totalResults
      // });
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/searchByCpr',async (req, res) => {
  const data_nameofcrp = req.query.data_nameofcrp;

  try {
    const data = await Data.find({ data_nameofcrp }).exec();
    //console.log("=======================");
    //console.log(data);
    //console.log("=======================");

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Data not found for the provided CrpName' });
    }

    const keys = data.map(item => item.KEY); // Get an array of all the KEY values

    // Fetch data from all schemas based on PARENT_KEY
    const fetchPromises = keys.map(async key => {
      const familyDetails = await FamilyDetails.find({ PARENT_KEY: key }).exec();
      const livelihoods = await Livelihood.find({ PARENT_KEY: key }).exec();
      const products = await Products.find({ PARENT_KEY: key }).exec();
      const purchaseOfRawMaterials = await PurchaseOfRawMaterials.find({ PARENT_KEY: key }).exec();
      const sales = await Sales.find({ PARENT_KEY: key }).exec();
      const data = await Data.find({ KEY: key }).exec();

      return {
        key,
        data,
        familyDetails,
        livelihoods,
        products,
        purchaseOfRawMaterials,
        sales
      };
    });

    // Execute all the fetch promises concurrently
    const responseData = await Promise.all(fetchPromises);
   console.log(data);
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





router.get('/searchById', async (req, res) => {
  const dataId = req.query.dataId;

  try {
    const data = await Data.findById(dataId).exec();

    if (!data) {
      return res.status(404).json({ message: 'Data not found for the provided id' });
    }

    const key = data.KEY;

    // Check if data_class3 exists and is not null
    const dataClass3List = data.data_support && typeof data.data_support === 'string' ? data.data_support.split(',') : [];

    // Fetch data from all schemas based on PARENT_KEY
    const familyDetails = await FamilyDetails.find({ PARENT_KEY: key }).exec();
    const livelihood = await Livelihood.findOne({ PARENT_KEY: key }).exec();
    const products = await Products.findOne({ PARENT_KEY: key }).exec();
    const purchaseOfRawMaterials = await PurchaseOfRawMaterials.find({ PARENT_KEY: key }).exec();
    const sales = await Sales.findOne({ PARENT_KEY: key }).exec();

    const responseData = {
      data: {
        ...data._doc,
        data_class3: dataClass3List, // Assign the converted list to data_class3
      },
      familyDetails,
      livelihood,
      products,
      purchaseOfRawMaterials,
      sales
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/deleteById', async (req, res) => {
  const dataId = req.query.dataId;

  try {
    // Fetch the key from the Data collection
    const data = await Data.findById(dataId).exec();
    if (!data) {
      return res.status(404).json({ message: 'Data not found for the provided ID' });
    }
    const key = data.KEY;

    // Delete the data by ID
    await Data.findByIdAndDelete(dataId).exec();

    // Delete related documents from other collections using the key
    await FamilyDetails.deleteMany({ PARENT_KEY: key }).exec();
    await Livelihood.deleteMany({ PARENT_KEY: key }).exec();
    await Products.deleteMany({ PARENT_KEY: key }).exec();
    await PurchaseOfRawMaterials.deleteMany({ PARENT_KEY: key }).exec();
    await Sales.deleteMany({ PARENT_KEY: key }).exec();

    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/class1', async (req, res) => {
  const { data_Panchayath, data_Class, page = 1, limit = 15 } = req.query;

  try {
    const classValues = data_Class.split(',');

    const query = {
      data_Panchayath,
      data_Class: { $in: classValues }
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Class')
      .skip(startIndex)
      .limit(limit);

      if (data.length !== 0) {
        try {
          const tempList = [];
          for (let i = 0; i < data.length; i++) {
            try {
              const obj = {
                Name: data[i].data_Name,
                Ward: data[i].data_Ward,
                Phonenumber: data[i].data_Phonenumber,
                Class: data[i].data_Class,
                Name_of_NHG: data[i].data_NameofNG
              };
      
              tempList.push(obj);
            } catch (e) {
              console.log("error");
            }
          }
      
          // Prepare headers for the Excel file
          const headers = ["Name","Ward","Phonenumber", "Class", "Name_of_NHG"];
      
          // Prepare values for the Excel file
          const values = [
            ['REPORT OF KUDUMBAVASTHA'],
            ['A-live Kudumbashree'],
            ['District: ' + data[0].data_district],
            ['Block: ' + data[0].data_Block],
            ['Panchayath: ' + data[0].data_Panchayath],
            headers,
           // Display selected district, block, and panchayath in the header
            ...tempList.map(obj => [obj.Name,obj.Ward, obj.Phonenumber, obj.Class, obj.Name_of_NHG])
          ];
      
          // Generate the Excel file
          const worksheet = XLSX.utils.aoa_to_sheet(values);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
          // Convert the workbook to a buffer
          const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
          // Set the appropriate headers for the response
          res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
          res.setHeader('Content-Length', buffer.length);
      
          // Send the buffer as the response
          res.send(buffer);
        } catch (error) {
          console.error('Failed to create Excel file:', error);
          res.status(500).send('Failed to create Excel file');
        }
      } else {
        res.status(404).json({ message: 'No data found for the provided class and panchayath' });
      }
      
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/class2',verifyToken,async (req, res) => {
  const { data_Panchayath, data_Class2, page = 1, limit = 15 } = req.query;

  try {
    const classValues = data_Class2.split(',');

    const query = {
      data_Panchayath,
      data_Class2: { $in: classValues }
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Class2')
      .skip(startIndex)
      .limit(limit);

    if (searchData.length !== 0) {
      try {
        var tempList = []
        for(var i=0; i<= searchData.length; i++){
          try{
            var obj = new Object();
            // obj.District = searchData[i].data_district
            // obj.Blocks = searchData[i].data_Block
            // obj.Panchayath= searchData[i].data_Panchayath
            obj.Name = searchData[i].data_Name
            obj.Ward = searchData[i].data_Ward
            obj.Phonenumber =searchData[i].data_Phonenumber
            obj.Class = searchData[i].data_Class2
            obj.Name_of_NHG = searchData[i].data_NameofNG

            tempList.push(obj)
          }catch(e){
            console.log("error")
          }
        }
                    // Prepare headers for the Excel file
                    const headers = ["Name","Ward", "Phonenumber", "Class", "Name_of_NHG"];

                    // Prepare values for the Excel file
                    const values = [
                      ['REPORT OF VIBHAGAM'],
                      ['A-live Kudumbashree'],
                      ['District: ' + searchData[0].data_district],
                      ['Block: ' + searchData[0].data_Block],
                      ['Panchayath: ' + searchData[0].data_Panchayath],
                      headers,
                      ...tempList.map(obj => [obj.Name,obj.Ward,obj.Phonenumber, obj.Class, obj.Name_of_NHG])
                    ];
                    // Generate the Excel file
                    const worksheet = XLSX.utils.aoa_to_sheet(values);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
                    // Convert the workbook to a buffer
                    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          
                    // Set the appropriate headers for the response
                    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
                    res.setHeader('Content-Length', buffer.length);
          
                    // Send the buffer as the response
                    res.send(buffer);
               
              } catch (error) {
                console.error('Failed to fetch data from MongoDB:', error);
                res.status(500).send('Failed to fetch data from MongoDB');
              }

        } else {
      res.status(404).json({ message: 'No data found for the provided class and panchayath' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/class3',verifyToken, async (req, res) => {
  const { data_Panchayath, data_Class3, page = 1, limit = 50 } = req.query;

  try {
    const classValues = data_Class3.split(',');

    const query = {
      data_Panchayath,
      data_Class3: { $in: classValues }
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Class3')
      .skip(startIndex)
      .limit(limit);
      console.log(searchData);

    if (searchData.length !== 0) {
      try {
        var tempList = []
        for(var i=0; i<= searchData.length; i++){
          try{
            const obj = {
              Name: searchData[i].data_Name,
              Ward: searchData[i].data_Ward,
              Phonenumber: searchData[i].data_Phonenumber,
              Class: searchData[i].data_Class3,
              Name_of_NHG: searchData[i].data_NameofNG
            };

            tempList.push(obj)
          }catch(e){
            console.log("error")
          }
        }
                    // Prepare headers for the Excel file
                    const headers = Object.keys(tempList[0]);

                    // Prepare values for the Excel file
                    const values = [
                      ['REPORT OF PRETHEKAVIBHAGAM'],
                      ['A-live Kudumbashree'],
                      ['District: ' + searchData[0].data_district],
                      ['Block: ' + searchData[0].data_Block],
                      ['Panchayath: ' + searchData[0].data_Panchayath],
                      headers,
                      ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Class, obj.Name_of_NHG])
                    ];
          
                    // Generate the Excel file
                    const worksheet = XLSX.utils.aoa_to_sheet(values);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
                    // Convert the workbook to a buffer
                    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          
                    // Set the appropriate headers for the response
                    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
                    res.setHeader('Content-Length', buffer.length);
          
                    // Send the buffer as the response
                    res.send(buffer);
               
              } catch (error) {
                console.error('Failed to fetch data from MongoDB:', error);
                res.status(500).send('Failed to fetch data from MongoDB');
              }
     
    } else {
      res.status(404).json({ message: 'No data found for the provided class and panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/detailsofAnimalHusbandryBusiness',verifyToken, async (req, res) => {
  const { selectedPanchayath, selectedBusinessType, page = 1, limit = 20 } = req.query;

  try {
    const businessTypeOptions = selectedBusinessType.split(',');

    const query = {
      data_Panchayath: selectedPanchayath,
      data_Animalhusbendary_businesstype: { $in: businessTypeOptions }
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const details = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Animalhusbendary_businesstype')
      .skip(startIndex)
      .limit(limit);

    if (details.length !== 0) {
      try {
        var tempList = [];
        for (var i = 0; i < details.length; i++) { // Fixed the loop condition
          try {
            const obj = {
              Name: details[i].data_Name,
              Ward: details[i].data_Ward,
              Phonenumber: details[i].data_Phonenumber,
              Animalhusbendary_businesstype: details[i].data_Animalhusbendary_businesstype,
              Name_of_NHG: details[i].data_NameofNG
            };

            tempList.push(obj);
          } catch (e) {
            console.log("error");
          }
        }

        // Prepare headers for the Excel file
        const headers = Object.keys(tempList[0]);

        // Prepare values for the Excel file
        const values = [
          ['REPORT OF ANIMAL HUSBENDARY BUSINESS TYPE'],
          ['A-live Kudumbashree'],
          ['District: ' + details[0].data_district],
          ['Block: ' + details[0].data_Block],
          ['Panchayath: ' + details[0].data_Panchayath],
          headers,
          ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Animalhusbendary_businesstype, obj.Name_of_NHG])
        ];

        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as the response
        res.send(buffer);
      } catch (error) {
        console.error('Failed to fetch data from MongoDB:', error);
        res.status(500).send('Failed to fetch data from MongoDB');
      }
    } else {
      res.status(404).json({ message: 'No data found for the provided class and panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/landdetails', async (req, res) => {
  const { selectedPanchayath, page = 1, limit = 10 } = req.query;

  try {
    const query = {
      data_Panchayath: selectedPanchayath
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: null,
          totalLandArea: { $sum: '$data_landdetails_landarea' },
          totalAgricultureLand: { $sum: '$data_landdetails_agricultureland' }
        }
      }
    ];

    const [details, totals] = await Promise.all([
      Data.find(query)
        .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_landdetails_landarea data_landdetails_agricultureland')
        .skip(startIndex)
        .limit(limit),
      Data.aggregate(pipeline)
    ]);

    if (details.length === 0) {
      res.status(404).json({ error: 'No matching data found' });
      return;
    }
    
    try {
      var tempList = [];
      for (var i = 0; i < details.length; i++) {
        try {
          const obj = {
            Name: details[i].data_Name,
            Ward: details[i].data_Ward,
            Phonenumber: details[i].data_Phonenumber,
            Name_of_NHG: details[i].data_NameofNG,
            Dry_Land_cent: details[i].data_landdetails_landarea,
            Paddy_Land_cent: details[i].data_landdetails_agricultureland
          };

          tempList.push(obj);
        } catch (e) {
          console.log("error");
        }
      }

      // Prepare headers for the Excel file
      const headers = Object.keys(tempList[0]);

      // Prepare values for the Excel file
      const values = [
        ['REPORT OF LAND DETAILS'],
        ['A-live Kudumbashree'],
        ['District: ' + details[0].data_district],
        ['Block: ' + details[0].data_Block],
        ['Panchayath: ' + details[0].data_Panchayath],
        headers,
        ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG, obj.Dry_Land_cent, obj.Paddy_Land_cent])
      ];

      // Generate the Excel file
      const worksheet = XLSX.utils.aoa_to_sheet(values);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Convert the workbook to a buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Set the appropriate headers for the response
      res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
      res.setHeader('Content-Length', buffer.length);

      // Send the buffer as the response
      res.send(buffer);
    } catch (error) {
      console.error('Failed to fetch data from MongoDB:', error);
      res.status(500).send('Failed to fetch data from MongoDB');
    }
    
    // Uncomment the below lines if you want to send the response as JSON
    // res.status(200).json({
    //   currentPage: parseInt(page),
    //   totalPages,
    //   totalResults,
    //   data: details,
    //   totals: totals[0]
    // });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving land details' });
  }
});


router.get('/questions-pdf',async (req, res)=>{
  const data = await registration.find()
  const pdfDoc = new pdf();
// Add content to the PDF document
pdfDoc.text("Qus");
pdfDoc.text(data)
// End the PDF document
pdfDoc.end();
// Send the PDF document to the user as a download
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
pdfDoc.pipe(res);
})


// router.get('/productDetails', async (req, res) => {
//   const { panchayath,products_Name, page = 1, limit = 15 } = req.query;

//   try {
//     const dataQuery = { data_Panchayath: panchayath };

//     const totalResults = await Data.countDocuments(dataQuery);
//     const totalPages = Math.ceil(totalResults / limit);

//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const searchData = await Data.find(dataQuery)
//       .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG KEY')
//       .skip(startIndex)
//       .limit(limit);

//     const parentKeys = searchData.map((data) => data.KEY);

//     const productQuery = { PARENT_KEY: { $in: parentKeys },
//    "data_products_prdct" : products_Name,
//    };
//     const productData = await Products.find(productQuery)
//       .select('data_products_prdct data_products_quantum data_products_price2 PARENT_KEY')
//       .exec();

//     const mergedData = searchData.map((data) => {
//       const matchedProduct = productData.find((product) => product.PARENT_KEY === data.KEY);

//       // Add a check to handle undefined matchedProduct
//       if (matchedProduct) {
//         const { data_products_prdct, data_products_quantum, data_products_price2 } = matchedProduct;
//         const isProductMatched = Array.isArray(data_products_prdct) && data_products_prdct.includes(products_Name);
//         if (isProductMatched) {
//         return {
//           data_district: data.data_district,
//           data_Block: data.data_Block,
//           data_Panchayath: data.data_Panchayath,
//           data_Name: data.data_Name,
//           data_Phonenumber: data.data_Phonenumber,
//           data_NameofNG: data.data_NameofNG,
//           data_products_prdct,
//           data_products_quantum,
//           data_products_price2
//          // KEY: data.KEY,
//           // data_products_prdct: matchedProduct.data_products_prdct,
//           // data_products_quantum: matchedProduct.data_products_quantum,
//           // data_products_price2: matchedProduct.data_products_price2
//         };
//       } else {
//         return null;
//       }
//     } else {
//       return null; // matchedProduct is not found, so we exclude this entry from the result
//     }
//     });
//  console.log(mergedData);
//     if (searchData.length !== 0) {
//       try {
//         var tempList = []
//         for(var i=0; i< mergedData.length; i++){
//           try{
//             var obj = new Object();
//             obj.District = mergedData[i].data_district
//             obj.Block = mergedData[i].data_Block
//             obj.Panchayath= mergedData[i].data_Panchayath
//             obj.Name = mergedData[i].data_Name
//             obj.Phonenumber =mergedData[i].data_Phonenumber
//             obj.Name_of_NHG = mergedData[i].data_NameofNG
//             obj.products_Name = mergedData[i].data_products_prdct
//             obj.products_quantity = mergedData[i].data_products_quantum
//             obj.products_price2 = mergedData[i].data_products_price2
  
//             tempList.push(obj)
//           }catch(e){
//             console.log("error")
//           }
//         }
//                     // Prepare headers for the Excel file
//                     const headers = Object.keys(tempList[0]);
  
//                     // Prepare values for the Excel file
//                     const values = [
//                       ["REPORT OF PRODUCTS"], // Add "Report" line
//                       ["A-live "], // Add "Alive" line
//                       headers, ...tempList.map(obj => Object.values(obj))];
          
//                     // Generate the Excel file
//                     const worksheet = XLSX.utils.aoa_to_sheet(values);
//                     const workbook = XLSX.utils.book_new();
//                     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
//                     // Convert the workbook to a buffer
//                     const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          
//                     // Set the appropriate headers for the response
//                     res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
//                     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
//                     res.setHeader('Content-Length', buffer.length);
          
//                     // Send the buffer as the response
//                     res.send(buffer);
               
//       } catch (error) {
//                 console.error('Failed to fetch data from MongoDB:', error);
//                 res.status(500).send('Failed to fetch data from MongoDB');
//               }

//       // res.json({
//       //   data: mergedData,
//       //   currentPage: parseInt(page),
//       //   totalPages,
//       //   totalResults
//       // });
//     } else {
//       res.status(404).json({ message: 'No data found for the provided panchayath' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


//const XLSX = require('xlsx');


 router.get('/purchaseReport',async (req, res) => {
  const { panchayath, itemtype, page = 1, limit = 15 } = req.query;

  try {
    const dataQuery = { data_Panchayath: panchayath };

    const totalResults = await Data.countDocuments(dataQuery);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(dataQuery)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
      .skip(startIndex)
      .limit(limit);

    const parentKeys = searchData.map((data) => data.KEY);

    let purchaseQuery = {
      PARENT_KEY: { $in: parentKeys },
      data_purchaseofrawmaterials_itemtype: { $in: itemtype }
    };

    let mergedData = [];
    if (itemtype.includes('PULLETS') || itemtype.includes('MANURE') ||  itemtype.includes('FODDER SLIPS') || itemtype.includes('CALVES') || itemtype.includes('HEIFERS') || itemtype.includes('COWS') ) {
      const subList = req.query.subList; // Assuming PULLETS_List is an array of values
     
      if (itemtype.includes('PULLETS')) {
        purchaseQuery = {
          ...purchaseQuery,
          PULLETS_List: { $in: subList }
        };
      }
      if (itemtype.includes('MANURE')) {
        purchaseQuery = {
          ...purchaseQuery,
          MANURE_List: { $in: subList }
        };
      }
      if (itemtype.includes('FODDER SLIPS')) {
        purchaseQuery = {
          ...purchaseQuery,
          FODDER_SLIPS_List: { $in: subList }
        };
      }
      if (itemtype.includes('CALVES')) {
        purchaseQuery = {
          ...purchaseQuery,
          CALVES_List: { $in: subList }
        };
      }
      if (itemtype.includes('HEIFERS')) {
        purchaseQuery = {
          ...purchaseQuery,
          HEIPERS_List: { $in: subList }
        };
      }
      if (itemtype.includes('COWS')) {
        console.log("enter..........")
        purchaseQuery = {
          ...purchaseQuery,
          COWS_List: { $in: subList }
        };
      }
     
      

      const purchaseData = await PurchaseOfRawMaterials.find(purchaseQuery)
        .select('data_purchaseofrawmaterials_itemtype PULLETS_List BV380_qnty GRAMALAKSHMI_qnty OTHER OTHER_qnty GRAMAPRIYA_qnty MANURE_List COW_DUNG_qnty GOAT_MANURE_qnty POULTRY_MANURE_qnty VERMY_COMPOST_qnty FODDER_SLIPS_List NAPIER_qnty CO4_qnty CO5_qnty RED_NAPIER_qnty SUPER_NAPIER_qnty GUINEA_GRASS_qnty PARA_GRASS_qnty CONGO_SIGNAL_qnty CALVES_List CALVES_HF_qnty CALVES_GERSEY_qnty HEIPERS_List HEIPERS_HF_qnty HEIPERS_GERSEY_qnty COWS_List COWS_HF_qnty COWS_GERSEY_qnty PARENT_KEY')
        .exec();
        console.log("purchaseData =",purchaseData)

      mergedData = searchData.map((data) => {
        const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
        if (matchedPurchases.length > 0) {
          const mergedItems = matchedPurchases.map((matchedPurchase) => {
            const {
                    PULLETS_List,
                    BV380_qnty,
                    GRAMALAKSHMI_qnty,
                    OTHER,
                    OTHER_qnty,
                    GRAMAPRIYA_qnty,
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
                    CALVES_List,
                    CALVES_HF_qnty,
                    CALVES_GERSEY_qnty,
                    HEIPERS_List,
                    HEIPERS_HF_qnty,
                    HEIPERS_GERSEY_qnty,
                    COWS_List,
                    COWS_HF_qnty,
                    COWS_GERSEY_qnty,
                    //CATTLE_FEED_List:subList,
                    //CATTLE_FEED_qnty

             } = matchedPurchase;
            const isPulletsListMatched = Array.isArray(PULLETS_List) && PULLETS_List.some((sub) => subList.includes(sub));
            const isManureListMatched = Array.isArray(MANURE_List) && MANURE_List.some((sub) => subList.includes(sub));
            const isFodderSlipsListMatched = Array.isArray(FODDER_SLIPS_List) && FODDER_SLIPS_List.some((sub) => subList.includes(sub));
            const isCalvesListMatched = Array.isArray(CALVES_List) && CALVES_List.some((sub) => subList.includes(sub));
            const isHeipersListMatched = Array.isArray(HEIPERS_List) && HEIPERS_List.some((sub) => subList.includes(sub));
            const isCowsListMatched = Array.isArray(COWS_List) && COWS_List.some((sub) => subList.includes(sub));
            if ((itemtype.includes('PULLETS') && isPulletsListMatched) || (itemtype.includes('MANURE') && isManureListMatched) || (itemtype.includes('FODDER SLIPS') && isFodderSlipsListMatched) || (itemtype.includes('CALVES') && isCalvesListMatched) || (itemtype.includes('HEIFERS') && isHeipersListMatched) || (itemtype.includes('COWS') && isCowsListMatched)) {
              return {
                data_district: data.data_district,
                data_Block: data.data_Block,
                data_Panchayath: data.data_Panchayath,
                data_Name: data.data_Name,
                data_Ward: data.data_Ward,
                data_Phonenumber: data.data_Phonenumber,
                data_NameofNG: data.data_NameofNG,
                KEY: data.KEY,
                data_purchaseofrawmaterials_itemtype: itemtype,
                PULLETS_List: subList,
                BV380_qnty,
                GRAMALAKSHMI_qnty,
                OTHER,
                OTHER_qnty,
                GRAMAPRIYA_qnty,
                MANURE_List : subList,
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
              CALVES_List : subList,
              CALVES_HF_qnty,
              CALVES_GERSEY_qnty,
              HEIPERS_List : subList,
              HEIPERS_HF_qnty,
              HEIPERS_GERSEY_qnty,
              COWS_List : subList,
              COWS_HF_qnty,
              COWS_GERSEY_qnty,
              //CATTLE_FEED_List : subList,
              //CATTLE_FEED_qnty
              
              };
            } else {
              return null; // Exclude data that doesn't satisfy the condition
            }
          });
          return mergedItems.filter((item) => item !== null);
        } else {
          return null;
        }
      }).filter((data) => data !== null);
      mergedData = mergedData.filter((items) => items !== null);
      
      //res.json({ mergedData, totalPages });
      console.log(mergedData);
      if (searchData.length !== 0) {
       
          var tempList = [];
          console.log(mergedData.length);
          for (let i = 0; i < mergedData.length; i++) {
         
            try {
              const obj = {
                Name: mergedData[i][0].data_Name,
                Ward: mergedData[i][0].data_Ward,
                Phonenumber: mergedData[i][0].data_Phonenumber,
                Name_of_NHG: mergedData[i][0].data_NameofNG,
               // products_Name: mergedData[i][0].data_Sales_prdct2,  
                products_Name : mergedData[i][0].data_purchaseofrawmaterials_itemtype,
                products_quantity : mergedData[i][0].PULLETS_List,
              };
              if (obj.products_quantity === 'BV380') {
                 obj.BV380_qnty = mergedData[i][0].BV380_qnty;
            } else if (obj.products_quantity === 'GRAMALAKSHMI') {
              obj.BV380_qnty = mergedData[i][0].GRAMALAKSHMI_qnty;
              } else if (obj.products_quantity === 'GRAMAPRIYA') {
              obj.BV380_qnty = mergedData[i][0].GRAMAPRIYA_qnty;
              } else if (obj.products_quantity === 'OTHER') {
              obj.BV380_qnty = mergedData[i][0].OTHER_qnty;
              }
              else if (obj.products_quantity === 'COW DUNG') {
              obj.BV380_qnty = mergedData[i][0].COW_DUNG_qnty;
              }
              else if (obj.products_quantity === 'GOAT MANURE') {
                obj.BV380_qnty = mergedData[i][0].GOAT_MANURE_qnty;
                }else if (obj.products_quantity === 'POULTRY MANURE') {
                  obj.BV380_qnty = mergedData[i][0].POULTRY_MANURE_qnty;
                  }
                  else if (obj.products_quantity === 'VERMY COMPOST') {
                    obj.BV380_qnty = mergedData[i][0].VERMY_COMPOST_qnty;
                    }
                  else if (obj.products_quantity === 'NAPIER') {
                  obj.BV380_qnty = mergedData[i][0].NAPIER_qnty;
                  }
                  else if (obj.products_quantity === 'CO4') {
                    obj.BV380_qnty = mergedData[i][0].CO4_qnty;
                    }else if (obj.products_quantity === 'CO5') {
                      obj.BV380_qnty = mergedData[i][0].CO5_qnty;
                      }
                      else if (obj.products_quantity === 'RED NAPIER') {
                        obj.BV380_qnty = mergedData[i][0].RED_NAPIER_qnty;
                        }
                        else if (obj.products_quantity === 'SUPER NAPIER') {
                          obj.BV380_qnty = mergedData[i][0].SUPER_NAPIER_qnty;
                          }
                      else if (obj.products_quantity === 'GUINEA GRASS') {
                        obj.BV380_qnty = mergedData[i][0].GUINEA_GRASS_qnty;
                        }else if (obj.products_quantity === 'PARA GRASS') {
                          obj.BV380_qnty = mergedData[i][0].PARA_GRASS_qnty;
                          }
                          // else if (obj.products_quantity === 'RED NAPIER') {
                          //   obj.BV380_qnty = mergedData[i][0].RED_NAPIER_qnty;
                          //   }
                            else if (obj.products_quantity === 'CONGO SIGNAL') {
                              obj.BV380_qnty = mergedData[i][0].CONGO_SIGNAL_qnty;
                              }
                              else if (obj.products_quantity === 'CALVES-H F') {
                                obj.BV380_qnty = mergedData[i][0].CALVES_HF_qnty;
                                }
                                else if (obj.products_quantity === 'CALVES-GERSEY') {
                                  obj.BV380_qnty = mergedData[i][0].CALVES_GERSEY_qnty;
                                  }
                                  else if (obj.products_quantity === 'HEIPERS-H F') {
                                    obj.BV380_qnty = mergedData[i][0].HEIPERS_HF_qnty;
                                    }
                                    else if (obj.products_quantity === 'HEIPERS-GERSEY') {
                                      obj.BV380_qnty = mergedData[i][0].HEIPERS_GERSEY_qnty;
                                      }
                                      else if (obj.products_quantity === 'COWS-H F') {
                                        obj.BV380_qnty = mergedData[i][0].COWS_HF_qnty;
                                        }
                                        else if (obj.products_quantity === 'COWS-GERSEY') {
                                          obj.BV380_qnty = mergedData[i][0].COWS_GERSEY_qnty;
                                          }
              tempList.push(obj);
              
              
              
            } catch (e) {
              console.log("error");
            }
          }
          // Prepare headers for the Excel file
          let headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG"];
          // Prepare values for the Excel file
          let products_Qty_Field_Name = '';
          if (subList === 'BV380') {
            headers.push('BV380 (number)');
            products_Qty_Field_Name = 'BV380_qnty';
          } else if (subList === 'GRAMALAKSHMI') {
            headers.push('GRAMALAKSHMI (number)');
            products_Qty_Field_Name = 'GRAMALAKSHMI_qnty';
          } else if (subList === 'GRAMAPRIYA') {
            headers.push('GRAMAPRIYA (number)');
            products_Qty_Field_Name = 'GRAMAPRIYA_qnty';
          } else if (subList === 'OTHER') {
            headers.push('OTHER_qnty');
            products_Qty_Field_Name = 'OTHER_qnty';
          } 
          // else if (subList === 'OTHER') {
          //   headers.push('OTHER_qnty');
          //   products_Qty_Field_Name = 'OTHER_qnty';
          // }
          else if (subList === 'COW DUNG') {
            headers.push('COW DUNG (kg)');
            products_Qty_Field_Name = 'COW_DUNG_qnty';
          }
          else if (subList === 'GOAT MANURE') {
            headers.push('GOAT MANURE (kg)');
            products_Qty_Field_Name = 'GOAT_MANURE_qnty';
          }
          else if (subList === 'POULTRY MANURE') {
            headers.push('POULTRY MANURE (kg)');
            products_Qty_Field_Name = 'POULTRY_MANURE_qnty';
          }
          else if (subList === 'VERMY COMPOST') {
            headers.push('VERMY COMPOST (kg)');
            products_Qty_Field_Name = 'VERMY_COMPOST_qnty';
          }
          else if (subList === 'NAPIER') {
            headers.push('NAPIER (kg)');
            products_Qty_Field_Name = 'NAPIER_qnty';
          }
          else if (subList === 'CO4') {
            headers.push('CO4 (kg)');
            products_Qty_Field_Name = 'CO4_qnty';
          }
          else if (subList === 'CO5') {
            headers.push('CO5 (kg)');
            products_Qty_Field_Name = 'CO5_qnty';
          }
          else if (subList === 'RED NAPIER') {
            headers.push('RED NAPIER (kg)');
            products_Qty_Field_Name = 'RED_NAPIER_qnty';
          }
          else if (subList === 'SUPER NAPIER') {
            headers.push('SUPER NAPIER (kg)');
            products_Qty_Field_Name = 'SUPER_NAPIER_qnty';
          }
          else if (subList === 'GUINEA GRASS') {
            headers.push('GUINEA GRASS (kg)');
            products_Qty_Field_Name = 'GUINEA_GRASS_qnty';
          }
          else if (subList === 'PARA GRASS') {
            headers.push('PARA GRASS (kg)');
            products_Qty_Field_Name = 'PARA_GRASS_qnty';
          }
          else if (subList === 'CONGO SIGNAL') {
            headers.push('CONGO SIGNAL (kg)');
            products_Qty_Field_Name = 'CONGO_SIGNAL_qnty';
          }
          else if (subList === 'CALVES-H F') {
            headers.push('HF (number)');
            products_Qty_Field_Name = 'CALVES_HF_qnty';
          }
          else if (subList === 'CALVES-GERSEY') {
            headers.push('CALVES GERSEY (number)');
            products_Qty_Field_Name = 'CALVES_GERSEY_qnty';
          }
          else if (subList === 'HEIPERS-H F') {
            headers.push('HF (number)');
            products_Qty_Field_Name = 'HEIPERS_HF_qnty';
          }
          else if (subList === 'HEIPERS-GERSEY') {
            headers.push('HEIPERS GERSEY (number)');
            products_Qty_Field_Name = 'HEIPERS_GERSEY_qnty';
          }
          else if (subList === 'COWS-H F') {
            headers.push('HF (number)');
            products_Qty_Field_Name = 'COWS_HF_qnty';
          }
          else if (subList === 'COWS-GERSEY') {
            headers.push('GERSEY (number)');
            products_Qty_Field_Name = 'COWS_GERSEY_qnty';
          }
         
          const values = [
            ['REPORT OF PURCHASE OF RAW MATERIALS'],
            ['A-live Kudumbashree'],
            ['District: ' + searchData[0]?.data_district || 'N/A'],
            ['Block: ' + searchData[0]?.data_Block || 'N/A'],
            ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
            ['Item Type : '+ itemtype ],
            headers,...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG,obj.BV380_qnty
          ])];

          // Generate the Excel file
          const worksheet = XLSX.utils.aoa_to_sheet(values);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

          // Convert the workbook to a buffer
          const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

          // Set the appropriate headers for the response
          res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Length', buffer.length);

          // Send the buffer as the response
          res.write(buffer, 'binary');
          res.end(null, 'binary');

       
      } else {
        res.status(404).json({ message: 'No data found for the provided panchayath' });
      }

    } 
   
 
    else if (itemtype.includes('CATTLE FEED')) {
      const subList = req.query.subList;
    
      purchaseQuery = {
        ...purchaseQuery,
        data_purchaseofrawmaterials_itemtype: 'CATTLE FEED',
        data_purchaseofrawmaterials_brand: subList
      };
    
      const purchaseData = await PurchaseOfRawMaterials.find(purchaseQuery)
        .select('data_purchaseofrawmaterials_itemtype PARENT_KEY data_purchaseofrawmaterials_brand BRAND_qnty')
        .exec();
    
      mergedData = searchData.map((data) => {
        const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
        if (matchedPurchases.length > 0) {
          const mergedItems = matchedPurchases.map((matchedPurchase) => {
            const { data_purchaseofrawmaterials_itemtype, PARENT_KEY, data_purchaseofrawmaterials_brand,BRAND_qnty } = matchedPurchase;
            return {
              data_district: data.data_district,
              data_Block: data.data_Block,
              data_Panchayath: data.data_Panchayath,
              data_Name: data.data_Name,
              data_Ward:data.data_Ward,
              data_Phonenumber: data.data_Phonenumber,
              data_NameofNG: data.data_NameofNG,
              KEY: data.KEY,
              data_purchaseofrawmaterials_itemtype: itemtype,
              PARENT_KEY,
          
              data_purchaseofrawmaterials_brand:subList,
              BRAND_qnty
            };
          });
          return mergedItems;
        } else {
          return null;
        }
      }).filter((data) => data !== null);
      mergedData = mergedData.filter((items) => items !== null);
          
    //res.json({ mergedData, totalPages });
    console.log(mergedData);
    if (searchData.length !== 0) {
     
        var tempList = [];
        console.log(mergedData.length);
        for (let i = 0; i < mergedData.length; i++) {
          try {
            const obj = {
              Name: mergedData[i][0].data_Name,
              Ward: mergedData[i][0].data_Ward,
              Phonenumber: mergedData[i][0].data_Phonenumber,
              Name_of_NHG: mergedData[i][0].data_NameofNG,
            //  Itemtype : mergedData[i][0].data_purchaseofrawmaterials_itemtype,
             // CATTLE_FEED_List : mergedData[i][0].CATTLE_FEED_List,
              Brand : mergedData[i][0].data_purchaseofrawmaterials_brand,
              Quantity_50kg : mergedData[i][0].BRAND_qnty,

            }
          
            tempList.push(obj);
            
            
            
          } catch (e) {
            console.log("error");
          }
        }
        // Prepare headers for the Excel file
        const headers = Object.keys(tempList[0]);
    
        // Prepare values for the Excel file
        const values = [
           ['REPORT OF PURCHASE OF RAW MATERIALS'],
            ['A-live Kudumbashree'],
            ['District: ' + searchData[0]?.data_district || 'N/A'],
            ['Block: ' + searchData[0]?.data_Block || 'N/A'],
            ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
            ['Item Type : '+itemtype ],
            headers, ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG,obj.Brand,obj.Quantity_50kg
             ])
          ];
    
        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);
    
        // Send the buffer as the response
        res.write(buffer, 'binary');
        res.end(null, 'binary');
    
     
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
    }
    else if (itemtype.includes('MILK REPLACER')) {
      const subList = req.query.subList;
    
      purchaseQuery = {
        ...purchaseQuery,
        data_purchaseofrawmaterials_itemtype: 'MILK REPLACER',
        MILK_REPLACER_List: subList
      };
    
      const purchaseData = await PurchaseOfRawMaterials.find(purchaseQuery)
        .select('data_purchaseofrawmaterials_itemtype PARENT_KEY MILK_REPLACER_List MILK_REPLACER_qnty')
        .exec();
    
      mergedData = searchData.map((data) => {
        const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
        if (matchedPurchases.length > 0) {
          const mergedItems = matchedPurchases.map((matchedPurchase) => {
            const { data_purchaseofrawmaterials_itemtype, PARENT_KEY, MILK_REPLACER_List, MILK_REPLACER_qnty } = matchedPurchase;
            return {
              data_district: data.data_district,
              data_Block: data.data_Block,
              data_Panchayath: data.data_Panchayath,
              data_Name: data.data_Name,
              data_Ward:data.data_Ward,
              data_Phonenumber: data.data_Phonenumber,
              data_NameofNG: data.data_NameofNG,
              KEY: data.KEY,
              data_purchaseofrawmaterials_itemtype: itemtype,
              PARENT_KEY,
              MILK_REPLACER_List:subList,
              MILK_REPLACER_qnty
            };
          });
          return mergedItems;
        } else {
          return null;
        }
      }).filter((data) => data !== null);
      mergedData = mergedData.filter((items) => items !== null);
          
    //res.json({ mergedData, totalPages });
    console.log(mergedData);
    if (searchData.length !== 0) {
     
        var tempList = [];
        console.log(mergedData.length);
        for (let i = 0; i < mergedData.length; i++) {
         
          try {
            const obj = {
              Name: mergedData[i][0].data_Name,
              Ward: mergedData[i][0].data_Ward,
              Phonenumber: mergedData[i][0].data_Phonenumber,
              Name_of_NHG: mergedData[i][0].data_NameofNG,
             // Itemtype : mergedData[i][0].data_purchaseofrawmaterials_itemtype,
              MILK_REPLACER_List : mergedData[i][0].MILK_REPLACER_List,
              MILK_REPLACER_kg : mergedData[i][0].MILK_REPLACER_qnty,
            };
          
            tempList.push(obj);
            
            
            
          } catch (e) {
            console.log("error");
          }
        }
        // Prepare headers for the Excel file
        let headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG","MILK REPLACER List","Quantity (litre)"];
        // Prepare values for the Excel file
        const values = [
          ['REPORT OF PURCHASE OF RAW MATERIALS'],
          ['A-live Kudumbashree'],
          ['District: ' + searchData[0]?.data_district || 'N/A'],
          ['Block: ' + searchData[0]?.data_Block || 'N/A'],
          ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
          ['Item Type : '+ itemtype],
          headers,...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG,obj.MILK_REPLACER_List,obj.MILK_REPLACER_kg
        ])];
        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);
    
        // Send the buffer as the response
        res.write(buffer, 'binary');
        res.end(null, 'binary');
    
     
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
    }
    
else if (itemtype.includes('ENERGY RICH FEED')) {
  const subList = req.query.subList;

  purchaseQuery = {
    ...purchaseQuery,
    data_purchaseofrawmaterials_itemtype: 'ENERGY RICH FEED',
    ENERGY_RICH_FEED_List: subList
  };

  const purchaseData = await PurchaseOfRawMaterials.find(purchaseQuery)
    .select('data_purchaseofrawmaterials_itemtype PARENT_KEY ENERGY_RICH_FEED_List ENERGY_RICH_FEED_qnty')
    .exec();

  mergedData = searchData.map((data) => {
    const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
    if (matchedPurchases.length > 0) {
      const mergedItems = matchedPurchases.map((matchedPurchase) => {
        const { data_purchaseofrawmaterials_itemtype,ENERGY_RICH_FEED_List,ENERGY_RICH_FEED_qnty, PARENT_KEY,} = matchedPurchase;
        return {
          data_district: data.data_district,
          data_Block: data.data_Block,
          data_Panchayath: data.data_Panchayath,
          data_Name: data.data_Name,
          data_Ward:data.data_Ward,
          data_Phonenumber: data.data_Phonenumber,
          data_NameofNG: data.data_NameofNG,
          KEY: data.KEY,
          data_purchaseofrawmaterials_itemtype: itemtype,
          PARENT_KEY,
          ENERGY_RICH_FEED_List:subList,
          ENERGY_RICH_FEED_qnty        
        };
      });
      return mergedItems;
    } else {
      return null;
    }
  }).filter((data) => data !== null);
  mergedData = mergedData.filter((items) => items !== null);
      
//res.json({ mergedData, totalPages });
console.log(mergedData);
if (searchData.length !== 0) {
 
    var tempList = [];
    console.log(mergedData.length);
    for (let i = 0; i < mergedData.length; i++) {
      try {
        const obj = {
          Name: mergedData[i][0].data_Name,
          Ward: mergedData[i][0].data_Ward,
          Phonenumber: mergedData[i][0].data_Phonenumber,
          Name_of_NHG: mergedData[i][0].data_NameofNG,
          Itemtype: mergedData[i][0].data_purchaseofrawmaterials_itemtype,
      ENERGY_RICH_FEED_List : mergedData[i][0].ENERGY_RICH_FEED_List,
      ENERGY_RICH_FEED_qnty : mergedData[i][0].ENERGY_RICH_FEED_qnty,
     
        };
        tempList.push(obj);
        
        
        
      } catch (e) {
        console.log("error");
      }
    }
    // Prepare headers for the Excel file
    const headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG",  "ENERGY_RICH_FEED_List", "Quantity (litres)"];
          // Prepare values for the Excel file
          const values = [
            ['REPORT OF PURCHASE OF RAW MATERIALS'],
            ['A-live Kudumbashree'],
            ['District: ' + searchData[0]?.data_district || 'N/A'],
            ['Block: ' + searchData[0]?.data_Block || 'N/A'],
            ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
            ['Item Type : '+ itemtype],
            headers,
            ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG,obj.ENERGY_RICH_FEED_List,obj.ENERGY_RICH_FEED_qnty
          ])];

    // Generate the Excel file
    const worksheet = XLSX.utils.aoa_to_sheet(values);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert the workbook to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    // Set the appropriate headers for the response
    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Length', buffer.length);

    // Send the buffer as the response
    res.write(buffer, 'binary');
    res.end(null, 'binary');
 
} else {
  res.status(404).json({ message: 'No data found for the provided panchayath' });
}
}
else if(itemtype.includes("BYPASS FAT") || itemtype.includes("TMR") || itemtype.includes("BYPASS PROTIN") || itemtype.includes("CAFF STARTER") || itemtype.includes("CHEMICAL FERTILIZERS") || itemtype.includes("EGG TRAYS") || itemtype.includes("FODDER SEEDS") || itemtype.includes("GOAT FEED") || itemtype.includes("GRASS FOODER") || itemtype.includes("GROWER") || itemtype.includes("HAY") || itemtype.includes("INGREDIENTS FOR CTTLE FEED") || itemtype.includes("INGREDIENTS FOR POULTRY FEED") || itemtype.includes("KID STARTER") || itemtype.includes("LAYER") || itemtype.includes("MALABARI GOAT-KIDS") || itemtype.includes("MALABARI GOATS") || itemtype.includes("MALE BUFFALO") ||  itemtype.includes("MATERIAL FOR POULTRY CAGE FABRICATION") ||  itemtype.includes("POULTRY FEED") ||  itemtype.includes("SILAGE") ||  itemtype.includes("TOTAL MIXED RATION") ||  itemtype.includes("TREE FOODER") ||  itemtype.includes("UREA MOLASS BLOCK") ||  itemtype.includes("UREA TREATED STRAW")) 
{
  console.log("itemtype =",itemtype)
// let purchaseQuery = {};
if (itemtype.includes('BYPASS FAT')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('BYPASS PROTIN')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('CAFF STARTER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('CHEMICAL FERTILIZERS')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('EGG TRAYS')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('FODDER SEEDS')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('GOAT FEED')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('GRASS FOODER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('GROWER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('HAY')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('INGREDIENTS FOR CTTLE FEED')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('INGREDIENTS FOR POULTRY FEED')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('KID STARTER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('LAYER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('MALABARI GOAT-KIDS')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('MALABARI GOATS')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('MALE BUFFALO')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
  console.log("purchaseQuery...........",purchaseQuery);
}
if (itemtype.includes('MATERIAL FOR POULTRY CAGE FABRICATION')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('POULTRY FEED')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('SILAGE')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('TOTAL MIXED RATION')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('TREE FOODER')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('UREA MOLASS BLOCK')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('UREA TREATED STRAW')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}
if (itemtype.includes('TMR')) {
  purchaseQuery = {
    ...purchaseQuery,
  };
}

      const purchaseData = await PurchaseOfRawMaterials.find(purchaseQuery)
          .select('data_purchaseofrawmaterials_itemtype PARENT_KEY MALE_BUFFALO_CALVES_qnty CAFF_STARTER_qnty INGREDIENTS_FOR_POULTRY_FEED_qnty INGREDIENTS_FOR_CTTLE_FEED_qnty CHEMICAL_FERTILIZERS_qnty FODDER_SEEDS_qnty Grass_fooder_qnty Tree_fooder_qnty MALABARI_GOAT_KIDS_qnty MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty Urea_treated_Straw_qnty urea_molass_block_qnty MALABARI_GOATS_qnty EGG_TRAYS_qnty POULTRY_FEED_qnty LAYER_List BY_PASS_PROTEIN_qnty BY_PASS_FAT_qnty TMR_qnty SILAGE_qnty HAY_qnty GOAT_FEEDqnty KID_STARTER_qnty GROWER_qnty Total_mixed_ration_qnty')
          .exec();
          mergedData = searchData.map((data) => {
                        const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
                        if (matchedPurchases.length > 0) {
                                  const mergedItems = matchedPurchases.map((matchedPurchase) => {
                                    const { data_purchaseofrawmaterials_itemtype,
                               PARENT_KEY,
                               MALE_BUFFALO_CALVES_qnty,
                               INGREDIENTS_FOR_POULTRY_FEED_qnty ,
                               INGREDIENTS_FOR_CTTLE_FEED_qnty,
                               CHEMICAL_FERTILIZERS_qnty,
                               FODDER_SEEDS_qnty,
                               Grass_fooder_qnty,
                               Tree_fooder_qnty,
                               MALABARI_GOAT_KIDS_qnty,
                               MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty,
                               Urea_treated_Straw_qnty,
                               urea_molass_block_qnty,
                               MALABARI_GOATS_qnty,
                              // MATERIAL_FOR_POULTRY_qnty,
                               EGG_TRAYS_qnty,
                               POULTRY_FEED_qnty,
                               LAYER_List,
                               BY_PASS_PROTEIN_qnty,
                               BY_PASS_FAT_qnty,
                               TMR_qnty,
                               SILAGE_qnty,
                               HAY_qnty,
                               // UREA_TREATED_STRAW_qnty,
                               GOAT_FEEDqnty,
                               KID_STARTER_qnty,
                               GROWER_qnty,
                              Total_mixed_ration_qnty
                             }= matchedPurchase;
                              if(itemtype.includes("BYPASS FAT") || itemtype.includes("BYPASS PROTIN")||itemtype.includes("TMR") || itemtype.includes("CAFF STARTER") || itemtype.includes("CHEMICAL FERTILIZERS") || itemtype.includes("EGG TRAYS") || itemtype.includes("FODDER SEEDS") || itemtype.includes("GOAT FEED") || itemtype.includes("GRASS FOODER") || itemtype.includes("GROWER") || itemtype.includes("HAY") || itemtype.includes("INGREDIENTS FOR CTTLE FEED") || itemtype.includes("INGREDIENTS FOR POULTRY FEED") || itemtype.includes("KID STARTER") || itemtype.includes("LAYER") || itemtype.includes("MALABARI GOAT-KIDS") || itemtype.includes("MALABARI GOATS") || itemtype.includes("MALE BUFFALO") ||  itemtype.includes("MATERIAL FOR POULTRY CAGE FABRICATION") ||  itemtype.includes("POULTRY FEED") ||  itemtype.includes("SILAGE") ||  itemtype.includes("TOTAL MIXED RATION") ||  itemtype.includes("TREE FOODER") ||  itemtype.includes("UREA MOLASS BLOCK") ||  itemtype.includes("UREA TREATED STRAW")) {
                              return {
                              data_district: data.data_district,
                              data_Block: data.data_Block,
                              data_Panchayath: data.data_Panchayath,
                              data_Name: data.data_Name,
                              data_Ward: data.data_Ward,
                              data_Phonenumber: data.data_Phonenumber,
                              data_NameofNG: data.data_NameofNG,
                              KEY: data.KEY,
                              data_purchaseofrawmaterials_itemtype:itemtype,
                              PARENT_KEY,
                              MALE_BUFFALO_CALVES_qnty,
                              INGREDIENTS_FOR_POULTRY_FEED_qnty ,
                              INGREDIENTS_FOR_CTTLE_FEED_qnty,
                              CHEMICAL_FERTILIZERS_qnty,
                              FODDER_SEEDS_qnty,
                              Grass_fooder_qnty,
                              Tree_fooder_qnty,
                              MALABARI_GOAT_KIDS_qnty,
                              MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty,
                              Urea_treated_Straw_qnty,
                              urea_molass_block_qnty, 
                              MALABARI_GOATS_qnty,
                             // MATERIAL_FOR_POULTRY_qnty,
                              EGG_TRAYS_qnty,
                              POULTRY_FEED_qnty,
                              LAYER_List,
                              BY_PASS_PROTEIN_qnty,
                              BY_PASS_FAT_qnty,
                              TMR_qnty,
                              SILAGE_qnty,
                              HAY_qnty,
                             // UREA_TREATED_STRAW_qnty,
                              GOAT_FEEDqnty,
                              KID_STARTER_qnty,
                              GROWER_qnty,
                              Total_mixed_ration_qnty

                                   };
                                  } else {
                                    return null; // Exclude data that doesn't satisfy the condition
                                  }
                                });
                                return mergedItems.filter((item) => item !== null);
        
                              } else {
                                return null;
                              }
                        
                              }).filter((data) => data !== null);
                              mergedData = mergedData.filter((items) => items !== null);
                              
                            
                      console.log(searchData);
                            if (searchData.length !== 0) {
       
                              var tempList = [];
                              console.log(mergedData.length);
                              for (let i = 0; i < mergedData.length; i++) {
                             
                                try {
                                  const obj = {
                                    Name: mergedData[i][0].data_Name,
                                    Ward: mergedData[i][0].data_Ward,
                                    Phonenumber: mergedData[i][0].data_Phonenumber,
                                    Name_of_NHG: mergedData[i][0].data_NameofNG,  
                                    products_Name : mergedData[i][0].data_purchaseofrawmaterials_itemtype,
                                    //products_quantity : mergedData[i][0].PULLETS_List,
                                  };
                                  if (obj.products_Name === 'BYPASS FAT') {
                                    obj.BY_PASS_FAT_qnty = mergedData[i][0].BY_PASS_FAT_qnty; 
                                  }
                                  else if (obj.products_Name === 'BYPASS PROTIN') {
                                    obj.BY_PASS_FAT_qnty = mergedData[i][0].BY_PASS_PROTEIN_qnty;
                                     }
                                    else if (obj.products_Name === 'CHEMICAL FERTILIZERS') {
                                    obj.BY_PASS_FAT_qnty = mergedData[i][0].CHEMICAL_FERTILIZERS_qnty;
                                    }
                                     else if (obj.products_Name === 'CAFF STARTER') {
                                      obj.BY_PASS_FAT_qnty = mergedData[i][0].CAFF_STARTER_qnty;
                                       }
                                       else if (obj.products_Name === 'EGG TRAYS') {
                                        obj.BY_PASS_FAT_qnty = mergedData[i][0].EGG_TRAYS_qnty;
                                         }
                                     else if (obj.products_Name === 'FODDER SEEDS') {
                                     obj.BY_PASS_FAT_qnty = mergedData[i][0].FODDER_SEEDS_qnty;
                                      }
                                    else if (obj.products_Name === 'GOAT FEED') {
                                     obj.BY_PASS_FAT_qnty = mergedData[i][0].GOAT_FEEDqnty;
                                       }
                                       else if (obj.products_Name === 'GRASS FOODER') {
                                        obj.BY_PASS_FAT_qnty = mergedData[i][0].Grass_fooder_qnty;
                                                             }
                                         else if (obj.products_Name === 'GROWER') {
                                            obj.BY_PASS_FAT_qnty = mergedData[i][0].GROWER_qnty;
                                           }
                                           else if (obj.products_Name === 'HAY') {
                                            obj.BY_PASS_FAT_qnty = mergedData[i][0].HAY_qnty;
                                             }
                                            else if (obj.products_Name === 'INGREDIENTS FOR CTTLE FEED') {
                                              obj.BY_PASS_FAT_qnty = mergedData[i][0].INGREDIENTS_FOR_CTTLE_FEED_qnty;
                                               }
                                             else if (obj.products_Name === 'INGREDIENTS FOR POULTRY FEED') {
                                                obj.BY_PASS_FAT_qnty = mergedData[i][0].INGREDIENTS_FOR_POULTRY_FEED_qnty;
                                               // console.log("...........................................BV380_qnty......................",BV380_qnty);
                                               }
                                               else if (obj.products_Name === 'KID STARTER') {
                                                  obj.BY_PASS_FAT_qnty = mergedData[i][0].KID_STARTER_qnty;
                                                    }
                                                else if (obj.products_Name === 'LAYER') {
                                                 obj.BY_PASS_FAT_qnty = mergedData[i][0].LAYER_qnty;
                                                }
                                                 else if (obj.products_Name === 'MALABARI GOAT-KIDS') {
                                                    obj.BY_PASS_FAT_qnty = mergedData[i][0].MALABARI_GOAT_KIDS_qnty;
                                                    }
                                                   else if (obj.products_Name === 'MALABARI GOATS') {
                                                      obj.BY_PASS_FAT_qnty = mergedData[i][0].MALABARI_GOATS_qnty;
                                                      }
                                                      else if (obj.products_Name === 'MALE BUFFALO') {
                                                        obj.BY_PASS_FAT_qnty = mergedData[i][0].MALE_BUFFALO_CALVES_qnty;
                                                       }
                                                        else if (obj.products_Name === 'MATERIAL FOR POULTRY CAGE FABRICATION') {
                                                           obj.BY_PASS_FAT_qnty = mergedData[i][0].MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty;
                                                            }
                                                         else if (obj.products_Name === 'POULTRY FEED') {
                                                              obj.BY_PASS_FAT_qnty = mergedData[i][0].POULTRY_FEED_qnty;
                                                           }
                                                           else if (obj.products_Name === 'SILAGE') {
                                                              obj.BY_PASS_FAT_qnty = mergedData[i][0].SILAGE_qnty;
                                                              }
                                                            else if (obj.products_Name === 'TOTAL MIXED RATION') {
                                                               obj.BY_PASS_FAT_qnty = mergedData[i][0].Total_mixed_ration_qnty;
                                                             }
                                                              else if (obj.products_Name === 'TREE FOODER') {
                                                                obj.BY_PASS_FAT_qnty = mergedData[i][0].Tree_fooder_qnty;
                                                               }
                                                              else if (obj.products_Name === 'UREA MOLASS BLOCK') {
                                                                  obj.BY_PASS_FAT_qnty = mergedData[i][0].urea_molass_block_qnty;
                                                                   }
                                                               else if (obj.products_Name === 'UREA TREATED STRAW') {
                                                                obj.BY_PASS_FAT_qnty = mergedData[i][0].Urea_treated_Straw_qnty;
                                                                }
                                                                else if (obj.products_Name === 'TMR') {
                                                                  obj.BY_PASS_FAT_qnty = mergedData[i][0].TMR_qnty;
                                                                  }
            
                                  tempList.push(obj);
                                } catch (e) {
                                  console.log(e);
                                  res.status(500).json({ message: 'Internal server error' });
                                  return;
                                }
                              }
                              let headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG"];
                              let products_Qty_Field_Name = '';
                               if (itemtype === 'BYPASS FAT') {
                                //console.log("..............BUFFALO.................")
                                headers.push('BYPASS FAT (kg)');
                                products_Qty_Field_Name = 'BY_PASS_FAT_qnty';
                              }
                              else if (itemtype === 'BY PASS PROTIN') {
                               // console.log("..............BUFFALO.................")
                                headers.push('BY PASS PROTIN (kg)');
                                products_Qty_Field_Name = 'BY_PASS_PROTEIN_qnty';
                              }
                              else if (itemtype === 'CHEMICAL FERTILIZERS') {
                               // console.log("..............BUFFALO.................")
                                headers.push('CHEMICAL FERTILIZERS (kg)');
                                products_Qty_Field_Name = 'CHEMICAL_FERTILIZERS_qnty';
                              }
                              else if (itemtype === 'CAFF STARTER') {
                               // console.log("..............BUFFALO.................")
                                headers.push('CAFF STARTER (kg)');
                                products_Qty_Field_Name = 'CAFF_STARTER_qnty';
                              }
                            
                              else if (itemtype === 'EGG TRAYS') {
                               // console.log("..............BUFFALO.................")
                                headers.push('EGG TRAYS (number)');
                                products_Qty_Field_Name = 'EGG_TRAYS_qnty';
                              }
                              else if (itemtype === 'FODDER SEEDS') {
                               // console.log("..............BUFFALO.................")
                                headers.push('FODDER SEEDS (kg)');
                                products_Qty_Field_Name = 'FODDER_SEEDS_qnty';
                              }
                              else if (itemtype === 'GOAT FEED') {
                               // console.log("..............BUFFALO.................")
                                headers.push('GOAT FEED (kg)');
                                products_Qty_Field_Name = 'GOAT_FEEDqnty';
                              }
                              else if (itemtype === 'GRASS FOODER') {
                               // console.log("..............BUFFALO.................")
                                headers.push('GRASS FOODER (kg)');
                                products_Qty_Field_Name = 'Grass_fooder_qnty';
                              }
                              else if (itemtype === 'GROWER') {
                                //console.log("..............BUFFALO.................")
                                headers.push('GROWER (kg)');
                                products_Qty_Field_Name = 'GROWER_qnty';
                              }
                              else if (itemtype === 'HAY') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('HAY (kg)');
                                products_Qty_Field_Name = 'HAY_qnty';
                              }
                              else if (itemtype === 'INGREDIENTS FOR CTTLE FEED') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('INGREDIENTS FOR CTTLE FEED (kg)');
                                products_Qty_Field_Name = 'INGREDIENTS_FOR_CTTLE_FEED_qnty';
                              }
                              else if (itemtype === 'INGREDIENTS FOR POULTRY FEED') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('INGREDIENTS FOR POULTRY FEED (kg)');
                                products_Qty_Field_Name = 'INGREDIENTS_FOR_POULTRY_FEED_qnty';
                              }
                              else if (itemtype === 'KID STARTER') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('KID STARTER Quantity');
                                products_Qty_Field_Name = 'KID_STARTER_qnty';
                              }
                              else if (itemtype === 'LAYER') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('LAYER Quantity');
                                products_Qty_Field_Name = 'LAYER_qnty';
                              }
                              else if (itemtype === 'MALABARI GOAT-KIDS') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('MALABARI GOAT-KIDS (number)');
                                products_Qty_Field_Name = 'MALABARI_GOAT_KIDS_qnty';
                              }
                              else if (itemtype === 'MALABARI GOATS') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('MALABARI GOATS (number)');
                                products_Qty_Field_Name = 'MALABARI_GOATS_qnty';
                              }
                              else if (itemtype === 'MALE BUFFALO') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('MALE BUFFALO CALVES (number)');
                                products_Qty_Field_Name = 'MALE_BUFFALO_CALVES_qnty';
                              }
                              else if (itemtype === 'MATERIAL FOR POULTRY CAGE FABRICATION') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('MATERIAL FOR POULTRY CAGE FABRICATION Quantity');
                                products_Qty_Field_Name = 'MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty';
                              }
                              else if (itemtype === 'POULTRY FEED') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('POULTRY FEED (kg)');
                                products_Qty_Field_Name = 'POULTRY_FEED_qnty';
                              }
                              else if (itemtype === 'SILAGE') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('SILAGE Quantity');
                                products_Qty_Field_Name = 'SILAGE_qnty';
                              }
                              else if (itemtype === 'TOTAL MIXED RATION') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('TOTAL MIXED RATION Quantity');
                                products_Qty_Field_Name = 'Total_mixed_ration_qnty';
                              }
                              else if (itemtype === 'TREE FOODER') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('TREE FOODER (number)');
                                products_Qty_Field_Name = 'Tree_fooder_qnty';
                              }
                              else if (itemtype === 'UREA MOLASS BLOCK') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('UREA MOLASS BLOCK (kg)');
                                products_Qty_Field_Name = 'urea_molass_block_qnty';
                              }
                              else if (itemtype === 'UREA TREATED STRAW') {
                              //  console.log("..............BUFFALO.................")
                                headers.push('UREA TREATED STRAW (kg)');
                                products_Qty_Field_Name = 'Urea_treated_Straw_qnty';
                              }
                              else if (itemtype === 'TMR') {
                                //  console.log("..............BUFFALO.................")
                                  headers.push('TMR (kg)');
                                  products_Qty_Field_Name = 'TMR_qnty';
                                }

                              const values = [
                                ['REPORT OF LIVELIHOOD'],
                                ['A-live Kudumbashree'],
                                ['District: ' + searchData[0]?.data_district || 'N/A'],
                                ['Block: ' + searchData[0]?.data_Block || 'N/A'],
                                ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
                                ['Item Type : '+ itemtype],
                                headers, ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG, obj.BY_PASS_FAT_qnty]),
                              ];
                                     // Generate the Excel file
          // Generate the Excel file
          const worksheet = XLSX.utils.aoa_to_sheet(values);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

          // Convert the workbook to a buffer
          const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

          // Set the appropriate headers for the response
          res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Length', buffer.length);

          // Send the buffer as the response
          res.write(buffer, 'binary');
          res.end(null, 'binary');
                            }
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
           } catch (error) {
                  console.error(error);
                  res.status(500).json({ message: 'Internal server error' });
                }
              });

router.get('/salesReport', async (req, res) => {
  const { panchayath, products_Name } = req.query;

  try {
    const searchData = await Data.find({ data_Panchayath: panchayath })
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
      .exec();

    const parentKeys = searchData.map((data) => data.KEY);

    const purchaseQuery = {
      PARENT_KEY: { $in: parentKeys },
      data_Sales_prdct2: { $in: products_Name }
    };

    const purchaseData = await Sales.find(purchaseQuery)
      .select('data_Sales_prdct2 PARENT_KEY MILK_qnty MEAT_qnty EGG_qnty Sales_MANURE_qnty FEED_qnty male_buffalo_calf_qnty Gras_fooder_qnty tree_fooder_qnty kid_qnty day_old_chick_qnty pullets_qnty calf_qnty beifer_qnty')
      .exec();

    const mergedData = searchData.map((data) => {
      const matchedPurchases = purchaseData.filter((purchase) => purchase.PARENT_KEY === data.KEY);
      if (matchedPurchases.length > 0) {
        const mergedItems = matchedPurchases.map((matchedPurchase) => {
          const {
            data_Sales_prdct2,
            PARENT_KEY,
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
            beifer_qnty
          } = matchedPurchase;
          return {
            data_district: data.data_district,
            data_Block: data.data_Block,
            data_Panchayath: data.data_Panchayath,
            data_Name: data.data_Name,
            data_Phonenumber: data.data_Phonenumber,
            data_Ward: data.data_Ward,
            data_NameofNG: data.data_NameofNG,
            KEY: data.KEY,
            data_Sales_prdct2: products_Name,
            PARENT_KEY,
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
            beifer_qnty
          };
        });
        return mergedItems;
      } else {
        return null;
      }
    }).filter((data) => data !== null);

    console.log(mergedData);

    if (searchData.length && purchaseData.length !== 0) {
      const tempList = [];

      for (let i = 0; i < mergedData.length; i++) {
        try {
          const obj = {
            Name: mergedData[i][0].data_Name,
            Ward: mergedData[i][0].data_Ward,
            Phonenumber: mergedData[i][0].data_Phonenumber,
            Name_of_NHG: mergedData[i][0].data_NameofNG,
            products_Name: mergedData[i][0].data_Sales_prdct2,
          };

          if (obj.products_Name === 'MILK') {
            obj.MILK_qnty = mergedData[i][0].MILK_qnty;
          } else if (obj.products_Name === 'MEAT') {
            obj.MILK_qnty = mergedData[i][0].MEAT_qnty;
          } else if (obj.products_Name === 'EGG') {
            obj.MILK_qnty = mergedData[i][0].EGG_qnty;
          } else if (obj.products_Name === 'MANURE') {
            obj.MILK_qnty = mergedData[i][0].Sales_MANURE_qnty;
          } else if (obj.products_Name === 'FEED') {
            obj.MILK_qnty = mergedData[i][0].FEED_qnty;
          } else if (obj.products_Name === 'MALE BUFFALO') {
            obj.MILK_qnty = mergedData[i][0].male_buffalo_calf_qnty;
          } else if (obj.products_Name === 'GRAS FOODER') {
            obj.MILK_qnty = mergedData[i][0].Gras_fooder_qnty;
          } else if (obj.products_Name === 'TREE FOODER') {
          obj.MILK_qnty = mergedData[i][0].tree_fooder_qnty;
        } else if (obj.products_Name === 'KID') {
          obj.MILK_qnty = mergedData[i][0].kid_qnty;
        } else if (obj.products_Name === 'DAY OLD CHICK') {
          obj.MILK_qnty = mergedData[i][0].day_old_chick_qnty;
        } else if (obj.products_Name === 'PULLET') {
          obj.MILK_qnty = mergedData[i][0].pullets_qnty;
        } else if (obj.products_Name === 'CALF') {
          obj.MILK_qnty = mergedData[i][0].calf_qnty;
        } else if (obj.products_Name === 'BEIFER') {
          obj.MILK_qnty = mergedData[i][0].beifer_qnty;
        }

        tempList.push(obj);
      } catch (e) {
        console.log('error');
      }
    }
    let products_Qty_Field_Name;
    // Prepare headers for the Excel file
    let headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG"];
   
    if (products_Name === 'MILK') {
      headers.push('MILK (litre)');
      products_Qty_Field_Name = 'MILK_qnty'; // Assign the correct quantity field name
    } else if (products_Name === 'MEAT') {
      headers.push('MEAT (kg)');
      products_Qty_Field_Name = 'MEAT_qnty'; // Assign the correct quantity field name
    } else if (products_Name === 'EGG') {
      headers.push('EGG (number))');
      products_Qty_Field_Name = 'EGG_qnty'; // Assign the correct quantity field name
    }
    else if (products_Name === 'MANURE') {
      headers.push('MANURE (kg)');
      products_Qty_Field_Name = 'Sales_MANURE_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'FEED') {
      headers.push('FEED (kg)');
      products_Qty_Field_Name = 'FEED_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'MALE BUFFALO') {
      headers.push('MALE BUFFALO CALVES (number)');
      products_Qty_Field_Name = 'male_buffalo_calf_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'GRAS FOODER') {
      headers.push('GRAS FOODER (number)');
      products_Qty_Field_Name = 'Gras_fooder_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'TREE FOODER') {
      headers.push('TREE FOODER (number)');
      products_Qty_Field_Name = 'tree_fooder_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'KID') {
      headers.push('kid (number)');
      products_Qty_Field_Name = 'kid_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'DAY OLD CHICK') {
      headers.push('DAY OLD CHICK (number)');
      products_Qty_Field_Name = 'day_old_chick_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'PULLET') {
      headers.push('PULLET (number)');
      products_Qty_Field_Name = 'pullets_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'CALF') {
      headers.push('CALF (number)');
      products_Qty_Field_Name = 'calf_qnty'; // Assign the correct quantity field name
    }else if (products_Name === 'BEIFER') {
      headers.push('BEIFER (number)');
      products_Qty_Field_Name = 'beifer_qnty'; // Assign the correct quantity field name
    }
    const values = [
      // Prepare values for the Excel file
      ['REPORT OF PURCHASE OF RAW MATERIALS'],
      ['A-live Kudumbashree'],
      ['District: ' + searchData[0]?.data_district || 'N/A'],
      ['Block: ' + searchData[0]?.data_Block || 'N/A'],
      ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
      ['Products Name: '+ products_Name],
      headers, ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG, obj.MILK_qnty,
       ])
    ];

    // Generate the Excel file
    const worksheet = XLSX.utils.aoa_to_sheet(values);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Convert the workbook to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set the appropriate headers for the response
    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.length);

    // Send the buffer as the response
    res.write(buffer, 'binary');
    res.end(null, 'binary');
  } else {
    res.status(404).json({ message: 'No data found for the provided panchayath' });
  }

} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}
});


router.get('/livelihoodReport', async (req, res) => {
  const { panchayath, itemtype, subList, page = 1, limit = 15 } = req.query;

  try {
    const dataQuery = { data_Panchayath: panchayath };

    const totalResults = await Data.countDocuments(dataQuery);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(dataQuery)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
      .skip(startIndex)
      .limit(limit);

    const parentKeys = searchData.map((data) => data.KEY);

    let livelihoodQuery = {
      PARENT_KEY: { $in: parentKeys },
      data_livelihood_incomesource: { $in: itemtype }
    };

    let mergedData = [];

    if (itemtype.includes('COW') || itemtype.includes('CALF') || itemtype.includes('GOAT') || itemtype == 'POULTRY' || itemtype == 'MANURE') {
      //const subList = req.query.subList; // Assuming subList is an array of values

      if (itemtype.includes('COW')) {
        livelihoodQuery = {
          ...livelihoodQuery,
          livelihood_cows_list: { $in: subList }
        };
      }
      
      if (itemtype.includes('CALF')) {
        livelihoodQuery = {
          ...livelihoodQuery,
          livelihood_calf_list: { $in: subList }
        };
      }

      if (itemtype.includes('GOAT')) {
        livelihoodQuery = {
          ...livelihoodQuery,
          livelihood_goat_list: { $in: subList }
        };
      }
      if (itemtype == 'POULTRY') {
        livelihoodQuery = {
          ...livelihoodQuery,
          livelihood_poultry_list: { $in: subList }
        };
      }
      if (itemtype == 'MANURE') {
        livelihoodQuery = {
          ...livelihoodQuery,
          livelihood_manure_list: { $in: subList }
        };
        console.log(livelihoodQuery);
      }
   

      const livelihoodData = await Livelihood.find(livelihoodQuery)
        .select('data_livelihood_incomesource livelihood_cows_list livelihood_cows_HF_qnty livelihood_cows_JERSEY_qnty livelihood_cows_INDIGENOUS_qnty livelihood_calf_list livelihood_calf_FEMALE_qnty livelihood_calf_MALE_qnty livelihood_goat_list livelihood_goat_MALABARI_qnty livelihood_goat_MALABARI_KID_qnty livelihood_goat_ATTAPADI_BLACK_qnty livelihood_goat_ATTAPADI_BLACK_KID_qnty livelihood_goat_OTHERS_qnty livelihood_poultry_list livelihood_poultry_EGG_PRODUCTION_qnty livelihood_poultry_MARKETING_qnty livelihood_manure_list livelihood_manure_DRY_qnty livelihood_manure_FRESH_qnty PARENT_KEY')
        .exec();
        //console.log(",,,,,",livelihoodData);

      mergedData = searchData.map((data) => {
        const matchedLivelihood = livelihoodData.filter((livelihood) => livelihood.PARENT_KEY === data.KEY);
        if (matchedLivelihood.length > 0) {
          const mergedItems = matchedLivelihood.map((matchedLivelihood) => {
            const {
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
             livelihood_goat_ATTAPADI_BLACK_qnty ,
             livelihood_goat_ATTAPADI_BLACK_KID_qnty ,
             livelihood_goat_OTHERS_qnty,
             livelihood_poultry_list,
             livelihood_poultry_EGG_PRODUCTION_qnty,
             livelihood_poultry_MARKETING_qnty,
             livelihood_manure_list,
             livelihood_manure_DRY_qnty,
             livelihood_manure_FRESH_qnty,
             //livelihood_POULTRY_MANURE_qnty

            } = matchedLivelihood;

            const isCowsListMatched = Array.isArray(livelihood_cows_list) && livelihood_cows_list.some((sub) => subList.includes(sub));
            const isCalfListMatched = Array.isArray(livelihood_calf_list) && livelihood_calf_list.some((sub) => subList.includes(sub));
            const isGoatListMatched = Array.isArray(livelihood_goat_list) && livelihood_goat_list.some((sub) => subList.includes(sub));
            const isPoultryListMatched = Array.isArray(livelihood_poultry_list) && livelihood_poultry_list.some((sub) => subList.includes(sub));
            const isManureListMatched = Array.isArray(livelihood_manure_list) && livelihood_manure_list.some((sub) => subList.includes(sub));
           // const isPoultryManureListMatched = Array.isArray(livelihood_manure_list)


            if ((itemtype.includes('COW') && isCowsListMatched) || (itemtype.includes('CALF') && isCalfListMatched) ||  (itemtype.includes('GOAT') && isGoatListMatched) || (itemtype.includes('POULTRY') && isPoultryListMatched)|| (itemtype.includes('MANURE') && isManureListMatched) ) {
              //Console.log("....................");
              return {
                data_district: data.data_district,
                data_Block: data.data_Block,
                data_Panchayath: data.data_Panchayath,
                data_Name: data.data_Name,
                data_Ward: data.data_Ward,
                data_Phonenumber: data.data_Phonenumber,
                data_NameofNG: data.data_NameofNG,
                KEY: data.KEY,
                data_livelihood_incomesource: itemtype,
                livelihood_cows_list: subList,
                livelihood_cows_HF_qnty,
                livelihood_cows_JERSEY_qnty,
                livelihood_cows_INDIGENOUS_qnty,
                livelihood_calf_list: subList,
                livelihood_calf_FEMALE_qnty,
                livelihood_calf_MALE_qnty,
                livelihood_goat_list : subList,
                livelihood_goat_MALABARI_qnty,
                livelihood_goat_MALABARI_KID_qnty,
                livelihood_goat_ATTAPADI_BLACK_qnty,
                livelihood_goat_ATTAPADI_BLACK_KID_qnty ,
                livelihood_goat_OTHERS_qnty,
                livelihood_poultry_list,
                livelihood_poultry_EGG_PRODUCTION_qnty,
                livelihood_poultry_MARKETING_qnty,
                livelihood_manure_list,
                livelihood_manure_DRY_qnty,
                livelihood_manure_FRESH_qnty,
               // livelihood_POULTRY_MANURE_qnty

              };

            } else {
              return null; // Exclude data that doesn't satisfy the condition
            }
          });
          return mergedItems.filter((item) => item !== null);
        } else {
          return null;
        }
      }).filter((data) => data !== null);
      mergedData = mergedData.filter((items) => items !== null);
     
    }
    else if(itemtype.includes("BUFFALO") || itemtype.includes('DUCK') || itemtype == 'POULTRY MANURE' ){
      console.log("....................enter...........................");

      if (itemtype.includes('BUFFALO')) {
        livelihoodQuery = {
          ...livelihoodQuery,
        };
      //  console.log("livelihoodQuery......",livelihoodQuery);
      }
      
      if (itemtype.includes('DUCK')) {
        livelihoodQuery = {
          ...livelihoodQuery,
        };
      //  console.log("livelihoodQuery......",livelihoodQuery);
      }
      if (itemtype == 'POULTRY MANURE') {
        livelihoodQuery = {
          ...livelihoodQuery,
        };
        console.log("livelihoodQuery......",livelihoodQuery);
      }
      const livelihoodData = await Livelihood.find(livelihoodQuery)
      .select('data_livelihood_incomesource livelihood_BUFFALO_qnty livelihood_DUCK_qnty livelihood_POULTRY_MANURE_qnty PARENT_KEY')
      .exec();
      console.log(livelihoodData);
      mergedData = searchData.map((data) => {
        const matchedLivelihood = livelihoodData.filter((livelihood) => livelihood.PARENT_KEY === data.KEY);
        console.log("matchedLivelihood =",matchedLivelihood);
        if (matchedLivelihood.length > 0) {
          const mergedItems = matchedLivelihood.map((matchedLivelihood) => {
            const {
              data_livelihood_incomesource,
              livelihood_BUFFALO_qnty,
              livelihood_DUCK_qnty,
              livelihood_POULTRY_MANURE_qnty
            } = matchedLivelihood;
            if (itemtype.includes('BUFFALO') || itemtype.includes('DUCK') || itemtype == 'POULTRY MANURE'){
              return {
                data_district: data.data_district,
                data_Block: data.data_Block,
                data_Panchayath: data.data_Panchayath,
                data_Name: data.data_Name,
                data_Ward: data.data_Ward,
                data_Phonenumber: data.data_Phonenumber,
                data_NameofNG: data.data_NameofNG,
                KEY: data.KEY,
                data_livelihood_incomesource: itemtype,
                livelihood_BUFFALO_qnty,
                livelihood_DUCK_qnty,
                livelihood_POULTRY_MANURE_qnty

            };
          } else {
            return null; // Exclude data that doesn't satisfy the condition
          }
        });
        console.log("......mergedItems........",mergedItems);
        return mergedItems.filter((item) => item !== null);
        
      } else {
        return null;
      }

      }).filter((data) => data !== null);
      mergedData = mergedData.filter((items) => items !== null);
      
    }

    else {
      res.status(400).json({ message: 'Invalid itemtype' });
      return;
    }

    if (searchData.length !== 0) {
      var tempList = [];
      console.log(mergedData.length);
      for (let i = 0; i < mergedData.length; i++) {
        try {
          const obj = {
            Name: mergedData[i][0].data_Name,
            Ward: mergedData[i][0].data_Ward,
            Phonenumber: mergedData[i][0].data_Phonenumber,
            Name_of_NHG: mergedData[i][0].data_NameofNG,
            products_Name: mergedData[i][0].data_livelihood_incomesource,
            products_quantity: mergedData[i][0].livelihood_cows_list,
          };
          if (obj.products_quantity === 'H F') {
             obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_cows_HF_qnty;
             console.log("livelihood_cows_HF_qnty.............",obj.livelihood_cows_HF_qnty);
              } else if (obj.products_quantity === 'JERSEY') {
              obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_cows_JERSEY_qnty;
               } else if (obj.products_quantity === 'INDIGENOUS') {
               obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_cows_INDIGENOUS_qnty;
               }
               else if (obj.products_quantity === 'FEMALE') {
                obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_calf_FEMALE_qnty;
                console.log("livelihood_calf_FEMALE_qnty.............",obj.livelihood_cows_HF_qnty);
                }
                else if (obj.products_quantity === 'MALE') {
                  obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_calf_MALE_qnty;
                  }
                  else if (obj.products_quantity === 'MALABARI') {
                    obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_goat_MALABARI_qnty;
                   // console.log("livelihood_calf_FEMALE_qnty.............",obj.livelihood_cows_HF_qnty);
                    }
                    else if (obj.products_quantity === 'MALABARI KID') {
                      obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_goat_MALABARI_KID_qnty;
                      }
                      else if (obj.products_quantity === 'ATTAPADI BLACK') {
                        obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_goat_ATTAPADI_BLACK_qnty;
                        }
                        else if (obj.products_quantity === 'ATTAPADI BLACK KID') {
                          obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_goat_ATTAPADI_BLACK_KID_qnty;
                         // console.log("livelihood_calf_FEMALE_qnty.............",obj.livelihood_cows_HF_qnty);
                          }
                      else if (obj.products_quantity === 'OTHERS') {
                      obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_goat_OTHERS_qnty;
                      }
                      else if (obj.products_quantity === 'EGG PRODUCTION') {
                        obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_poultry_EGG_PRODUCTION_qnty;
                          console.log("livelihood_poultry_EGG_PRODUCTION_qnty.............",obj.livelihood_poultry_EGG_PRODUCTION_qnty);
                        }
                        else if (obj.products_quantity === 'MARKETING') {
                          obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_poultry_MARKETING_qnty;
                          }
                          else if (obj.products_quantity === 'DRY') {
                            obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_manure_DRY_qnty;
                              console.log("livelihood_cows_HF_qnty.............",obj.livelihood_cows_HF_qnty);
                            }
                            else if (obj.products_quantity === 'FRESH') {
                              obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_manure_FRESH_qnty;
                             }
                             else if (obj.products_Name === 'BUFFALO') {
                              console.log(".........enter............."),
                              obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_BUFFALO_qnty;
                              console.log("livelihood_cows_HF_qnty.............",obj.livelihood_cows_HF_qnty);
                             }  
                             else if (obj.products_Name === 'DUCK') {
                              console.log(".........enter............."),
                              obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_DUCK_qnty;
                              console.log("livelihood_DUCK_qnty.............",obj.livelihood_cows_HF_qnty);
                             }  
                             else if (obj.products_Name === 'POULTRY MANURE') {
                              console.log(".........enter............."),
                              obj.livelihood_cows_HF_qnty = mergedData[i][0].livelihood_POULTRY_MANURE_qnty;
                              console.log("livelihood_POULTRY_MANURE_qnty.............",obj.livelihood_cows_HF_qnty);
                             }      


          tempList.push(obj); // Collect data in the tempList
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
          return; // Exit the loop on error to prevent further processing
        }
      }
          let headers = ["Name", "Ward", "Phonenumber", "Name_of_NHG"];
          // ... (previous code for determining the products_Qty_Field_Name)
          let products_Qty_Field_Name = '';
          if (subList === 'H F') {
            headers.push('HF (number)');
            products_Qty_Field_Name = 'livelihood_cows_HF_qnty';
          } else if (subList === 'JERSEY') {
            headers.push('JERSEY (number)');
            products_Qty_Field_Name = 'livelihood_cows_JERSEY_qnty';
          } else if (subList === 'INDIGENOUS') {
            headers.push('INDIGENOUS (number)');
            products_Qty_Field_Name = 'livelihood_cows_INDIGENOUS_qnty';
          } else if (subList === 'FEMALE') {
            headers.push('FEMALE (number)');
            products_Qty_Field_Name = 'livelihood_calf_FEMALE_qnty';
          } else if (subList === 'MALE') {
            headers.push('MALE (number)');
            products_Qty_Field_Name = 'livelihood_calf_MALE_qnty';
          }
          else if (subList === 'MALABARI') {
            headers.push('MALABARI (number)');
            products_Qty_Field_Name = 'livelihood_goat_MALABARI_qnty';
          }
          else if (subList === 'MALABARI KID') {
            headers.push('MALABARI KID (number)');
            products_Qty_Field_Name = 'livelihood_goat_MALABARI_KID_qnty';
          }
          else if (subList === 'ATTAPADI BLACK') {
            headers.push('ATTAPADI BLACK (number)');
            products_Qty_Field_Name = 'livelihood_goat_ATTAPADI_BLACK_qnty';
          }
          else if (subList === 'ATTAPADI BLACK KID') {
            headers.push('ATTAPADI BLACK KID (number)');
            products_Qty_Field_Name = 'livelihood_goat_ATTAPADI_BLACK_KID_qnty';
          }
          else if (subList === 'OTHERS') {
            headers.push('OTHERS (number)');
            products_Qty_Field_Name = 'livelihood_goat_OTHERS_qnty';
          }
          else if (subList === 'EGG PRODUCTION') {
            headers.push('EGG_PRODUCTION_qnty');
            products_Qty_Field_Name = 'livelihood_poultry_EGG_PRODUCTION_qnty';
          }
          else if (subList === 'MARKETING') {
            headers.push('poultry_MARKETING_qnty');
            products_Qty_Field_Name = 'livelihood_poultry_MARKETING_qnty';
          }
          else if (subList === 'DRY') {
            headers.push('DRY (kg)');
            products_Qty_Field_Name = 'livelihood_manure_DRY_qnty';
          }
          else if (subList === 'FRESH') {
            headers.push('FRESH (kg)');
            products_Qty_Field_Name = 'livelihood_manure_FRESH_qnty';
          }
          else if (itemtype === 'BUFFALO') {
            console.log("..............BUFFALO.................")
            headers.push('BUFFALO (number)');
            products_Qty_Field_Name = 'livelihood_BUFFALO_qnty';
          }
          else if (itemtype === 'DUCK') {
            console.log("..............DUCK.................")
            headers.push('DUCK (number)');
            products_Qty_Field_Name = 'livelihood_BUFFALO_qnty';
          }
          else if (itemtype === 'POULTRY MANURE') {
            headers.push('POULTRY MANURE (kg)');
            products_Qty_Field_Name = 'livelihood_POULTRY_MANURE_qnty';
          }
          const values = [
            ['REPORT OF LIVELIHOOD'],
            ['A-live Kudumbashree'],
            ['District: ' + searchData[0]?.data_district || 'N/A'],
            ['Block: ' + searchData[0]?.data_Block || 'N/A'],
            ['Panchayath: ' + searchData[0]?.data_Panchayath || 'N/A'],
            ['Item Name : ' + itemtype || 'N/A'],
            headers, ...tempList.map(obj => [obj.Name, obj.Ward, obj.Phonenumber, obj.Name_of_NHG, obj.livelihood_cows_HF_qnty]),
          ];

          // Generate the Excel file
          const worksheet = XLSX.utils.aoa_to_sheet(values);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

          // Convert the workbook to a buffer
          const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

          // Set the appropriate headers for the response
          res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Length', buffer.length);

          // Send the buffer as the response
          res.write(buffer, 'binary');
          res.end(null, 'binary');
        
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/TrainingsRequired',async (req, res) => {
  const { data_Panchayath, data_Trainingsrequired, page = 1, limit = 15 } = req.query;
  console.log(data_Panchayath, data_Trainingsrequired);

  try {
    const classValues = data_Trainingsrequired.split(',');

    if (classValues.length === 0) {
      res.status(400).json({ error: 'data_Trainingsrequired parameter cannot be empty' });
      return;
    }

    const query = {
      data_Panchayath: data_Panchayath,
      data_Trainingsrequired: { $in: classValues },
    };
    console.log(query);

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Trainingsrequired')
      .skip(startIndex)
      .limit(limit);
    console.log(searchData);

    if (searchData.length !== 0) {
      try {
        var tempList = [];
        for (var i = 0; i < searchData.length; i++) {
          try {
           
            const obj = {
              Name: searchData[i].data_Name,
              Ward: searchData[i].data_Ward,
              Phonenumber: searchData[i].data_Phonenumber,
              Trainingsrequired : searchData[i].data_Trainingsrequired,
               Name_of_NHG : searchData[i].data_NameofNG,
            };
            tempList.push(obj);
          } catch (e) {
            console.log('error');
          }
        }

        // Prepare headers for the Excel file
        const headers =["Name","Ward","Phonenumber", "Trainingsrequired", "Name_of_NHG"];

        // Prepare values for the Excel file
        const values = [
          ['REPORT OF TRAINING REQUIRED'],
          ['A-live Kudumbashree'],
          ['District: ' + searchData[0].data_district],
          ['Block: ' + searchData[0].data_Block],
          ['Panchayath: ' + searchData[0].data_Panchayath],
          headers,
           // Display selected district, block, and panchayath in the header
            ...tempList.map(obj => [obj.Name,obj.Ward, obj.Phonenumber, obj.Trainingsrequired, obj.Name_of_NHG])
        ];
        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'
        );
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as the response
        res.send(buffer);
      } catch (error) {
        console.error('Failed to fetch data from MongoDB:', error);
        res.status(500).send('Failed to fetch data from MongoDB');
      }
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/dataSupport',async (req, res) => {
  const { data_Panchayath, data_supportrecived, page = 1, limit = 15 } = req.query;
  //console.log(data_Panchayath, data_Trainingsrequired);

  try {
    const classValues = data_supportrecived.split(',');

    if (classValues.length === 0) {
      res.status(400).json({ error: 'data support parameter cannot be empty' });
      return;
    }

    const query = {
      data_Panchayath: data_Panchayath,
      data_support: { $in: classValues },
    };
    console.log(query);

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_support')
      .skip(startIndex)
      .limit(limit);
    console.log(searchData);

    if (searchData.length !== 0) {
      try {
        var tempList = [];
        for (var i = 0; i < searchData.length; i++) {
          try {
           
            const obj = {
              Name: searchData[i].data_Name,
              Ward: searchData[i].data_Ward,
              Phonenumber: searchData[i].data_Phonenumber,
              Support_Required : searchData[i].data_support,
              Name_of_NHG : searchData[i].data_NameofNG,
            };
            tempList.push(obj);
          } catch (e) {
            console.log('error');
          }
        }

        // Prepare headers for the Excel file
        const headers =["Name","Ward","Phonenumber", "Support Required", "Name of NHG"];

        // Prepare values for the Excel file
        const values = [
          ['REPORT OF SUPPORT REQUIRED'],
          ['A-live Kudumbashree'],
          ['District: ' + searchData[0].data_district],
          ['Block: ' + searchData[0].data_Block],
          ['Panchayath: ' + searchData[0].data_Panchayath],
          headers,
           // Display selected district, block, and panchayath in the header
            ...tempList.map(obj => [obj.Name,obj.Ward, obj.Phonenumber, obj.Support_Required, obj.Name_of_NHG])
        ];
        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'
        );
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as the response
        res.send(buffer);
      } catch (error) {
        console.error('Failed to fetch data from MongoDB:', error);
        res.status(500).send('Failed to fetch data from MongoDB');
      }
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/detailsofMGNREGASupport', async (req, res) => {
  const { selectedPanchayath, MGNREGA_Support, page = 1, limit = 20 } = req.query;
  console.log(selectedPanchayath, MGNREGA_Support);

  try {
    const MGNREGA_SupportTypeOptions = MGNREGA_Support.split(',');

    if (MGNREGA_SupportTypeOptions.length === 0) {
      res.status(400).json({ error: 'MGNREGA_Support parameter cannot be empty' });
      return;
    }

    const query = {
      data_Panchayath: selectedPanchayath,
      data_MGNREGAsupport: { $in: MGNREGA_SupportTypeOptions },
    };

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const details = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_MGNREGAsupport')
      .skip(startIndex)
      .limit(limit);

    if (details.length === 0) {
      res.status(404).json({ error: 'No matching data found' });
      return;
    }

    try {
      var tempList = [];
      for (var i = 0; i < details.length; i++) {
        try {
          const obj = {
            Name: details[i].data_Name,
            Ward: details[i].data_Ward,
            Phonenumber: details[i].data_Phonenumber,
            MGNREGA_Support : details[i].data_MGNREGAsupport,
          Name_of_NHG : details[i].data_NameofNG,
          };
          tempList.push(obj);
        } catch (e) {
          console.log('error');
        }
      }

      // Prepare headers for the Excel file
      const headers =["Name","Ward","Phonenumber", "MGNREGA_Support", "Name_of_NHG"];


      // Prepare values for the Excel file
      const values = [
        ['REPORT OF MGNREGA SUPPORT'],
        ['A-live Kudumbashree'],
        ['District: ' + details[0].data_district],
        ['Block: ' + details[0].data_Block],
        ['Panchayath: ' + details[0].data_Panchayath],
        headers,
        ...tempList.map(obj => [obj.Name,obj.Ward, obj.Phonenumber, obj.MGNREGA_Support, obj.Name_of_NHG])
        ];

      // Generate the Excel file
      const worksheet = XLSX.utils.aoa_to_sheet(values);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Convert the workbook to a buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Set the appropriate headers for the response
      res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'
      );
      res.setHeader('Content-Length', buffer.length);

      // Send the buffer as the response
      res.send(buffer);
    } catch (error) {
      console.error('Failed to fetch data from MongoDB:', error);
      res.status(500).send('Failed to fetch data from MongoDB');
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving details' });
  }
});

// router.get('/listData', async (req, res) => {
//   try {
//     const { page = 1, limit = 15 } = req.query;

//     const startIndex = (page - 1) * limit;

//     const query = {
//       $and: [
//         { data_district: { $ne: null } },
//         { data_Block: { $ne: null } },
//         { data_Panchayath: { $ne: null } },
//         { data_nameofcrp: { $ne: null } }
//       ]
//     };

//     const totalResults = await Data.countDocuments(query);
//     const totalPages = Math.ceil(totalResults / limit);

//     const data = await Data.find(query)
//       .select('data_district data_Block data_Panchayath data_nameofcrp')
//       .skip(startIndex)
//       .limit(limit)
//       .exec();
//       if (data.length !== 0) {
//         try {
//           const tempList = [];
//           for (let i = 0; i < data.length; i++) {
//             try {
//               const obj = {
//                 District: data[i].data_district,
//                 Block: data[i].data_Block,
//                 Panchayath: data[i].data_Panchayath,
//                 Name_of_CRP: data[i].data_nameofcrp,
              
//               };
      
//               tempList.push(obj);
//             } catch (e) {
//               console.log("error");
//             }
//           }
      
//           // Prepare headers for the Excel file
//           const headers = ["District","Block","Panchayath","Name_of_CRP"];
      
//           // Prepare values for the Excel file
//           const values = [
           
//             headers,
//            // Display selected district, block, and panchayath in the header
//             ...tempList.map(obj => [obj.District,obj.Block, obj.Panchayath, obj.Name_of_CRP])
//           ];
      
//           // Generate the Excel file
//           const worksheet = XLSX.utils.aoa_to_sheet(values);
//           const workbook = XLSX.utils.book_new();
//           XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
//           // Convert the workbook to a buffer
//           const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
//           // Set the appropriate headers for the response
//           res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
//           res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
//           res.setHeader('Content-Length', buffer.length);
      
//           // Send the buffer as the response
//           res.send(buffer);
//         } catch (error) {
//           console.error('Failed to create Excel file:', error);
//           res.status(500).send('Failed to create Excel file');
//         }
//       }
   
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.get('/listData', async (req, res) => {
//   try {
//     const query = {
//       $and: [
//         { data_district: { $ne: null } },
//         { data_Block: { $ne: null } },
//         { data_Panchayath: { $ne: null } },
//         { data_nameofcrp: { $ne: null } }
//       ]
//     };

//     const data = await Data.find(query)
//       .select('data_district data_Block data_Panchayath data_nameofcrp')
//       .exec();

//     if (data.length !== 0) {
//       try {
//         const tempList = [];
//         for (let i = 0; i < data.length; i++) {
//           try {
//             const obj = {
//               District: data[i].data_district,
//               Block: data[i].data_Block,
//               Panchayath: data[i].data_Panchayath,
//               Name_of_CRP: data[i].data_nameofcrp,
//             };

//             tempList.push(obj);
//           } catch (e) {
//             console.log("error");
//           }
//         }

//         // Prepare headers for the Excel file
//         const headers = ["District","Block","Panchayath","Name_of_CRP"];

//         // Prepare values for the Excel file
//         const values = [
//           headers,
//           // Display selected district, block, and panchayath in the header
//           ...tempList.map(obj => [obj.District,obj.Block, obj.Panchayath, obj.Name_of_CRP])
//         ];

//         // Generate the Excel file
//         const worksheet = XLSX.utils.aoa_to_sheet(values);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

//         // Convert the workbook to a buffer
//         const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

//         // Set the appropriate headers for the response
//         res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
//         res.setHeader('Content-Length', buffer.length);

//         // Send the buffer as the response
//         res.send(buffer);
//       } catch (error) {
//         console.error('Failed to create Excel file:', error);
//         res.status(500).send('Failed to create Excel file');
//       }
//     } else {
//       res.status(404).json({ message: 'No data found' });
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
//const XLSX = require('xlsx');
// ...

router.get('/listData', async (req, res) => {
  try {
    const query = {
      $and: [
        { data_district: { $ne: null } },
        { data_Block: { $ne: null } },
        { data_Panchayath: { $ne: null } },
        { data_nameofcrp: { $ne: null } }
      ]
    };

    const data = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_nameofcrp')
      .exec();

    if (data.length !== 0) {
      try {
        const uniqueSet = new Set(); // To store unique combinations
        const tempList = [];

        for (let i = 0; i < data.length; i++) {
          try {
            const combination = `${data[i].data_district}-${data[i].data_Block}-${data[i].data_Panchayath}-${data[i].data_nameofcrp}`;
            if (!uniqueSet.has(combination)) {
              uniqueSet.add(combination);

              const obj = {
                District: data[i].data_district,
                Block: data[i].data_Block,
                Panchayath: data[i].data_Panchayath,
                Name_of_CRP: data[i].data_nameofcrp,
              };

              tempList.push(obj);
            }
          } catch (e) {
            console.log("error");
          }
        }

        // Prepare headers for the Excel file
        const headers = ["District","Block","Panchayath","Name_of_CRP"];

        // Prepare values for the Excel file
        const values = [
          headers,
          // Display selected district, block, and panchayath in the header
          ...tempList.map(obj => [obj.District,obj.Block, obj.Panchayath, obj.Name_of_CRP])
        ];

        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as the response
        res.send(buffer);
      } catch (error) {
        console.error('Failed to create Excel file:', error);
        res.status(500).send('Failed to create Excel file');
      }
    } else {
      res.status(404).json({ message: 'No data found' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/downloadByCpr',async (req, res) => {
  const { data_nameofcrp, page = 1, limit = 15 } = req.query;

  try {
    const dataQuery = { data_nameofcrp: data_nameofcrp };

    const totalResults = await Data.countDocuments(dataQuery);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(dataQuery)
      .select('data_district data_Block data_Panchayath data_ward data_Name data_Address data_Phonenumber data_Class data_Class2 data_Class3 data_familyincome data_NameofNG data_NameofNGmember data_roleinNG data_houseownership data_landdetails_landarea data_landdetails_agricultureland data_Animalhusbendary_businesstype data_Animalhusbendary_others0 data_Animalhusbendary_cdsregistration data_Animalhusbendary_regdetails_regnumber data_Animalhusbendary_regdetails_cdsunitname data_enterpisetype data_noofgroupmembers data_Yearofstartingagriculture data_yearofstartingbussiness data_amountinvested data_Sourceofinvestment data_supportrecived data_loan data_loandetails_totalinvestment data_loandetails_DateofLoanApplication data_businessidea data_Infra_Infrastructure data_Infra_Shed data_Infr_wastage data_Infra_biogas data_Infra_equipments data_Infra_others data_support data_others2 data_MGNREGAsupport data_landdetails1_landforgrass data_landdetails1_qtyofownland data_landdetails1_qtyofleasedland data_landdetails2_siteforworkshed data_landdetails2_qtyofownland data_others4 data_Trainingsrequired data_others3 data_comments data_nameofcrp data_Nameofrespondent data_dateofsurvey data_Starttime KEY')
      .skip(startIndex)
      .limit(limit);

    const parentKeys = searchData.map((data) => data.KEY);

    const productQuery = { PARENT_KEY: { $in: parentKeys } };
    const productData = await Products.find(productQuery)
      .select('data_products_prdct data_products_quantum data_products_price2 PARENT_KEY')
      .exec();

      const salesQuery = { PARENT_KEY: { $in: parentKeys } };
      const salesData = await Sales.find(salesQuery)
        .select('data_Sales_prdct2 data_Sales_quntum2 data_Sales_salesmethod PARENT_KEY')
        .exec();

        const livelihoodQuery = { PARENT_KEY: { $in: parentKeys } };
        const livelihoodData = await Livelihood.find(livelihoodQuery)
          .select('data_livelihood_incomesource data_livelihood_numbers data_livelihood_capitalsource data_livelihood_revenue PARENT_KEY')
          .exec();
  
          const purchaseOfRawMaterialsQuery = { PARENT_KEY: { $in: parentKeys } };
          const purchaseOfRawMaterialsData = await PurchaseOfRawMaterials.find(purchaseOfRawMaterialsQuery)
            .select('data_purchaseofrawmaterials_itemtype data_purchaseofrawmaterials_quantity data_purchaseofrawmaterials_price data_purchaseofrawmaterials_brand data_purchaseofrawmaterials_own data_purchaseofrawmaterials_retail data_purchaseofrawmaterials_p2 data_purchaseofrawmaterials_wholesale data_purchaseofrawmaterials_p3 data_purchaseofrawmaterials_group data_purchaseofrawmaterials_p4 data_purchaseofrawmaterials_subsidy data_purchaseofrawmaterials_p5 PARENT_KEY')
            .exec();
          const mergedData = searchData.map((data) => {
            const matchedProduct = productData.find((product) => product.PARENT_KEY === data.KEY);
            const matchedSale = salesData.find((sale) => sale.PARENT_KEY === data.KEY);
            const matchedLivelihood = livelihoodData.find((livelihood) => livelihood.PARENT_KEY === data.KEY);
            const matchedPurchaseOfRawMaterials = purchaseOfRawMaterialsData.find((purchaseOfRawMaterials) => purchaseOfRawMaterials.PARENT_KEY === data.KEY);
      
      // Add a check to handle undefined matchedProduct
      // if (matchedProduct && matchedSale && matchedLivelihood && matchedpurchaseOfRawMaterials) {
      //   const { data_products_prdct, data_products_quantum, data_products_price2 } = matchedProduct;
      //  const isProductMatched = Array.isArray(data_products_prdct) && data_products_prdct.includes(products_Name);
        //if (matchedProduct) {
          if (matchedProduct && matchedSale && matchedLivelihood && matchedPurchaseOfRawMaterials) {
         
        return {
          data_district: data.data_district,
          data_Block: data.data_Block,
          data_Panchayath: data.data_Panchayath,
          data_ward: data.data_ward,
          data_Name: data.data_Name,
          data_Address: data.data_Address,
          data_Class: data.data_Class,
         data_Class2: data.data_Class2,
         data_Class3:data.data_Class3,
          data_Phonenumber: data.data_Phonenumber,
          data_familyincome: data.data_familyincome,
          data_NameofNG: data.data_NameofNG,
          data_roleinNG: data.data_roleinNG,
        data_houseownership: data.data_houseOwnership,
        data_landdetails_landarea: data.data_landdetails_landarea,
        data_landdetails_agricultureland: data.data_landdetails_agricultureland,
        data_Animalhusbendary_businesstype: data.data_Animalhusbendary_businesstype,
        data_Animalhusbendary_others0: data.data_Animalhusbendary_others0,
        data_Animalhusbendary_cdsregistration: data.data_Animalhusbendary_cdsregistration,
        data_Animalhusbendary_regdetails_regnumber: data.data_Animalhusbendary_regdetails_regnumber,
        data_Animalhusbendary_regdetails_cdsunitname: data.data_Animalhusbendary_regdetails_cdsunitname,
        data_enterpisetype: data.data_enterpisetype,
        data_noofgroupmembers: data.data_noofgroupmembers,
        data_Yearofstartingagriculture: data.data_Yearofstartingagriculture,
        data_yearofstartingbussiness: data.data_yearofstartingbussiness,
        data_amountinvested: data.data_amountinvested,
        data_Sourceofinvestment: data.data_Sourceofinvestment,
        data_supportrecived: data.data_supportrecived,
        data_loan: data.data_loan,
        data_loandetails_totalinvestment: data.data_loandetails_totalinvestment,
        data_loandetails_DateofLoanApplication: data.data_loandetails_DateofLoanApplication,
        data_businessidea:data.data_businessidea,
        data_Infra_Infrastructure:data.data_Infra_Infrastructure,
      data_Infra_Shed: data.data_Infra_Shed,
      data_Infr_wastage: data.data_Infr_wastage,
      data_Infra_biogas: data.data_Infra_biogas,
      data_Infra_equipments: data.data_Infra_equipments,
      data_Infra_others: data.data_Infra_others,
      data_support: data.data_support,
      data_others2: data.data_others2,
      data_MGNREGAsupport: data.data_MGNREGAsupport,
      data_landdetails1_landforgrass: data.data_landdetails1_landforgrass,
      data_landdetails1_qtyofownland: data.data_landdetails1_qtyofownland,
      data_landdetails1_qtyofleasedland: data.data_landdetails1_qtyofleasedland,
      data_landdetails2_siteforworkshed: data.data_landdetails2_siteforworkshed,
      data_landdetails2_qtyofownland: data.data_landdetails2_qtyofownland,
      data_others4: data.data_others4,
      data_Trainingsrequired: data.data_Trainingsrequired,
      data_others3: data.data_others3,
      data_comments: data.data_comments,
      data_nameofcrp: data.data_nameofcrp,
      data_Nameofrespondent: data.data_Nameofrespondent,
      data_dateofsurvey: data.data_dateofsurvey,
      data_Starttime: data.data_Starttime,    
      data_products_prdct: matchedProduct.data_products_prdct,
      data_products_quantum: matchedProduct.data_products_quantum,
      data_products_price2: matchedProduct.data_products_price2,
      data_Sales_prdct2: matchedSale.data_Sales_prdct2,
      MILK_qnty: matchedSale.MILK_qnty,
      MEAT_qnty: matchedSale.MEAT_qnty,
      EGG_qnty: matchedSale.EGG_qnty,
      Sales_MANURE_qnty: matchedSale.Sales_MANURE_qnty,
      FEED_qnty: matchedSale.FEED_qnty,
      male_buffalo_calf_qnty: matchedSale.male_buffalo_calf_qnty,
      Gras_fooder_qnty: matchedSale.Gras_fooder_qnty,
      tree_fooder_qnty: matchedSale.tree_fooder_qnty,
      day_old_chick_qnty: matchedSale.day_old_chick_qnty,
      pullets_qnty: matchedSale.pullets_qnty,
      calf_qnty: matchedSale.calf_qnty,
      beifer_qnty: matchedSale.beifer_qnty,
      data_Sales_salesmethod: matchedSale.data_Sales_salesmethod,
      data_livelihood_incomesource: matchedLivelihood.data_livelihood_incomesource,
      data_livelihood_numbers : matchedLivelihood.data_livelihood_numbers,
      data_livelihood_capitalsource : matchedLivelihood.data_livelihood_capitalsource,
      data_livelihood_revenue : matchedLivelihood.data_livelihood_revenue,
      data_purchaseofrawmaterials_itemtype: matchedPurchaseOfRawMaterials.data_purchaseofrawmaterials_itemtype,
      PULLETS_List: matchedPurchaseOfRawMaterials.PULLETS_List,
      MANURE_List: matchedPurchaseOfRawMaterials.MANURE_List,
      COW_DUNG_qnty: matchedPurchaseOfRawMaterials.COW_DUNG_qnty,
      GOAT_MANURE_qnty: matchedPurchaseOfRawMaterials.GOAT_MANURE_qnty,
      POULTRY_MANURE_qnty: matchedPurchaseOfRawMaterials.POULTRY_MANURE_qnty,
      VERMY_COMPOST_qnty: matchedPurchaseOfRawMaterials.VERMY_COMPOST_qnty,
      FODDER_SLIPS_List: matchedPurchaseOfRawMaterials.FODDER_SLIPS_List,
      NAPIER_qnty: matchedPurchaseOfRawMaterials.NAPIER_qnty,
      CO4_qnty: matchedPurchaseOfRawMaterials.CO4_qnty,
      CO5_qnty: matchedPurchaseOfRawMaterials.CO5_qnty,
      RED_NAPIER_qnty: matchedPurchaseOfRawMaterials.RED_NAPIER_qnty,
      SUPER_NAPIER_qnty: matchedPurchaseOfRawMaterials.SUPER_NAPIER_qnty,
      GUINEA_GRASS_qnty: matchedPurchaseOfRawMaterials.GUINEA_GRASS_qnty,
      PARA_GRASS_qnty: matchedPurchaseOfRawMaterials.PARA_GRASS_qnty,
      CONGO_SIGNAL_qnty: matchedPurchaseOfRawMaterials.CONGO_SIGNAL_qnty,
      MALE_BUFFALO_CALVES_qnty: matchedPurchaseOfRawMaterials.MALE_BUFFALO_CALVES_qnty,
      CALVES_List: matchedPurchaseOfRawMaterials.CALVES_List,
      CALVES_HF_qnty: matchedPurchaseOfRawMaterials.CALVES_HF_qnty,
      CALVES_GERSEY_qnty: matchedPurchaseOfRawMaterials.SUPER_NAPIER_qnty,
      HEIPERS_List: matchedPurchaseOfRawMaterials.HEIPERS_List,
      HEIPERS_HF_qnty: matchedPurchaseOfRawMaterials.HEIPERS_HF_qnty,
      COWS_List: matchedPurchaseOfRawMaterials.COWS_List,
      COWS_HF_qnty: matchedPurchaseOfRawMaterials.COWS_HF_qnty,
      COWS_GERSEY_qnty: matchedPurchaseOfRawMaterials.COWS_GERSEY_qnty,
      MALABARI_GOATS_qnty: matchedPurchaseOfRawMaterials.MALABARI_GOATS_qnty,
     // MATERIAL_FOR_POULTRY_qnty: matchedPurchaseOfRawMaterials.MATERIAL_FOR_POULTRY_qnty,
      EGG_TRAYS_qnty: matchedPurchaseOfRawMaterials.EGG_TRAYS_qnty,
      POULTRY_FEED_qnty: matchedPurchaseOfRawMaterials.POULTRY_FEED_qnty,
      LAYER_List: matchedPurchaseOfRawMaterials.LAYER_List,
      CATTLE_FEED_List: matchedPurchaseOfRawMaterials.CATTLE_FEED_List,
      CATTLE_FEED_qnty: matchedPurchaseOfRawMaterials.CATTLE_FEED_qnty,
      MILK_REPLACER_List: matchedPurchaseOfRawMaterials.MILK_REPLACER_List,
      MILK_REPLACER_qnty: matchedPurchaseOfRawMaterials.MILK_REPLACER_qnty,
      ENERGY_RICH_FEED_List: matchedPurchaseOfRawMaterials.ENERGY_RICH_FEED_List,
      ENERGY_RICH_FEED_qnty: matchedPurchaseOfRawMaterials.ENERGY_RICH_FEED_qnty,
      BY_PASS_PROTEIN_qnty: matchedPurchaseOfRawMaterials.BY_PASS_PROTEIN_qnty,
      BY_PASS_FAT_qnty: matchedPurchaseOfRawMaterials.BY_PASS_FAT_qnty,
      TMR_qnty: matchedPurchaseOfRawMaterials.TMR_qnty,
      SILAGE_qnty: matchedPurchaseOfRawMaterials.SILAGE_qnty,
      HAY_qnty: matchedPurchaseOfRawMaterials.HAY_qnty,
      Urea_treated_Straw_qnty: matchedPurchaseOfRawMaterials.Urea_treated_Straw_qnty,
      GOAT_FEEDqnty: matchedPurchaseOfRawMaterials.GOAT_FEEDqnty,
      KID_STARTER_qnty: matchedPurchaseOfRawMaterials.KID_STARTER_qnty,
      Mode_purchaseofrawmaterials: matchedPurchaseOfRawMaterials.Mode_purchaseofrawmaterials,
      data_purchaseofrawmaterials_brand: matchedPurchaseOfRawMaterials.data_purchaseofrawmaterials_brand,
      BRAND_qnty: matchedPurchaseOfRawMaterials.BRAND_qnty,
      
         // KEY: data.KEY,
          // data_products_prdct: matchedProduct.data_products_prdct,
          // data_products_quantum: matchedProduct.data_products_quantum,
          // data_products_price2: matchedProduct.data_products_price2
        };
      } else {
        return null;
      }
    
    });
 console.log(mergedData);
    if (searchData.length !== 0) {
      try {
        var tempList = []
        for(var i=0; i< mergedData.length; i++){
          try{
            var obj = new Object();
            obj.District = mergedData[i].data_district
            obj.Block = mergedData[i].data_Block
            obj.Panchayath= mergedData[i].data_Panchayath
            obj.data_ward= mergedData[i].data_ward
            obj.Name = mergedData[i].data_Name
            obj.data_Address = mergedData[i].data_Address
            obj.Phonenumber =mergedData[i].data_Phonenumber
            obj.data_Class = mergedData[i].data_Class
            obj.data_Class2 = mergedData[i].data_Class2
            obj.data_Class3 = mergedData[i].data_Class3
            obj.data_familyincome = mergedData[i].data_familyincome
            obj.Name_of_NHG = mergedData[i].data_NameofNG
            obj.data_NameofNGmember = mergedData[i].data_NameofNGmember
            obj.data_roleinNG =mergedData[i].data_roleinNG
            obj.data_houseownership=  mergedData[i].data_houseOwnership,
            obj.data_landdetails_landarea=  mergedData[i].data_landdetails_landarea,
            obj.data_landdetails_agricultureland=  mergedData[i].data_landdetails_agricultureland,
            obj.data_Animalhusbendary_businesstype=  mergedData[i].data_Animalhusbendary_businesstype,
            obj.data_Animalhusbendary_others0=  mergedData[i].data_Animalhusbendary_others0,
            obj.data_Animalhusbendary_cdsregistration=  mergedData[i].data_Animalhusbendary_cdsregistration,
            obj.data_Animalhusbendary_regdetails_regnumber=  mergedData[i].data_Animalhusbendary_regdetails_regnumber,
            obj.data_Animalhusbendary_regdetails_cdsunitname=  mergedData[i].data_Animalhusbendary_regdetails_cdsunitname,
            obj.data_enterpisetype=  mergedData[i].data_enterpisetype,
            obj.data_noofgroupmembers=  mergedData[i].data_noofgroupmembers,
            obj.data_Yearofstartingagriculture=  mergedData[i].data_Yearofstartingagriculture,
            obj.data_yearofstartingbussiness=  mergedData[i].data_yearofstartingbussiness,
            obj.data_amountinvested=  mergedData[i].data_amountinvested,
            obj.data_Sourceofinvestment=  mergedData[i].data_Sourceofinvestment,
            obj.data_supportrecived=  mergedData[i].data_supportrecived,
            obj.data_loan=  mergedData[i].data_loan,
            obj.data_loandetails_totalinvestment=  mergedData[i].data_loandetails_totalinvestment,
            obj.data_loandetails_DateofLoanApplication=  mergedData[i].data_loandetails_DateofLoanApplication,
            obj.data_businessidea= mergedData[i].data_businessidea,
            obj.data_Infra_Infrastructure= mergedData[i].data_Infra_Infrastructure,
            obj.data_Infra_Shed=  mergedData[i].data_Infra_Shed,
            obj.data_Infr_wastage=  mergedData[i].data_Infr_wastage,
            obj.data_Infra_biogas=  mergedData[i].data_Infra_biogas,
            obj.data_Infra_equipments=  mergedData[i].data_Infra_equipments,
            obj.data_Infra_others=  mergedData[i].data_Infra_others,
            obj.data_support=  mergedData[i].data_support,
            obj.data_others2=  mergedData[i].data_others2,
            obj.data_MGNREGAsupport=  mergedData[i].data_MGNREGAsupport,
            obj.data_landdetails1_landforgrass=  mergedData[i].data_landdetails1_landforgrass,
            obj.data_landdetails1_qtyofownland=  mergedData[i].data_landdetails1_qtyofownland,
            obj.data_landdetails1_qtyofleasedland=  mergedData[i].data_landdetails1_qtyofleasedland,
            obj.data_landdetails2_siteforworkshed=  mergedData[i].data_landdetails2_siteforworkshed,
            obj.data_landdetails2_qtyofownland=  mergedData[i].data_landdetails2_qtyofownland,
            obj.data_others4=  mergedData[i].data_others4,
            obj.data_Trainingsrequired=  mergedData[i].data_Trainingsrequired,
            obj.data_others3=  mergedData[i].data_others3,
            obj.data_comments=  mergedData[i].data_comments,
            obj.data_nameofcrp=  mergedData[i].data_nameofcrp,
            obj.data_Nameofrespondent=  mergedData[i].data_Nameofrespondent,
            obj.data_dateofsurvey=  mergedData[i].data_dateofsurvey,
            obj.data_Starttime=  mergedData[i].data_Starttime, 
            obj.products_Name = mergedData[i].data_products_prdct,
            obj.products_quantity = mergedData[i].data_products_quantum,
            obj.products_price2 = mergedData[i].data_products_price2,
            obj.data_Sales_prdct2= mergedData[i].data_Sales_prdct2,
            obj.MILK_qnty= mergedData[i].MILK_qnty,
            obj.MEAT_qnty= mergedData[i].MEAT_qnty,
            obj.EGG_qnty= mergedData[i].EGG_qnty,
            obj.Sales_MANURE_qnty= mergedData[i].Sales_MANURE_qnty,
            obj.FEED_qnty= mergedData[i].FEED_qnty,
            obj.male_buffalo_calf_qnty= mergedData[i].male_buffalo_calf_qnty,
            obj.Gras_fooder_qnty= mergedData[i].Gras_fooder_qnty,
            obj.tree_fooder_qnty= mergedData[i].tree_fooder_qnty,
            obj.day_old_chick_qnty= mergedData[i].day_old_chick_qnty,
            obj.pullets_qnty= mergedData[i].pullets_qnty,
            obj.calf_qnty= mergedData[i].calf_qnty,
            obj.beifer_qnty= mergedData[i].beifer_qnty,
            obj.data_Sales_salesmethod = mergedData[i].data_Sales_salesmethod, 
            obj.data_livelihood_incomesource = mergedData[i].data_livelihood_incomesource,
            obj.data_livelihood_numbers = mergedData[i].data_livelihood_numbers,
            obj.data_livelihood_capitalsource = mergedData[i].data_livelihood_capitalsource,
            obj.data_livelihood_revenue = mergedData[i].data_livelihood_revenue,
            obj.data_purchaseofrawmaterials_itemtype= mergedData[i].data_purchaseofrawmaterials_itemtype,
            obj.PULLETS_List= mergedData[i].PULLETS_List,
            obj.MANURE_List= mergedData[i].MANURE_List,
            obj.COW_DUNG_qnty= mergedData[i].COW_DUNG_qnty,
            obj.GOAT_MANURE_qnty= mergedData[i].GOAT_MANURE_qnty,
            obj.POULTRY_MANURE_qnty= mergedData[i].POULTRY_MANURE_qnty,
            obj.VERMY_COMPOST_qnty= mergedData[i].VERMY_COMPOST_qnty,
            obj.FODDER_SLIPS_List= mergedData[i].FODDER_SLIPS_List,
            obj.NAPIER_qnty= mergedData[i].NAPIER_qnty,
            obj.CO4_qnty= mergedData[i].CO4_qnty,
            obj.CO5_qnty= mergedData[i].CO5_qnty,
            obj.RED_NAPIER_qnty= mergedData[i].RED_NAPIER_qnty,
            obj.SUPER_NAPIER_qnty= mergedData[i].SUPER_NAPIER_qnty,
            obj.GUINEA_GRASS_qnty= mergedData[i].GUINEA_GRASS_qnty,
            obj.PARA_GRASS_qnty= mergedData[i].PARA_GRASS_qnty,
            obj.CONGO_SIGNAL_qnty= mergedData[i].CONGO_SIGNAL_qnty,
            obj.MALE_BUFFALO_CALVES_qnty= mergedData[i].MALE_BUFFALO_CALVES_qnty,
            obj.CALVES_List= mergedData[i].CALVES_List,
            obj.CALVES_HF_qnty= mergedData[i].CALVES_HF_qnty,
            obj.CALVES_GERSEY_qnty= mergedData[i].SUPER_NAPIER_qnty,
            obj.HEIPERS_List= mergedData[i].HEIPERS_List,
            obj.HEIPERS_HF_qnty= mergedData[i].HEIPERS_HF_qnty,
            obj.COWS_List= mergedData[i].COWS_List,
            obj.COWS_HF_qnty= mergedData[i].COWS_HF_qnty,
            obj.COWS_GERSEY_qnty= mergedData[i].COWS_GERSEY_qnty,
            obj.MALABARI_GOATS_qnty= mergedData[i].MALABARI_GOATS_qnty,
         //   obj.MATERIAL_FOR_POULTRY_qnty= mergedData[i].MATERIAL_FOR_POULTRY_qnty,
            obj.EGG_TRAYS_qnty= mergedData[i].EGG_TRAYS_qnty,
            obj.POULTRY_FEED_qnty= mergedData[i].POULTRY_FEED_qnty,
            obj.LAYER_List= mergedData[i].LAYER_List,
            obj.CATTLE_FEED_List= mergedData[i].CATTLE_FEED_List,
            obj.CATTLE_FEED_qnty= mergedData[i].CATTLE_FEED_qnty,
            obj.MILK_REPLACER_List= mergedData[i].MILK_REPLACER_List,
            obj.MILK_REPLACER_qnty= mergedData[i].MILK_REPLACER_qnty,
            obj.ENERGY_RICH_FEED_List= mergedData[i].ENERGY_RICH_FEED_List,
            obj.ENERGY_RICH_FEED_qnty= mergedData[i].ENERGY_RICH_FEED_qnty,
            obj.BY_PASS_PROTEIN_qnty= mergedData[i].BY_PASS_PROTEIN_qnty,
            obj.BY_PASS_FAT_qnty= mergedData[i].BY_PASS_FAT_qnty,
            obj.TMR_qnty= mergedData[i].TMR_qnty,
            obj.SILAGE_qnty= mergedData[i].SILAGE_qnty,
            obj.HAY_qnty= mergedData[i].HAY_qnty,
            obj.Urea_treated_Straw_qnty= mergedData[i].Urea_treated_Straw_qnty,
            obj.GOAT_FEEDqnty= mergedData[i].GOAT_FEEDqnty,
            obj.KID_STARTER_qnty= mergedData[i].KID_STARTER_qnty,
            obj.Mode_purchaseofrawmaterials= mergedData[i].Mode_purchaseofrawmaterials,
            
            obj.data_purchaseofrawmaterials_brand= mergedData[i].data_purchaseofrawmaterials_brand,
            obj.BRAND_qnty= mergedData[i].BRAND_qnty,
            

    
  
            tempList.push(obj)
          }catch(e){
            console.log("error")
          }
        }
                    // Prepare headers for the Excel file
                    const headers = Object.keys(tempList[0]);
  
                    // Prepare values for the Excel file
                    const values = [headers, ...tempList.map(obj => Object.values(obj))];
          
                    // Generate the Excel file
                    const worksheet = XLSX.utils.aoa_to_sheet(values);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          
                    // Convert the workbook to a buffer
                    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
          
                    // Set the appropriate headers for the response
                    res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
                    res.setHeader('Content-Length', buffer.length);
          
                    // Send the buffer as the response
                    res.send(buffer);
               
              } catch (error) {
                console.error('Failed to fetch data from MongoDB:', error);
                res.status(500).send('Failed to fetch data from MongoDB');
              }

      // res.json({
      //   data: mergedData,
      //   currentPage: parseInt(page),
      //   totalPages,
      //   totalResults
      // });
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/downloadDetails', async (req, res) => {
  const { data_nameofcrp, page = 1, limit = 15 } = req.query;

  try {
    const dataQuery = { data_nameofcrp: data_nameofcrp };

    const totalResults = await Data.countDocuments(dataQuery);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(dataQuery)
      .select('data_district data_Block data_Panchayath data_ward data_Name data_Address data_Phonenumber data_Class data_Class2 data_Class3 data_familyincome data_NameofNG data_NameofNGmember data_roleinNG data_houseownership data_landdetails_landarea data_landdetails_agricultureland data_Animalhusbendary_businesstype data_Animalhusbendary_others0 data_Animalhusbendary_cdsregistration data_Animalhusbendary_regdetails_regnumber data_Animalhusbendary_regdetails_cdsunitname data_enterpisetype data_noofgroupmembers data_Yearofstartingagriculture data_yearofstartingbussiness data_amountinvested data_Sourceofinvestment data_supportrecived data_loan data_loandetails_totalinvestment data_loandetails_DateofLoanApplication data_businessidea data_Infra_Infrastructure data_Infra_Shed data_Infr_wastage data_Infra_biogas data_Infra_equipments data_Infra_others data_support data_others2 data_MGNREGAsupport data_landdetails1_landforgrass data_landdetails1_qtyofownland data_landdetails1_qtyofleasedland data_landdetails2_siteforworkshed data_landdetails2_qtyofownland data_others4 data_Trainingsrequired data_others3 data_comments data_nameofcrp data_Nameofrespondent data_dateofsurvey data_Starttime KEY')
      .skip(startIndex)
      .limit(limit);

    // Check if there is data to process
    if (searchData.length !== 0) {
      try {
        var tempList = [];
        for (var i = 0; i < searchData.length; i++) {
          try {
            var obj = new Object();
            obj.District = searchData[i].data_district;
            obj.Block = searchData[i].data_Block;
            obj.Panchayath = searchData[i].data_Panchayath;
            // Add the rest of the properties in a similar manner
            // ...
            obj.data_ward= mergedData[i].data_ward
            obj.Name = mergedData[i].data_Name
            obj.data_Address = mergedData[i].data_Address
            obj.Phonenumber =mergedData[i].data_Phonenumber
            obj.data_Class = mergedData[i].data_Class
            obj.data_Class2 = mergedData[i].data_Class2
            obj.data_Class3 = mergedData[i].data_Class3
            obj.data_familyincome = mergedData[i].data_familyincome
            obj.Name_of_NHG = mergedData[i].data_NameofNG
            obj.data_NameofNGmember = mergedData[i].data_NameofNGmember
            obj.data_roleinNG =mergedData[i].data_roleinNG
            obj.data_houseownership=  mergedData[i].data_houseOwnership,
            obj.data_landdetails_landarea=  mergedData[i].data_landdetails_landarea,
            obj.data_landdetails_agricultureland=  mergedData[i].data_landdetails_agricultureland,
            obj.data_Animalhusbendary_businesstype=  mergedData[i].data_Animalhusbendary_businesstype,
            obj.data_Animalhusbendary_others0=  mergedData[i].data_Animalhusbendary_others0,
            obj.data_Animalhusbendary_cdsregistration=  mergedData[i].data_Animalhusbendary_cdsregistration,
            obj.data_Animalhusbendary_regdetails_regnumber=  mergedData[i].data_Animalhusbendary_regdetails_regnumber,
            obj.data_Animalhusbendary_regdetails_cdsunitname=  mergedData[i].data_Animalhusbendary_regdetails_cdsunitname,
            obj.data_enterpisetype=  mergedData[i].data_enterpisetype,
            obj.data_noofgroupmembers=  mergedData[i].data_noofgroupmembers,
            obj.data_Yearofstartingagriculture=  mergedData[i].data_Yearofstartingagriculture,
            obj.data_yearofstartingbussiness=  mergedData[i].data_yearofstartingbussiness,
            obj.data_amountinvested=  mergedData[i].data_amountinvested,
            obj.data_Sourceofinvestment=  mergedData[i].data_Sourceofinvestment,
            obj.data_supportrecived=  mergedData[i].data_supportrecived,
            obj.data_loan=  mergedData[i].data_loan,
            obj.data_loandetails_totalinvestment=  mergedData[i].data_loandetails_totalinvestment,
            obj.data_loandetails_DateofLoanApplication=  mergedData[i].data_loandetails_DateofLoanApplication,
            obj.data_businessidea= mergedData[i].data_businessidea,
            obj.data_Infra_Infrastructure= mergedData[i].data_Infra_Infrastructure,
            obj.data_Infra_Shed=  mergedData[i].data_Infra_Shed,
            obj.data_Infr_wastage=  mergedData[i].data_Infr_wastage,
            obj.data_Infra_biogas=  mergedData[i].data_Infra_biogas,
            obj.data_Infra_equipments=  mergedData[i].data_Infra_equipments,
            obj.data_Infra_others=  mergedData[i].data_Infra_others,
            obj.data_support=  mergedData[i].data_support,
            obj.data_others2=  mergedData[i].data_others2,
            obj.data_MGNREGAsupport=  mergedData[i].data_MGNREGAsupport,
            obj.data_landdetails1_landforgrass=  mergedData[i].data_landdetails1_landforgrass,
            obj.data_landdetails1_qtyofownland=  mergedData[i].data_landdetails1_qtyofownland,
            obj.data_landdetails1_qtyofleasedland=  mergedData[i].data_landdetails1_qtyofleasedland,
            obj.data_landdetails2_siteforworkshed=  mergedData[i].data_landdetails2_siteforworkshed,
            obj.data_landdetails2_qtyofownland=  mergedData[i].data_landdetails2_qtyofownland,
            obj.data_others4=  mergedData[i].data_others4,
            obj.data_Trainingsrequired=  mergedData[i].data_Trainingsrequired,
            obj.data_others3=  mergedData[i].data_others3,
            obj.data_comments=  mergedData[i].data_comments,
            obj.data_nameofcrp=  mergedData[i].data_nameofcrp,
            obj.data_Nameofrespondent=  mergedData[i].data_Nameofrespondent,
            obj.data_dateofsurvey=  mergedData[i].data_dateofsurvey,
            obj.data_Starttime=  mergedData[i].data_Starttime, 

            tempList.push(obj);
          } catch (e) {
            console.log("error");
          }
        }

        // Prepare headers for the Excel file
        const headers = Object.keys(tempList[0]);

        // Prepare values for the Excel file
        const values = [headers, ...tempList.map(obj => Object.values(obj))];

        // Generate the Excel file
        const worksheet = XLSX.utils.aoa_to_sheet(values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Convert the workbook to a buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set the appropriate headers for the response
        res.setHeader('Content-Disposition', 'attachment; filename="example.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8');
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as the response
        res.send(buffer);
      } catch (error) {
        console.error('Failed to fetch data from MongoDB:', error);
        res.status(500).send('Failed to fetch data from MongoDB');
      }
    } else {
      res.status(404).json({ message: 'No data found for the provided panchayath' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
  

  
  

