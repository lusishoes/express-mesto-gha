const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { createUser, login } = require('./controllers/users')
const DocumentNotFoundErrorStatus = 404;
const {
  validateUserCreation, validateUserLogin
} = require('./middlewares/validation');
const {
  PORT = 3000,
} = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();
app.use(express.json());
app.use(router);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.post('/signin', validateUserLogin, login); // вход
app.post('/signup', validateUserCreation, createUser); // регистрация

app.use('*', (req, res) => {
  res.status(DocumentNotFoundErrorStatus).send({ message: 'страница не найдена.' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
