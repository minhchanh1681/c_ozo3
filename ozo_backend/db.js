const sql = require('mssql');

// const config = {
//     user: 'sa',
//     password: 'Itcs1995',
//     server: '127.0.0.1\\OBCINSTANCE3',
//     database: 'ozo3_tutorial',
//     options: {
//         encrypt: true, // Use this if you're on Windows Azure
//         trustServerCertificate: true // Change to true for local dev / self-signed certs
//     }
// };
const config = {
    user: 'chanh',
    password: 'itcs1995',
    server: 'localhost', // Không dùng instance name ở đây
    database: 'ozo3',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
        instanceName: 'MSSQLSERVER01' // Thêm instance name ở đây
    }
};

sql.connect(config, err => {
    if (err) console.log(err);
    else console.log('SQL Server Connected...');
});

module.exports = sql;
