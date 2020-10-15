const router = require('express').Router();
const user = require('../controllers/users');

router.post('/register', user.register);
router.post('/login', user.login);
router.get('/:id', user.getById);
router.put('/edit/:id', user.update);
router.delete('/delete/:id', user.delete);

module.exports = router;
