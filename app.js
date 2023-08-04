const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const bodyParser  = require('body-parser');

app.use((req, res, next) => {
  req.user = {
    _id: '64cb6b76442da71701c206df' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(usersRouter);
app.use(cardsRouter);

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
})



app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})
