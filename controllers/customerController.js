const customer= require('../model/customer');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require ('bcryptjs') ;
const random = require('random-token');



const taskcontroller = {
    customerRegistration : async (request,h) =>{
        try{ 
           
            var customer = new customer(request.payload);
            const salt = await bcrypt.genSalt(10);
            const token = random(10);
            const hashedPassword = await bcrypt.hash(customer.password, salt);
            customer.password = hashedPassword ; 
            customer.token = token;
            var result = await customer.save();
           
                return {message : "customer created successfully", result};
            }catch(error) {
            return "error";
        } 
    },
    customerLogin : async(request,h) => {
        try{  const {customerEmail, password } = request.payload;
            
        
              const customer = await customer.findOne({customerEmail});
              isBlock = customer.isBlock ; 
              
                console.log("findcustomer")
                   if (customer){
                       
                        const validpassword = await bcrypt.compare(password, customer.password);;
                        if (validpassword) {
                            console.log("success")
                            if (isBlock)
                            {return h.response("customer is blocked by admin")
                        }
                            return  h.response("Login Successfull");
                            
                        }
                    
                 
                }else   
                        return h.response("invalid customername or password");
        }catch(error) {
        return ("error");
    }
    
    },    
    editProfile : async(request,h) => {
        try{ const {credentials } = request.auth ;
       
            var customer = await customer.findByIdAndUpdate({_id : credentials._id}, request.payload, {new : true});

            
            return h.response({message : "Profile Updated successfully" , customer});
            

        } catch(error) {
            return ("error");
        } 
      },
      changePassword : async (request,h) =>{
        try{  
            const {oldPassword,newPassword} = request.payload ;
            const {credentials } = request.auth ;
            const customer = await customer.findById ({_id : credentials._id});
            
              if(!customer) {
                return('Invalid Credentials');
              }           
             
              const isValid =  await bcrypt.compare(oldPassword , customer.password) ;
                  if (!isValid){
                    
                   return h.response('Invalid old password');
                }
                 const salt = await bcrypt.genSalt(10);
                 customer.password = (newPassword);
            const hashedPassword = await bcrypt.hash(customer.password, salt);
            customer.password = hashedPassword ; 
            var result = await customer.save();
                return {message : 'Password changed successfully'};
            
            
            }catch(error) {
            return ("error");
        } 
    },
    resetPasswordRequest  :  async (request , h) =>{
        const { customerEmail } = request.payload;

        try {
          
          const resetToken = random(32);
          const resetTokenExpiry = new Date(Date.now() + 3600000); // Token expires in 1 hour
  
          const customer = await customer.findOneAndUpdate( { customerEmail }, {resetToken, resetTokenExpiry, },{ new: true } );
  
          if (!customer) {
            
            return h.response('customer not found');
          }
  
          sendResetTokenEmail(customer.customerEmail, resetToken);
  
          return { message: 'Reset token sent successfully' };
        } catch (error) {
          console.error(error);
          return h.response('An error occurred while processing your request');
        }
      },
      
      resetPasswordConfirm : async (request, h) => {
        const { resetToken } = request.params ; 
        const {credentials} = request.auth ; 
        customerEmail = credentials.customerEmail;
               
                const {newPassword } = request.payload;
       
  
        try {
          
          const customer = await customer.findOne({customerEmail : customerEmail });
  
          if (!customer || customer.resetToken !== resetToken || customer.resetTokenExpiry < new Date()) {
            return h.response('Invalid or expired reset token');
          }
  
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          customer.password = hashedPassword;
          customer.resetToken = null;
          customer.resetTokenExpiry = null;
          await customer.save();
  
          return { message: 'Password reset successfully' };
        } catch (error) {
          
          return h.response('An error occurred while processing your request');
        }
      },
};
 
function sendResetTokenEmail(customerEmail, resetToken) {

const transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
customer: 'testapi381@gmail.com',
pass: 'test@1234',
},
});

const mailOptions = {
from: 'testapi381@gmail.com',
to: customerEmail,
subject: 'Password Reset',
text: `Your password reset token is: ${resetToken}`, 
};  

transporter.sendMail(mailOptions, (error, info) => {
if (error) {
console.error(error);
} else {
console.log('Email sent: ' + info.response);
}
});
}
    

    module.exports = taskcontroller
