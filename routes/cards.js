const router = require('express').Router();

const {
  getCards, createCard, deleteCard, putCardLike, deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', createCard); // создаёт карточку
router.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', putCardLike); // ставим лайк
router.delete('/cards/:cardId/likes', deleteCardLike); // удаляем лайк

module.exports = router;
