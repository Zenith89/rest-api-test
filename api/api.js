const axios = require('axios');

const fetch = (url) => {
    return axios.get(url)
}
const post = (url,data) => {
    return axios.post(url,data)
}

module.exports = { fetch,post }