const express = require('express');
const router = express.Router();
const reviewTags = require('./Schemas/reviewTagSchema');
var upload = require("./multer")
const uuid = require('uuid');
var pool = require('./pool')


router.post('/chkTagId', upload.single(), async (req, res) => {
    let {tagId} = req.body;
    console.log(req.body);
    try {
      let reviewTag = await reviewTags.findOne({ tagId });
  
      if (!reviewTag){
        return res.status(200).json({ status: 'false', message: 'Not Found' });
      } else {
       
     return res.status(200).json({      status: 'true',data:reviewTag,  message: 'Found', });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post("/updateTagStatus",upload.single(""),async(req,res)=>{
const  {tagId,status}=req.body;
console.log(req.body);
try{
const card = await reviewTags.findOne({tagId})
if(card){
card.status=status;
await card.save();

return res.status(200).json({status:true,message:"Status Updated"});

}else{
  return res.status(404).json({status:false,message:"Not Found"});
}
}catch(err){
console.log(err);
return res.status(500).json({message:"server Error"});
}
});

router.get('/displayalltags', async (req, res) => {
    try {
      const cards = await reviewTags.find();
      return  res.status(200).json(cards)
    } catch (error) {
      console.log(error)
      return res.status(500).json({status:false})
    }
  });

router.post('/getUserDataById',upload.single(''), async (req, res) => {
    try {
      const {tagId } = req.body;
  
      const customer = await reviewTags.findOne({ tagId });
  
      if (!customer) {
        return res.status(404).json({ error: 'User details not found' });
      }
  
      return res.status(200).json({status:true,data:customer});
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve user details' });
    }
  });

router.post('/getTagsByEmail',upload.single(''),async(req,res)=>{

  try{
	const {email}=req.body;
	const tags=await reviewTags.find({email});
	
	if(!tags){
	return res.status(404).json({error:"Not Found"});
	
	}
	return res.status(200).json({status:true,data:tags});
	}catch(error){
	return res.status(500).json({error:"error"});
	}

});


router.post('/updatePassword',upload.single(''),async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if a customer with the provided email exists
      const customer = await reviewTags.findOne({ email });
  
      if (customer) {
        // Update the password
        customer.password = password;
        await customer.save();
        
        return res.status(200).json({ status: true, message: 'Password updated successfully' });
      } else {
        return res.status(404).json({ status: false, message: 'Customer not found' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


router.post('/customerLogin', upload.single(), async (req, res) => {
  let { tagId, name, email, phone, password } = req.body;

  try {
    const currentDate = new Date(); // Get the current date and time
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const customer = new reviewTags({
      tagId: tagId,
      name: name,
      email: email,
      phone: phone,
      password: password,
      link:"",
      status:"Active",
      createdDate: formattedDate, // Assign the formatted date to createdDate
    });

    await customer.save();

    console.log(customer._id);
    return res
      .status(200)
      .json({ status: 'true', mobileNumber: phone, message: 'Login successful' });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/chkLogin',upload.single(''), async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if a customer with the provided email exists
      const customer = await reviewTags.findOne({ email });
  
      if (customer) {
        // Compare the provided password with the stored password
        if (customer.password === password) {
          return res.status(200).json({ status: true,data:customer, message: 'Login successful' });
        } else {
          return res.status(401).json({ status: false, message: 'Incorrect password' });
        }
      } else {

        return res.status(404).json({ status: false, message: 'Customer not found' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


 router.post('/updateLink',upload.single(''),async (req, res) => {
    const { tagId,link } = req.body;
  
    try {
      // Check if a customer with the provided email exists
      const reviewTag = await reviewTags.findOne({tagId });
  
      if (reviewTag) {
        // Update the password
        if(link!='undefined' && link!=''){
        reviewTag.link = link;}
        await reviewTag.save();
        
        return res.status(200).json({ status: true,data:reviewTag, message: 'Link updated successfully' });
      } else {
        return res.status(404).json({ status: false, message: 'Tag not found' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports= router;
