const express = require('express');
const router = express.Router();
const standeeTags = require('./Schemas/standeeTagSchema');
var upload = require("./multer")
const uuid = require('uuid');
var pool = require('./pool')


router.post('/chkTagId', upload.single(), async (req, res) => {
    let {tagId} = req.body;
    console.log(req.body);
    try {
      let standeeTag = await standeeTags.findOne({ tagId });

      if (!standeeTag){
        return res.status(200).json({ status: 'false', message: 'Not Found' });
      } else {

     return res.status(200).json({      status: 'true',data:standeeTag,  message: 'Found', });
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
const card = await standeeTags.findOne({tagId})
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
      const cards = await standeeTags.find();
      return  res.status(200).json(cards)
    } catch (error) {
      console.log(error)
      return res.status(500).json({status:false})
    }
  });

router.post('/getUserDataById',upload.single(''), async (req, res) => {
    try {
      const {tagId } = req.body;

      const customer = await standeeTags.findOne({ tagId });

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
        const tags=await standeeTags.findOne({email});

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
      const customer = await standeeTags.findOne({ email });

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
    let customer = await standeeTags.findOne({ email });

    if (customer) {
      return res.status(200).json({ status: "exist", message: "Exist" });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    customer = new standeeTags({
      tagId: tagId,
      name: name,
      email: email,
      phone: phone,
      password: password,
      link:"",
      status:"Active",	
      createdDate: formattedDate,
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
      const customer = await standeeTags.findOne({ email });

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
      const standeeTag = await standeeTags.findOne({tagId });

      if (standeeTag) {
        // Update the password
        if(link!='undefined' && link!=''){
        standeeTag.link = link;}
        await standeeTag.save();

        return res.status(200).json({ status: true,data:standeeTag, message: 'Link updated successfully' });
      } else {
        return res.status(404).json({ status: false, message: 'Tag not found' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports= router;

