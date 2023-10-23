const mongoose=require('mongoose');


const reviewTagSchema=new mongoose.Schema({


	tagId:{
	   type:String,
	   required:true,
	   unique:true
	},
	 name: {
    type: String,
    required: true
  },
    email: {
    type: String,
    required: true,
  },
    phone: {
    type: Number,
    required: true,
    minLength:10,
    maxLength:12,
  },
    password: {
    type: String,
    required: true,
  },
    status:{
	type:String,
	default:''
	},
	link:{
	type:String,
	default:''
	},
	createdDate:{
	type:String,
	default:''
	},

});

const reviewTags=mongoose.model('reviewTags',reviewTagSchema);

module.exports=reviewTags;


