const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT = 3000,
} = process.env;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';
const app = express();
app.use(bodyParser.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
