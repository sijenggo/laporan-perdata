import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { db } from "./db.js"
import path from "path";
import * as fs from 'fs'; // untuk stream, readFileSync, dll
import { fileURLToPath } from "url";
import cors from "cors";

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 🔹 Buat log 
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `(${timestamp}) [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, 'server-%DATE%.log'), // 📅 Nama file per minggu
            datePattern: 'YYYY-[W]WW', // 🗓️ Mingguan
            zippedArchive: true,
            maxFiles: '5w', // ⏳ Simpan 5 minggu
            maxSize: '20m'
        }),
    ]
});

// ✅ API select
app.get("/api/ambil_data", (req, res) => {
    const { column, from, where } = req.query; // ✅ ambil dari req.query
    logger.info('Log API ambil data'); // 🔹 Log API ambil data

    const query = `SELECT ${column} FROM ${from} WHERE ${where}`;

    db.query(query, (err, result) => {
        if (err) {
            logger.error("Error saat mengambil data:", err);
            console.error("Error saat mengambil data:", err);
            return res.json({ success: false, message: "Terjadi kesalahan saat eksekusi query" });
        }
        logger.info('Data berhasil diambil'); // 🔹 Log jika data berhasil diambil
        res.json({ success: true, message: "Query berhasil", data: result });
    });
});

app.listen(PORT, () => {
    logger.info(`✅ Server listening ON PORT ${PORT}`);
    console.log(`✅ Server listening ON PORT ${PORT}`);
});