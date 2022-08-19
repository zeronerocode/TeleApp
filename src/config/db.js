const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
}
})

pool.connect((err) => {
  if (err) {
    console.log("Database not connected");
  } else {
    console.log(`Database connected on ${process.env.DB_DATABASE}`);
  }
});


module.exports = pool