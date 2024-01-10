const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const inviteSchema= new Schema({

	companyId:{
		type:String,
		required:true,
		unique:true
		},
        coverVideo:{
               type:String,
                required:true
                 },
 	 invitationVideo:{
               type:String,
                required:true
                },

       
});

const Invite=mongoose.model('Invite',inviteSchema);
module.exports=Invite;
