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
//const SearchReport =require('../model/searchReport');
const purchaseofrowmaterials = require('../model/purchaseofrowmaterials');
const searchreport = require('../model/searchReport');


router.get('/listpurchaserawmaterials', async (req, res) => {
  try {
    const purchaseData = await searchreport.distinct('data_purchaseofrawmaterials_itemtype', { data_purchaseofrawmaterials_itemtype: { $ne: null } }).exec();
    res.json(purchaseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/listpurchaserawmaterials/sublist', async (req, res) => {
  try {
    const { data_purchaseofrawmaterials_itemtype } = req.query;

    if (data_purchaseofrawmaterials_itemtype === 'PULLETS') {
      const pulletsList = await searchreport.distinct('pulletsList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        pulletsList: { $ne: null }
      }).exec();
      res.json(pulletsList);
    } else if (data_purchaseofrawmaterials_itemtype === 'MANURE') {
      const manureType = await searchreport.distinct('manureType', {
        data_purchaseofrawmaterials_itemtype: { $ne: null } ,
        manureType: { $ne: null }
      }).exec();
      res.json(manureType);
    } else if (data_purchaseofrawmaterials_itemtype === 'FODDER SLIPS') {
      const fodderSlipsList = await searchreport.distinct('fodderSlipsList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        fodderSlipsList: { $ne: null }
      }).exec();
      res.json(fodderSlipsList);
    } else if (data_purchaseofrawmaterials_itemtype === 'CALVES') {
      const CALVESList = await searchreport.distinct('CALVESList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        CALVESList: { $ne: null }
      }).exec();
      res.json(CALVESList);
    } else if (data_purchaseofrawmaterials_itemtype === 'HEIPERS') {
      const HEIPERSList = await searchreport.distinct('HEIPERSList', {
        data_purchaseofrawmaterials_itemtype: { $ne: null } ,
        HEIPERSList: { $ne: null }
      }).exec();
      res.json(HEIPERSList);
    } else if (data_purchaseofrawmaterials_itemtype === 'COWS') {
      const COWSList = await searchreport.distinct('COWSList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        COWSList: { $ne: null }
      }).exec();
      res.json(COWSList);
    } else if (data_purchaseofrawmaterials_itemtype === 'CATTLE FEED') {
      const CATTLEFEEDList = await searchreport.distinct('CATTLEFEEDList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        CATTLEFEEDList: { $ne: null }
      }).exec();
      res.json(CATTLEFEEDList);
    } else if (data_purchaseofrawmaterials_itemtype === 'MILK REPLACER') {
      const MILKREPLACERDList = await searchreport.distinct('MILKREPLACERDList', {
        data_purchaseofrawmaterials_itemtype:  { $ne: null } ,
        MILKREPLACERDList: { $ne: null }
      }).exec();
      res.json(MILKREPLACERDList);
    } else if (data_purchaseofrawmaterials_itemtype === 'ENERGY RICH FEED') {
      const ENERGYRICHFEEDList = await searchreport.distinct('ENERGYRICHFEEDList', {
        data_purchaseofrawmaterials_itemtype: { $ne: null } ,
        ENERGYRICHFEEDList: { $ne: null }
      }).exec();
      res.json(ENERGYRICHFEEDList);
    } else {
      res.status(400).json({ error: 'Invalid data_purchaseofrawmaterials_itemtype' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/Sales-salesmethod', async (req, res) => {
  try {
    const salesmethod = await searchreport.distinct('data_Sales_salesmethod', { data_Sales_salesmethod: { $ne: null } }).exec();
    res.json(salesmethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/Sales', async (req, res) => {
  try {
    const sales = await searchreport.distinct('data_Sales_prdct2', { data_Sales_prdct2: { $ne: null } }).exec();
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/data-support', async (req, res) => {
  console.log("..........data support ...................");
  try {
    const datasupport = await searchreport.distinct('data_support', {data_support: { $ne: null } }).exec();
    res.json(datasupport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/training-required', async (req, res) => {
  console.log("..........data support ...................");
  try {
    const datasupport = await searchreport.distinct('data_Trainingsrequired', {data_Trainingsrequired: { $ne: null } }).exec();
    res.json(datasupport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/MGNREGAsupport', async (req, res) => {
  try {
    const MGNREGAsupport = await searchreport.distinct('data_MGNREGAsupport', {data_MGNREGAsupport: { $ne: null } }).exec();
    res.json(MGNREGAsupport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/livelihood_list', async (req, res) => {
  try {
    const Livelihood_data = await searchreport.distinct('data_livelihood_incomesource', {data_livelihood_incomesource: { $ne: null } }).exec();
    res.json(Livelihood_data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/livelihood_list/sublist', async (req, res) => {
  try {
    const { data_livelihood_incomesource } = req.query;

    if (data_livelihood_incomesource === 'CALF') {
      const livelihood_calf_list = await searchreport.distinct('livelihood_calf_list', {
        data_livelihood_incomesource:  { $ne: null } ,
        livelihood_calf_list: { $ne: null }
      }).exec();
      res.json(livelihood_calf_list);
    } else if (data_livelihood_incomesource === 'COW') {
      const livelihood_cows_list = await searchreport.distinct('livelihood_cows_list', {
        data_livelihood_incomesource: { $ne: null } ,
        livelihood_cows_list: { $ne: null }
      }).exec();
      res.json(livelihood_cows_list);
    } else if (data_livelihood_incomesource === 'GOAT') {
      const livelihood_goat_list = await searchreport.distinct('livelihood_goat_list', {
        data_livelihood_incomesource:  { $ne: null } ,
        livelihood_goat_list: { $ne: null }
      }).exec();
      res.json(livelihood_goat_list);
    }
    else if (data_livelihood_incomesource === 'POULTRY') {
      const livelihood_poultry_list = await searchreport.distinct('livelihood_poultry_list', {
        data_livelihood_incomesource:  { $ne: null } ,
        livelihood_poultry_list: { $ne: null }
      }).exec();
      res.json(livelihood_poultry_list);
    }
    else if (data_livelihood_incomesource === 'MANURE') {
      const livelihood_manure_list = await searchreport.distinct('livelihood_manure_list', {
        data_livelihood_incomesource:  { $ne: null } ,
        livelihood_manure_list: { $ne: null }
      }).exec();
      res.json(livelihood_manure_list);
    }
    else if (data_livelihood_incomesource === 'FODDER') {
      const livelihood_fodder_list = await searchreport.distinct('livelihood_fodder_list', {
        data_livelihood_incomesource:  { $ne: null } ,
        livelihood_fodder_list: { $ne: null }
      }).exec();
      res.json(livelihood_fodder_list);
    }else {
      res.status(400).json({ error: 'Invalid data_purchaseofrawmaterials_itemtype' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/class2', async (req, res) => {
  const { data_District, data_Block, data_Panchayath, data_Class2, page = 1, limit = 15 } = req.query;

  try {
    const classValues = data_Class2.split(',');

    let query = {};

    if (data_District) {
      query.data_district = data_District;
    }

    if (data_Block) {
      query.data_Block = data_Block;
    }

    if (data_Panchayath) {
      query.data_Panchayath = data_Panchayath;
    }

    if (data_Class2) {
      query.data_Class2 = { $in: classValues };
    }

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG data_Class2')
      .skip(startIndex)
      .limit(limit);

    res.json({
      totalPages,
      currentPage: page,
      totalResults,
      searchData
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/class1', async (req, res) => {
  console.log("...................enter.....................");
  const { data_District, data_Block, data_Panchayath, data_Class, page = 1, limit = 15 } = req.query;

  try {
    const classValues = data_Class.split(',');
    let query = {};

    if (data_District) {
      query.data_district = data_District;
    }

    if (data_Block) {
      query.data_Block = data_Block;
    }

    if (data_Panchayath) {
      query.data_Panchayath = data_Panchayath;
    }

    if (data_Class) {
      query.data_Class = { $in: classValues };
    }

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG data_Class')
      .skip(startIndex)
      .limit(limit);

    res.json({
      totalPages,
      currentPage: page,
      totalResults,
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/class3', async (req, res) => {
  const { data_District, data_Block, data_Panchayath, data_Class3, page = 1, limit = 50 } = req.query;

  try {
    const classValues = data_Class3?.split(',') || [];

    const query = {};

    if (data_District) {
      query.data_district = data_District;
    }

    if (data_Block) {
      query.data_Block = data_Block;
    }

    if (data_Panchayath) {
      query.data_Panchayath = data_Panchayath;
    }

    if (data_Class3) {
      query.data_Class3 = { $in: classValues };
    }

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG data_Class3')
      .skip(startIndex)
      .limit(limit);

    console.log(searchData);

    res.json({
      totalPages,
      currentPage: page,
      totalResults,
      searchData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

    router.get('/detailsofAnimalHusbandryBusiness', async (req, res) => {
      const { data_District, data_Block, data_Panchayath, selectedBusinessType, page = 1, limit = 20 } = req.query;
     // console.log(selectedPanchayath, selectedBusinessType);
    
      try {
        const businessTypeOptions = selectedBusinessType?.split(',') || [];
    
        const query = {};
          
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
    
        if (selectedBusinessType) {
          query.data_Animalhusbendary_businesstype = { $in: businessTypeOptions };
        }
    
        const totalResults = await Data.countDocuments(query);
        const totalPages = Math.ceil(totalResults / limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const details = await Data.find(query)
          .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG data_Animalhusbendary_businesstype')
          .skip(startIndex)
          .limit(limit);
          console.log(details);
    
        res.json({
          totalPages,
          currentPage: page,
          totalResults,
          details
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    router.get('/landdetails',async (req, res) => {
      const {data_District, data_Block, data_Panchayath, page = 1, limit = 10 } = req.query;
    
      try {
        const query = {};
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
    
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
            .select('data_district data_Block data_Panchayath data_Name data_Phonenumber data_NameofNG data_landdetails_landarea data_landdetails_agricultureland')
            .skip(startIndex)
            .limit(limit),
          Data.aggregate(pipeline)
        ]);
        res.json({
          totalPages,
          currentPage: page,
          totalResults,
          details
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    // router.get('/productDetails', async (req, res) => {
    //   const { panchayath, products_Name, page = 1, limit = 15 } = req.query;
    
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
    
    //     const productQuery = {
    //       PARENT_KEY: { $in: parentKeys },
    //       data_products_prdct: products_Name
    //     };
    
    //     const productData = await Products.find(productQuery)
    //       .select('data_products_prdct data_products_quantum data_products_price2 PARENT_KEY')
    //       .exec();
    
    //     const mergedData = searchData.map((data) => {
    //       const matchedProduct = productData.find((product) => product.PARENT_KEY === data.KEY);
    
    //       if (matchedProduct) {
    //         const {
    //           data_products_prdct,
    //           data_products_quantum,
    //           data_products_price2
    //         } = matchedProduct;
    
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
    //         };
    //       }
          
    //       return null;
    //     });
    
    //     const filteredData = mergedData.filter((data) => data !== null); // Filter out null values
    
    //     res.json({
    //       totalPages,
    //       currentPage: page,
    //       totalResults,
    //       mergedData: filteredData
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: 'Internal server error' });
    //   }
    // });
    
    router.get('/TrainingsRequired', async (req, res) => {
      const { data_District, data_Block, data_Panchayath, data_Trainingsrequired, page = 1, limit = 15 } = req.query;
      //console.log(data_Panchayath, data_Trainingsrequired);
    
      try {
        const classValues = data_Trainingsrequired?.split(',') || [];
    
        if (classValues.length === 0) {
          res.status(400).json({ error: 'data_Trainingsrequired parameter cannot be empty' });
          return;
        }
    
        const query = {};
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
    
        if (data_Trainingsrequired) {
          query.data_Trainingsrequired = { $in: classValues };
        }
       // console.log(query);
    
        const totalResults = await Data.countDocuments(query);
        const totalPages = Math.ceil(totalResults / limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const searchData = await Data.find(query)
          .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_Trainingsrequired')
          .skip(startIndex)
          .limit(limit);
        console.log(searchData);
    
        res.json({
          totalPages,
          currentPage: page,
          totalResults,
          searchData
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    router.get('/detailsofMGNREGASupport', async (req, res) => {
      const { data_District, data_Block, data_Panchayath, MGNREGA_Support, page = 1, limit = 20 } = req.query;
      //console.log(selectedPanchayath, MGNREGA_Support);
    
      try {
        const MGNREGA_SupportTypeOptions = MGNREGA_Support?.split(',') || [];
    
        if (MGNREGA_SupportTypeOptions.length === 0) {
          res.status(400).json({ error: 'MGNREGA_Support parameter cannot be empty' });
          return;
        }
    
        const query = {}
         
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
        
    if (MGNREGA_Support) {
      query.data_MGNREGAsupport = { $in: MGNREGA_SupportTypeOptions };
    }
    
        const totalResults = await Data.countDocuments(query);
        const totalPages = Math.ceil(totalResults / limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const details = await Data.find(query)
          .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_MGNREGAsupport')
          .skip(startIndex)
          .limit(limit);
    
        console.log(details);
    
        res.json({
          totalPages,
          currentPage: page,
          totalResults,
          details
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    router.get('/salesReport', async (req, res) => {
      const { data_District, data_Block, data_Panchayath, products_Name } = req.query;
    
      try {
        const query = {};
    
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
    
        // Ensure that products_Name is an array of product names
        const productNamesArray = products_Name?.split(',') || [];
        if (productNamesArray.length === 0) {
          res.status(400).json({ error: 'products_Name parameter cannot be empty' });
          return;
        }
    
        // Fetch data from the Data collection based on the provided panchayath
        const searchData = await Data.find(query)
          .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
          .exec();
    
        // Extract the parentKeys from the searchData
        const parentKeys = searchData.map((data) => data.KEY);
    
        // Build the query for fetching purchase data from the Sales collection
        const purchaseQuery = {
          PARENT_KEY: { $in: parentKeys },
          data_Sales_prdct2: { $in: productNamesArray } // Use the productNamesArray for the query
        };
    
        // Fetch purchase data from the Sales collection based on the query
        const purchaseData = await Sales.find(purchaseQuery)
          .select('data_Sales_prdct2 PARENT_KEY MILK_qnty MEAT_qnty EGG_qnty Sales_MANURE_qnty FEED_qnty male_buffalo_calf_qnty Gras_fooder_qnty tree_fooder_qnty kid_qnty day_old_chick_qnty pullets_qnty calf_qnty beifer_qnty')
          .exec();
    
        // Merge the fetched data from Data and Sales collections
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
    
              // Select the quantity field based on the product name
              let quantity;
              switch (data_Sales_prdct2) {
                case 'MILK':
                  quantity = MILK_qnty;
                  break;
                case 'MEAT':
                  quantity = MEAT_qnty;
                  break;
                case 'EGG':
                  quantity = EGG_qnty;
                  break;
                case 'MANURE':
                  quantity = Sales_MANURE_qnty;
                  break;
                case 'FEED':
                  quantity = FEED_qnty;
                  break;
                case 'GRASS FOODER':
                  quantity = Gras_fooder_qnty;
                  break;
                case 'KID':
                  quantity = kid_qnty;
                  break;
                case 'DAY OLD CHICK':
                  quantity = day_old_chick_qnty;
                  break;
                case 'BEIFER':
                  quantity = beifer_qnty;
                  break;
                case 'MALE BUFFALO':
                  quantity = male_buffalo_calf_qnty;
                  break;
                case 'TREE FOODER':
                  quantity = tree_fooder_qnty;
                  break;
                case 'PULLET':
                  quantity = pullets_qnty;
                  break;
                case 'CALF':
                  quantity = calf_qnty;
                  break;
                default:
                  quantity = 0;
              }
    
              return {
                data_district: data.data_district,
                data_Block: data.data_Block,
                data_Panchayath: data.data_Panchayath,
                data_Name: data.data_Name,
                data_Phonenumber: data.data_Phonenumber,
                data_Ward: data.data_Ward,
                data_NameofNG: data.data_NameofNG,
                //KEY: data.KEY,
                data_Sales_prdct2: data_Sales_prdct2, // Use the individual product name, not products_Name
               // PARENT_KEY,
                quantity,
              };
            });
            return mergedItems;
          } else {
            return null;
          }
        }).filter((data) => data !== null);
    
        res.json({
          salesReport: mergedData,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    router.get('/livelihoodReport', async (req, res) => {
      const {data_District, data_Block, data_Panchayath, itemtype, subList, page = 1, limit = 15 } = req.query;
    
      try {
        const query = {};
    
        if (data_District) {
          query.data_district = data_District;
        }
    
        if (data_Block) {
          query.data_Block = data_Block;
        }
    
        if (data_Panchayath) {
          query.data_Panchayath = data_Panchayath;
        }
    
        // const totalResults = await Data.countDocuments(query);
        // const totalPages = Math.ceil(totalResults / limit);
    
        // const startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
    
        const searchData = await Data.find(query)
          .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
           .exec();
          // .skip(startIndex)
          // .limit(limit);
    console.log("searchData",searchData)
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
                  const reportObject = {
                    data_district: data.data_district,
                    data_Block: data.data_Block,
                    data_Panchayath: data.data_Panchayath,
                    data_Name: data.data_Name,
                    data_Ward: data.data_Ward,
                    data_Phonenumber: data.data_Phonenumber,
                    data_NameofNG: data.data_NameofNG,
                    KEY: data.KEY,
        
                    data_livelihood_incomesource: itemtype,
                  };
                    if(itemtype.includes('COW')){
                      reportObject.livelihood_cows_list = subList,
                      reportObject.livelihood_cows_HF_qnty = livelihood_cows_HF_qnty,
                      reportObject.livelihood_cows_JERSEY_qnty = livelihood_cows_JERSEY_qnty,
                      reportObject.livelihood_cows_INDIGENOUS_qnty = livelihood_cows_INDIGENOUS_qnty
                    }
                    if(itemtype.includes('CALF')){
                      reportObject.livelihood_calf_list = subList,
                      reportObject.livelihood_calf_FEMALE_qnty =livelihood_calf_FEMALE_qnty ,
                      reportObject.livelihood_calf_MALE_qnty = livelihood_calf_MALE_qnty
                    }
                    if(itemtype.includes('GOAT')){
                      reportObject.livelihood_goat_list = subList,
                      reportObject.livelihood_goat_MALABARI_qnty=livelihood_goat_MALABARI_qnty,
                      reportObject.livelihood_goat_MALABARI_KID_qnty = livelihood_goat_MALABARI_KID_qnty,
                      reportObject.livelihood_goat_ATTAPADI_BLACK_qnty = livelihood_goat_ATTAPADI_BLACK_qnty,
                      reportObject.livelihood_goat_ATTAPADI_BLACK_KID_qnty = livelihood_goat_ATTAPADI_BLACK_KID_qnty ,
                      reportObject.livelihood_goat_OTHERS_qnty = livelihood_goat_OTHERS_qnty
                    }
                    if(itemtype.includes('POULTRY')){

                      reportObject.livelihood_poultry_list = subList,
                      reportObject.livelihood_poultry_EGG_PRODUCTION_qnty = livelihood_poultry_EGG_PRODUCTION_qnty,
                      reportObject.livelihood_poultry_MARKETING_qnty = livelihood_poultry_MARKETING_qnty
                    }
                    if(itemtype.includes('MANURE')){
                    reportObject.livelihood_manure_list = subList,
                    reportObject.livelihood_manure_DRY_qnty = livelihood_manure_DRY_qnty,
                    reportObject.livelihood_manure_FRESH_qnty = livelihood_manure_FRESH_qnty
                   // livelihood_POULTRY_MANURE_qnty
                    }
                    return reportObject;
                  }
    
                 else {
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
                  const reportObject = {
                    data_district: data.data_district,
                    data_Block: data.data_Block,
                    data_Panchayath: data.data_Panchayath,
                    data_Name: data.data_Name,
                    data_Ward: data.data_Ward,
                    data_Phonenumber: data.data_Phonenumber,
                    data_NameofNG: data.data_NameofNG,
                    KEY: data.KEY,
                    data_livelihood_incomesource: itemtype,
                  }
                  if(itemtype.includes('BUFFALO')){
                    reportObject.livelihood_BUFFALO_qnty = livelihood_BUFFALO_qnty
                  }
                  if(itemtype.includes('DUCK')){
                    reportObject.livelihood_DUCK_qntyc= livelihood_DUCK_qnty
                  }
                  if(itemtype == 'POULTRY MANURE'){
                    reportObject.livelihood_POULTRY_MANURE_qnty = livelihood_POULTRY_MANURE_qnty
                  }
                  return reportObject;
                
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
        
        res.json({
          salesReport: mergedData,
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
  });
    
  router.get('/purchaseReport',async (req, res) => {
    const { data_District, data_Block, data_Panchayath, itemtype, page = 1, limit = 15 } = req.query;
  
    try {
      const query = {};
    
      if (data_District) {
        query.data_district = data_District;
      }
  
      if (data_Block) {
        query.data_Block = data_Block;
      }
  
      if (data_Panchayath) {
        query.data_Panchayath = data_Panchayath;
      }
  
      // const totalResults = await Data.countDocuments(query);
      // const totalPages = Math.ceil(totalResults / limit);
  
      // const startIndex = (page - 1) * limit;
      // const endIndex = page * limit;
  
      const searchData = await Data.find(query)
        .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG KEY')
        //.skip(startIndex)
       // .limit(limit);
       .exec();
  
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
                const reportObject = {
                  data_district: data.data_district,
                  data_Block: data.data_Block,
                  data_Panchayath: data.data_Panchayath,
                  data_Name: data.data_Name,
                  data_Ward: data.data_Ward,
                  data_Phonenumber: data.data_Phonenumber,
                  data_NameofNG: data.data_NameofNG,
                  KEY: data.KEY,
                  data_purchaseofrawmaterials_itemtype: itemtype,
                };
                if(itemtype.includes('PULLETS')){
                  reportObject.PULLETS_List = subList,
                  reportObject.BV380_qnty = BV380_qnty,
                  reportObject.GRAMALAKSHMI_qnty = GRAMALAKSHMI_qnty,
                  reportObject.OTHER = OTHER,
                  reportObject.OTHER_qnty = OTHER_qnty,
                  reportObject.GRAMAPRIYA_qnty = GRAMAPRIYA_qnty
                }
                if(itemtype.includes('MANURE')){
                  reportObject.MANURE_List = subList,
                  reportObject.COW_DUNG_qnty = COW_DUNG_qnty,
                  reportObject.GOAT_MANURE_qnty = GOAT_MANURE_qnty,
                  reportObject.POULTRY_MANURE_qnty = POULTRY_MANURE_qnty,
                  reportObject.VERMY_COMPOST_qnty = VERMY_COMPOST_qnty
                }
                if(itemtype.includes('FODDER SLIPS')){
                  reportObject.FODDER_SLIPS_List = subList,
                  reportObject.NAPIER_qnty = NAPIER_qnty, 
                  reportObject.CO4_qnty = CO4_qnty,
                  reportObject.CO5_qnty = CO5_qnty,
                  reportObject.RED_NAPIER_qnty = RED_NAPIER_qnty,
                  reportObject.SUPER_NAPIER_qnty = SUPER_NAPIER_qnty,
                  reportObject.GUINEA_GRASS_qnty = GUINEA_GRASS_qnty,
                  reportObject.PARA_GRASS_qnty = PARA_GRASS_qnty,
                  reportObject.CONGO_SIGNAL_qnty = CONGO_SIGNAL_qnty
                }
                if(itemtype.includes('CALVES')){
                  reportObject.CALVES_List = subList,
                  reportObject.CALVES_HF_qnty = CALVES_HF_qnty,
                  reportObject.CALVES_GERSEY_qnty = CALVES_GERSEY_qnty
                }
                if(itemtype.includes('HEIFERS')){
                  reportObject.HEIPERS_List = subList,
                  reportObject.HEIPERS_HF_qnty = HEIPERS_HF_qnty,
                  reportObject.HEIPERS_GERSEY_qnty = HEIPERS_GERSEY_qnty
                }
                if(itemtype.includes('COWS')){
                  reportObject.COWS_List = subList,
                  reportObject.COWS_HF_qnty = COWS_HF_qnty,
                  reportObject.COWS_GERSEY_qnty = COWS_GERSEY_qnty
                }
                //CATTLE_FEED_List : subList,
                //CATTLE_FEED_qnty
                return reportObject;
                
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
        res.json({
          salesReport: mergedData,
        });
      }
      else if(itemtype.includes('CATTLE FEED')) {
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
        res.json({
              salesReport: mergedData,
            });
  
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
        res.json({
          salesReport: mergedData,
        });
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
        res.json({
          salesReport: mergedData,
        });
      }
      else if(itemtype.includes("BYPASS FAT") ||itemtype.includes("TMR")|| itemtype.includes("BYPASS PROTIN") || itemtype.includes("CAFF STARTER") || itemtype.includes("CHEMICAL FERTILIZERS") || itemtype.includes("EGG TRAYS") || itemtype.includes("FODDER SEEDS") || itemtype.includes("GOAT FEED") || itemtype.includes("GRASS FOODER") || itemtype.includes("GROWER") || itemtype.includes("HAY") || itemtype.includes("INGREDIENTS FOR CTTLE FEED") || itemtype.includes("INGREDIENTS FOR POULTRY FEED") || itemtype.includes("KID STARTER") || itemtype.includes("LAYER") || itemtype.includes("MALABARI GOAT-KIDS") || itemtype.includes("MALABARI GOATS") || itemtype.includes("MALE BUFFALO") ||  itemtype.includes("MATERIAL FOR POULTRY CAGE FABRICATION") ||  itemtype.includes("POULTRY FEED") ||  itemtype.includes("SILAGE") ||  itemtype.includes("TOTAL MIXED RATION") ||  itemtype.includes("TREE FOODER") ||  itemtype.includes("UREA MOLASS BLOCK") ||  itemtype.includes("UREA TREATED STRAW")) 
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
          console.log("..........purchaseData",purchaseData)
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
                               //UREA_TREATED_STRAW_qnty,
                               GOAT_FEEDqnty,
                               KID_STARTER_qnty,
                               GROWER_qnty,
                              Total_mixed_ration_qnty,
                              CAFF_STARTER_qnty
                             }= matchedPurchase;
                              if(itemtype.includes("BYPASS FAT") || itemtype.includes("BYPASS PROTIN") || itemtype.includes("CAFF STARTER") || itemtype.includes("CHEMICAL FERTILIZERS") || itemtype.includes("EGG TRAYS") || itemtype.includes("FODDER SEEDS") || itemtype.includes("GOAT FEED") || itemtype.includes("GRASS FOODER") || itemtype.includes("GROWER") || itemtype.includes("HAY") || itemtype.includes("INGREDIENTS FOR CTTLE FEED") || itemtype.includes("INGREDIENTS FOR POULTRY FEED") || itemtype.includes("KID STARTER")||itemtype.includes("TMR") || itemtype.includes("LAYER") || itemtype.includes("MALABARI GOAT-KIDS") || itemtype.includes("MALABARI GOATS") || itemtype.includes("MALE BUFFALO") ||  itemtype.includes("MATERIAL FOR POULTRY CAGE FABRICATION") ||  itemtype.includes("POULTRY FEED") ||  itemtype.includes("SILAGE") ||  itemtype.includes("TOTAL MIXED RATION") ||  itemtype.includes("TREE FOODER") ||  itemtype.includes("UREA MOLASS BLOCK") ||  itemtype.includes("UREA TREATED STRAW")) {
                                const reportObject = {
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
                              };
                              if(itemtype.includes("MALE BUFFALO")){
                                reportObject.MALE_BUFFALO_CALVES_qnty = MALE_BUFFALO_CALVES_qnty
                              }
                              if( itemtype.includes("INGREDIENTS FOR POULTRY FEED")){
                                reportObject.INGREDIENTS_FOR_POULTRY_FEED_qnty = INGREDIENTS_FOR_POULTRY_FEED_qnty 
                              }
                              if(itemtype.includes("INGREDIENTS FOR CTTLE FEED")){
                                reportObject.INGREDIENTS_FOR_CTTLE_FEED_qnty = INGREDIENTS_FOR_CTTLE_FEED_qnty
                              }
                              if(itemtype.includes("CHEMICAL FERTILIZERS")){
                                reportObject.CHEMICAL_FERTILIZERS_qnty = CHEMICAL_FERTILIZERS_qnty
                              }
                              if(itemtype.includes("FODDER SEEDS")){
                                reportObject.FODDER_SEEDS_qnty = FODDER_SEEDS_qnty
                              }
                              if(itemtype.includes("GRASS FOODER")){
                                reportObject.Grass_fooder_qnty = Grass_fooder_qnty
                              }
                              if (itemtype.includes('TREE FOODER')) {
                                reportObject.Tree_fooder_qnty = Tree_fooder_qnty
                              }
                              if(itemtype.includes("MALABARI GOAT-KIDS")){
                                reportObject.MALABARI_GOAT_KIDS_qnty = MALABARI_GOAT_KIDS_qnty
                              }
                              if(itemtype.includes("MATERIAL FOR POULTRY CAGE FABRICATION")){
                                reportObject.MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty= MATERIAL_FOR_POULTRY_CAGE_FABRICATION_qnty
                              }
                              if(itemtype.includes("UREA TREATED STRAW")){

                                reportObject.Urea_treated_Straw_qnty = Urea_treated_Straw_qnty
                              }
                              if(itemtype.includes("UREA MOLASS BLOCK")){
                                reportObject.urea_molass_block_qnty = urea_molass_block_qnty
                              }
                              if( itemtype.includes("MALABARI GOATS")){
                                reportObject.MALABARI_GOATS_qnty = MALABARI_GOATS_qnty
                              }
                              //MATERIAL_FOR_POULTRY_qnty
                              if(itemtype.includes("EGG TRAYS")){
                                reportObject.EGG_TRAYS_qnty = EGG_TRAYS_qnty
                              }
                              if(itemtype.includes("POULTRY FEED")){
                                reportObject.POULTRY_FEED_qnty = POULTRY_FEED_qnty
                              }
                              if(itemtype.includes("LAYER")){
                                reportObject.LAYER_List = LAYER_List
                              }
                              if (itemtype.includes("BYPASS PROTIN")){
                                reportObject.BY_PASS_PROTEIN_qnty = BY_PASS_PROTEIN_qnty
                              }
                              if (itemtype.includes("BYPASS FAT")){
                                reportObject.BY_PASS_FAT_qnty = BY_PASS_FAT_qnty
                              }
                              if(itemtype.includes("TMR")){
                                reportObject.TMR_qnty = TMR_qnty
                              }
                              if (itemtype.includes('SILAGE')) {
                                reportObject.SILAGE_qnty = SILAGE_qnty
                            }
                              if(itemtype.includes("HAY")){
                                reportObject.HAY_qnty = HAY_qnty
                              }
                            //  UREA_TREATED_STRAW_qnty
                              if(itemtype.includes("GOAT FEED")){
                                reportObject.GOAT_FEEDqnty = GOAT_FEEDqnty
                              }
                              if(itemtype.includes("KID STARTER")){
                                reportObject.KID_STARTER_qnty = KID_STARTER_qnty
                              }
                              if(itemtype.includes("GROWER")){
                                reportObject.GROWER_qnty = GROWER_qnty
                              }
                              if (itemtype.includes('TOTAL MIXED RATION')) {
                                reportObject.Total_mixed_ration_qnty = Total_mixed_ration_qnty
                              }
                              if(itemtype.includes("CAFF STARTER")){
                                reportObject.CAFF_STARTER_qnty = CAFF_STARTER_qnty
                              }
                              return reportObject;
                                   
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
                            
                            res.json({
                              salesReport: mergedData,
                            });
                          }
                    
                          } catch (error) {
                            console.error(error);
                            res.status(500).json({ message: 'Internal server error' });
                          }
                      });
router.get('/dataSupport',async (req, res) => {
  const { data_District, data_Block, data_Panchayath, data_supportrecived, page = 1, limit = 15 } = req.query;
  //console.log(data_Panchayath, data_Trainingsrequired);

  try {
    const classValues = data_supportrecived.split(',');

    if (classValues.length === 0) {
      res.status(400).json({ error: 'data support parameter cannot be empty' });
      return;
    }
    const query = {};
    if (data_District) {
      query.data_district = data_District;
    }

    if (data_Block) {
      query.data_Block = data_Block;
    }

    if (data_Panchayath) {
      query.data_Panchayath = data_Panchayath;
    }

    if (classValues) {
      query.data_support = { $in: classValues };
    }
   
    console.log(query);

    const totalResults = await Data.countDocuments(query);
    const totalPages = Math.ceil(totalResults / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const searchData = await Data.find(query)
      .select('data_district data_Block data_Panchayath data_Name data_Ward data_Phonenumber data_NameofNG data_support')
      .skip(startIndex)
      .limit(limit);
      res.json({
        totalPages,
        currentPage: page,
        totalResults,
        searchData
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
    
    
  module.exports = router;
  