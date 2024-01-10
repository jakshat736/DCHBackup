const mongoose=require('mongoose');


const reviewTagLinkSchema=new mongoose.Schema({


        tagId:{
           type:String,
           required:true,
           unique:true
        },
	clientName:{
		type:String,
		required:true,
		}
 

});

const reviewTagLinks=mongoose.model('reviewTagLinks',reviewTagLinkSchema);

module.exports=reviewTagLinks;
