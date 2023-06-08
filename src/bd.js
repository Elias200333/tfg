const mysql = require('mysql2');

// Configuración de conexión con la base de datos
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'permahosting'
});

// Conecta a MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a MySQL como id ' + connection.threadId);
});

// Promesa que devuelve el resultado de una query
async function query(query) {
    return new Promise((resolve, reject) => {
      connection.query(query,
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        }
      );
    });
}

// Establece una configuración base compatible con la base de datos
query(`SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`)

module.exports = { query }