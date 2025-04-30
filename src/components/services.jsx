import { id } from 'date-fns/locale';
import { format } from "date-fns";

export const formattedDate = (date) =>{
    return format(date, 'yyyy-MM-dd');
};
export const formattedTgl = (date) =>{
    return format(date, 'd MMMM yyyy', {locale: id});
};

export const formattedTglJam = (date) =>{
  return format(date, 'd MMMM yyyy HH:mm', {locale: id});
};

export const formattedBulanSaja = (date) =>{
    return format(date, 'MMMM', {locale: id});
};
export const formattedTahunSaja = (date) =>{
    return format(date, 'yyyy', {locale: id});
};

//fungsi kategorikan perkara
export const alur_permohonan = [2, 10, 12, 13, 14, 16, 18, 21, 26, 30, 31, 126, 127, 128, 129, 130, 131];
export const alur_gugatan = [1, 3, 4, 5, 6, 7, 9, 11, 15, 19, 20, 22, 23, 24, 25,  27, 28, 29, 32]; 
export const alur_gugatan_sederhana = [8, 17];

export const dataEIS =[
	{ header: "kinerja",
		items: [
			{
				unsur: 'kin4',
				judul: '4. Jangka Waktu Pelaksanaan Delegasi Masuk',
				detail: 'Waktu Pelaksanaan Delegasi Masuk Maksimal 7 Hari Kerja',
			},
			{
				unsur: 'kin5',
				judul: '5. Pelaksanaan Mediasi',
				detail: 'Keberhasilan Pelaksanaan Mediasi',
			}
		]
	},
	{ header: "kepatuhan",
		items: [
			{
				unsur: 'kep1',
				judul :'1. Pendaftaran Perkara',
				detail: 'Kepatuhan pendaftaran perkara dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep2',
				judul: '2. Pencatatan Barang Bukti',
				detail: 'Kepatuhan Pengguna dalam mengisi Barang Bukti',
			},
			{
				unsur: 'kep3',
				judul: '3. Penetapan Hakim',
				detail: 'Kepatuhan penetapan majelis/hakim dalam waktu maksimal 3 (tiga) hari',
			},
			{
				unsur: 'kep4',
				judul: '4. Penetapan Panitera Pengganti',
				detail: 'Kepatuhan penetapan panitera pengganti dalam waktu maksimal 3 (tiga) hari',
			},
			{
				unsur: 'kep5',
				judul: '5. Penetapan Jurusita/Jurusita Pengganti',
				detail: 'Kepatuhan penetapan jurusita dalam waktu maksimal 3 (tiga) hari',
			},
			{
				unsur: 'kep6',
				judul: '6. Penetapan Hari Sidang Pertama',
				detail: 'Kepatuhan penetapan hari sidang pertama dalam waktu maksimal 3 (tiga) hari',
			},
			{
				unsur: 'kep7',
				judul: '7. Penginputan Tuntutan',
				detail: 'Ketepatan Waktu dalam input Tuntutan dalam suatu perkara',
			},
			{
				unsur: 'kep8',
				judul: '8. Penginputan Putusan Akhir',
				detail: 'Ketepatan Waktu dalam input Putusan dalam suatu perkara',
			},
			{
				unsur: 'kep9',
				judul: '9. Penginputan Minutasi',
				detail: 'Kepatuhan penginputan minutasi maksimal 1x24 jam',
			},
			{
				unsur: 'kep10',
				judul: '10. Pelaksanaan Minutasi',
				detail: 'Ketepatan waktu dalam melakukan minutasi dalam waktu 7 Hari (Pidana) dan 14 Hari (Perdata)',
			},
			{
				unsur: 'kep11',
				judul: '11. Penginputan Permohonan Banding',
				detail: 'Kepatuhan waktu dalam input Permohonan Banding dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep12',
				judul: '12. Penginputan Permohonan Kasasi',
				detail: 'Kepatuhan waktu dalam input Permohonan Kasasi dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep13',
				judul: '13. Penginputan Permohonan Peninjauan Kembali',
				detail: 'Kepatuhan waktu dalam input Permohonan Peninjauan Kembali dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep14',
				judul: '14. Pengiriman Berkas Banding',
				detail: `
						a. Pelaksanaan Pemberitahuan Permohonan Banding
						b. Pemberitahuan Pelaksanaan Pemeriksaan Berkas (Inzage)
						c. Pengiriman Berkas Banding ke Pengadilan Tinggi - 30 Hari (Perdata)/ 14 Hari (Pidana)
						`,
			},
			{
				unsur: 'kep15',
				judul: '15. Pengiriman Berkas Kasasi',
				detail: `
						a. Pelaksanaan Pemberitahuan Permohonan Kasasi
						b. Penerimaan Memori Kasasi
						c. Penyerahan Memori Kasasi Kepada Termohon
						d. Pengiriman Berkas Kasasi ke Mahkamah Agung`,
			},
			{
				unsur: 'kep16',
				judul: '16. Pengiriman Berkas Peninjauan Kembali',
				detail: `
						a. Pelaksanaan Pemberitahuan Permohonan PK
						b. Penerimaan Memori PK
						c. Penerimaan Kontra Memori PK
						d. Pengiriman Berkas PK ke Mahkamah Agung`,
			},
			{
				unsur: 'kep17',
				judul: '17. Pemberitahuan Putusan/Penetapan',
				detail: 'Kepatuhan waktu dalam input tanggal pemberitahuan putusan dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep18',
				judul: '18. Penginputan Penetapan Majelis/Hakim',
				detail: 'Kepatuhan waktu dalam input penetapan Majelis Hakim/Hakim dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep19',
				judul: '19. Penginputan Penunjukan Panitera Pengganti',
				detail: 'Kepatuhan waktu dalam input penunjukan Panitera Pengganti dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep20',
				judul: '20. Penginputan Penetapan Hari Sidang',
				detail: 'Kepatuhan waktu dalam input penetapan hari sidang dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep21',
				judul: '21. Penginputan Penetapan Jurusita/Jurusita Pengganti',
				detail: 'Kepatuhan waktu dalam input penunjukan Jurusita/Jurusita Pengganti dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep22',
				judul: '22. Penginputan Data Pelaksanaan Delegasi',
				detail: 'Kepatuhan waktu dalam input Data Pelaksanaan Delegasi dalam waktu 1x24 jam',
			},
			{
				unsur: 'kep23',
				judul: '23. Kepatuhan Penundaan Jadwal Sidang',
				detail: 'Kepatuhan input penundaan jadwal sidang dalam waktu 1x24 jam (Query masih tidak pasti)',
			},
			{
				unsur: 'kep24',
				judul: '24. Penginputan Penetapan Perpanjangan Penahanan',
				detail: 'Kepatuhan penginputan perpanjangan penahanan maksimal 1x24 jam sejak tanggal penetapan',
			},
			{
				unsur: 'kep25',
				judul: '25. Unggah Putusan Akhir',
				detail: 'Kepatuhan unggah dokumen Putusan Akhir maksimal 1x24 jam sejak tanggal putus (Query masih tidak pasti)',
			},
			]
		},
		{ header: "kelengkapan",
			items: [
			{
				unsur: 'kel1',
				judul: '1. E-Document Dakwaan/Petitum',
				detail: 'Kelengkapan Dokumen Elektronik dalam pendaftaran perkara (Data Umum)',
			},
			{
				unsur: 'kel2',
				judul: '2. Pencatatan Saksi',
				detail: 'Kelengkapan pencatatan Data Saksi',
			},
			{
				unsur: 'kel3',
				judul: '3. E-Document Tuntutan',
				detail: 'Kelengkapan Dokumen Elektronik Tuntutan',
			},
			{
				unsur: 'kel4',
				judul: '4. E-Document Putusan Akhir/Penetapan',
				detail: 'Kelengkapan Dokumen Elektronik Putusan',
			},
			{
				unsur: 'kel5',
				judul: '5. Data Lapor Mediasi',
				detail: 'Kesesuaian pencatatan Tanggal Lapor Mediasi',
			},
			{
				unsur: 'kel6',
				judul: '6. Data Diversi',
				detail: 'Kesesuaian pencatatan Tanggal Lapor Diversi ',
			},
			{
				unsur: 'kel7',
				judul: '7. Data Nilai Sengketa',
				detail: 'Kesesuaian pencatatan Nilai Sengketa dalam Perkara Gugatan Sederhana',
			},
			{
				unsur: 'kel8',
				judul: '8. Dokumen Elektronik Berita Acara Sidang',
				detail: 'Ketersediaan Dokumen Berita Acara Sidang',
			},
			{
				unsur: 'kel9',
				judul: '9. Dokumen Elektronik Relaas Panggilan Sidang Pertama',
				detail: 'Ketersediaan Dokumen Berita Relaas (Query masih belum pasti)',
			},
			{
				unsur: 'kel10',
				judul: '10. Dokumen Elektronik Rencana Persidangan (Court Callendar)',
				detail: 'Ketersediaan Dokumen Elektronik Rencana Persidangan (Court Callendar)',
			},
			{
				unsur: 'kel11',
				judul: '11. Dokumen Elektronik Putusan Anonimisasi',
				detail: 'Ketersediaan Dokumen Elektronik Putusan yang sudah dilakukan Anonimisasi (SK KMA 2-144/KMA/SK/VIII/2022)',
			},
		]
	},
	{ header: "kesesuaian",
		items: [
			{
				unsur: 'kes1',
				judul: '1. Agenda Sidang Terakhir',
				detail: 'Kesesuaian Agenda Sidang Terakhir dengan status perkara putus',
			},
			{
				unsur: 'kes2',
				judul: '2. Tanggal Putusan dan Tanggal Sidang Terakhir',
				detail: 'Kesesuaian Tanggal Sidang Terakhir dengan Tanggal Putusan',
			},
			{
				unsur: 'kes3',
				judul: '3. Publikasi Pihak',
				detail: 'Kesesuaian Publikasi Perkara sesuai SK KMA Nomor 2-144/KMA/SK/VIII/2022',
			},
			{
				unsur: 'kes4',
				judul: '4. Pelaksanaan BHT',
				detail: 'Ada Atau Tidaknya Pencatatan BHT pada suatu perkara',
			},
			{
				unsur: 'kes5',
				judul: '5. Penahanan',
				detail: 'Kesesuaian pencatatan penahanan habis sebelum perkara putus',
			},
			{
				unsur: 'kes6',
				judul: '6. Sisa Biaya Perkara Tk Pertama',
				detail: 'Kesesuaian pencatatan pengembalian sisa panjar',
			},
			{
				unsur: 'kes10',
				judul: '10. Pengarsipan Perkara',
				detail: 'Kesesuaian Waktu Pelaksanaan Pengarsipan Perkara',
			}
		]
	},
];