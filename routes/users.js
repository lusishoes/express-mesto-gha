const router = require('express').Router();

const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUserInfo,
} = require('../controllers/users');

const {
  validateUserId, validateUserAvatar, validateUserData,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserData, updateUserProfile);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
