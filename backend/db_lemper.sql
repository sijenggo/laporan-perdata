-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2025 at 05:04 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_lemper`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_barang`
--

CREATE TABLE `tb_barang` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `ket` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_barang`
--

INSERT INTO `tb_barang` (`id`, `nama`, `ket`) VALUES
(1, 'Ballpoint  STANDART A.E-7', ''),
(2, 'Ballpoint Balliner', ''),
(3, 'SPIDOL HITAM PERMANEN MARKER.', ''),
(4, 'Pensil 2 B Stadler', ''),
(5, 'Ball point B`GEL.0.7.', ''),
(6, 'BOLPOINT PEN.', ''),
(7, 'Stabillo', ''),
(8, 'Pen Organizer', ''),
(9, 'K.GL Pen', ''),
(10, 'Ballpoint Balliner Hitam', ''),
(11, 'Pulpen Joyko', ''),
(12, 'Tinta Stempel', ''),
(13, 'Binder (klip)  No.155', ''),
(14, 'paper Klip No.3 (Trigonal Klip)', ''),
(15, 'paper Klip No.1 (Trigonal Klip)', ''),
(16, 'Binder (Klip) No.111', ''),
(17, 'Binder Clip No. 200', ''),
(18, 'Binder Clip No. 107', ''),
(19, 'Bull Dog Clip   Penjepit Kertas Besar', ''),
(20, 'Binder Clip 105', ''),
(21, 'Tipex  Biasa.', ''),
(22, 'Buku FL.100', ''),
(23, 'Buku FL.50', ''),
(24, 'Buku Tulis 38 GK', ''),
(25, 'Buku Buku Expedisi 100', ''),
(26, 'Buku Kwitansi B  GK', ''),
(27, 'Buku Folio 300', ''),
(28, 'Buku Folio 200.', ''),
(29, 'BUKU AGENDA KAS  FL  100.', ''),
(30, 'Buku Kwitansi TANGGUNG', ''),
(31, 'Buku A4 100', ''),
(32, 'Buku Agenda', ''),
(33, 'Stop map folio kertas', ''),
(34, 'Stop map snel Hecter Kertas.', ''),
(35, 'Stop map snel plastik', ''),
(36, 'FILE BOX PLASTIK.', ''),
(37, 'ORDNER 401 BINDEX', ''),
(38, 'ORDNER 403 BINDEX', ''),
(39, 'STOP MAP Berlogo PN.Bms', ''),
(40, 'Snelheckter Transparan', ''),
(41, 'Stop  Map Plastik.', ''),
(42, 'File Box Bantex', ''),
(43, 'Cutter Rumah', ''),
(44, 'PISAU CUTTER B L-500 (Super)', ''),
(45, 'Gunting', ''),
(46, 'Gunting Besar', ''),
(47, 'Doubel Tape', ''),
(48, 'Lak ban Hitam besar', ''),
(49, 'Lak ban bening', ''),
(50, 'LAK BAN HITAM TANGGUNG', ''),
(51, 'LEM GLUE KENKO ( Ukuran bsr)', ''),
(52, 'Doubel Tipe Tanggung.', ''),
(53, 'Doubel Tipe Kecil', ''),
(54, 'LEM GLUE Cair ( Ukuran Kcil )', ''),
(55, 'Post It Flag', ''),
(56, 'Stick Note', ''),
(57, 'Lakban Bening Premium', ''),
(58, 'Lakban Merah', ''),
(59, 'Dispenser', ''),
(60, 'Isolasi 1/2 x 72', ''),
(61, 'Isolasi 1 x 72', ''),
(62, 'Kertas Stiker', ''),
(63, 'Staples', ''),
(64, 'Isi Staples 23/15 Max', ''),
(65, 'Isi Staples 23/10', ''),
(66, 'Stepler HD 30', ''),
(67, 'STEPLER  HD.10', ''),
(68, 'PERPORATOR NO.40 (Pembolong Kertas)', ''),
(69, 'ISI STEPLER GW.10 (Kecil).', ''),
(70, 'Gunting Tanggung.', ''),
(71, 'Isi Stapler 24 6', ''),
(72, 'Stepler GW.30', ''),
(73, 'PERPORATOR JUMBO NO.85', ''),
(74, 'Alat Tulis kantor lainnya ( CATRIGHT 810)', ''),
(75, 'alat tulis Lainnya Catright 811.', ''),
(76, 'TALI RAFIA', ''),
(77, 'Wipol 800 ml', ''),
(78, 'Stella Pengharum Ruangan XXX', ''),
(79, 'So Klin Lantai 900 ml', ''),
(80, 'Tisue Tessa (XXX)', ''),
(81, 'Stella Refill 250 ml Dream', ''),
(82, 'Cling Pembersih Kaca XXX', ''),
(83, 'Obat Nyamuk VAPE 600 ml XXX', ''),
(84, 'WIPOL (Pembersih WC) 800 ml XXX', ''),
(85, 'SUN LIGHT 750. ML', ''),
(86, 'PEMBERSIH KACA. (Cling) XXX', ''),
(87, 'Sabun cuci tangan HAND SOSP XXX', ''),
(88, 'Pengharum ruangan Stela Orange-21 XXX', ''),
(89, 'STELA Metix  250.ML Drea.Island-21', ''),
(90, 'STELA REFIL 250.ML Wild', ''),
(91, 'Kapur Barus DAHLIA  TABLET-21', ''),
(92, 'Pengharum Ruang BAYFRES BOTOL XXX', ''),
(93, 'Kapur Barus Warna Pengharum WC (DAHLIA) (XXX)', ''),
(94, 'Batu Batrai- Alkalin   Batu Jam', ''),
(95, 'Stella Refil 250 ml  Sweet Rainbow', ''),
(96, 'Batu  Allkalin   Remot', ''),
(97, 'SEAGUL BAL SG 531', ''),
(98, 'Benang Kaur', ''),
(99, 'So Klin Lantai 900 Ml.  Mawar', ''),
(100, 'VIXAL 780 ML', ''),
(101, 'TINTA SUPER INK CANON WARNA-49500', ''),
(102, 'SO Klin Lantai 900, Ml. Beda Harga', ''),
(103, 'CATRIGHT 810 Harga Beda.', ''),
(104, 'Catright 680', ''),
(105, 'STELA  Gantung Aroma Lemon -21', ''),
(106, 'STELA Gantung Aroma Apel', ''),
(107, 'Poket Bantex Folio.', ''),
(108, 'STELLA METIC FIESTA APPLE XXX', ''),
(109, 'Materai 10.000.an', ''),
(110, 'Siglak DIAMOND', ''),
(111, 'HVS 70.Gram - 21', ''),
(112, 'Tintan Canon Hitam -21', ''),
(113, 'Buku Folio 100 --21', ''),
(114, 'Buku Folio 50 --21', ''),
(115, 'buku Tulis GK 38 -21', ''),
(116, 'Balpoin AE-7 --21', ''),
(117, 'BALLINER HITAM --21', ''),
(118, 'BALLINER WARNA --21', ''),
(119, 'Balpoin BIG\'JEL-07 --21', ''),
(120, 'STOP MAP FOLIO Kertas --21', ''),
(121, 'So Klin Lantai 900 Ml. Kuning-21', ''),
(122, 'Stella Pengharum Ruangan Lemon -21 (XXX)', ''),
(123, 'BALPOIN BIG\'JEL 05 - 21', ''),
(124, 'LEM GLUE CAIR Ukuran Bsr -21', ''),
(125, 'Lak Ban  Hitam Tanggung-21', ''),
(126, 'Lak ban Hitam Besar-21', ''),
(127, 'Doubel Tip Tanggung -21', ''),
(128, 'Doubel tip Besar-21', ''),
(129, 'Kertas BC FOLIO PUTIH - 21', ''),
(130, 'Binder Klip 107 -21', ''),
(131, 'Kertas BC FOLIO MERAH TUA - 21', ''),
(132, 'Kertas BC  FOLIO HIJAU TUA - 21', ''),
(133, 'Penggaris Plastik 30 Cm -21', ''),
(134, 'ORDNER 401 -21', ''),
(135, 'HVS - A4 - 21', ''),
(136, 'BINDER KLIP-200-  21', ''),
(137, 'STOP MAP SNEL KERTAS  FOLIO - 21', ''),
(138, 'TRI GONAL KLIP No.3 - 21', ''),
(139, 'Kertas Stiker Folio - 21', ''),
(140, 'Amplop Dinas Kecil   Ukuran Standar berlogo PN.Banyumas -21', ''),
(141, 'LAKBAN BENING- 22', ''),
(142, 'Buku Ekspedisi 100-21', ''),
(143, 'Amplop Tanggung / Kabinet - 21', ''),
(144, 'Pisau Cuter L 500 - 21', ''),
(145, 'Amplop Kecil Putih/ Tanggung - 21', ''),
(146, 'Lap Pel Tongkat Kayu B.', ''),
(147, 'Stela MAT.Japan Sakura -21', ''),
(148, 'Stela Gantung Passion Red', ''),
(149, 'Lap Pel Tongkat Kayu.A', ''),
(150, 'Stella MATIC.250 ml/Sweet', ''),
(151, 'Lap Pel Tongkat Dust Mop', ''),
(152, 'BC. FOLIO KUNING', ''),
(153, 'KERTAS SAMSON-22', ''),
(154, 'Buku Kwitansi BESAR-22', ''),
(155, 'Poket Bantex Folio Harga Beda', ''),
(156, 'AMPLOP DINAS JUMBO UKURAN', ''),
(157, 'Buku FL.300- 22', ''),
(158, 'POS IT FLAG', ''),
(159, 'STOP MAP PLASTIK JEPIT-22', ''),
(160, 'ISI PARKER- 22', ''),
(161, 'Pengharum Ruang Bay Fres Stella XXX', ''),
(162, 'Stela Gantung Aroma Bougenvile', ''),
(163, 'SULAK RAFIA WARNA. -22', ''),
(164, 'Akrilik', ''),
(165, 'STELA MATIC SCRET LENDA', ''),
(166, 'TISUE MONTIS XXX', ''),
(167, 'Sabun Cream Ekonomi XXX', ''),
(168, 'Sabun Cream Ekonomi harga beda XXX', ''),
(169, 'Wiper Kaca Jendela', ''),
(170, 'Kanebo FLAS-23', ''),
(171, 'Kanebo Premium', ''),
(172, 'FILE Box Bantex-23', ''),
(173, 'Flasdisk -23', ''),
(174, 'Isi Pisau Cuter', ''),
(175, 'Stabilo-23', ''),
(176, 'STOP MAP JUMBO BERLOGO', ''),
(177, 'Stella Gantung All In One Sensation', ''),
(178, 'Kanebo', ''),
(179, 'Doubel Tip Mini', ''),
(180, 'Gel Pen Joyko 23', ''),
(181, 'Stop Map Plastik Kancing', ''),
(182, 'STOP MAP COVER PERKARA', ''),
(183, 'Spidol Hitam Besar Permanen', ''),
(184, 'Spidol Hitam Board Maker - 23', ''),
(185, 'Strapler Remover', ''),
(186, 'Tape Dispenser Kenko', ''),
(187, 'Papan Alas Ujian', ''),
(188, 'Kertas HVS F4 80 Gr', ''),
(189, 'Kertas HVS F4 70 Gr', ''),
(190, 'Kertas HVS A4 80 gr', ''),
(191, 'KERTAS HVS WARNA .b ( beda hrga )', ''),
(192, 'Kertas HVS A4 70 gr', ''),
(193, 'Kertas Stiker   Label', ''),
(194, 'Tissue', ''),
(195, 'Tissue Gulung', ''),
(196, 'Kalender', ''),
(197, 'Kertas BC Folio', ''),
(198, 'KERTAS BC FOLIO MERAH TUA', ''),
(199, 'KERTAS BC FOLIO HIJAU MUDA.', ''),
(200, 'Kertas Piagam', ''),
(201, 'Amplop Besar', ''),
(202, 'Amplop Sedang', ''),
(203, 'Amplop Kecil', ''),
(204, 'AMPLOP DINAS KECIL BERLOGO PN BANYUMAS', ''),
(205, 'Amplop Dinas Ukuran Stop Map Folio Berlogo PN.Bms', ''),
(206, 'Amplop Dinas kecil / ukuran standar', ''),
(207, 'Sticker Folio', ''),
(208, 'Kertas Sertifikat', ''),
(209, 'Transparant Sheet', ''),
(210, 'Kertas Ivori', ''),
(211, 'SERBUK TONER FOTO COPY', ''),
(212, 'TINTA SUPER INK HP HITAM', ''),
(213, 'catridge printer canon', ''),
(214, 'TINTA SUPER INK CANON  HITAM', ''),
(215, 'Catridge 810', ''),
(216, 'Tinta Super Ink Canon Warna', ''),
(217, 'Catridge 811', ''),
(218, 'Tinta Printer Canon Hitam', ''),
(219, 'DRUM IP2770', ''),
(220, 'DRUM MX340', ''),
(221, 'PG 47', ''),
(222, 'PG 57', ''),
(223, 'Tinta Blueprit Canon Black', ''),
(224, 'Tinta Blueprint Canon Magenta', ''),
(225, 'Tinta Blueprint Canon Yellow', ''),
(226, 'Tinta Epson Warna', ''),
(227, 'Flasdis 4 GB', ''),
(228, 'Mouse', ''),
(229, 'CD/DVD', ''),
(230, 'Lampu LED', ''),
(231, 'Batu Baterai ABC kecil', ''),
(232, 'Batu Baterai Alkaline AA', ''),
(233, 'Batu Baterai Alkaline AAA', ''),
(234, 'Meterai', ''),
(235, 'Prangko', ''),
(236, 'Stempel', ''),
(237, 'Tempat Tissu', ''),
(238, 'Obat Nyamuk', ''),
(239, 'sulak', ''),
(240, 'Sapu Lidi', ''),
(241, 'Sapu lante plastik.', ''),
(242, 'sikat WC', ''),
(243, 'Sapu Lantai', ''),
(244, 'SIKAT WC Gagang panjang', ''),
(245, 'Kemoceng Sintetis putri kembar', ''),
(246, 'Sapu Meja', ''),
(247, 'Sapu Lantai Merk Bagus', ''),
(248, 'Sapu Lantai Mayasa', ''),
(249, 'Sapu Lantai Scotc B', ''),
(250, 'Nagoya Sikat Lantai', ''),
(251, 'Kain Pel', ''),
(252, 'Kanebo', ''),
(253, 'KANEBO Merk UNIK', ''),
(254, 'Nagata Refill Pel', ''),
(255, 'Kanebo Kenmaster plas chamois', ''),
(256, 'Refill Kanebo kenmaster plas chamois', ''),
(257, 'Spon Pencuci Piring', ''),
(258, 'Keset 60 X 90 Welcome.', ''),
(259, 'Tempat Sampah Tutup', ''),
(260, 'Klipak Kantong Plastik Sampah Sedang', ''),
(261, 'Klipak Kantong Plastik Sampah Kecil', ''),
(262, 'Tempat Sampah Meja', ''),
(263, 'Tempat Sampah Injak Besar', ''),
(264, 'Kran Air', ''),
(265, 'WIPOL (Pembersih Wc) 800 ml', ''),
(266, 'SOKLIN LANTAI 800 ML.', ''),
(267, 'SUN LIGHT 400. ML', ''),
(268, 'SUN LIGHT 750. ML', ''),
(269, 'WIPOL (Pembersih Wc) 450. ml', ''),
(270, 'VIXAL (PEMBERSIH PORSELEN)', ''),
(271, 'PEMBERSIH KACA. (Cling ).', ''),
(272, 'Soklin Lantai 900 Ml', ''),
(273, 'HAND  SOAP NOSY- (rasa Lemon)', ''),
(274, 'Kapur Barus / Seagull', ''),
(275, 'Kit Black Magic Gel', ''),
(276, 'Kit Black Magic Spray', ''),
(277, 'Master Cleaner', ''),
(278, 'GELAS', ''),
(279, 'Pengharum ruangan Stela', ''),
(280, 'Glade Pengharum Kamar mandi', ''),
(281, 'Pengharum Ruang Mobil Bayer Hung Fro', ''),
(282, 'STELA REFIL 250.ML Drea.', ''),
(283, 'STELA REFIL 250.ML Wild', ''),
(284, 'Stella refil', ''),
(285, 'Stella Matic', ''),
(286, 'Seagul SG 531', ''),
(287, 'Pengharum Ruangan Automatic Glade', ''),
(288, 'Glade Matic', ''),
(289, 'Kemoceng', ''),
(290, 'Taplak', ''),
(291, 'ISI STEPLER 23/15 MAX (XXX)', ''),
(292, 'ISI STEPLER 23/10 (XXX)', ''),
(293, 'Alat Tulis kantor lainnya (Catright 810) (XXX)', ''),
(294, 'Alat tulis Lainnya Catright 811. (XXX)', ''),
(295, 'Batu Batrai- Alkalin / Batu Jam (XXX)', ''),
(296, 'Batu Allkalin/ Remot (XXX)', ''),
(297, 'TINTA SUPER INK CANON (XXX)', ''),
(298, 'HVS 70.Gram - 21 (XXX)', ''),
(299, 'Tintan Canon Hitam -21 (XXX)', ''),
(300, 'Balpoin AE-7 --21 (XXX)', ''),
(301, 'STOP MAP FOLIO Kertas --21 (XXX)', ''),
(302, 'Lak Ban Hitam Tanggung-21 (XXX)', ''),
(303, 'Kertas BC FOLIO WARNA (XXX)', ''),
(304, 'Ordner 401 -21 (XXX)', ''),
(305, 'HVS - A4 - 21 (XXX)', ''),
(306, 'HVS.WARNA- 22 (XXX)', ''),
(307, 'LAKBAN BENING (XXX)', ''),
(308, 'ISI STEPLER 23/13 (XXX)', ''),
(309, 'STOP MAP BATIK- 22 (XXX)', '');

