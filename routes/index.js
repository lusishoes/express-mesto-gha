const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const {
  validateUserCreation, validateUserLogin,
} = require('../middlewares/validation');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.post('/signin', validateUserLogin, login); // вход
router.post('/signup', validateUserCreation, createUser); // регистрация

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена.')));
module.exports = router;
