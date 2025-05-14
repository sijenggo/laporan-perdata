import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';

// 🔹 Gunakan createPool agar lebih stabil
export const db = mysql.createPool({
    host: process.env.DB_2_HOST,
    user: process.env.DB_2_USER,
    password: process.env.DB_2_PASS,
    database: process.env.DB_2_DATABASE,
    connectionLimit: 10 // ✅ Menjaga performa
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error Connecting to MySQL:', err);
        return;
    }
    console.log(`✅ Connected to db_laper MySQL HOST = ${process.env.DB_2_HOST}`);
    connection.release(); // ✅ Lepaskan koneksi
});

export default db;
