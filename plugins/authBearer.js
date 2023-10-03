const AuthBearer = require('hapi-auth-bearer-token');
const customers = require('../model/customer');
const Driver = require('../model/driver');


const validatecustomer= async (request, token, h) => {
    try {
        const customer = await customers.findOne({token});
        if(customer) {
        const credentials = { _id: customer._id, customerName: customer.customerName  ,customerPhoneNo : customer.customerPhoneNo , customerEmail : customer.customerEmail};
        
        return { isValid : true, credentials };
    } else {
        return {isValid : false, credentials : null}
    }
    } catch (error) {
        return { isValid: false, credentials: null };
      }
} ;
const validateDriver= async (request, token, h) => {
   try{ 
        const driver = await Driver.findOne({token});
        if(driver){
        const credentials = { _id: driver._id, driverName: driver.driverName, driverContact : driver.driverContact,  driverEmail : driver.driverEmail};
        
        return { isValid : true, credentials };
    } else {
        return {isValid : false, credentials : null}
    }
}catch (error) {
    return { isValid: false, credentials: null };
  }
};

       

const Auth = [
{name: 'auth-bearer-token',
    register: async (server, options) => {
        await server.register(AuthBearer);
        server.auth.strategy('token', 'bearer-access-token',{ validate : validatecustomer });
        server.auth.strategy('driverToken', 'bearer-access-token',{ validate : validateDriver });

        
    } 
}
]



module.exports = Auth