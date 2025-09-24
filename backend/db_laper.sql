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
-- Database: `db_laper`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_dok`
--

CREATE TABLE `tb_dok` (
  `id` int(11) NOT NULL,
  `ket` varchar(100) DEFAULT NULL,
  `dok` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_judul`
--

CREATE TABLE `tb_judul` (
  `id` int(11) NOT NULL,
  `judul` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_judul`
--

INSERT INTO `tb_judul` (`id`, `judul`) VALUES
(1, 'Mediasi Secara Elektronik Pengadilan Negeri Banyumas'),
(2, 'Upaya Hukum Kasasi dan PK Pengadilan Negeri Banyumas'),
(3, 'Pelaksanaan Eksekusi Pengadilan Negeri Banyumas'),
(4, 'Penyampaian Salinan dan Petikan Putusan Pengadilan Negeri Banyumas'),
(5, 'Panjar Biaya Perkara Pengadilan Negeri Banyumas'),
(6, 'Pelaporan Komdanas Pengadilan Negeri Banyumas'),
(7, 'Pelaporan Keuangan Perkara dan Komdanas Pengadilan Negeri Banyumas'),
(8, 'Minutasi Perkara Sesuai SOP Pengadilan Negeri Banyumas'),
(9, 'Publikasi Putusan Pengadilan Negeri Banyumas'),
(10, 'PTSP Perdata & E-Court Pengadilan Negeri Banyumas'),
(11, 'Penjaga Sidang Pengadilan Negeri Banyumas'),
(12, 'Informasi Publik'),
(13, 'coba'),
(14, 'coba 4');

-- --------------------------------------------------------

--
-- Table structure for table `tb_monev`
--

CREATE TABLE `tb_monev` (
  `id` int(11) NOT NULL,
  `judul` int(11) DEFAULT NULL,
  `bulan` varchar(20) DEFAULT NULL,
  `tahun` varchar(10) DEFAULT NULL,
  `setiap` varchar(25) DEFAULT NULL,
  `temuan` varchar(100) DEFAULT NULL,
  `tgl_laporan_monev` datetime DEFAULT NULL,
  `tgl_notulen_monev` datetime DEFAULT NULL,
  `tempat` varchar(150) DEFAULT NULL,
  `peserta` varchar(150) DEFAULT NULL,
  `pimpinan_monev` varchar(25) DEFAULT NULL,
  `notulis_monev` varchar(25) DEFAULT NULL,
  `tanya_jawab` longtext DEFAULT NULL,
  `nomor_surat` varchar(50) DEFAULT NULL,
  `tgl_surat_monev` datetime DEFAULT NULL,
  `kepada` text DEFAULT NULL,
  `dokumentasi` varchar(150) DEFAULT NULL,
  `absen` varchar(25) DEFAULT NULL,
  `tindak_lanjut` varchar(100) DEFAULT NULL,
  `diinput_tanggal` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_monev`
--

INSERT INTO `tb_monev` (`id`, `judul`, `bulan`, `tahun`, `setiap`, `temuan`, `tgl_laporan_monev`, `tgl_notulen_monev`, `tempat`, `peserta`, `pimpinan_monev`, `notulis_monev`, `tanya_jawab`, `nomor_surat`, `tgl_surat_monev`, `kepada`, `dokumentasi`, `absen`, `tindak_lanjut`, `diinput_tanggal`) VALUES
(2, 10, 'April', '2025', '1 Bulan', '1,3', '2025-04-08 10:00:00', '2025-04-08 11:00:00', 'Ruang kepaniteraan perdata', 'Hakim pengawas, Staff Panitera Perdata', '10', '7', '-', '123/KP/123/56/2025', '2025-04-07 09:00:00', '1. Hakim Pengawas Bidang Perdata\r\n2. Panitera Muda Perdata\r\n3. Staff Panitera Muda Perdata', '-', '10,1,3,5,8,7', '1', '2025-04-10 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tb_perbaikan`
--

CREATE TABLE `tb_perbaikan` (
  `id` int(11) NOT NULL,
  `id_temuan` int(11) DEFAULT NULL,
  `perbaikan` varchar(250) DEFAULT NULL,
  `eviden` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_perbaikan`
--

INSERT INTO `tb_perbaikan` (`id`, `id_temuan`, `perbaikan`, `eviden`) VALUES
(1, 1, 'Koordinasi dengan PTIP untuk beli scanner', 'scanner.jpg'),
(2, 3, 'Coba', 'dok_1757405233749.png'),
(3, 2, 'bibu', 'dok_1757405289101.png'),
(4, 4, 'jajajajajajaj', 'dok_1757406141616.png');

-- --------------------------------------------------------

--
-- Table structure for table `tb_temuan`
--

CREATE TABLE `tb_temuan` (
  `id` int(11) NOT NULL,
  `temuan` varchar(100) DEFAULT NULL,
  `kendala` varchar(100) DEFAULT NULL,
  `rekomendasi` varchar(150) DEFAULT NULL,
  `ket` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_temuan`
--

INSERT INTO `tb_temuan` (`id`, `temuan`, `kendala`, `rekomendasi`, `ket`) VALUES
(1, 'Tidak ada alat scanner', 'Tidak bisa scan bukti/jawaban/duplik dll di meja ecourt', 'Beli scanner', '-'),
(2, 'Tidak ada printer', 'Tidak bisa cetak cetak surat, jadi perlu bolak balik ke fotocopy/ruangan', 'Beli printer', '-'),
(3, 'Tidak ada konsumsi untuk tamu', 'Tamu mengeluh harus menunggu lama tanpa cemilan', 'Beli snack', '-'),
(4, 'Layar monitor tidak berfungsi', 'Struktur organisasi belum diperbaharui', 'Agar segera memperbaharui stuktur organisasi sesuai dengan keadaan sebenarnya', '-'),
(5, 'coba', 'coba', 'coba', 'coba'),
(6, 'coba 2', 'coba 2', 'coba 2', 'coba'),
(7, 'hahaha', 'hahsd', 'asdf', 'asdf'),
(8, 'hihu', 'werwerwer', 'werwerwerwe', 'werwerwer'),
(9, 'hyhyh', 'qwerqwerqwer', 'qwerqwer', 'qwerqwer'),
(10, 'gagaga', 'agaga', 'gag', 'agaga'),
(11, 'hyhyhyhyh', 'asdfasdf', 'asdfasdf', 'asdfasdf'),
(12, 'WEWEWEWEWEWEW', 'ASDFASDFS', 'ADFASDFASDFADS', 'ASDFASDF'),
(13, 'tytytytyty', 'tytsdfgs', 'sdfg', 'sdfgsdfg'),
(14, 'hyhyhyhyhy', 'asdfasdf', 'asdfasdf', 'asdf'),
(15, 'tidak ada uang tambahan', 'tidak ada uang tambahan', 'moneyyy', 'moneyyy'),
(16, 'jujujukakka', 'jujadasdf', 'asdfasdf', 'asdfasdf'),
(17, NULL, NULL, NULL, NULL),
(18, NULL, NULL, NULL, NULL),
(19, NULL, NULL, NULL, NULL),
(20, NULL, NULL, NULL, NULL),
(21, NULL, NULL, NULL, NULL),
(22, NULL, NULL, NULL, NULL),
(23, NULL, NULL, NULL, NULL),
(24, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tb_ttd`
--

CREATE TABLE `tb_ttd` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `jabatan` varchar(50) DEFAULT NULL,
  `ttd` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_ttd`
--

INSERT INTO `tb_ttd` (`id`, `nama`, `jabatan`, `ttd`) VALUES
(1, 'DAMAS SATRIYO WIBOWO, S.H.', 'Panitera Muda Perdata', 'damas.png'),
(2, 'FIRDAUS AZIZY, S.H., M.H.', 'Hakim Pengawas Bidang Perdata', 'firdaus.png'),
(3, 'SUDARSIJAH, SH.', 'Panitera Pengganti', 'sudarsijah.png'),
(4, 'MISTAM. SH.', 'Panitera Pengganti', 'mistam.png'),
(5, 'WAHYUDI AMD.', 'Staff Kepaniteraan Perdata', 'wahyudi.png'),
(6, 'PRAMUDITHA ANDARJATI, SH.', 'Staff Kepaniteraan Perdata', 'pramuditha.png'),
(7, 'ADIMAS FAUZAN, SKOM', 'PPNPN', 'adimas.png'),
(8, 'DIKA ARUM PERMATASARI, S.H.', 'Panitera Pengganti', 'dika.png'),
(10, 'ANNISA NURJANAH TUARITA, S.H., M.H.', 'Hakim Pengawas Bidang Perdata', 'annisa.png'),
(12, 'ASYROTUN MUGIASTUTI, S.H., M.H.', 'Ketua Pengadilan Negeri Banyumas', 'asyrotun.png'),
(13, 'ARIESTI', 'asdf', '1756789109131.png'),
(14, 'asd', 'asdf', 'ttd_1756796022575.png'),
(15, 'ARIESTI', 'asdf', 'ttd_1756798651855.png'),
(16, 'ARIESTI', 'asdf', 'ttd_1756798734821.png'),
(17, 'asdgad', 'asdfasdf', 'ttd_1756798757153.png'),
(18, 'asdf', 'asdfasdf', 'ttd_1756798772859.png'),
(19, 'asdfasdf', 'asdfasdf', 'ttd_1756798798832.png'),
(20, 'asdfasdf', 'asdfasdf', 'ttd_1756798888485.png'),
(21, 'hahahahah', 'ahahahah', 'ttd_1756798981543.png'),
(22, 'hahahahah', 'ahahahah', 'ttd_1756799016452.png'),
(23, 'hahahahahsad', 'ahahahah', 'ttd_1756799045314.png'),
(24, 'hahahahahsad', 'ahahahah', 'ttd_1756799074384.png'),
(25, 'hahahahahsad', 'ahahahah', 'ttd_1756799087892.png'),
(26, 'hahahaha', 'hahahahaha', 'ttd_1756800265154.png'),
(27, 'jujuj', 'juju', 'ttd_1756800292137.png'),
(28, 'asdfasdfasd', 'asdfasdfasdfsadf', 'ttd_1757383668514.png'),
(29, 'haji dimas', 'pak kaji', 'ttd_1757383881010.png'),
(30, 'asdfasdf', 'asdfasdf', 'ttd_1757384052902.png'),
(31, 'pak jihu', 'asdfasdf', 'ttd_1757384370270.png'),
(32, 'pak jijuhu', 'asdfasdfasdf', 'ttd_1757385882466.png'),
(33, 'kiko', 'asdfasdfsdaf', 'ttd_1757385930741.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_dok`
--
ALTER TABLE `tb_dok`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_judul`
--
ALTER TABLE `tb_judul`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_monev`
--
ALTER TABLE `tb_monev`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_judul` (`judul`);

--
-- Indexes for table `tb_perbaikan`
--
ALTER TABLE `tb_perbaikan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_perbaikan_temuan` (`id_temuan`);

--
-- Indexes for table `tb_temuan`
--
ALTER TABLE `tb_temuan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_ttd`
--
ALTER TABLE `tb_ttd`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_dok`
--
ALTER TABLE `tb_dok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_judul`
--
ALTER TABLE `tb_judul`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tb_monev`
--
ALTER TABLE `tb_monev`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_perbaikan`
--
ALTER TABLE `tb_perbaikan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_temuan`
--
ALTER TABLE `tb_temuan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `tb_ttd`
--
ALTER TABLE `tb_ttd`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_monev`
--
ALTER TABLE `tb_monev`
  ADD CONSTRAINT `fk_judul` FOREIGN KEY (`judul`) REFERENCES `tb_judul` (`id`);

--
-- Constraints for table `tb_perbaikan`
--
ALTER TABLE `tb_perbaikan`
  ADD CONSTRAINT `fk_perbaikan_temuan` FOREIGN KEY (`id_temuan`) REFERENCES `tb_temuan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
