const mongoose = require('mongoose');
const UserModel = require('../models/user');

const ValidationErrorStatus = 400;
const DocumentNotFoundErrorStatus = 404;
const CastErrorStatus = 400;
const ServerErrorStatus = 500;
const OkStatus = 200;
const CreatedStatus = 201;

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(OkStatus).send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OkStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'DocumentNotFoundError' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(CastErrorStatus).send({ message: 'CastError' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: 'ValidationError' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return UserModel.create({ name, about, avatar })
    .then((user) => {
      res.status(CreatedStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: err.message });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(CastErrorStatus).send({ message: err.message });
      } else {
        res.status(ServerErrorStatus).send({ message: err.message });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OkStatus).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.status(OkStatus).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          res.status(DocumentNotFoundErrorStatus).send({ message: 'Пользователь с указанным _id не найден.' });
        }
      });
  } else {
    res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
