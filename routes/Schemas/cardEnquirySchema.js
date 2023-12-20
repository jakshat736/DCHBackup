const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const cardEnquirySchema= new Schema({
 	cardId:{
	type:String,
	required:true
		},
        name:{
               type:String,
                required:true
                },
        number:{
                type:String,
                required:true
        },
        query:{
                type:String,
                required:true
        },
});

const CardEnquiry=mongoose.model('CardEnquiries',cardEnquirySchema);
module.exports=CardEnquiry;
