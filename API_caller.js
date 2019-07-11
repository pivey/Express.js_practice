const axios = require('axios');

module.exports = {
    make_API_call : async function(url){
        let res = await axios.get(url);
        return res;
    }
}