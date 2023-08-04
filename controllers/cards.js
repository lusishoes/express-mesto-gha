const cardShema = require('../models/card');
// работает
const getCards = (req, res) => {
    cardShema.find()
    .then((cards) => {
        return res.status(201).send(cards);
    })
    .catch((err)=> {
      if(err instanceof mongoose.Error.ValidationError) {
          res.status(400).send(err.message);
      } else {
          res.status(500).send(err.message)
      }
  })
}

// работает
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
    return cardShema.create({ name, link, owner })
    .then((card)=> {
        res.status(201).send(card)
    })
    .catch((err)=> {
      if(err instanceof mongoose.Error.ValidationError) {
          res.status(400).send(err.message);
      } else {
          res.status(500).send(err.message)
      }
  })
}

// работает
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  cardShema.findByIdAndRemove(cardId)
  .then(() => {
      res.status(201).send({ message: 'карточка удалена' })
  })
  .catch((err) => {
      res.status(404).send(err.message);
  });
}


const putCardLike = (req, res) => {


  cardShema.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send(err.message);
      } else if (err instanceof mongoose.Error.DocumentNotFoundError){
        res.status(404).send(err.message);
      } else {
        res.status(500).send(err.message);
      }
    });
};


const deleteCardLike = (req, res) => {
  cardShema.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(400).send(err.message);
      } else if (err instanceof mongoose.Error.DocumentNotFoundError){
        res.status(404).send(err.message);
      } else {
        res.status(500).send(err.message);
      }
    });
};


module.exports = {
    getCards,
    createCard,
    deleteCard,
    putCardLike,
    deleteCardLike
}

