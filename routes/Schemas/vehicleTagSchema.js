const mongoose=require('mongoose');


const vehicleTagSchema=new mongoose.Schema({


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
        vehicleNumber:{
	type:String,
	default:''
	},
	vehicleType:{
	type:String,
	default:''
	},
        createdDate:{
        type:String,
        default:''
        },

});

const vehicleTags=mongoose.model('vehicleTags',vehicleTagSchema);

module.exports=vehicleTags;
