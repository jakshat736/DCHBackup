const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const restaurantDetailsSchema= new Schema({
	
	companyId:{
	type:String,
	required:true,
	unique:true
	},
        name:{
               type:String,
                required:true
                },
        number:{
                type:String,
                required:true
        },
        logo:{
                type:String,
                required:true
        },
	call:{
		type:String,
		default:"able"
		}
        
});

const RestaurantDetails=mongoose.model('RestaurantDetails',restaurantDetailsSchema);
module.exports=RestaurantDetails;
