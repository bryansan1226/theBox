require("dotenv").config();
const { Pool } = require("pg");

/*const database = process.env.PGDATABASE;

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${database}`;

const pool = new Pool({
  connectionString: connectionString,
});*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//db.connect();
pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end(),
};