-- --------------------------------------------------------

--
-- Table structure for table `tb_list`
--

CREATE TABLE `tb_list` (
  `id` int(11) NOT NULL,
  `id_permintaan` int(11) DEFAULT NULL,
  `id_barang` int(11) DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  `satuan` varchar(10) DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  `diedit_tgl` datetime DEFAULT NULL,
  `diinput_tgl` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_list`
--

INSERT INTO `tb_list` (`id`, `id_permintaan`, `id_barang`, `jumlah`, `satuan`, `status`, `diedit_tgl`, `diinput_tgl`) VALUES
(1, 1, 37, 6, 'box', 'Y', NULL, '2025-09-23 09:52:49'),
(2, 2, 38, 3, 'box', 'Y', NULL, '2025-09-23 09:53:49'),
(3, 2, 63, 2, 'pcs', 'Y', NULL, '2025-09-23 09:53:49'),
(4, 2, 71, 2, 'pcs', 'Y', NULL, '2025-09-23 09:53:49'),
(5, 3, 4, 3, 'pcs', 'Y', NULL, '2025-09-23 09:55:23'),
(6, 3, 59, 5, 'lusin', 'Y', NULL, '2025-09-23 09:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `tb_permintaan`
--

CREATE TABLE `tb_permintaan` (
  `id` int(11) NOT NULL,
  `id_pegawai` varchar(5) DEFAULT NULL,
  `nama_pegawai` varchar(255) DEFAULT NULL,
  `id_unit` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `diedit_tgl` datetime DEFAULT NULL,
  `diinput_tgl` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_permintaan`
--

INSERT INTO `tb_permintaan` (`id`, `id_pegawai`, `nama_pegawai`, `id_unit`, `status`, `diedit_tgl`, `diinput_tgl`) VALUES
(1, '14', 'NORMANDITO WIJAYA, S.Kom.,M.M.', 2, 'Y', NULL, '2025-09-23 09:52:49'),
(2, '14', 'NORMANDITO WIJAYA, S.Kom.,M.M.', 2, 'Y', NULL, '2025-09-23 09:53:49'),
(3, '14', 'NORMANDITO WIJAYA, S.Kom.,M.M.', 2, 'Y', NULL, '2025-09-23 09:55:23');

-- --------------------------------------------------------

--
-- Table structure for table `tb_unit`
--

CREATE TABLE `tb_unit` (
  `id` int(11) NOT NULL,
  `unit` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_unit`
--

INSERT INTO `tb_unit` (`id`, `unit`) VALUES
(1, 'Ketua Pengadilan'),
(2, 'Wakil Ketua Pengadilan'),
(3, 'Panitera'),
(4, 'Sekretaris'),
(5, 'Hakim'),
(6, 'Kepaniteraan Perdata'),
(7, 'Kepaniteraan Hukum'),
(8, 'Kepaniteraan Pidana'),
(9, 'Kesekretariatan Umum dan Keuangan'),
(10, 'Kesekretariatan PTIP'),
(11, 'Kesekretariatan Kepegawaian dan ORTALA'),
(12, 'Panitera Pengganti'),
(13, 'Jurusita Pengganti'),
(14, 'PPPK'),
(15, 'PPNPN'),
(16, 'Document Control'),
(17, 'Tim SATGAS SIPP'),
(21, 'coba'),
(22, 'cibi'),
(23, 'hihu'),
(24, 'hyhy'),
(25, 'hghg'),
(26, 'mind');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_barang`
--
ALTER TABLE `tb_barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_list`
--
ALTER TABLE `tb_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`),
  ADD KEY `fk_list_permintaan` (`id_permintaan`);

--
-- Indexes for table `tb_permintaan`
--
ALTER TABLE `tb_permintaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_unit` (`id_unit`);

--
-- Indexes for table `tb_unit`
--
ALTER TABLE `tb_unit`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_barang`
--
ALTER TABLE `tb_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=311;

--
-- AUTO_INCREMENT for table `tb_list`
--
ALTER TABLE `tb_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_permintaan`
--
ALTER TABLE `tb_permintaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_unit`
--
ALTER TABLE `tb_unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_list`
--
ALTER TABLE `tb_list`
  ADD CONSTRAINT `fk_list_permintaan` FOREIGN KEY (`id_permintaan`) REFERENCES `tb_permintaan` (`id`),
  ADD CONSTRAINT `tb_list_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `tb_barang` (`id`);

--
-- Constraints for table `tb_permintaan`
--
ALTER TABLE `tb_permintaan`
  ADD CONSTRAINT `tb_permintaan_ibfk_1` FOREIGN KEY (`id_unit`) REFERENCES `tb_unit` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
