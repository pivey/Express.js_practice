const axios = require('./node_modules/axios');

module.exports = {
    make_API_call : async function(url){
        let res = await axios.get(url);
        return res;
    }
}