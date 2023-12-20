const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
    subCategoryName: {
    type: String,
    required: true
  },
    productName: {
    type: String,
    required: true
  },
   price:{
 	type:String,
	required:true
	},
 offerprice:{
	type:String,
	required:true
	},
    hotSelling: {
    type: String,
    required: true
  },
    newArrival: {
    type: String,
    required: true
  },
    description: {
    type: String,
    required: true
  },
 description1: {
    type: String,
    required: true,
  },
  description2: {
    type: String,
    required: true,
  },
  description3: {
    type: String,
    required: true,
  },
  description4: {
    type: String,
    required: true,
  },

   images:[


]

  
 
  
});

const products = mongoose.model('products', productSchema);

module.exports = products;
