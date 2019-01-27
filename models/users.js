const api = require('../api/api');
const {getPost} = require('./posts');
const {postTodo,storeTodo,loadTodo} = require('./todo');
const { USER_ENDPOINT, TODO_ENDPOINT } = require('../endpoints');

const { saveToRedis } = require('./../middleware/redisCache');

const handleUserNicholas = (req, res) => {
    getUser().then(users => {
        let user = users.data.filter(usr => (usr.name === 'Nicholas Runolfsdottir V'))[0]
        getPost().then(posts => {
            let userPosts = posts.data.filter(post => post.userId === user.id)
            saveToRedis(req.url.trim(), JSON.stringify({ user, userPosts }), 10)
            .then(() => {})
            .catch(e => console.log(e,'error to save into Redis'))
            res.status(200).send({ user, userPosts })
        }).catch(e => {
            console.log(e);
            res.status(400).send('error')
        })

    }).catch(e => {
        console.log(e)
        res.status(400).send('error')
    })
}
const handleUserRomaguera = (req, res) => {
    getUser().then(users => {
        let ids = users.data.filter(usr => (usr.company.name.includes('Romaguera'))).map(user => user.id)
        getPost().then(posts => {
            let userPosts = []
            ids.forEach(id => {
                userPosts.push(
                    posts.data.filter(post => post.userId === id))
            })
            saveToRedis(req.url.trim(), JSON.stringify({ userPosts }), 10)
            .then(() => {})
            .catch(e => console.log(e,'error to save into Redis'))
            res.status(200).send({  userPosts })
        }).catch(e => {
            console.log(e);
            res.status(400).send('error')
        })

    }).catch(e => {
        console.log(e); res.status(400).send('error')
    })
}
const handleUserTodo = (req, res) => {
    const { userId, title, completed } = req.body
    if (!(typeof (userId) === "number" && typeof (title) === "string" && typeof (completed) === "boolean")) {
        return res.status(400).send('invalid input')

    }
    let todo = {
        userId: req.body.userId,
        title: req.body.title,
        completed: req.body.completed
    }
  
   postTodo(TODO_ENDPOINT, todo).then(response => {
        // console.log(response)
        res.status(200).send({'todo':todo})
            storeTodo(todo,'./todos.json')

    }

    ).catch(e => {
        console.log(e);
        res.status(400).send('error')
    })
}
const handleSortUsers= (req,res) =>{
    getUser().then(users => {
        let filtered = users.data.filter(user => (!user.website.includes('.com') && !user.website.includes('.net') && !user.website.includes('.org')))
        let sortedByCity = filtered.sort(sortUsersByCityName())
        saveToRedis(req.url.trim(), JSON.stringify({"sortedUsers": sortedByCity }), 10)
            .then(() => {})
            .catch(e => console.log(e,'error to save into catche'))
            res.status(200).send({ "sortedUsers": sortedByCity })
    }).catch(e => {
        console.log(e);
        res.status(400).send('error')
    })
}
const handleNewTodo = (req,res) =>{
    const data=loadTodo('./todos.json');
    console.log(data)
    if(!data){
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

module.exports = { handleUserNicholas, handleUserRomaguera,handleUserTodo,handleSortUsers,handleNewTodo }

