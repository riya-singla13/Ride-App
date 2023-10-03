const customerController = require('../controllers/customerController');
const Joi = require('joi');


const Routes = [
    {
        method :"POST",
        path :"/customerRegister",
        config : { 
            description:" customer registration ",
            tags:['api'],
            validate: {
                payload: Joi.object({
                    customerName: Joi.string().min(3).max(30).required(),
                    customerEmail: Joi.string().email().required() ,
                    password : Joi.string().required(),
                    customerPhoneNo : Joi.number().required()
                }),
           }
        },
        handler:  customerController.customerRegistration
    },
    {
        method: 'POST',
        path: '/customerLogin',
        options: {
            description:" customer login ",
              tags:['api'],
            validate: {
                payload: Joi.object({
                    customerEmail: Joi.string().email().required(),
                    password: Joi.string().required()
                })
            },
            auth :'token'
        },
        handler: customerController.customerLogin
        },
        {
            method :"PUT",
            path :"/customerEditProfile",
            options: {
                description:" customer edit profile  ",
              tags:['api'],

                validate: {
                        payload: Joi.object({
                        
                        customerName: Joi.string().min(3).max(30),
                         customerEmail: Joi.string().email(),
                         password : Joi.string(),
                         customerPhoneNo : Joi.number(),
                         token : Joi.string()
                }) 
            },
            auth : 'token' 
        },
            handler: customerController.editProfile
},

{
    method: 'POST',
    path: '/customerChangePassword',
    options: {
        description:" customer change password ",
              tags:['api'],
        validate: {
            payload: Joi.object({
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().required()
            })
        },
        auth :'token'
    },
    handler: customerController.changePassword
    },
    {
        method: 'POST',
        path: '/customerResetPassword/request',
        options: {
            description:" customer reset  password request ",
              tags:['api'],
            validate: {
              payload: Joi.object({
                customerEmail: Joi.string().email().required(),
              }),
            },
            auth : 'token'
        },
        handler: customerController.resetPasswordRequest
        },
    
      {
        method: 'POST',
        
        path: '/customerResetPassword/confirm/{resetToken}',
        handler: customerController.resetPasswordConfirm  ,
        options: {
            description:" customer reset  password ",
              tags:['api'],
          validate: {
            params :  Joi.object({
              
                
                resetToken : Joi.string().required()
              }),
           
            payload: Joi.object({
              
              newPassword: Joi.string().required(),
           
            }),
          },
          auth : 'token'
        },
      },

]
module.exports = Routes