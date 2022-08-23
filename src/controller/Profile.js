/* eslint-disable no-unused-vars */
const createError = require("http-errors");
const commonHelper = require("../helper/response");
const cloudinary = require("../helper/cloudinary");
const {updateProfile,getProfile } = require('../models/users')

const Profile = async(req, res, next)=>{
  const idUser = req.decoded.id
  const {rows} = await getProfile(idUser)
  commonHelper.response(res, rows, 200, 'get profile success')
}

const updateImage = async (req, res, next) => {
  const id = req.decoded.id
  const {fullname, email, phone} = req.body
  const img = await cloudinary.uploader.upload(req.file.path)
  console.log('img =>',img.secure_url);
  try {
    const data = {
        fullname,
        email,
        phone,
        photo : img.secure_url,
        updated_at : new Date()
    }

    updateProfile(data, id)
    .then(()=>{
        commonHelper.response(res, data, 200,'update profile success')
    })

  } catch (error) {
    console.log(error);
    next(createError("Internal Server Error"));
  }
};

module.exports = {
  updateImage,
  Profile
};
