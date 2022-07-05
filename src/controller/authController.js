const createError = require('http-errors')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { findByEmail, create, getUsers:modelGetUsers } = require('../models/users')
const commonHelper = require('../helper/response')
// const jwt = require('jsonwebtoken')
const authHelper = require('../helper/auth')
// const { sendEmail } = require('../helper/mail')

const register = async (req, res, next) => {
  try {
    const { email, password, fullname } = req.body
    console.log(req.body);
    const { rowCount } = await findByEmail(email)
    // console.log(rowCount);
    const salt = bcrypt.genSaltSync(10)
    const passwrodHash = bcrypt.hashSync(password, salt)

    // USER1 = '2sdfasdf'
    // password =abc123+2sdfasdf -> 123123sddsfa3edfs
    // USER2 =
    // password =abc123+123sdf34  -> 123123sddsf234sdfsdf

    if (rowCount) {
      return next(createError(403, 'user sudah terdaftar'))
    }
    const data = {
      id: uuidv4(),
      email,
      password: passwrodHash,
      fullname
    }
    console.log(data);
    await create(data)
    // sendEmail(email)
    commonHelper.response(res, null, 201, 'user berhasil resgiter')

  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { rows: [user] } = await findByEmail(email)
    // const user = rows[0]
    if (!user) {
      return commonHelper.response(res, null, 403, 'email atau password anda salah')
    }
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return commonHelper.response(res, null, 403, 'email atau password anda salah')
    }
    delete user.password

    const payload = {
      email: user.email,
      id: user.id,
    }
    // generate token
    user.token = authHelper.generateToken(payload)
    user.refreshToken = authHelper.gerateRefreshToken(payload)
    commonHelper.response(res, user, 201, 'anda berhasil login')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
// const profile = async(req, res, next)=>{
//   const email = req.decoded.email
//   const {rows: [user]} = await findByEmail(email)
//   delete user.password
//   commonHelper.response(res, user, 200)
// }

// const deleteUser = async(req, res, next) =>{

// }
// eslint-disable-next-line no-unused-vars
const getUsers = async(req, res, next)=>{
  const idUser = req.decoded.id
  const {rows} = await modelGetUsers(idUser)
  commonHelper.response(res, rows, 200)
}
// const refreshToken = (req, res, next)=>{
//   const refreshToken = req.body.refreshToken
//   const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
//   const payload = {
//     email: decoded.email,
//     role: decoded.role
//   }
//   const rusult = {
//     token: authHelper.generateToken(payload),
//     refreshToken: authHelper.gerateRefreshToken(payload)
//   }
//   commonHelper.response(res, rusult, 200)
// } 
module.exports = {
  register,
  login,
  getUsers
//   profile,
//   deleteUser,
//   refreshToken
}