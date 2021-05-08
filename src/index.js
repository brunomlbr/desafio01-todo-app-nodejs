const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find( (user) => user.username === username );

  if(!user) {
    return response.status(404).json({
      error: "Username not found! "
    });
  };

  request.user =  user ;

  return next();
}
// create new user
app.post('/users', (request, response) => {
  const { name, username } = request.body ;

  const userAlreadyExists = users.some( 
    (user) =>  user.username === username
    );

  if(userAlreadyExists) {
    return response.status(400).json({error: "Customer already exists!"}); 
  }
  
  const user = { 
                id: uuidv4(), 
                name, 
                username, 
                todos: []
              };

            
  users.push(user);            

  return response.status(201).send(user);

});
// show todo information
app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  const { user } = request ;
  
  return response.json(user.todos);

});
// create a new todo
app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const { title, deadline } = request.body;

  const { user } = request ;
  
  const todoTask =
  { 
    id: uuidv4(), 
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  };

  user.todos.push(todoTask);

  //return response.status(201).send(todoTask);
  return response.status(201).json(todoTask);

});
// update a todo
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { id } = request.params;
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({error: "Todo not found!"})
  }

  todo.title = title;
  todo.deadline = new Date(deadline) ;
  // status padrão é 200
  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;