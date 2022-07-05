const express = require('express')
const router = express.Router()
// const categoryRoute = require('./category')
// const productRoute = require('./products')
const usersRoute = require('./users')
const messageRoute = require('./messages')

router
//   .use('/category', categoryRoute)
//   .use('/products', productRoute)
  .use('/users', usersRoute)
  .use('/messages', messageRoute)

module.exports = router