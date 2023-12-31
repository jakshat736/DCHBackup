const express = require('express');
const router = express.Router();
const reviewTags = require('./Schemas/reviewTagSchema');
var upload = require("./multer")
const uuid = require('uuid');
var pool = require('./pool')
const nodemailer = require('nodemailer');

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

async function sendMail(email,otp){
    //1. create an email transporter.
    //SMTP (Simple Mail Transfer Protocol)
   const transporter =  nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'noreply.digitalcardhub.in@gmail.com',
            pass: 'hjayrzhovunfltdd'
        }
    })


    //2.configure email content.
    const mailOptions = {
        from:'noreply.digitalcardhub.in@gmail.com',
        to: `${email}`,
        subject: 'Welcome to Digital Card Hub',
        text: `<!doctype html>
<html  email data-css-strict>

<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <style amp4email-boilerplate>
    body {
      visibility: hidden
    }
  </style>

  <script async src="https://cdn.ampproject.org/v0.js"></script>


  <style amp-custom>
    .u-row {
      display: flex;
      flex-wrap: nowrap;
      margin-left: 0;
      margin-right: 0;
    }
    
    .u-row .u-col {
      position: relative;
      width: 100%;
      padding-right: 0;
      padding-left: 0;
    }
    
    .u-row .u-col.u-col-100 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    @media (max-width: 767px) {
      .u-row:not(.no-stack) {
        flex-wrap: wrap;
      }
      .u-row:not(.no-stack) .u-col {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
    
    body {
      margin: 0;
      padding: 0;
    }
    
    table,
    tr,
    td {
      vertical-align: top;
      border-collapse: collapse;
    }
    
    p {
      margin: 0;
    }
    
    .ie-container table,
    .mso-container table {
      table-layout: fixed;
    }
    
    * {
      line-height: inherit;
    }
    
    table,
    td {
      color: #000000;
    }
  </style>


</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;background-color: #f9f9f9;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
    <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse;vertical-align: top">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;background-color: #ffffff;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:20px;font-family:'Cabin',sans-serif;" align="left">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                  <amp-img alt="Image" src="https://assets.unlayer.com/projects/195503/1699347721039-dchub%20logo-01.png" width="1031" height="568" layout="intrinsic" style="width: 16%;max-width: 16%;">

                                  </amp-img>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;background-color: #003399;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:'Cabin',sans-serif;" align="left">

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding-right: 0px;padding-left: 0px;" align="center">

                                  <amp-img alt="Image" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" width="335" height="93" layout="intrinsic" style="width: 26%;max-width: 26%;">

                                  </amp-img>
                                </td>
                              </tr>
                            </table>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                              <p style="font-size: 14px; line-height: 140%;"><strong>T H A N K S&nbsp; &nbsp;F O R&nbsp; &nbsp;R E G I S T E R I N G !</strong></p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                              <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px;"><strong><span style="line-height: 39.2px; font-size: 28px;">Verify Your E-mail Address </span></strong>
                                </span>
                              </p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;background-color: #ffffff;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                              <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 22px; line-height: 35.2px;">Hi, </span></p>
                              <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">Welcome! You're almost ready to get started. Your One-Time Password (OTP) for email verification is: ${otp}. Please use this OTP to enjoy exclusive cleaning services with us. ! </span></p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                              <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">Thanks,</span></p>
                              <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px;">Digital Card Hub</span></p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;background-color: #e5eaf5;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:41px 55px 18px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; color: #003399; line-height: 160%; text-align: center; word-wrap: break-word;">
                              <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 20px; line-height: 32px;"><strong>Get in touch</strong></span></p>
                              <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 16px; line-height: 25.6px; color: #000000;">+91 8889430333</span></p>
                              <p style="font-size: 14px; line-height: 160%;">digitalcardhub.in@gmail.com</p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="padding: 0px;">
            <div style="max-width: 600px;margin: 0 auto;background-color: #003399;">
              <div class="u-row">

                <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                  <div style="width: 100%;padding:0px;">

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                            <div style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                              <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">Copyrights © Digital Card Hub All Rights Reserved</span></p>
                            </div>

                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>
            </div>
          </div>

          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
      </tr>
    </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>`    }

    //3. send email
    try {
       const result = await transporter.sendMail(mailOptions);
       console.log('Eamil sent successfully')
    } catch (error) {
        console.log('Email send failed with error:', error)
    }
}

router.post('/sendOtp',upload.single(''), async (req, res) => {
    const { mail, otp } = req.body;

    try {
      sendMail(mail,otp);
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
  
router.post('/deleteReviewTag',upload.single(''), async (req, res) => {
  const { tagId } = req.body;

  try {
    // Check if a reviewTag with the provided tagId exists
    const reviewTag = await reviewTags.deleteOne({ tagId });

    if (reviewTag) {
      // Delete the reviewTag
  

      return res.status(200).json({ status: true, message: 'ReviewTag deleted successfully' });
    } else {
      return res.status(404).json({ status: false, message: 'ReviewTag not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports= router;
