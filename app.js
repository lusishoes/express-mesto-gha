const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const {
  validateUserCreation, validateUserLogin,
} = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

const {
  PORT = 3000,
} = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();
app.use(bodyParser.json());
app.use(router);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.post('/signin', validateUserLogin, login); // вход
app.post('/signup', validateUserCreation, createUser); // регистрация

app.use('*', () => Promise.reject(NotFoundError('Страница не найдена.')));

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
