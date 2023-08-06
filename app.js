const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const DocumentNotFoundErrorStatus = 404;

const {
  PORT = 3000,
} = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '64cb6b76442da71701c206df', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});
app.use(express.json());
app.use(router);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use('*', (req, res) => {
  res.status(DocumentNotFoundErrorStatus).send({ message: 'страница не найдена.' });
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
