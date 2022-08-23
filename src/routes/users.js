const express = require('express')
const router = express.Router()
const { register, login, getUsers,} = require('../controller/authController.js')
const {updateImage, Profile} = require ('../controller/Profile')
const { protect } = require('../middleware/auth.js')
const upload = require("../middleware/multer");
// const { protect } = require('../middlewares/auth.js')

router
  .post('/register', register)
  .post('/login', login)
//   .post('/refresh-token', refreshToken)
  .get('/', protect, getUsers)
  .put('/update-image',protect,upload.single('photo'),updateImage)
  .get('/profile',protect, Profile)
//   .delete('/:id', deleteUser)

module.exports = router