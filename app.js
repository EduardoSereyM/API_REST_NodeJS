const express = require('express');
const mysql = require('mysql');
const colors = require('colors');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());


//DATABASE CONNECTION
var conexion = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b6501f40edd7e0',
    password: '7bfa543e',
    database: 'heroku_112688f3993912f'
});


conexion.connect(function (err) {
    if (err) {
        console.log('Ocurrio un error'.bgRed);
        throw err;
    } else {
        console.log('Conexion con la base de datos realizada exitosamente'.bgGreen);
    }
});


app.get('/', (req, res) => {
    res.send('<h1>Ruta de inicio<h1></br><p>API Rest con NodeJS<p>')
})


//READ ALL
app.get('/api/articulos', (req, res) => {
    conexion.query('select * from articulos', (err, data) => {
        if (err) {
            throw err;
        } else {
            res.send(data);
        }
    })
});


//READ ONLY ONE
app.get('/api/articulos/:id', (req, res) => {
    conexion.query('select * from articulos where id = ?', req.params.id, (err, data) => {
        if (err) {
            throw err;
        } else {
            // toda la data
            res.send(data);
            // solo la descripcion  * * * * 
            // res.send(data[0].descripcion);
        }
    });
});


//CREATE 
app.post('/api/articulos', (req, res) => {
    let data = {
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock
    };
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql, data, function (error, result) {
        if (error) {
            console.log(data['descripcion']);
            throw error;
        } else {
            res.send(result);
        };
    });
});



//UPDATE
app.put('/api/articulos/:id', (req, res) => {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = 'UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?';

    conexion.query(sql, [descripcion, precio, stock, id], function (err, data) {
        if (err) {
            console.log(data['descripcion']);
            throw err;
        } else {
            res.send(data);
        };
    });
});


//DELETE
app.delete('/api/articulos/:id', (req, res) => {
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function (err, data) {
        if (err) {
            throw err;
        } else {
            res.send(data);
        };
    });
});



var puerto = process.env.PORT || 8080;
app.listen(puerto, (err) => {
    err && console.log('Error: '.bgRed, err);
    console.log(`Conexion establecida en http://localhost:${puerto}`.green);
})