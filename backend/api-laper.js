import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { db as db, dbStatus as db1status } from "./db.js" 
import { db as db2, dbStatus as db2status } from "./db2.js"
import path from "path";
import multer from 'multer';

import * as fs from 'fs';
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
            pm.keputusan_mediasi DESC`,
    kep1: `
        SELECT 
            nomor_perkara AS 'Nomor Perkara', 
            tanggal_pendaftaran AS ' Tgl Pendaftaran', 
            diinput_tanggal AS 'Tgl Input',
            CONCAT(DATEDIFF(diinput_tanggal, tanggal_pendaftaran), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(diinput_tanggal, tanggal_pendaftaran) > 0
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
            pppn.panitera_nama AS 'PP',
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
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        WHERE 
            alur_perkara_id>100 AND alur_perkara_id<>114
        AND 
            (p.tanggal_pendaftaran BETWEEN ? AND ?)`,
    kep3: `
        SELECT 
            nomor_perkara AS 'Nomor Perkara',
            tanggal_pendaftaran AS 'Tgl Pendaftaran',
            (
                SELECT
                    MIN(pph.tanggal_penetapan)
                FROM
                    perkara_hakim_pn AS pph
                WHERE 
                    pph.perkara_id = p.perkara_id    
            ) as 'Tgl Penetapan Majelis/Hakim Pertama',
            CONCAT(
                DATEDIFF(
                    (
                        SELECT
                            MIN(pph.tanggal_penetapan)
                        FROM
                            perkara_hakim_pn AS pph
                        WHERE 
                            pph.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                )
            , ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(
                    (
                        SELECT
                            MIN(pph.tanggal_penetapan)
                        FROM
                            perkara_hakim_pn AS pph
                        WHERE 
                            pph.perkara_id = p.perkara_id    
                    ), 
                    tanggal_pendaftaran
                ) > 3
                OR
                pp.penetapan_majelis_hakim IS NULL
                OR
                pp.penetapan_majelis_hakim = '', 1, 0
            ) as kesesuaian
        FROM 
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id = p.perkara_id
        WHERE 
            p.alur_perkara_id <> 114 
        AND 
            p.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep4: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.tanggal_pendaftaran AS 'Tgl Pendaftaran',
            (
                SELECT 
                    MIN(ppn.tanggal_penetapan)
                FROM 
                    perkara_panitera_pn AS ppn
                WHERE 
                    ppn.perkara_id = p.perkara_id
            ) AS 'Tgl Penetapan Pertama PP',
            CONCAT(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_panitera_pn AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                )
            , ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_panitera_pn AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                ) > 3
                OR
                pp.penetapan_panitera_pengganti IS NULL
                OR
                pp.penetapan_panitera_pengganti = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id = p.perkara_id
        WHERE 
            p.alur_perkara_id <> 114
        AND 
            p.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep5: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.tanggal_pendaftaran AS 'Tgl Pendaftaran',
            (
                SELECT 
                    MIN(ppn.tanggal_penetapan)
                FROM 
                    perkara_jurusita AS ppn
                WHERE 
                    ppn.perkara_id = p.perkara_id
            ) AS 'Tgl Penetapan Pertama JS / JSP',
            CONCAT(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_jurusita AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                )
            , ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_jurusita AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                ) > 3
                OR
                pp.penetapan_jurusita IS NULL
                OR
                pp.penetapan_jurusita = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id = p.perkara_id
        WHERE 
            (p.alur_perkara_id <> 114) AND (p.alur_perkara_id < 100)
        AND 
            p.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep6: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.tanggal_pendaftaran AS 'Tgl Pendaftaran',
            (
                SELECT 
                    MIN(ppn.tanggal_penetapan)
                FROM 
                    perkara_penetapan_hari_sidang AS ppn
                WHERE 
                    ppn.perkara_id = p.perkara_id
            ) AS 'Tgl Penetapan Pertama Hari Sidang Pertama',
            CONCAT(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_penetapan_hari_sidang AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                )
            , ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(
                    (
                        SELECT
                            MIN(ppn.tanggal_penetapan)
                        FROM
                            perkara_penetapan_hari_sidang AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id    
                    ),
                    tanggal_pendaftaran
                ) > 3
                OR
                pp.penetapan_hari_sidang IS NULL
                OR
                pp.penetapan_hari_sidang = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id = p.perkara_id
        WHERE 
            (p.alur_perkara_id <> 114) AND (p.alur_perkara_id <> 118)
        AND 
            p.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep7: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            ppen.tanggal_penuntutan AS 'Tgl Tuntutan',
            LEFT(ppen.diinput_tanggal, 10) AS 'Tgl Input',
            pppn.panitera_nama AS 'PP',
            CONCAT(
                DATEDIFF(
                    LEFT(ppen.diinput_tanggal, 10),
                    ppen.tanggal_penuntutan
                )
            , ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(
                    LEFT(ppen.diinput_tanggal, 10),
                    ppen.tanggal_penuntutan
                ) > 0,
            1, 0) AS kesesuaian
        FROM
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_penuntutan AS ppen ON ppen.perkara_id=p.perkara_id
        WHERE 
            ppen.tanggal_penuntutan BETWEEN ? AND ?
        AND 
            (p.alur_perkara_id>100) AND (p.alur_perkara_id<>114)`,
    kep8: `
         SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            pput.tanggal_putusan AS 'Tgl Putusan',
            pput.amar_putusan AS 'Amar Putusan',
            pput.amar_putusan_dok AS 'Amar Putusan Doc',
            IF(
                pput.amar_putusan IS NULL
                OR
                pput.amar_putusan = ''
                OR
                pput.amar_putusan_dok IS NULL
                OR
                pput.amar_putusan_dok = '', 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id=p.perkara_id
        JOIN 
            perkara_putusan AS pput ON pput.perkara_id=p.perkara_id
        WHERE 
            (pput.tanggal_putusan BETWEEN ? AND ?)
        AND 
            (p.alur_perkara_id<>114)`,
    kep9: `
         SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            pput.tanggal_putusan AS 'Tgl Putusan',
            pput.tanggal_minutasi AS 'Tgl Minutasi',
            CONCAT(
                DATEDIFF(
                    pput.tanggal_minutasi,
                    pput.tanggal_putusan
                )
            , ' Hari') AS 'Waktu Input',
            pppn.panitera_nama AS 'PP',
            IF(
                DATEDIFF(
                    pput.tanggal_minutasi,
                    pput.tanggal_putusan
                ) > 1
                OR
                    pput.tanggal_minutasi IS NULL
                OR
                    pput.tanggal_minutasi = ''
                , 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_putusan AS pput ON pput.perkara_id=p.perkara_id
        WHERE 
            (pput.tanggal_putusan BETWEEN ? AND ?)
        AND 
            (p.alur_perkara_id<>114)`,
    kep10: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            pput.tanggal_putusan AS 'Tgl Putusan',
            pput.tanggal_minutasi AS 'Tgl Minutasi',
            CONCAT(
                DATEDIFF(
                    pput.tanggal_minutasi,
                    pput.tanggal_putusan
                )
            , ' Hari') AS 'Waktu Input',
            pppn.panitera_nama AS 'PP',
            (CASE
                WHEN (p.alur_perkara_id < 100 && DATEDIFF(pput.tanggal_minutasi, pput.tanggal_putusan) > 14 ) OR (pput.tanggal_minutasi IS NULL) OR (pput.tanggal_minutasi = '') THEN 1
                WHEN (p.alur_perkara_id < 100 && DATEDIFF(pput.tanggal_minutasi, pput.tanggal_putusan) > 7 ) OR (pput.tanggal_minutasi IS NULL) OR (pput.tanggal_minutasi = '') THEN 1
                ELSE 0
            END) AS kesesuaian
        FROM
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_putusan AS pput ON pput.perkara_id=p.perkara_id
        WHERE 
            (pput.tanggal_putusan BETWEEN ? AND ?)
        AND 
            (p.alur_perkara_id<>114)`,
    kep11: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            perban.nomor_perkara_banding AS 'Nomor Perkara Banding',
            perban.permohonan_banding AS 'Tgl Permohonan Banding',
            perban.diinput_tanggal AS 'Tgl Jam Input Banding',
            CONCAT(DATEDIFF(LEFT(perban.diinput_tanggal, 10),permohonan_banding), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(perban.diinput_tanggal, 10), permohonan_banding) > 0
                OR
                perban.diinput_tanggal IS NULL
                OR
                perban.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id=p.perkara_id
        JOIN 
            perkara_banding AS perban ON perban.perkara_id=p.perkara_id
        WHERE 
            perban.diinput_tanggal BETWEEN ? AND ?
        AND 
            (p.alur_perkara_id<>114)
        ORDER BY
            perban.permohonan_banding DESC`,
    kep12: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            perkas.nomor_perkara_kasasi AS 'Nomor Perkara Kasasi',
            perkas.permohonan_kasasi AS 'Tgl Permohonan Kasasi',
            perkas.diinput_tanggal AS 'Tgl Jam Input Kasasi',
            CONCAT(DATEDIFF(LEFT(perkas.diinput_tanggal, 10),permohonan_kasasi), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(perkas.diinput_tanggal, 10), permohonan_kasasi) > 0
                OR
                perkas.diinput_tanggal IS NULL
                OR
                perkas.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id=p.perkara_id
        JOIN
            perkara_kasasi AS perkas ON perkas.perkara_id=p.perkara_id
        WHERE 
            permohonan_kasasi BETWEEN ? AND ?
        AND 
            (p.alur_perkara_id<>114)
        ORDER BY
            permohonan_kasasi DESC`,
    kep13: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            perpk.nomor_perkara_kasasi AS 'Nomor Perkara Kasasi',
            perpk.permohonan_pk AS 'Tgl Permohonan PK',
            perpk.diinput_tanggal AS 'Tgl Jam Input Permohonan PK',
            CONCAT(DATEDIFF(LEFT(perpk.diinput_tanggal, 10), permohonan_pk), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(perpk.diinput_tanggal, 10), permohonan_pk) > 0
                OR
                perpk.diinput_tanggal IS NULL
                OR
                perpk.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan AS pp ON pp.perkara_id=p.perkara_id
        JOIN 
            perkara_pk AS perpk ON perpk.perkara_id=p.perkara_id
        WHERE 
            permohonan_pk BETWEEN ? AND ?
        AND 
            (p.alur_perkara_id<>114)
        ORDER BY
            permohonan_pk DESC`,
    kep14: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep15: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep16: `SELECT perkara.nomor_perkara FROM perkara WHERE perkara.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep17: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pput.tanggal_putusan AS 'Tgl Putusan',
            ppro.diinput_tanggal AS 'Tgl Input Pemberitahuan Putusan',
            CONCAT(DATEDIFF(LEFT(ppro.diinput_tanggal, 10), kurung.tanggal_pemberitahuan_putusan_min), ' Hari') AS 'Waktu Input Pemberitahuan Putusan',
            IF(
                DATEDIFF(
                    LEFT(ppro.diinput_tanggal, 10)
                    ,kurung.tanggal_pemberitahuan_putusan_min
                ) > 1, 
            1, 0) AS kesesuaian  
        FROM 
            (
                SELECT 
                    perkara_id,
                    MIN(tanggal_pemberitahuan_putusan) AS tanggal_pemberitahuan_putusan_min
                FROM 
                    perkara_putusan_pemberitahuan_putusan 
                GROUP BY 
                    perkara_id
            ) AS kurung
        INNER JOIN 
            perkara AS p ON kurung.perkara_id = p.perkara_id
        INNER JOIN
            perkara_putusan AS pput ON pput.perkara_id = kurung.perkara_id
        LEFT JOIN 
            perkara_proses AS ppro ON kurung.perkara_id = ppro.perkara_id AND ppro.proses_id = 218
        WHERE
            (
                p.alur_perkara_id <> 114
            )
        AND 
            (kurung.tanggal_pemberitahuan_putusan_min BETWEEN ? AND ?) `,
    kep18: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            p.tanggal_pendaftaran AS 'Tgl Pendaftaran',
            kurung.tanggal_penetapan AS 'Tgl Penetapan Majelis/Hakim',
            kurung.diinput_tanggal AS 'Tgl Jam Input Penetapan Majelis Hakim',
            CONCAT(DATEDIFF(LEFT(kurung.diinput_tanggal, 10), tanggal_penetapan), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(kurung.diinput_tanggal, 10), tanggal_penetapan) > 0
                OR
                kurung.diinput_tanggal IS NULL
                OR
                kurung.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            (
                SELECT 
                    * 
                FROM 
                    perkara_hakim_pn 
                WHERE 
                    perkara_hakim_pn.tanggal_penetapan BETWEEN ? AND ?
                GROUP BY
                    perkara_id
            ) AS kurung ON kurung.perkara_id=p.perkara_id
        WHERE 
            p.alur_perkara_id<>114`,
    kep19: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.tanggal_pendaftaran AS 'Tgl Pendaftaran',
            (
                SELECT 
                    MAX(ppn.tanggal_penetapan)
                FROM 
                    perkara_panitera_pn AS ppn
                WHERE 
                    ppn.perkara_id = p.perkara_id
            ) AS 'Tgl Penetapan Terbaru PP',
            (
                SELECT 
                    COUNT(*)
                FROM 
                    perkara_panitera_pn AS ppn
                WHERE 
                    ppn.perkara_id = p.perkara_id
            ) AS 'Jumlah Penetapan PP',
            pppn.panitera_nama AS 'PP',
            IF(
                DATEDIFF(
                    (
                        SELECT 
                            MAX(ppn.tanggal_penetapan)
                        FROM 
                            perkara_panitera_pn AS ppn
                        WHERE 
                            ppn.perkara_id = p.perkara_id
                    ), 
                    p.tanggal_pendaftaran
                ) > 1
            , 1, 0) AS kesesuaian
        FROM
            perkara as p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        WHERE 
            p.alur_perkara_id <> 114
        AND 
            p.tanggal_pendaftaran BETWEEN ? AND ?`,
    kep20: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            kurung.tanggal_penetapan AS 'Tgl Penetapan Hari Sidang',
            LEFT(kurung.diinput_tanggal, 10) AS 'Tgl Input Penetapan',
            CONCAT(DATEDIFF(LEFT(kurung.diinput_tanggal, 10), kurung.tanggal_penetapan), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(kurung.diinput_tanggal, 10), kurung.tanggal_penetapan) > 1
                OR
                kurung.diinput_tanggal IS NULL
                OR
                kurung.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN 
            (
                SELECT 
                    * 
                FROM 
                    perkara_penetapan_hari_sidang 
                WHERE 
                    perkara_penetapan_hari_sidang.tanggal_penetapan BETWEEN ? AND ?
            ) AS kurung ON kurung.perkara_id=p.perkara_id
        WHERE 
            alur_perkara_id<>114`,
    kep21: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            kurung.tanggal_penetapan AS 'Tgl Penetapan JS / JSP',
            LEFT(kurung.diinput_tanggal, 10) AS 'Tgl Input Penetapan JS / JSP',
            CONCAT(DATEDIFF(LEFT(kurung.diinput_tanggal, 10), kurung.tanggal_penetapan), ' Hari') AS 'Waktu Input',
            IF(
                DATEDIFF(LEFT(kurung.diinput_tanggal, 10), kurung.tanggal_penetapan) > 1
                OR
                kurung.diinput_tanggal IS NULL
                OR
                kurung.diinput_tanggal = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            (
                SELECT 
                    * 
                FROM 
                    perkara_jurusita 
                WHERE 
                    perkara_jurusita.tanggal_penetapan BETWEEN ? AND ?
                GROUP BY 
                    perkara_jurusita.perkara_id
            ) AS kurung ON kurung.perkara_id=p.perkara_id
        WHERE 
            (alur_perkara_id <> 114) AND (alur_perkara_id < 100)`,
    kep22: `
        SELECT 
            dm.pn_asal_text AS 'PN Pengaju',
            dpm.nomor_relaas AS 'Nomor Relaas',
            dpm.tgl_relaas AS 'Tgl Relaas',
            dpm.tgl_pengiriman_relaas AS 'Tgl Pengiriman Relaas',
            dpm.jurusita_nama AS 'Jurusita',
            CONCAT(DATEDIFF(dpm.tgl_pengiriman_relaas, dpm.tgl_relaas), ' Hari') AS 'Waktu Input',
            dfm.file AS 'File',
            IF(
                DATEDIFF(dpm.tgl_pengiriman_relaas, dpm.tgl_relaas) > 1
                OR
                dpm.tgl_pengiriman_relaas IS NULL
                OR
                dpm.tgl_pengiriman_relaas = '', 1, 0
            ) AS kesesuaian
        FROM
            delegasi_masuk AS dm
        JOIN
            delegasi_proses_masuk AS dpm ON dpm.delegasi_id = dm.id
        JOIN
            delegasi_file_masuk AS dfm ON dfm.delegasi_id = dm.id AND dfm.status_file = 2
        WHERE 
            dpm.tgl_relaas BETWEEN ? AND ?
        AND
            dpm.id_status_delegasi <> 9
        GROUP BY 
            dpm.delegasi_id`,
    kep23: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pjs.tanggal_sidang AS 'Tgl Sidang',
            pjs.diinput_tanggal AS 'Tgl Jam Diinput',
            pjs.diperbaharui_tanggal AS 'Tgl Jam Diperbaharui',
            CONCAT(
                DATEDIFF(
                    LEFT(pjs.diperbaharui_tanggal,10)
                    ,tanggal_sidang
                ) <> 0
            , ' Hari') AS 'Waktu Input',
            pjs.ditunda AS 'Ket',
            1 AS kesesuaian
        FROM
            perkara_jadwal_sidang AS pjs
        JOIN
            perkara AS p ON pjs.perkara_id = p.perkara_id
        JOIN
            perkara_putusan AS pput ON pput.perkara_id = p.perkara_id
        WHERE
            p.alur_perkara_id NOT IN (114)
        AND
            (
                pjs.tanggal_sidang BETWEEN ? AND ?
                OR
                LEFT(pjs.diinput_tanggal, 10) BETWEEN ? AND ?
                OR
                LEFT(pjs.diperbaharui_tanggal, 10) BETWEEN ? AND ?
                OR
                LEFT(pjs.diedit_tanggal, 10) BETWEEN ? AND ?
            )
        GROUP BY
            pjs.id`,
    kep24: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pt.tanggal_surat AS 'Tgl Surat',
            LEFT(pt.diinput_tanggal, 10) AS 'Tgl Input', 
            CONCAT(
                DATEDIFF(
                    LEFT(pt.diinput_tanggal, 10)
                    ,pt.tanggal_surat
                )
            , ' Hari') AS 'Waktu Input',
            pppn.panitera_nama AS 'PP',
            IF(
                DATEDIFF(
                    LEFT(pt.diinput_tanggal, 10)
                    ,pt.tanggal_surat
                ) > 0
            , 1, 0) AS kesesuaian
        FROM 
            penahanan_terdakwa AS pt
        JOIN 
            perkara AS p ON pt.perkara_id = p.perkara_id
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        WHERE 
            pt.tanggal_surat BETWEEN ? AND ?
        AND 
            pt.jenis_penahanan_id IN (7,8)
        ORDER BY
            p.tanggal_pendaftaran`,
    kep25: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            pjs.tanggal_sidang AS 'Tgl Sidang',
            pjs.agenda AS 'Agenda',
            pjs.diinput_tanggal AS 'Tgl Jam Input',
            1 AS kesesuaian
        FROM 
            perkara_jadwal_sidang AS pjs
        JOIN 
            perkara AS p ON pjs.perkara_id = p.perkara_id
        WHERE 
            pjs.tanggal_sidang BETWEEN ? AND ?
        AND 
            p.alur_perkara_id NOT IN (114)
        AND 
            (
                pjs.agenda REGEXP '[[:<:]]putusan[[:>:]]'
                OR
                pjs.agenda REGEXP '[[:<:]]putus[[:>:]]'
                OR 
                pjs.agenda REGEXP '[[:<:]]penetapan[[:>:]]'
                AND
                pjs.agenda NOT LIKE '%mediasi%'
                AND
                pjs.agenda NOT LIKE '%kembali%'
                AND
                pjs.agenda NOT LIKE '%putusan sela%'
            )`,
    kel1: `
        SELECT
            p.nomor_perkara as 'Nomor Perkara',
            pppn.panitera_nama AS PP,
            p.tanggal_pendaftaran as 'Tgl Pendaftaran',
            CASE
                WHEN p.alur_perkara_id < 100 AND p.petitum_dok IS NULL THEN 'Petitum belum diupload'
                WHEN p.alur_perkara_id > 100 AND p.dakwaan_dok IS NULL THEN 'Dakwaan belum diupload'
                ELSE 'Dokumen lengkap'
            END AS Dokumen,
            CASE
                WHEN p.alur_perkara_id < 100 AND p.petitum_dok IS NULL THEN 1
                WHEN p.alur_perkara_id > 100 AND p.dakwaan_dok IS NULL THEN 1
                ELSE 0
            END AS kesesuaian
        FROM 
            perkara as p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        WHERE 
            p.tanggal_pendaftaran BETWEEN ? AND ?
        AND 
            p.alur_perkara_id NOT IN (114)`,
    kel2: `
        SELECT 
            p.nomor_perkara as 'Nomor Perkara',
            pjs.tanggal_sidang as 'Tgl Sidang',
            pjs.agenda as 'Agenda',
            pppn.panitera_nama AS PP,
            1 AS kesesuaian
        FROM 
            v_jadwal_sidang AS pjs
        JOIN 
            perkara AS p ON p.perkara_id = pjs.perkara_id
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        WHERE 
            pjs.tanggal_sidang BETWEEN ? AND ?
        AND 
            pjs.agenda LIKE '%saksi%'
        ORDER BY 
            pjs.tanggal_sidang DESC`,
    kel3: `
         SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pppn.panitera_nama AS PP,
            pjs.agenda AS 'Agenda',
            pjs.tanggal_sidang AS 'Tgl Sidang',
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM perkara_penuntutan pp2 WHERE pp2.perkara_id = p.perkara_id
                ) 
                THEN 'Ada dokumen tuntutan'
                ELSE 'Tidak ada dokumen tuntutan'
            END AS 'Data Tuntutan',
            1 AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_jadwal_sidang AS pjs ON pjs.perkara_id = p.perkara_id
        JOIN 
            perkara_penetapan as ppn ON ppn.perkara_id = p.perkara_id
        WHERE 
            pjs.tanggal_sidang BETWEEN ? AND ?
        AND 
            pjs.tanggal_sidang <= CURDATE()
        AND 
            (pjs.agenda LIKE '%tuntutan%' OR pjs.agenda LIKE '%penuntutan%')
        GROUP BY 
            p.nomor_perkara
        ORDER BY 
            pjs.tanggal_sidang DESC`,
    kel4: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pjs.agenda AS 'Agenda',
            pjs.tanggal_sidang AS 'Tgl Sidang',
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM perkara_putusan pp2 WHERE pp2.perkara_id = p.perkara_id
                ) 
                THEN 'Ada dokumen putusan'
                ELSE 'Tidak ada dokumen putusan'
            END AS 'Data Putusan',
            IF(
                EXISTS (
                    SELECT 1 FROM perkara_putusan pp2 WHERE pp2.perkara_id = p.perkara_id
                ), 0, 1 
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_jadwal_sidang AS pjs ON pjs.perkara_id = p.perkara_id
        WHERE 
            pjs.tanggal_sidang BETWEEN ? AND ?
        AND 
            pjs.tanggal_sidang <= CURDATE()
        AND 
            p.alur_perkara_id NOT IN (114)
        AND 
            (pjs.agenda LIKE '%putusan%' OR pjs.agenda LIKE '%penetapan%')
        AND 
            (
                pjs.agenda NOT LIKE '%sela%'
                AND 
                pjs.agenda NOT LIKE '%putusan sela%'
                AND 
                pjs.agenda NOT LIKE '%penetapan sela%'
                AND 
                pjs.agenda NOT LIKE '%kembali%'
                AND 
                pjs.agenda NOT LIKE '%mediasi%'
            )
        GROUP BY 
            p.nomor_perkara
        ORDER BY 
            pjs.tanggal_sidang DESC`,
    kel5: `
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
                pm.tgl_laporan_mediator IS NULL
                OR
                pm.tgl_laporan_mediator = ''
                , 1, 0
            ) AS kesesuaian
        FROM 
            perkara_mediasi AS pm
        JOIN 
            perkara AS p ON pm.perkara_id = p.perkara_id
        WHERE 
            pm.keputusan_mediasi BETWEEN ? AND ?
        ORDER BY 
            pm.keputusan_mediasi DESC`,
    kel6: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            CASE(pd.kesepakatan_melaksanakan_diversi)
                WHEN 1 THEN 'Sepakat'
                ELSE 'Tidak Sepakat'
            END AS 'Kesepakatan Diversi',
            CASE(pd.hasil_diversi)
                WHEN 1 THEN 'Diversi Berhasil'
                ELSE 'Diversi Gagal'
            END AS 'Hasil Diversi',
            pd.tgl_laporan_hakim AS 'Tgl Laporan Diversi',
            IF(
                pd.tgl_laporan_hakim IS NULL
                OR
                pd.tgl_laporan_hakim = '', 1, 0
            ) AS kesesuaian
        FROM 
            perkara_diversi AS pd
        JOIN 
            perkara AS p ON pd.perkara_id = p.perkara_id
        WHERE 
            pd.tgl_penetapan_musyawarah BETWEEN ? AND ?            
        ORDER BY 
            pd.tgl_penetapan_musyawarah DESC`,
    kel7: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.nilai_sengketa AS 'Biaya Nilai Sengketa',
            IF(
                p.nilai_sengketa IS NULL
                OR
                p.nilai_sengketa = ''
                , 1, 0
            ) AS kesesuaian           
        FROM
            perkara AS p
        WHERE
            p.tanggal_pendaftaran BETWEEN ? AND ?
        AND
            p.alur_perkara_id IN (8, 17)
        ORDER BY 
            p.tanggal_pendaftaran DESC`,
    kel8: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pppn.panitera_nama AS PP,
            pjs.agenda AS 'Agenda',
            pjs.tanggal_sidang AS 'Tgl Sidang',
            CASE 
                WHEN pjs.edoc_bas IS NOT NULL THEN 'Ada dokumen BAS'
                ELSE 'Tidak ada dokumen BAS'
            END AS 'Dokumen BAS',
            IF(
                pjs.edoc_bas IS NULL, 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_penetapan as ppn ON ppn.perkara_id = p.perkara_id
        JOIN 
            perkara_jadwal_sidang as pjs ON pjs.perkara_id = p.perkara_id
        WHERE
            pjs.tanggal_sidang BETWEEN ? AND ?
        AND 
            p.alur_perkara_id NOT IN (114)
        ORDER BY 
            pjs.tanggal_sidang DESC;`,
    kel9: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pphs.tanggal_penetapan AS 'Tgl Penetapan',
            pphs.tanggal_sidang AS 'Tgl Sidang',
            vp.nama AS 'Nama Pihak',
            vp.status_perkara AS 'Status Pihak',
            1 AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan_hari_sidang AS pphs ON pphs.perkara_id = p.perkara_id
        JOIN
            v_pihak_perkara AS vp ON vp.perkara_id = p.perkara_id
        WHERE
            (
                pphs.tanggal_penetapan BETWEEN ? AND ?
                OR
                pphs.tanggal_sidang BETWEEN ? AND ?
            )
        AND
            (
                p.alur_perkara_id NOT IN (114)
                AND
                p.alur_perkara_id < 100
            )
        AND
            (
                vp.status_perkara NOT LIKE '%saksi%'
            )
        ORDER BY
            pphs.tanggal_penetapan DESC`,
    kel10: `
        SELECT
            p.nomor_perkara AS 'Nomor Perkara',
            1 AS kesesuaian
        FROM
            perkara AS p
        JOIN
            perkara_penetapan_hari_sidang AS pphs ON pphs.perkara_id = p.perkara_id
        JOIN
            perkara_jadwal_sidang AS pjs ON pjs.id = pphs.jadwalsidang_id
        WHERE
            p.alur_perkara_id NOT IN (114)
        AND
            p.tanggal_pendaftaran BETWEEN ? AND ?
        GROUP BY
            p.perkara_id
        ORDER BY
            p.tanggal_pendaftaran DESC`,
    kel11: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.jenis_perkara_nama AS 'Jenis Perkara',
            ptus.tanggal_putusan AS 'Tgl Putusan',
            CASE(p.pihak_dipublikasikan)
                WHEN 'T' THEN 'Tidak dipublikasikan'
                ELSE 'Dipublikasikan'
            END AS 'Publikasi Pihak',
            IF(
                ptus.amar_putusan_anonimisasi_dok IS NULL
                OR
                ptus.amar_putusan_anonimisasi_dok = '',
                'Tidak ada dokumen putusan anonimisasi', 
                'Ada dokumen putusan anonimisasi'
            ) AS 'Dokumen Putusan Anonimisasi',
            IF(
                ptus.amar_putusan_anonimisasi_dok IS NULL
                OR
                ptus.amar_putusan_anonimisasi_dok = '',
                1, 0
            ) AS kesesuaian
        FROM 
            perkara as p
        JOIN
            perkara_putusan as ptus ON ptus.perkara_id = p.perkara_id
        WHERE
            ptus.tanggal_putusan BETWEEN ? AND ?
        AND
            ptus.tanggal_putusan <= CURDATE()
        AND 
            (
                p.jenis_perkara_id IN (64, 25, 200, 293, 137, 224, 242, 88, 98, 63, 65, 130, 248, 346, 347, 365) 
                OR 
                p.alur_perkara_id = 118
            )
        ORDER BY
            ptus.tanggal_putusan DESC`,
    kes1: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pjs.tanggal_sidang AS 'Tgl Sidang Terakhir',
            pjs.agenda AS 'Agenda',
            pppn.panitera_nama AS PP,
            IF( 
                p.tahapan_terakhir_id = 15
                AND
                (
                    pjs.agenda NOT REGEXP '[[:<:]]putusan/penetapan[[:>:]]'
                    AND
                    pjs.agenda NOT REGEXP '[[:<:]]putusan[[:>:]]'
                    AND 
                    pjs.agenda NOT REGEXP '[[:<:]]penetapan[[:>:]]'
                ), 1, 0 
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_jadwal_sidang AS pjs ON pjs.perkara_id = p.perkara_id
        WHERE 
            pjs.tanggal_sidang = (
                                    SELECT 
                                        MAX(pjs_sub.tanggal_sidang)
                                    FROM 
                                        perkara_jadwal_sidang AS pjs_sub
                                    WHERE 
                                        pjs_sub.perkara_id = p.perkara_id
                                )
            AND 
                pjs.tanggal_sidang BETWEEN ? AND ?
            AND 
                pjs.tanggal_sidang <= CURDATE()
            AND 
                p.alur_perkara_id NOT IN (114)
        ORDER BY 
            pjs.tanggal_sidang DESC`,
    kes2: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            pjs.tanggal_sidang AS 'Tgl Sidang Terakhir',
            pjs.agenda AS 'Agenda',
            ptus.tanggal_putusan AS 'Tgl Putusan',
            pppn.panitera_nama AS PP,
            IF(
                p.tahapan_terakhir_id = 15
                AND
                pjs.tanggal_sidang != ptus.tanggal_putusan
                , 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_panitera_pn AS pppn ON pppn.perkara_id = p.perkara_id AND pppn.aktif = 'Y'
        JOIN 
            perkara_putusan AS ptus ON ptus.perkara_id = p.perkara_id
        JOIN 
            perkara_jadwal_sidang AS pjs ON pjs.perkara_id = p.perkara_id
        WHERE 
            pjs.tanggal_sidang = (
                                    SELECT 
                                        MAX(pjs_sub.tanggal_sidang)
                                    FROM 
                                        perkara_jadwal_sidang AS pjs_sub
                                    WHERE 
                                        pjs_sub.perkara_id = p.perkara_id
                                )
            AND 
                (
                    pjs.tanggal_sidang BETWEEN ? AND ?
                    OR
                    ptus.tanggal_putusan BETWEEN ? AND ?
                )
            AND 
                (
                    pjs.tanggal_sidang <= CURDATE()
                    OR
                    ptus.tanggal_putusan <= CURDATE()
                )
            AND 
                p.alur_perkara_id NOT IN (114)
        ORDER BY 
            ptus.tanggal_putusan DESC`,
    kes3: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            jp.nama AS 'Jenis Perkara',
            jp.nama_lengkap AS 'Keterangan',
            CASE(p.pihak_dipublikasikan)
                WHEN 'T' THEN 'Tidak dipublikasikan'
                ELSE 'Dipublikasikan'
            END AS 'Publikasi Pihak',
            IF(
                p.pihak_dipublikasikan = 'Y'
                OR
                p.pihak_dipublikasikan IS NULL
                OR
                p.pihak_dipublikasikan = ''
                , 1, 0
            ) AS kesesuaian
        FROM
            perkara AS p
        JOIN 
            jenis_perkara AS jp ON p.jenis_perkara_id = jp.id
        WHERE
            p.tanggal_pendaftaran BETWEEN ? AND ?
            AND 
            (
                p.jenis_perkara_id IN (92, 64, 25, 200, 293, 137, 224, 242, 88, 98, 63, 65, 130, 248, 346, 347, 365)
                OR
                p.alur_perkara_id = 118
            )
        ORDER BY
            p.tanggal_pendaftaran DESC`,
    kes4: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            p.tahapan_terakhir_text AS 'Tahapan Perkara',
            ptus.tanggal_putusan AS 'Tgl Putusan',
            CASE(ptus.tanggal_bht)
                WHEN NULL THEN 'Tidak ada tanggal BHT'
                ELSE ptus.tanggal_bht
            END AS 'Tgl BHT',
            IF(
                p.tahapan_terakhir_id = 15
                AND 
                ptus.tanggal_bht IS NULL
                OR
                ptus.tanggal_bht = ''
                , 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_putusan AS ptus ON ptus.perkara_id = p.perkara_id
        WHERE 
            ptus.tanggal_putusan BETWEEN ? AND ?
            AND 
            p.alur_perkara_id NOT IN(114)
        ORDER BY 
            ptus.tanggal_putusan DESC`,
    kes5: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            STR_TO_DATE(pntd.sampai, '%Y-%m-%d') AS 'Tgl Batas Akhir Penahanan',
            STR_TO_DATE(ptus.tanggal_putusan, '%Y-%m-%d') AS 'Tgl Putusan',
            CONCAT(
                DATEDIFF(
                    STR_TO_DATE(pntd.sampai, '%Y-%m-%d'), 
                    STR_TO_DATE(ptus.tanggal_putusan, '%Y-%m-%d')
                ), ' Hari'
            ) AS 'Jangka Waktu',
            IF(
                p.tahapan_terakhir_id = 15
                AND
                DATEDIFF(
                    STR_TO_DATE(pntd.sampai, '%Y-%m-%d'), 
                    STR_TO_DATE(ptus.tanggal_putusan, '%Y-%m-%d')
                ) < 1
                , 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            penahanan_terdakwa AS pntd 
                ON pntd.perkara_id = p.perkara_id 
                AND pntd.tanggal_surat = (
                                            SELECT 
                                                MAX(STR_TO_DATE(tanggal_surat, '%Y-%m-%d')) 
                                            FROM 
                                                penahanan_terdakwa 
                                            WHERE 
                                                perkara_id = p.perkara_id
                                        )
        JOIN 
            perkara_putusan AS ptus ON ptus.perkara_id = p.perkara_id
        WHERE 
            ptus.tanggal_putusan BETWEEN ? AND ?
            AND 
            p.alur_perkara_id NOT IN (114) AND p.alur_perkara_id > 100
        GROUP BY
            p.perkara_id
        ORDER BY
            ptus.tanggal_putusan DESC`,
    kes6: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            subquery.pemasukan AS 'Biaya Masuk',
            subquery.pengeluaran AS 'Biaya Keluar',
            (subquery.pemasukan - subquery.pengeluaran) AS 'Sisa Biaya',
            subquery.transaksi_terakhir AS 'Tgl Transaksi Terakhir',
            IF(
                p.tahapan_terakhir_id = 15
                AND
                (subquery.pemasukan - subquery.pengeluaran) > 0
                , 1, 0
            ) AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            (
                SELECT
                    id,
                    perkara_id,
                    MAX(tanggal_transaksi) AS transaksi_terakhir,
                    SUM(CASE WHEN jenis_transaksi = 1 THEN jumlah ELSE 0 END) AS pemasukan,
                    SUM(CASE WHEN jenis_transaksi = -1 THEN jumlah ELSE 0 END) AS pengeluaran
                FROM 
                    perkara_biaya
                WHERE 
                    tahapan_id = 10
                GROUP BY 
                    perkara_id
            ) AS subquery ON subquery.perkara_id = p.perkara_id
        JOIN
            perkara_putusan AS ptus ON ptus.perkara_id = p.perkara_id
        WHERE 
            ptus.tanggal_putusan BETWEEN ? AND ?
            AND 
            p.alur_perkara_id NOT IN (114) AND p.alur_perkara_id < 100
        ORDER BY
            subquery.transaksi_terakhir DESC`,
    kes10: `
        SELECT 
            p.nomor_perkara AS 'Nomor Perkara',
            ptus.tanggal_minutasi AS 'Tgl Minutasi',
            asp.tanggal_masuk_arsip AS 'Tgl Arsip',
            asp.diinput_tanggal AS 'Tgl Input',
            CONCAT(
                DATEDIFF(
                    asp.tanggal_masuk_arsip,
                    ptus.tanggal_minutasi
                )
            , ' Hari') AS 'Jangka Waktu',
            1 AS kesesuaian
        FROM 
            perkara AS p
        JOIN 
            perkara_putusan AS ptus ON ptus.perkara_id = p.perkara_id
        JOIN
            arsip AS asp ON asp.perkara_id = p.perkara_id
        WHERE 
            ptus.tanggal_putusan BETWEEN ? AND ?
            AND 
            p.alur_perkara_id NOT IN (114)
        ORDER BY
            ptus.tanggal_putusan DESC`,
};
  
app.get("/api/data_eis", (req, res) => {
    const { unsur, date1, date2 } = req.query;
  
    //logger.info(`Log API select Data EIS - unsur: ${unsur}`);
  
    if (!unsur || !queryMap[unsur]) {
      logger.error("Unsur tidak valid");
      return res.status(400).json({ success: false, message: "Unsur tidak valid" });
    }
  
    const query = queryMap[unsur];
  
    // ✅ Buat list unsur yang TIDAK butuh tanggal
    const noDateParams = ['kin2', 'kin3'];
    const twoDateParams = ['kel9', 'kes2'];
    const fourDateParams = ['kep23'];
  
    let params;

    if (noDateParams.includes(unsur)) {
      params = [];
    }else if (twoDateParams.includes(unsur)) {
        params = [date1, date2, date1, date2]; // 👈 satu pasang tanggal
    } else if (fourDateParams.includes(unsur)) {
      params = [date1, date2, date1, date2, date1, date2, date1, date2]; // 👈 empat pasang tanggal
    } else {
      params = [date1, date2]; // default: satu pasang tanggal
    }
  
    // Opsional: validasi kalau date1/date2 kosong
    if (!noDateParams.includes(unsur) && (!date1 || !date2)) {
      return res.status(400).json({ success: false, message: "Parameter tanggal tidak lengkap" });
    }
  
    db.query(query, params, (err, result) => {
      if (err) {
        logger.error("Error saat mengambil data:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat eksekusi query" });
      }
  
      //logger.info(`Data berhasil diambil untuk unsur ${unsur}`);
      res.json({ success: true, message: "Query berhasil", data: result });
    });
});

app.get("/api_laper/ambildata", (req, res) => {
    const { column, from, where } = req.query; // ✅ ambil dari req.query
    logger.info('Log API Laper ambil data'); // 🔹 Log API ambil data

    const query = `SELECT ${column} FROM ${from} WHERE ${where}`;

    db2.query(query, (err, result) => {
        if (err) {
            logger.error("Error saat mengambil data:", err);
            console.error("Error saat mengambil data:", err);
            return res.json({ success: false, message: "Terjadi kesalahan saat eksekusi query" });
        }
        logger.info('Data berhasil diambil'); // 🔹 Log jika data berhasil diambil
        res.json({ success: true, message: "Query berhasil", data: result });
    });

});

app.post('/api_laper/kirimdata', (req, res) => {
    const { table, data } = req.body; // ✅ ambil dari req.body
    logger.info('Log API Laper kirim data'); // 🔹 Log API kirim data

    if (!table || !data || typeof data !== 'object' || Array.isArray(data)) {
        logger.error("Data tidak valid");
        return res.json({ success: false, message: "Data tidak valid" });
    }

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    db2.query(query, values, (err, result) => {
        if (err) {
            logger.error("Error saat mengirim data:", err);
            console.error("Error saat mengirim data:", err);
            return res.json({ success: false, message: "Terjadi kesalahan saat eksekusi query" });
        }
        logger.info('Data berhasil dikirim'); // 🔹 Log jika data berhasil dikirim
        res.json({ success: true, message: "Data berhasil dikirim", insertId: result.insertId });
    });
});

const storageTTD = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'TTD'; // folder fix
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const customName = req.body.filename || Date.now().toString();
        cb(null, `ttd_${customName}${path.extname(file.originalname)}`);
    },
});
  
