const { default: mongoose } = require('mongoose');
const UserModel = require('../models/user');
// 400 500 да
const getUsers = (req, res) => {
    UserModel.find()
    .then((users) => {
        return res.status(201).send(users);
    })
    .catch((err)=> {
      if(err instanceof mongoose.Error.ValidationError) {
          res.status(400).send(err.message);
      } else {
          res.status(500).send(err.message);
      }
  })
}

// 400 500 да
const getUserById = (req, res) => {
    const { userId } = req.params;

    UserModel.findById(userId)
    .then((user) => {

          return res.status(201).send(user);

    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError){
        res.status(404).send(err.message);
      } else {
        res.status(500).send(err.message);
      }
    });
}

// 400 500
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
    return UserModel.create( { name, about, avatar } )
    .then((user)=> {
        res.status(201).send(user);
    })
    .catch((err)=> {
      if(err instanceof mongoose.Error.ValidationError) {
          res.status(400).send(err.message);
      } else {
          res.status(500).send(err.message);
      }
  })
}
// работает
const updateUserProfile = (req, res) => {
  const { name, about} = req.body;

  if(req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidaotrs: true})
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if(err instanceof mongoose.Error.ValidationError) {
            res.status(400).send(err.message);
        } else if (err instanceof mongoose.Error.DocumentNotFoundError){
          res.status(404).send(err.message);
        }
      })
  } else {
    res.status(500).send(err.message);
  }
}
// работает
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if(req.user._id) {
    UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidaotrs: true})
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if(err instanceof mongoose.Error.ValidationError) {
            res.status(400).send(err.message);
        } else if (err instanceof mongoose.Error.DocumentNotFoundError){
            res.status(404).send(err.message);
        }
      })
  } else {
    res.status(500).send(err.message);
  }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserProfile,
    updateUserAvatar
}

