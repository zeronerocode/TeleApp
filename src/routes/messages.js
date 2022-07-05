const express = require('express')
const router = express.Router()
const {getMessage} = require('../controller/messages')
const { protect } = require('../middleware/auth.js')
// const { protect } = require('../middlewares/auth.js')

router
//   .post('/refresh-token', refreshToken)
  .get('/:receiver_id', protect, getMessage)
//   .delete('/:id', deleteUser)

module.exports = router