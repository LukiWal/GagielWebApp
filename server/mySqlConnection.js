const mysql = require('mysql2');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"admin123",
    database:"gaigel"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
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

// sessionId gameId socketId