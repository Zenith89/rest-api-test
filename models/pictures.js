
const api = require('../api/api');
const { PICTURE_ENDPOINT } = require('../endpoints');
const { saveToRedis } = require('./../middleware/redisCache');
//getImages 
const handleImages = async (req, res) => {
    // TODO ask for clarification
    // validate size and offset must be a +ve number or 0
    let offset, size
    parseInt(req.query) === NaN ? 0 : offset = parseInt(req.query)
    parseInt(req.size) === NaN ? 1 : size = parseInt(req.size)

    // the description for qn 4.2 is not clear
    // by assuming the user request is intened to get the 9th and 10th image
    let result = []
    try {

        let images = await getPictures();
        result.push(images.data[8])
        result.push(images.data[9])
    }
    catch (e) {
        res.status(400).send('unable to get images')
        throw new Error('unable to get images', e);
    }

    try {
        await saveToRedis(req.url.trim(), JSON.stringify(result), 10)
    }
    catch (e) {
        throw new Error('unable to save into redis', e)

    }
       return res.status(200).send(result)
}

const getPictures = async () => await api.fetch(PICTURE_ENDPOINT)
module.exports = { handleImages }
