const mongoose = require('mongoose');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ValidationErrorStatus = 400;
const DocumentNotFoundErrorStatus = 404;
const CastErrorStatus = 400;
const ServerErrorStatus = 500;
const OkStatus = 200;
const CreatedStatus = 201;
const SALT = 10;
// const SECRET_KEY = 'some-secret-key';
const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(OkStatus).send(users))
    .catch(() => {
      res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
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
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

//return UserModel.create({ name, about, avatar, email, password })
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, SALT)
    .then(hash => UserModel.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(CreatedStatus).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: err.message });
      } else {
        res.status(ServerErrorStatus).send({ message: err.message });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
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

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OkStatus).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' } // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getCurrentUserInfo = (req, res) => {
  UserModel.findById(req.user._id)
    .orFail()
    .then((user)=>{
      res.status(OkStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'DocumentNotFoundError' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(CastErrorStatus).send({ message: 'CastError' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
}
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUserInfo
};
