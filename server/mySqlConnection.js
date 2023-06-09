const mysql = require('mysql2');
const CREATE = require('./helper/createTablesConstants.js')

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

DB_NAME = "GaigelWebApp"
db.query("CREATE DATABASE IF NOT EXISTS " +DB_NAME +";", (err, result) => {
   
    if (err) throw err
    return;
});


db.query("USE " +DB_NAME +";", (err, result) => {
   
    if (err) throw err
    return;
});

db.query(CREATE.CREATE_GAMES_TABLE, (err, result) => {
   
    if (err) throw err
    return;
});

db.query(CREATE.CREATE_PLAYERS_TABLE, (err, result) => {
   
    if (err) throw err
    return;
});

db.query(CREATE.CREATE_ROUNDS_TABLE, (err, result) => {
   
    if (err) throw err
    return;
});

db.promise = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err){
                reject(new Error());
            }
            else{
                resolve(result);
            }
        });
    });
};

db.promiseInsert = (sql, values) => {

    return new Promise((resolve, reject) => {
        db.query(sql, [values], (err, result) => {
            if(err){
                reject(new Error());
            }
            else{
                resolve(result);
            }
        });
    });
};

db.promiseUpdate = (sql, values) => {

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if(err){
                reject(new Error());
            }
            else{
                resolve(result);
            }
        });
    });
};


module.exports = db

