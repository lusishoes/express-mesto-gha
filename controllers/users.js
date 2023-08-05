const mongoose = require('mongoose');
const UserModel = require('../models/user');

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};
// 1.[GET] Получение пользователя с некорректным id
//         Код ответа равен 400
// 2. Получение пользователя с несуществующим в БД id
//   2. В ответе приходит JSON-объект
//   3. Код ответа равен 404
//   4. Проверка возврата поля message
//   5. Ответ содержит message длинной больше 1 символа
  const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .orFail()
    .then((user) => {
        res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: err.message });
      } else if (err instanceof mongoose.Error.CastError){
        res.status(400).send({ message: err.message });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      }
      else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return UserModel.create({ name, about, avatar })
    .orFail()
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: err.message });
      } else if (err instanceof mongoose.Error.CastError){
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
//Обновление данных пользователя с полем name меньше 2 символов
// 6. Код ответа равен 400
// 7. Проверка возврата поля message
// 8. Ответ содержит message длинной больше 1 символа
//Обновление данных пользователя с полем name больше 30 символов
//  9. Код ответа равен 400
//  10. Проверка возврата поля message
//  11. Ответ содержит message длинной больше 1 символа
//Обновление данных пользователя с полем about меньше 2 символов
// 12. Код ответа равен 400
// 13. Проверка возврата поля message
// 14. Ответ содержит message длинной больше 1 символа
//Обновление данных пользователя с полем about больше 30 символов
// 15. Код ответа равен 400
// 16. Проверка возврата поля message
// 17. Ответ содержит message длинной больше 1 символа
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;


    UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .orFail()
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: err.message });
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        }   else {
          res.status(500).send({ message: 'Ошибка на стороне сервера.' });
        }
      });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        }
      });
  } else {
    res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
