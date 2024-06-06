const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 9000;

//====================================config and middleware==========================

const dbconfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zenmonk'
}

app.use(express.static("public"));
app.use(bodyParser.json());

const dbref = mysql.createConnection(dbconfig);

dbref.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("db connected successfully");
    }
});

app.listen(port, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});


//==============================================================API END POINTS =================================
app.get('/todo', function(req, res) {
    var sql = "SELECT * FROM todos";
    dbref.query(sql, (err, results) => {
        if (err) {
            res.status(500).send("ERROR IN reading full TODO LIST");
            console.log("error in reading TODO list");
            return;
        }
        res.json(results);
        console.log("reading all ids successfully");
    });
});

app.post('/todo', function(req, res) {
    const todo = req.body;
    var sql = "INSERT INTO todos SET ?";
    dbref.query(sql, todo, (err, results) => {
        if (err) {
            res.status(500).send("ERROR IN INSERTING TODO LIST");
            console.log("error in inserting TODO list");
            return;
        }
        res.status(201).json({ id: results.insertId, ...todo });
        console.log("inserted successfully");
    });
});

app.put('/todo/:id', function(req, res) {
    var sql = "UPDATE todos SET ? WHERE id=?";
    dbref.query(sql, [req.body, req.params.id], (err, results) => {
        if (err) {
            res.status(500).send("ERROR IN updating TODO LIST");
            console.log("error in updating TODO list");
            return;
        }
        res.json(req.body);
        console.log("updating successfully");
    });
});

app.delete('/todo/:id', function(req, res) {
    var sql = "DELETE FROM todos WHERE id=?";
    dbref.query(sql, [req.params.id], (err, results) => {
        if (err) {
            res.status(500).send("ERROR IN deleting TODO LIST");
            console.log("error in deleting TODO list");
            return;
        }
        res.json({ id: req.params.id });
        console.log("deleting successfully");
    });
});
