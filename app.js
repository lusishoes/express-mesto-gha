const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const {
  PORT = 3000,
} = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use((req, res, next) => {
  req.user = {
    _id: '64cb6b76442da71701c206df', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(usersRouter);
app.use(cardsRouter);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'страница не найдена.' });
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
