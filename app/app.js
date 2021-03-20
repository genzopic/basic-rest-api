
// express
const express = require('express');
const app = express();
// sqlite3
const sqlite3 = require('sqlite3');
const dbPath = "app/db/database.sqlite3"

//----------------------------------------------------------------
// Get all users
// ex) GET /api/v1/users
//----------------------------------------------------------------
app.get('/api/v1/users', (req, res) => {
  const db = new sqlite3.Database(dbPath);

  db.all("select * from users",(err,rows) => {
    res.json(rows);
  })

  db.close;
});

//----------------------------------------------------------------
// Get a user
// ex) GET /api/v1/users/1
//----------------------------------------------------------------
app.get('/api/v1/users/:id', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const id = req.params.id;
  db.get(`select * from users where id = ${id}`,(err,row) => {
    res.json(row);
  })

  db.close;
});

//----------------------------------------------------------------
// Search users matching keyword
// ex) GET /api/v1/search?q=keyword
//----------------------------------------------------------------
app.get('/api/v1/search', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const keyword = req.query.q

  db.all(`select * from users where name like "%${keyword}%"`,(err,rows) => {
    res.json(rows);
  })

  db.close;
});

//------------------------------------------------------------
// port
//------------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port: " + port);
