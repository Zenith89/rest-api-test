
const redis = require('redis')
// const client = redis.createClient('6379','127.0.0.1');
const client = redis.createClient(process.env.REDIS_URI);


const redisMiddleware = (req, res, next) => {
    let key = req.url.trim();
    client.get(key, (err, reply) => {
        if (reply) {
            return res.json(JSON.parse(reply))
        }
        next();
    });
};
const saveToRedis = (key, value, seconds) => { return Promise.resolve(client.set(key, value, 'EX', seconds)) }

module.exports = { redisMiddleware, saveToRedis }