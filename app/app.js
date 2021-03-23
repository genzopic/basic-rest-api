// express
const express = require('express')
const app = express()
// sqlite3
const sqlite3 = require('sqlite3')
const dbPath = "app/db/database.sqlite3"
// static
const path = require('path')
const bodyParser = require('body-parser')
const { resolve } = require('path')
const { runInNewContext } = require('vm')
// リクエストのbodyをパースする設定
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// publicディレクトリを静的ファイル群のルートディレクトリとして設定
app.use(express.static(path.join(__dirname, 'public')))

//----------------------------------------------------------------
// Get all users
// ex) GET /api/v1/users
//----------------------------------------------------------------
app.get('/api/v1/users', (req, res) => {
  const db = new sqlite3.Database(dbPath)

  db.all("select * from users",(err,rows) => {
    res.json(rows)
  })

  db.close
})

//----------------------------------------------------------------
// Get a user
// ex) GET /api/v1/users/1
//----------------------------------------------------------------
app.get('/api/v1/users/:id', (req, res) => {
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id;

  db.get(`select * from users where id = ${id}`,(err,row) => {
    if (!row) {
      res.status(404).send({error:"Not Found!"})
    } else {
      res.status(200).json(row)
    }
  })

  db.close
})

//----------------------------------------------------------------
// Search users matching keyword
// ex) GET /api/v1/search?q=keyword
//----------------------------------------------------------------
app.get('/api/v1/search', (req, res) => {
  const db = new sqlite3.Database(dbPath)
  const keyword = req.query.q

  db.all(`select * from users where name like "%${keyword}%"`,(err,rows) => {
    res.json(rows);
  })

  db.close;
})

//----------------------------------------------------------------
// exec sql
//----------------------------------------------------------------
const run = async (sql, db) => {
  return new Promise((resolve,reject) => {
    db.run(sql, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve()
      }
    })
  })
}

//----------------------------------------------------------------
// Create a new user
// ex) POST /api/v1/users
//----------------------------------------------------------------
app.post('/api/v1/users', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error:"ユーザ名が指定されていません"})
  } else {
    // connect database
    const db = new sqlite3.Database(dbPath)
    
    const name = req.body.name
    const profile = req.body.profile ? req.body.profile : ""
    const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : ""

    try {
      await run(
        `insert into users (name, profile, date_of_birth) values ("${name}","${profile}","${date_of_birth}")`,
        db)
      res.status(201).send({message: "新規ユーザを作成しました！"})
    } catch (e) {
      res.status(500).send({error: e})
    }
      
    db.close()
  }
})

//----------------------------------------------------------------
// Update user data
// ex) POST /api/v1/users
//----------------------------------------------------------------
app.put('/api/v1/users/:id', async (req, res) => {
  if (!req.body.name || req.body.name === "") {
    res.status(400).send({error:"ユーザ名が指定されていません"})
  } else {
    const db = new sqlite3.Database(dbPath)
    const id = req.params.id

    // 現在のユーザ情報を取得する
    db.get(`select * from users where id = ${id}`,async (err,row) => {
      if (!row) {
        res.status(404).send({error:"指定されたユーザが見つかりません"})
      } else {
        const name = req.body.name ? req.body.name : row.name
        const profile = req.body.profile ? req.body.profile : row.profile
        const date_of_birth = req.body.date_of_birth ? req.body.date_of_birth : row.date_of_birth
  
        try {
          await run(
            `update users set name = "${name}", profile = "${profile}", date_of_birth = "${date_of_birth}" where id = ${id}`,
            db)
          res.status(200).send({message: "ユーザを更新しました！"})
        } catch (e) {
          res.status(500).send({error:e})
        }
      }

    })

    db.close()
  }
})

//----------------------------------------------------------------
// Delete user data
// ex) POST /api/v1/users
//----------------------------------------------------------------
app.delete('/api/v1/users/:id', async (req, res) => {
  const db = new sqlite3.Database(dbPath)
  const id = req.params.id

  // 現在のユーザ情報を取得する
  db.get(`select * from users where id = ${id}`,async (err,row) => {
    if (!row) {
      res.status(404).send({error:"指定されたユーザが見つかりません"})
    } else {
      try {
        await run(`delete from users where id = ${id}`,db)
        res.status(200).send({message: "ユーザを削除しました"})
      } catch (e) {
        res.status(500).send({error: e})
      }
    }
  })
  
  db.close()
})

//------------------------------------------------------------
// port
//------------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port);
console.log("Listen on port: " + port)