const uploadTTD = multer({ storage: storageTTD });
  
app.post('/api_laper/kirimdatapegawai', uploadTTD.single('ttd'), (req, res) => {
    const { table, data } = req.body;

    if (!table || !data) {
        return res.json({ success: false, message: "Data tidak valid" });
    }

    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (e) {
        parsedData = data;
    }

    // tambahin nama file hasil upload
    if (req.file) {
        parsedData.ttd = req.file.filename;
    }

    const columns = Object.keys(parsedData).join(', ');
    const placeholders = Object.keys(parsedData).map(() => '?').join(', ');
    const values = Object.values(parsedData);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    db2.query(query, values, (err, result) => {
        if (err) {
            console.error("Error saat insert:", err);
            return res.json({ success: false, message: "Terjadi kesalahan query" });
        }

        res.json({
            success: true,
            message: "Data berhasil dikirim",
            pegawai: { id: result.insertId, ...parsedData }
        });
    });
});

const storageTDL = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'DOK'; // folder fix
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const customName = req.body.filename || Date.now().toString();
        cb(null, `dok_${customName}${path.extname(file.originalname)}`);
    },
});
  
const uploadTDL = multer({ storage: storageTDL });

app.post('/api_laper/kirimdataperbaikan', uploadTDL.single('eviden'), (req, res) => {
    const { table, data } = req.body;

    if (!table || !data) {
        return res.json({ success: false, message: "Data tidak valid" });
    }

    let parsedData;
    try {
        parsedData = JSON.parse(data);
    } catch (e) {
        parsedData = data;
    }

    // tambahin nama file hasil upload
    if (req.file) {
        parsedData.eviden = req.file.filename;
    }

    const columns = Object.keys(parsedData).join(', ');
    const placeholders = Object.keys(parsedData).map(() => '?').join(', ');
    const values = Object.values(parsedData);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    db2.query(query, values, (err, result) => {
        if (err) {
            console.error("Error saat insert:", err);
            return res.json({ success: false, message: "Terjadi kesalahan query" });
        }

        const temuanQuery = `SELECT temuan FROM tb_temuan WHERE id = ?`;
        db2.query(temuanQuery, [parsedData.id_temuan], (err2, temuanResult) => {
            if (err2) {
                console.error("Error saat ambil temuan:", err2);
                return res.json({ success: false, message: "Gagal ambil temuan" });
            }

            const temuan = temuanResult.length > 0 ? temuanResult[0].temuan : null;
            delete parsedData.id_temuan;
            parsedData.temuan = temuan;

            res.json({
                success: true,
                message: "Data berhasil dikirim",
                perbaikan: {
                    id: result.insertId,
                    ...parsedData,
                },
            });
        });
    });
});

// ✅ API cek status
app.get('/', (req, res) => {
    logger.info(`Server running in PORT: ${PORT}`);
    res.end(`Status Koneksi DB :\n${db1status}\n${db2status}\n`);
});
  
app.listen(PORT, () => {
    logger.info(`✅ Server listening ON PORT ${PORT}`);
});