const jwt = require('jsonwebtoken');
const Todo = require('../models/todo');
const User = require('../models/user');

const getTokenFrom = req => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

module.exports = {
  create: async (req, res, next) => {
    const body = req.body;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const user = await User.findById(decodedToken.id);

      const todo = new Todo({
        date: body.date,
        user: user._id,
        title: body.title,
        description: body.description,
        priority: body.priority,
        isCompleted: false
      });

      const savedTodo = await todo.save();
      user.todos = user.todos.concat(savedTodo._id);
      await user.save();
      res.json(savedTodo.toJSON());
    } catch (err) {
      next(err);
    }
  },
  getAll: async (req, res, next) => {
    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const todos = await Todo.find({});
      const userTodos = [];

      todos.map(t => {
        if (t.user == decodedToken.id) {
          userTodos.push(t);
        }
      });

      res.json(userTodos.map(t => t.toJSON()));
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const todo = await Todo.findById(id);

      if (todo.user != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      if (todo) {
        res.json(todo.toJSON());
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    const body = req.body;
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const todoById = await Todo.findById(id);

      if (todoById.user != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      const todo = {
        date: body.date,
        title: body.title,
        description: body.description,
        priority: body.priority,
        isCompleted: body.isCompleted
      };

      const updatedTodo = await Todo.findByIdAndUpdate(id, todo, {
        new: true
      });
      if (updatedTodo) {
        res.json(updatedTodo.toJSON());
      } else {
        res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    const id = req.params.id;

    const token = getTokenFrom(req);

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' });
      }

      const todo = await Todo.findById(id);

      if (todo.user != decodedToken.id) {
        return res.status(401).json({ error: 'access denied' });
      }

      await Todo.findByIdAndRemove(id);
      // const populate = await User.findById(todo.user).populate('todos');
      // console.log('7777777777777777');
      // console.log(populate);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
};
