const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const inviteSchema= new Schema({

	inviteId:{
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
        coverVideo:{
               type:String,
               default:""
                 },
 	 invitationVideo:{
               type:String,
               default:""
                },

       
});

const Invite=mongoose.model('Invite',inviteSchema);
module.exports=Invite;
