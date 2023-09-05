require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const cors = require('./middlewares/cors')
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT=3000,
} = process.env;

const app = express();
app.use(cors);
app.use(bodyParser.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
mongoose.connect(DB_URL = 'mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
console.log(process.env.NODE_ENV)
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
