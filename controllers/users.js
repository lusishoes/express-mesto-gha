const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');

const OkStatus = 200;
const CreatedStatus = 201;
const SALT = 10;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConfilctError = require('../errors/ConflictError');

// const SECRET_KEY = 'some-secret-key';
const getUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => res.status(OkStatus).send(users))
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  UserModel.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OkStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id юзера.'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('CastError'));
      } else {
        next(err);
      }
    });
};

// return UserModel.create({ name, about, avatar, email, password })
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CreatedStatus).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConfilctError('Пользователь с таким email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(OkStatus).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OkStatus).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUserInfo = (req, res, next) => {
  UserModel.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(OkStatus).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUserInfo,
};
