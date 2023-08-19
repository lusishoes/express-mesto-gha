const mongoose = require('mongoose');
const cardShema = require('../models/card');

const ValidationErrorStatus = 400;
const DocumentNotFoundErrorStatus = 404;
const CastErrorStatus = 400;
const ServerErrorStatus = 500;
const OkStatus = 200;
const CreatedStatus = 201;

const getCards = (req, res) => {
  cardShema.find()
    .then((cards) => res.status(OkStatus).send(cards))
    .catch(() => {
      res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardShema.create({ name, link, owner })
    .then((card) => {
      res.status(CreatedStatus).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ValidationErrorStatus).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardShema.findById(cardId)
    .then((card) => {
      if(!card)  {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else if(card.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'Вы не являетесь владельцем карточки' });
      }
      cardShema.findByIdAndRemove(cardId)
      .orFail()
      .then(() => {
        res.status(OkStatus).send({ message: 'карточка удалена.' });
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
    })
};



const putCardLike = (req, res) => {
  cardShema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(CreatedStatus).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(CastErrorStatus).send({ message: 'CastError' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const deleteCardLike = (req, res) => {
  cardShema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(OkStatus).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(DocumentNotFoundErrorStatus).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(CastErrorStatus).send({ message: 'CastError' });
      } else {
        res.status(ServerErrorStatus).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
