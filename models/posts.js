const api = require('../api/api');
const { POST_ENDPOINT, TODO_ENDPOINT } = require('../endpoints');

const getPost = () => api.fetch(POST_ENDPOINT);
module.exports={getPost};
