// Incorrect type in query parameters, null values, XSS injection
const express = require('express');
const bodyParser = require('body-parser');

const users = require('./models/users');
const pictures = require('./models/pictures');
const utils= require('./utils/utils');
const {redisMiddleware}= require('./middleware/redisCache');

const port = 8040;
// 1. create http server
const app = express();
app.use(bodyParser.json());
// 2 GET/ping
app.get('/ping', (req, res) => {utils.handlePing(req,res)});
// 3. GET/version
app.get('/version', (req, res) => {utils.handleVersionNumber(req,res)});
// 4. GET/images
app.get('/images',redisMiddleware, (req, res) => {pictures.handleImages(req,res)});
// 5.GET/Nicholas
app.get('/nicholas',redisMiddleware, (req, res) => {  users.handleUserNicholas(req, res)});

// 6. GET/Romaguera
app.get('/Romaguera',redisMiddleware, (req, res) => {users.handleUserRomaguera(req,res)});

// 7.
app.post('/todo', (req, res) => {users.handleUserTodo(req,res)});
// 8 GET/sorted-users
app.get('/sorted-users',redisMiddleware, (req, res) => {users.handleSortUsers(req,res)})

// 12 
app.get('/new-todos', (req, res) => {users.handleNewTodo(req,res)})
// 9
app.get('*',  (req, res) =>{utils.handleInvalidUrl(req,res)});
app.post('*',  (req, res) =>{utils.handleInvalidUrl(req,res)});
app.listen(port, () => {
    console.log(`listning on port ${port}`)
})
// module.exports= {app}
module.exports.app = app



