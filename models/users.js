const api = require('../api/api');
const { getPost } = require('./posts');
const { postTodo, storeTodo, loadTodo } = require('./todo');
const { USER_ENDPOINT, TODO_ENDPOINT } = require('../endpoints');

const { saveToRedis } = require('./../middleware/redisCache');

const handleUserNicholas = async (req, res) => {
    let user, userPosts;
    try {
        let users = await getUser();
        user = users.data.filter(usr => (usr.name === 'Nicholas Runolfsdottir V'))[0]
        let posts = await getPost();
        userPosts = posts.data.filter(post => post.userId === user.id)
    }
    catch (e) {
        console.log('unable to get user or user posts', e)
        return res.status(400).send('error');
    }
    try {
        await saveToRedis(req.url.trim(), JSON.stringify({ user, userPosts }), 10)
    }
    catch (e) {
        throw new Error('error to save into Redis', e)
    }
    return res.status(200).send({ user, userPosts })
}
const handleUserRomaguera = async (req, res) => {
    let userPosts;
    try {
        let users = await getUser();
        let ids = users.data.filter(usr => (usr.company.name.includes('Romaguera'))).map(user => user.id)
        let posts = await getPost();
        ids.forEach(id => {
            userPosts.push(
                posts.data.filter(post => post.userId === id))
        })
    }
    catch (e) {
        console.log('unable to get user or user posts', e)
        return res.status(400).send('error')
    }
    try {
        await saveToRedis(req.url.trim(), JSON.stringify({ userPosts }), 10);

    }
    catch (e) {
        throw new Error('error to save into Redis', e)
    }
    return res.status(200).send({ userPosts })
}
const handleUserTodo = async (req, res) => {
    const { userId, title, completed } = req.body
    if (!(typeof (userId) === "number" && typeof (title) === "string" && typeof (completed) === "boolean")) {
        return res.status(400).send('invalid input')

    }
    let todo = {
        userId: req.body.userId,
        title: req.body.title,
        completed: req.body.completed
    }
    try {

        await postTodo(TODO_ENDPOINT, todo);
        storeTodo(todo, './todos.json')

    }
    catch (e) {
        console.log('error during post todos', e)
        return res.status(400).send('error')
    }
    return res.status(200).send({ 'todo': todo })
}

const handleSortUsers = async (req, res) => {
    let sortedByCity;
    try {
        let users = await getUser();
        let filtered = users.data.filter(user => (!user.website.includes('.com') && !user.website.includes('.net') && !user.website.includes('.org')))
        sortedByCity = filtered.sort(sortUsersByCityName());
    }
    catch (e) {
        console.log('unable to get user or user posts', e)
        return res.status(400).send('error')
    }
    try {
        saveToRedis(req.url.trim(), JSON.stringify({ "sortedUsers": sortedByCity }), 10)

    }
    catch (e) {
        throw new Error(e, 'error to save into catche');

    }
    return res.status(200).send({ "sortedUsers": sortedByCity })
}
const handleNewTodo = (req, res) => {
    const data = loadTodo('./todos.json');
    // console.log(data)
    if (!data) {
        res.send('No todos');
    }
    else {
        res.send(data).json()
    }
}
const getUser = () => api.fetch(USER_ENDPOINT)

const sortUsersByCityName = () => {
    return (user1, user2) => {
        // user1.address.city. localCompare( user2.address.city)

        if (user1.address.city.toLowerCase() > user2.address.city.toLowerCase()) {
            return 1
        }
        else if (user1.address.city.toLowerCase() < user2.address.city.toLowerCase()) {
            return -1
        }
        else return 0
    }

}

module.exports = { handleUserNicholas, handleUserRomaguera, handleUserTodo, handleSortUsers, handleNewTodo }

