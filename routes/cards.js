const router = require('express').Router();

const {
  getCards, createCard, deleteCard, putCardLike, deleteCardLike,
} = require('../controllers/cards');

const {
  validateCardCreation, validateCardById,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCardCreation, createCard);
router.delete('/:cardId', deleteCard); // validateCardById,
router.put('/:cardId/likes', validateCardById, putCardLike);
router.delete('/:cardId/likes', validateCardById, deleteCardLike);

module.exports = router;
