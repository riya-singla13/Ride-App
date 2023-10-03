const Basic = require('@hapi/basic');
const customer = require ( '../model/customer');



const validate = async (request, email, password) => {

    const customer = await customer.findOne({email});
    if (!customer) {
        return { credentials: null, isValid: false };
    }

    const isValid = (password === customer.password);
    const credentials = { id: customer.id, name: customer.name };

    return { isValid, credentials };
};
 
 
const Auth = [
    {name: 'basic-auth',
    register: async (server, options) => {
        await server.register(Basic);

        server.auth.strategy('simple', 'basic', { validate });
        // server.auth.default('simple');
    } 
},


];

module.exports = Auth