const mongoose = require('mongoose');
const cardShema = require('../models/card');

const getCards = (req, res) => {
  cardShema.find()
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return cardShema.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};
// Удаление карточки
// 29. Код ответа равен 200
//Удаление карточки с некорректным id
// 30. Код ответа равен 400
// Удаление карточки с несуществующим в БД id
// 31. Код ответа равен 404
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardShema.findByIdAndRemove(cardId)
    .then(() => {
      res.status(201).send({ message: 'карточка удалена.' });
    })
    .catch(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    });
};
// Добавление лайка с некорректным id карточки
// 18. Код ответа равен 400
// Добавление лайка с несуществующим в БД id карточки
// 19. В ответе приходит JSON-объект
//  20. Код ответа равен 404
//  21. Проверка возврата поля message
//  22. Ответ содержит message длинной больше 1 символа
const putCardLike = (req, res) => {
  cardShema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
      }
    });
};
//Удаление лайка у карточки с некорректным id
//23. Код ответа равен 400
//Удаление лайка у карточки с несуществующим в БД id
// 24. В ответе приходит JSON-объект
// 25. Код ответа равен 404
// 26. Проверка возврата поля message
// 27. Ответ содержит message длинной больше 1 символа
// Удаление лайка у карточки
//  28. Код ответа равен 200
const deleteCardLike = (req, res) => {
  cardShema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера.' });
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
