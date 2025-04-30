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

// ✅ API select Data EIS
const queryMap = {
    kin1: `
        SELECT 
            perkara.nomor_perkara as 'Nomor Perkara',
            IF(perkara.alur_perkara_id > 100, perkara_penetapan_hari_sidang.tanggal_sidang, perkara.tanggal_pendaftaran) as 'Tgl Pendaftaran(Perdata) / Sidang Pertama(Pidana)',
            perkara_putusan.tanggal_putusan as 'Tgl Putusan',
            CONCAT(
                DATEDIFF(
                    perkara_putusan.tanggal_putusan,
                    IF(perkara.alur_perkara_id > 100, perkara_penetapan_hari_sidang.tanggal_sidang, perkara.tanggal_pendaftaran)
                )
            , ' Hari') AS Hari,
            IF(
                DATEDIFF(
                    perkara_putusan.tanggal_putusan,
                    IF(perkara.alur_perkara_id > 100, perkara_penetapan_hari_sidang.tanggal_sidang, perkara.tanggal_pendaftaran)
                ) > 186, 1, 0
            ) AS kesesuaian
        FROM
            perkara
        JOIN perkara_putusan ON perkara.perkara_id = perkara_putusan.perkara_id
        JOIN perkara_penetapan_hari_sidang ON perkara.perkara_id = perkara_penetapan_hari_sidang.perkara_id
        WHERE 
            perkara_putusan.tanggal_putusan BETWEEN ? AND ?
            AND perkara.alur_perkara_id <> 114
        ORDER BY DATEDIFF(perkara_putusan.tanggal_putusan,perkara_penetapan_hari_sidang.tanggal_sidang) DESC
    `,
    kin2: `
        SELECT
            value as 'ver.Satker'
        FROM
            sys_config
        WHERE id = 80`,
    kin3: `
        SELECT
            CONCAT('PN ', value) as 'Kode Satker'
        FROM
            sys_config
        WHERE id = 61`,
    kin4: `
        SELECT
            IF
                (
                    tgl_delegasi = '0000-00-00' 
                OR 
                    tgl_delegasi IS NULL, '-', DATE_FORMAT(tgl_delegasi, '%Y-%m-%d')
                ) AS 'Tgl Delegasi Masuk',
            dm.pn_asal_text AS 'PN Pengaju',
            jenis_delegasi_text AS 'Jenis Delegasi',
            IF
                (
                    tgl_surat_diterima = '0000-00-00' 
                OR 
                    tgl_surat_diterima IS NULL, '-', DATE_FORMAT(tgl_surat_diterima, '%Y-%m-%d')
                ) AS 'Tgl Surat ',
            IF
                (
                    tgl_penunjukan_jurusita = '0000-00-00' 
                OR 
                    tgl_penunjukan_jurusita IS NULL, '-', DATE_FORMAT(tgl_penunjukan_jurusita, '%Y-%m-%d')
                ) AS 'Tgl Penunjukan JS',
            IF
                (
                    tgl_relaas = '0000-00-00' 
                OR 
                    tgl_relaas IS NULL, '-', DATE_FORMAT(tgl_relaas, '%Y-%m-%d')
                ) AS 'Tgl Relaas',
            CONCAT(DATEDIFF(tgl_relaas,tgl_delegasi), ' Hari') AS 'Pelaksanaan',
            jurusita_nama AS 'JS',
            IF(
                DATEDIFF(
                    IF(tgl_relaas = '0000-00-00' OR tgl_relaas IS NULL, '-', DATE_FORMAT(tgl_relaas, '%Y-%m-%d')),
                    tgl_delegasi
                ) > 7, 1, 0
            ) AS kesesuaian
        FROM 
            delegasi_masuk AS dm
        LEFT JOIN 
            delegasi_proses_masuk AS dp ON dm.id = dp.delegasi_id
        WHERE 
            tgl_delegasi BETWEEN ? AND ?
        GROUP BY 
            dm.perkara_id`,
    kin5: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            CASE(pm.hasil_mediasi)
                WHEN 'Y1' THEN 'Berhasil Dengan Kesepatakan'
                WHEN 'Y2' THEN 'Berhasil Dengan Pencabutan'
                WHEN 'S' THEN 'Berhasil Sebagian'
                WHEN 'T' THEN 'Tidak Berhasil'
                WHEN 'D' THEN 'Tidak dapat dilaksanakan'
                ELSE 'Tidak ada data'
            END AS 'Hasil Mediasi',
            pm.mediator_text AS 'Mediator',
            pm.tgl_laporan_mediator AS 'Tgl Laporan Mediator',
            IF(
                pm.hasil_mediasi NOT IN ('Y1', 'Y2', 'S'), 1, 0) AS kesesuaian
        FROM perkara_mediasi AS pm
        LEFT JOIN perkara AS p ON pm.perkara_id = p.perkara_id
        WHERE 
            pm.keputusan_mediasi BETWEEN ? AND ?
        ORDER BY 
            pm.keputusan_mediasi ASC`,
    kep1: `
        SELECT 
            nomor_perkara AS 'Nomor Perkara', 
            tanggal_pendaftaran AS ' Tgl Pendaftaran', 
            diinput_tanggal AS 'Tgl Input',
            CONCAT(DATEDIFF(diinput_tanggal, tanggal_pendaftaran), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(diinput_tanggal, tanggal_pendaftaran) > 1
                OR
                diinput_tanggal IS NULL
                OR
                diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara
        WHERE 
            alur_perkara_id <> 114
            AND tanggal_pendaftaran BETWEEN ? AND ?`,
    kep2: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pp.panitera_pengganti_text AS 'PP',
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM perkara_barang_bukti pbb WHERE pbb.perkara_id = p.perkara_id
                ) 
                THEN 'Ada data barang bukti'
                ELSE 'Tidak ada data barang bukti'
            END AS 'Data Barang Bukti',
            IF(
                EXISTS (
                    SELECT 1 FROM perkara_barang_bukti pbb WHERE pbb.perkara_id = p.perkara_id
                ), 0, 1
            ) AS kesesuaian
        FROM
            perkara AS p
        LEFT JOIN
            perkara_penetapan AS pp ON pp.perkara_id=p.perkara_id
        WHERE 
            alur_perkara_id>100 AND alur_perkara_id<>114
        AND 
            (p.tanggal_pendaftaran BETWEEN ? AND ?)`,
    kep3: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep4: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep5: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep6: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep7: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep8: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep9: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep10: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep11: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep12: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep13: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep14: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep15: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep16: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep17: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep18: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep19: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep20: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep21: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep22: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep23: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep24: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep25: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel1: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel2: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel3: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel4: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel5: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel6: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel7: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel8: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel9: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel10: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kel11: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes1: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes2: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes3: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes4: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes5: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes6: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kes10: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
};
  
app.get("/api/data_eis", (req, res) => {
    const { unsur, date1, date2 } = req.query;
  
    logger.info(`Log API select Data EIS - unsur: ${unsur}`);
  
    if (!unsur || !queryMap[unsur]) {
      logger.error("Unsur tidak valid");
      return res.status(400).json({ success: false, message: "Unsur tidak valid" });
    }
  
    const query = queryMap[unsur];
  
    // ✅ Buat list unsur yang TIDAK butuh tanggal
    const noDateParams = ['kin2', 'kin3'];
  
    // Kalau unsur tidak ada di list noDateParams, berarti dia butuh date1 & date2
    const params = noDateParams.includes(unsur) ? [] : [date1, date2];
  
    // Opsional: validasi kalau date1/date2 kosong
    if (!noDateParams.includes(unsur) && (!date1 || !date2)) {
      return res.status(400).json({ success: false, message: "Parameter tanggal tidak lengkap" });
    }
  
    db.query(query, params, (err, result) => {
      if (err) {
        logger.error("Error saat mengambil data:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat eksekusi query" });
      }
  
      logger.info(`Data berhasil diambil untuk unsur ${unsur}`);
      res.json({ success: true, message: "Query berhasil", data: result });
    });
});
  

app.listen(PORT, () => {
    logger.info(`✅ Server listening ON PORT ${PORT}`);
    console.log(`✅ Server listening ON PORT ${PORT}`);
});