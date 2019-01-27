const fs = require('fs')
const api = require('../api/api');
const { TODO_ENDPOINT } = require('../endpoints');

const postTodo = (todo) => api.post(TODO_ENDPOINT, todo);

const storeTodo = (data, path) => {
    fs.writeFile(path,JSON.stringify(data),{ flag: 'a+' },(err)=>{
        if(err){
            console.error(err)
            return
        }
    })
}
const loadTodo = (path) => {
        try {
        return  fs.readFileSync(path, 'utf8')
      } catch (err) {
        console.error(err)
      }
  }
module.exports = { postTodo, storeTodo, loadTodo };
