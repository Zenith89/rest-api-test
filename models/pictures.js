
const api = require('../api/api');
const { PICTURE_ENDPOINT } = require('../endpoints');
const { saveToRedis } = require('./../middleware/redisCache');
//getImages 
const handleImages = (req, res) => {
    // TODO ask for clarification
    // validate size and offset must be a +ve number or 0
    let offset, size
    parseInt(req.query) ===NaN ?0 : offset = parseInt(req.query)
    parseInt(req.size)=== NaN? 1 : size =parseInt(req.size)

        // the description for qn 4.2 is not clear
        // by assuming the user request is intened to get the 9th and 10th image
    getPictures().then(images => {
        let result = []
        result.push(images.data[8])
        result.push(images.data[9])
        saveToRedis(req.url.trim(), JSON.stringify(result), 10)
        .then(() => {})
        .catch(e => console.log('error to save into catche'))
        res.status(200).send(result)

    }).catch(e => {
        console.log(e)
        res.status(400).send('error')
    })

}

const getPictures = () => api.fetch(PICTURE_ENDPOINT)
module.exports = { handleImages }
