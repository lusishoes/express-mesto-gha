const { default: mongoose } = require('mongoose');
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

const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return UserModel.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidaotrs: true })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        }
      });
  } else {
    res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidaotrs: true })
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
