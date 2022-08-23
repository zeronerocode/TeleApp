const pool = require("../config/db");
const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const create = ({ id, email, password, fullname }) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users(id, email, password, fullname)VALUES($1, $2, $3, $4)",
      [id, email, password, fullname],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const getUsers = (idUser) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users where id <> $1",
      [idUser],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const getProfile = (idUser) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM users where id = $1`,
      [idUser],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const updateProfile = ({ photo, fullname, email, phone, updated_at }, id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE users SET photo = $1, updated_at = $2, fullname = $3, email = $4, phone = $5 WHERE id = $6",
      [photo, updated_at, fullname, email, phone, id],
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};
module.exports = {
  findByEmail,
  create,
  getUsers,
  updateProfile,
  getProfile,
};
