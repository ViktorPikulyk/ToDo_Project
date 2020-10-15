const router = require('express').Router();
const todos = require('../controllers/todos');

router.post('/', todos.create);
router.get('/', todos.getAll);
router.get('/:id', todos.getById);
router.put('/:id', todos.update);
router.delete('/:id', todos.delete);

module.exports = router;
