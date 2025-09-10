import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths, format } from "date-fns";
import { id, se, te } from 'date-fns/locale';
import { formattedBulanSajaNumber, formattedTahunSajaNumber, formattedBulanSaja, formattedDate, formattedDateTime, formattedTime, formattedTimeMysql, formattedTgl, formattedTahunSaja, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';
import RSelect from 'react-select';
import CreateableSelect from 'react-select/creatable';
import { createColumnHelper } from '@tanstack/react-table';

import {
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CInputGroup,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CSpinner,
  CAlert,
  CFormTextarea,
  CFormSelect,
  CImage,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCardFooter,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import * as icons from '@coreui/icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faicons from '@fortawesome/free-solid-svg-icons';

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../components/axiosHooks';
const SELECT_URL = 'api_laper/ambildata';
const INSERT_URL = 'api_laper/kirimdata';
const INSERT_PEGAWAI_URL = 'api_laper/kirimdatapegawai';
const INSERT_PERBAIKAN_URL = 'api_laper/kirimdataperbaikan';

import Swal from 'sweetalert2';
import { TableDinamis } from '../components/TableDinamis';
import ReactImageUploading from 'react-images-uploading';

import { Formik } from 'formik';
import * as Yup from 'yup';

const TemuanSchema = Yup.object().shape({
    temuan: Yup.string().required("Temuan wajib dipilih"),
    kendala: Yup.string().required("Temuan wajib dipilih"),
    rekomendasi: Yup.string().required("Temuan wajib dipilih"),
    ket: Yup.string().required("Temuan wajib dipilih"),
});

const validationSchemaPegawai = Yup.object({
    nama: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Nama pegawai yg bener isinya, jgn alay')
        .required('Tidak boleh kosong woyy!'),
    jabatan: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Jabatan pegawai yg bener isinya, jgn alay')
        .required('Tidak boleh kosong woyy!'),
});

const PerbaikanSchema = Yup.object().shape({
    temuan: Yup.string().required("Temuan wajib dipilih"),
    perbaikan: Yup.string().required("Tindak lanjut wajib diisi"),
    eviden: Yup.mixed().required("Eviden wajib diupload"),
});

const MonevSchema = Yup.object().shape({
    bulan: Yup.string().required("Bulan wajib diisi"),
    tahun: Yup.number()
        .typeError("Tahun harus berupa angka")
        .required("Tahun wajib diisi"),
    setiap: Yup.string().required("Periode wajib dipilih"),
    //temuan: Yup.string().required("Temuan wajib diisi"),
    tgl_laporan_monev: Yup.string().required("Tanggal laporan wajib diisi"),
    tgl_notulen_monev: Yup.string().required("Tanggal notulen wajib diisi"),
    tempat: Yup.string().required("Tempat wajib diisi"),
    peserta: Yup.string().required("Peserta wajib diisi"),
    pimpinan_monev: Yup.string().required("Pimpinan monev wajib diisi"),
    notulis_monev: Yup.string().required("Notulis monev wajib diisi"),
    tanya_jawab: Yup.string().required("Tanya jawab wajib diisi"),
    nomor_surat: Yup.string().required("Nomor surat wajib diisi"),
    tgl_surat_monev: Yup.string().required("Tanggal surat wajib diisi"),
    kepada: Yup.string().required("Kepada wajib diisi"),
    //dokumentasi: Yup.string().required("Dokumentasi wajib diisi"),
    //absen: Yup.string().required("Absen wajib diisi"),
    //tindak_lanjut: Yup.string().required("Tindak lanjut wajib diisi"),
    //diinput_tanggal: Yup.string().required("Tanggal input wajib diisi"),
});

const ambilData = async ({ column, from, where }) => {
    try {
        const response = await axios.get(SELECT_URL, {
            params: {
                column,
                from,
                where,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Terjadi kesalahan saat ambilData:", error);
        return []; // biar gak undefined kalau error
    }
};
  
const Monev = () =>{
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [date1, setDate1] = useState(formattedDate(firstDayOfMonth));
    const queryClient = useQueryClient();    

    const [dataEdit, setDataEdit] = useState(null);
    
    const [showModalTemuan, setShowModalTemuan] = useState(false);
    const [showModalPegawai, setShowModalPegawai] = useState(false);
    const [showModalPerbaikan, setShowModalPerbaikan] = useState(false);

    const [newTemuan, setNewTemuan] = useState('');
    const [newPegawai, setNewPegawai] = useState('');
    const [newPerbaikan, setNewPerbaikan] = useState('');

    const [formikTemuan, setFormikTemuan] = useState(null);

    const [images, setImages] = useState([]);
    const [imagesDokumentasi, setImagesDokumentasi] = useState([]);
    const [imagesPerbaikan, setImagesPerbaikan] = useState([]);
    const maxNumber = 1;

    const imgOnChange = (imageList, addUpdateIndex) =>{
        //console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const [dateMonev, setDateMonev] = useState(firstDayOfMonth);
    const [dateUndanganMonev, setDateUndanganMonev] = useState(firstDayOfMonth);

    const handleChangeDate = (newDate) => {
        setStartDate(newDate);
        setDate1(formattedDate(newDate));
    };

    const { data: judulMonev = [], isLoading: loadingJudulMonev, error: errorJudulMonev } = useQuery({
        queryKey: ['judulMonev'],
        queryFn: () => ambilData({ column: 'id AS value, judul AS label', from: 'tb_judul', where: 1 }),
    });

    const [idjudulMonev, setIdJudul] = useState(null);
    const [selectedJudul, setSelectedJudul] = useState(null);

    const handleChangeSelect = (selectedOption) => {
        setIdJudul(selectedOption);
        setSelectedJudul(selectedOption);
        //console.log(selectedOption)
    };

    const handleCreateSelect = (inputValue) => {
        tambahJudulMutation.mutate(inputValue);
    };

    const tambahJudulMutation = useMutation({
        mutationFn: async (judulBaru) => {
            const res = await axios.post(INSERT_URL, {
                table: "tb_judul",
                data: { judul: judulBaru }, // ✅ cukup kirim judul
            });
            return res.data; // axios otomatis parse JSON
        },
        onSuccess: (data, judulBaru) => {
          if (data.success) {
            Swal.fire({title : 'Tambah Judul',icon: 'success', 'text' : 'Ciye bikin judul baru!'});
            queryClient.invalidateQueries(['judulMonev']);    
            setIdJudul({ value: data.insertId, label: judulBaru });
            setSelectedJudul({ value: data.insertId, label: judulBaru });
          }
        },
        onError: (error) => {
            Swal.fire({
                title: "Gagal Tambah Judul",
                text: error?.response?.data?.message || error.message || "Error woy error.",
                icon: "error",
            });
        },
    });

    const { data: dataMonev = [], isLoading: loadingDataMonev, error: errorDataMonev } = useQuery({
        queryKey: ['dataMonev', idjudulMonev, date1],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_monev',
                where: `judul = ${idjudulMonev.value} AND DATE_FORMAT(tgl_laporan_monev, '%Y-%m') = '${formattedTahunSajaNumber(date1)}-${formattedBulanSajaNumber(date1)}'`,
            }),
        enabled: !!idjudulMonev && !!date1,
    });

    const [temuanMonev, setTemuanMonev] = useState([]);
    const [absensiMonev, setAbsensiMonev] = useState([]);
    const [perbaikanMonev, setPerbaikanMonev] = useState([]);

    const { data: dataTemuan = [], isLoading: isLoadingTemuan, error: errorDataTemuan } = useQuery({
        queryKey: ['dataTemuan'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_temuan',
                where: 1,
            }),
    });
    
    const { data: dataTemuanStatis = [] } = useQuery({
        queryKey: ['dataTemuanStatis'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_temuan',
                where: 1,
            }),
        enabled: false,      // ❌ tidak auto-fetch
        staleTime: Infinity, // anggap selalu fresh
    });

    useEffect(() => {
        if (dataTemuan?.length > 0 && !queryClient.getQueryData(['dataTemuanStatis'])) {
            queryClient.setQueryData(['dataTemuanStatis'], dataTemuan);
        }
    }, [dataTemuan, queryClient]);

    const selectTemuan = useMemo(() => {
        if (!dataTemuan || dataTemuan.length === 0) return [];
        return dataTemuan.map(item => ({
            value: item.id,
            label: item.temuan
        }));
    }, [dataTemuan]);

    const { data: dataPegawai = [] } = useQuery({
        queryKey: ['dataPegawai'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_ttd',
                where: 1,
            }),
    });

    const { data: dataPegawaiStatis = [] } = useQuery({
        queryKey: ['dataPegawaiStatis'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_ttd',
                where: 1,
            }),
        enabled: false,      // ❌ tidak auto-fetch
        staleTime: Infinity, // anggap selalu fresh
    });

    useEffect(() => {
        if (dataPegawai?.length > 0 && !queryClient.getQueryData(['dataPegawaiStatis'])) {
            queryClient.setQueryData(['dataPegawaiStatis'], dataPegawai);
        }
    }, [dataPegawai, queryClient]);

    const selectPegawai = useMemo(() =>{
        if (!dataPegawai || dataPegawai.length === 0) return [];
        return dataPegawai.map(item => ({
            value: item.id,
            label: `${item.nama} | ${item.jabatan}`,
        }));
    }, [dataPegawai]);    

    const { data: dataPerbaikan = [] } = useQuery({
        queryKey: ['dataPerbaikan'],
        queryFn: () =>
            ambilData({
                column: 'tb_perbaikan.id, tb_temuan.temuan, tb_perbaikan.perbaikan, tb_perbaikan.eviden ',
                from: 'tb_perbaikan JOIN tb_temuan ON tb_perbaikan.id_temuan = tb_temuan.id',
                where: 1,
            }),
    });

    const { data: dataPerbaikanStatis = [] } = useQuery({
        queryKey: ['dataPerbaikanStatis'],
        queryFn: () =>
            ambilData({
                column: 'tb_perbaikan.id, tb_temuan.temuan, tb_perbaikan.perbaikan, tb_perbaikan.eviden ',
                from: 'tb_perbaikan JOIN tb_temuan ON tb_perbaikan.id_temuan = tb_temuan.id',
                where: 1,
            }),
        enabled: false,      // ❌ tidak auto-fetch
        staleTime: Infinity, // anggap selalu fresh
    });

    useEffect(() => {
        if (dataPerbaikan?.length > 0 && !queryClient.getQueryData(['dataPerbaikanStatis'])) {
            queryClient.setQueryData(['dataPerbaikanStatis'], dataPerbaikan);
        }
    }, [dataPerbaikan, queryClient]);

    const selectPerbaikan = useMemo(() =>{
        if (!dataPerbaikan || dataPerbaikan.length === 0) return [];
        return dataPerbaikan.map(item => ({
            value: item.id,
            label: `${item.temuan} | ${item.perbaikan}`,
        }));
    }, [dataPerbaikan]);

    console.log(selectPegawai)
    
    useEffect(() => {
        if (dataMonev && dataMonev.length > 0) {
            setDataEdit(dataMonev[0]);
            setDateMonev(new Date(dataMonev[0].tgl_laporan_monev));
            formikTemuan?.setFieldValue('setiap', dataMonev[0].setiap);
            formikTemuan?.setFieldValue('tempat', dataMonev[0].tempat);
            formikTemuan?.setFieldValue('peserta', dataMonev[0].peserta);
            formikTemuan?.setFieldValue('pimpinan_monev', selectPegawai.find(opt => opt.value == dataMonev[0].pimpinan_monev) || null);

            const temuanIds = dataMonev[0].temuan.split(",").map((id) => id.trim()).filter(Boolean);
            const pegawaiIds = dataMonev[0].absen.split(",").map((id) => id.trim()).filter(Boolean);
            const perbaikanIds = dataMonev[0].tindak_lanjut.split(",").map((id) => id.trim()).filter(Boolean);

            const filteredTemuan = dataTemuanStatis.filter((item) =>
                temuanIds.includes(String(item.id))
            );

            const filteredAbsensi = dataPegawaiStatis.filter((item) =>
                pegawaiIds.includes(String(item.id))
            );

            const filteredPerbaikan = dataPerbaikanStatis.filter((item) =>
                perbaikanIds.includes(String(item.id))
            );

            formikTemuan?.setFieldValue('temuan', filteredTemuan.length > 0 ? filteredTemuan.map(item => item.id).join(',') : '');
            formikTemuan?.setFieldTouched('temuan', filteredTemuan.length > 0 ? true : false);

            formikTemuan?.setFieldValue('absen', filteredAbsensi.length > 0 ? filteredAbsensi.map(item => item.id).join(',') : '');
            formikTemuan?.setFieldTouched('absen', filteredAbsensi.length > 0 ? true : false);

            formikTemuan?.setFieldValue('tindak_lanjut', filteredPerbaikan.length > 0 ? filteredPerbaikan.map(item => item.id).join(',') : '');
            formikTemuan?.setFieldTouched('tindak_lanjut', filteredPerbaikan.length > 0 ? true : false);

            setTemuanMonev((prev) => {
                const sameLength = prev.length === filteredTemuan.length;
                const sameContent = sameLength && prev.every((p, i) => p.id === filteredTemuan[i].id);
                return sameContent ? prev : filteredTemuan;
            });

            setAbsensiMonev((prev) => {
                const sameLength = prev.length === filteredAbsensi.length;
                const sameContent = sameLength && prev.every((p, i) => p.id === filteredAbsensi[i].id);
                return sameContent ? prev : filteredAbsensi;
            });

            setPerbaikanMonev((prev) => {
                const sameLength = prev.length === filteredPerbaikan.length;
                const sameContent = sameLength && prev.every((p, i) => p.id === filteredPerbaikan[i].id);
                return sameContent ? prev : filteredPerbaikan;
            });
        } else {
            setTemuanMonev((prev) => (prev.length > 0 ? [] : prev));
            setAbsensiMonev((prev) => (prev.length > 0 ? [] : prev));
            setPerbaikanMonev((prev) => (prev.length > 0 ? [] : prev));
        }
    }, [dataMonev, dataTemuanStatis, dataPegawaiStatis, dataPerbaikanStatis]);

    //console.log(dataEdit);

    const tambahTemuanMutation = useMutation({
        mutationFn: async (temuan) => {
            const res = await axios.post(INSERT_URL, {
                table: "tb_temuan",
                data: temuan, // ✅ cukup kirim judul
            });
            return res.data; // axios otomatis parse JSON
        },
        onSuccess: (data, temuanBaru) => {
            if (data.success) {
                Swal.fire({title : 'Tambah Temuan',icon: 'success', 'text' : 'Berhasil menambahkan temuan baru!'});
                queryClient.invalidateQueries(['dataTemuan']);

                let parsedData = {};
                for (let [key, val] of temuanBaru.entries()) {
                    if (key === "data") {
                        try {
                            parsedData = JSON.parse(val);
                        } catch (e) {
                            console.error("Gagal parse data:", e);
                        }
                    }
                }
        
                const temp = {
                    id: data.insertId,
                    ...parsedData
                };

                const values = [...temuanMonev, temp];
                formikTemuan.setFieldValue('temuan', values.map(item => item.id).join(',')); 
                formikTemuan.setFieldTouched('temuan', true);
                setTemuanMonev([...temuanMonev, temp]);
                setFormikTemuan(null);
                setNewTemuan('');
                setShowModalTemuan(false);
            }
        },
        onError: (error) => {
            Swal.fire({
                title: "Gagal Tambah Temuan",
                text: error?.response?.data?.message || error.message || "Error woy error.",
                icon: "error",
            });
        },
    });

    const SelectTemuan = ({formik}) =>{
        return(
            <>
                <CreateableSelect
                    options={selectTemuan}
                    isClearable
                    onChange={(data) => {
                        let temp = [];
                        if(!idjudulMonev || !date1){
                            Swal.fire({
                                title: 'Pilih Judul dan Periode Terlebih Dahulu',
                                text: 'Yoo pilih judul monevnya dahulu dongs..',
                                icon: 'warning',
                            });
                            return;
                        }

                        if (data) {
                            // Cek duplikat
                            const exists = temuanMonev.some((item) => item.id === data.value);
                            if (exists) {
                                Swal.fire({
                                    title: 'Duplikat Temuan',
                                    text: 'Temuan sudah ada dalam daftar.',
                                    icon: 'warning',
                                });
                                return;
                            }

                            const filter = dataTemuan.find(
                                (item) => String(item.id) === String(data.value)
                            );
                            temp = [...temuanMonev, filter];
                            setTemuanMonev([...temuanMonev, filter]);
                            formik.setFieldValue('temuan', temp.map(item => item.id).join(','));
                            formik.setFieldTouched('temuan', true);
                        }
                    }}
                    onCreateOption={(temuan) => {
                        handleCreateTemuan(temuan);
                        setFormikTemuan(formik);
                    }}                      
                    placeholder="Pilih atau ketik temuan..."
                />
            </>
        )
    };    

    const handleSaveTemuan = (values, resetForm) => {
        const formData = new FormData();
        formData.append("table", "tb_temuan");  

        const payload = {
            temuan: values.temuan,
            kendala: values.kendala,
            rekomendasi: values.rekomendasi,
            ket: values.ket,
        };
        formData.append("data", JSON.stringify(payload)); 

        tambahTemuanMutation.mutate(formData);
        //console.log(values);
    };

    const handleCreateTemuan = (temuan) =>{
        setNewTemuan(temuan);
        setShowModalTemuan(true);
    };
    
    const tambahPegawaiMutation = useMutation({
        mutationFn: async (pegawaiBaru) => {
            // pegawaiBaru = FormData dari handleSavePegawai
            const res = await axios.post(INSERT_PEGAWAI_URL, pegawaiBaru, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                //console.log(data.pegawai);
                Swal.fire({
                    title: "Tambah Pegawai",
                    icon: "success",
                    text: "Ciye bikin pegawai baru!",
                }).then(() => {
                    // baru dijalankan setelah Swal di-dismiss
                    queryClient.invalidateQueries(["dataPegawai"]);
                    formikTemuan.setFieldValue('absen', [...absensiMonev, data.pegawai].map(item => item.id).join(','));
                    formikTemuan.setFieldTouched('absen', true);
                    setFormikTemuan(null);
                    setNewPegawai('');
                    setShowModalPegawai(false);
                    setImages([]);
                    setAbsensiMonev([...absensiMonev, data.pegawai]); 
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                title: "Gagal Tambah Pegawai",
                text: error?.response?.data?.message || error.message || "Error woy error.",
                icon: "error",
            });
        },
    });

    const SelectPegawai = ({formik}) =>{
        return(
            <>
                <CreateableSelect
                    options={selectPegawai}
                    isClearable
                    onChange={(data) => {
                        if(!idjudulMonev || !date1){
                            Swal.fire({
                                title: 'Pilih Judul dan Periode Terlebih Dahulu',
                                text: 'Yoo pilih judul monevnya dahulu dongs..',
                                icon: 'warning',
                            });
                            return;
                        }

                        if (data) {
                            // Cek duplikat
                            const exists = absensiMonev.some((item) => item.id === data.value);
                            if (exists) {
                                Swal.fire({
                                    title: 'Duplikat Pegawai',
                                    text: 'Pegawai sudah ada dalam daftar.',
                                    icon: 'warning',
                                });
                                return;
                            }

                            const filter = dataPegawai.find(
                                (item) => String(item.id) === String(data.value)
                            );
                            const temp = [...absensiMonev, filter];
                            formik.setFieldValue('absen', temp.map(item => item.id).join(','));
                            formik.setFieldTouched('absen', true);
                            setAbsensiMonev([...absensiMonev, filter]);
                        }
                    }}
                    onCreateOption={(pegawai) => {
                        handleCreatePegawai(pegawai);
                        setFormikTemuan(formik);
                    }}                   
                    placeholder="Pilih atau ketik pegawai yg ada..."
                />
            </>
        )
    };

    const handleSavePegawai = (values, resetForm) => {
        const formData = new FormData();
        formData.append("table", "tb_ttd");  

        const payload = {
            nama: values.nama,
            jabatan: values.jabatan,
        };
        formData.append("data", JSON.stringify(payload)); 

        if (images.length > 0) {
            const file = images[0].file;
            formData.append("ttd", file);
        }
        tambahPegawaiMutation.mutate(formData);
    };

    const handleCreatePegawai = (pegawai) =>{
        setNewPegawai(pegawai);
        setShowModalPegawai(true);
    };

    const tambahPerbaikanMutation = useMutation({
        mutationFn: async (perbaikanBaru) => {
            // pegawaiBaru = FormData dari handleSavePegawai
            const res = await axios.post(INSERT_PERBAIKAN_URL, perbaikanBaru, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                //console.log(data.perbaikan);
                Swal.fire({
                    title: "Tambah Tindak Lanjut",
                    icon: "success",
                    text: "Ciye bikin Tindak Lanjut baru!",
                }).then(() => {
                    // baru dijalankan setelah Swal di-dismiss
                    queryClient.invalidateQueries(["dataPerbaikan"]);
                    formikTemuan.setFieldValue('tindak_lanjut', [...perbaikanMonev, data.perbaikan].map(item => item.id).join(','));
                    formikTemuan.setFieldTouched('tindak_lanjut', true);
                    setFormikTemuan(null);
                    setNewPerbaikan('');
                    setShowModalPerbaikan(false);
                    setImagesPerbaikan([]);
                    setPerbaikanMonev([...perbaikanMonev, data.perbaikan]); 
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                title: "Gagal Tambah Tindak Lanjut",
                text: error?.response?.data?.message || error.message || "Error woy error.",
                icon: "error",
            });
        },
    });

    const SelectPerbaikan = ({formik}) =>{
        return(
            <>
                <CreateableSelect
                    options={selectPerbaikan}
                    isClearable
                    onChange={(data) => {
                        if(!idjudulMonev || !date1){
                            Swal.fire({
                                title: 'Pilih Judul dan Periode Terlebih Dahulu',
                                text: 'Yoo pilih judul monevnya dahulu dongs..',
                                icon: 'warning',
                            });
                            return;
                        }

                        if (data) {
                            // Cek duplikat
                            const exists = perbaikanMonev.some((item) => item.id === data.value);
                            if (exists) {
                                Swal.fire({
                                    title: 'Duplikat Tindak Lanjut',
                                    text: 'Tindak Lanjut sudah ada dalam daftar.',
                                    icon: 'warning',
                                });
                                return;
                            }

                            const filter = dataPerbaikan.find(
                                (item) => String(item.id) === String(data.value)
                            );
                            formik.setFieldValue('tindak_lanjut', [...perbaikanMonev, filter].map(item => item.id).join(',')); 
                            formik.setFieldTouched('tindak_lanjut', true);
                            setPerbaikanMonev([...perbaikanMonev, filter]);
                        }
                    }}
                    onCreateOption={(perbaikan) => {
                        handleCreatePerbaikan(perbaikan);
                        setFormikTemuan(formik);
                    }}                
                    placeholder="Pilih atau ketik tindak lanjut..."
                />
            </>
        )
    };

    const handleCreatePerbaikan = (perbaikan) =>{
        setNewPerbaikan(perbaikan);
        setShowModalPerbaikan(true);
    };

    const handleSavePerbaikan = (values, resetForm) => {
        const formData = new FormData();
        formData.append("table", "tb_perbaikan");
        const payload = {
            id_temuan: values.temuan,
            perbaikan: values.perbaikan,
        };
        formData.append("data", JSON.stringify(payload));
        if (imagesPerbaikan.length > 0) {
            const file = imagesPerbaikan[0].file;
            formData.append("eviden", file);
        }  
        
        // cek isi formData
        /*for (let [key, val] of formData.entries()) {
            console.log(key, val);
        }*/
        tambahPerbaikanMutation.mutate(formData);
    }

    const columnHelper = createColumnHelper();
    
    const columns = [
		columnHelper.display({
		  id: 'no',
		  header: () => 'No',
		  cell: ({ row }) => row.index + 1,
		}),
        columnHelper.accessor('temuan', {
            id: 'temuan',
            header: () => 'Temuan',
            cell: ({ row }) => <p className="m-0">{row.original.temuan}</p>
        }),
        columnHelper.accessor('kendala', {
            id: 'kendala',
            header: () => 'Kendala',
            cell: ({ row }) => <p className="m-0">{row.original.kendala}</p>
        }),
        columnHelper.accessor('rekomendasi', {
            id: 'rekomendasi',
            header: () => 'Rekomendasi',
            cell: ({ row }) => <p className="m-0">{row.original.rekomendasi}</p>
        }),
        columnHelper.accessor('ket', {
            id: 'ket',
            header: () => 'Ket',
            cell: ({ row }) => <p className="m-0">{row.original.ket}</p>
        }),
		columnHelper.display({
		  id: 'aksi',
		  header: () => 'Aksi',
		  cell: ({ row }) => {
            return (
                <CButton 
                    color="danger" 
                    className='text-white'
                    size="sm" 
                    onClick={() => {
                        const temuanToRemove = row.original;
                        Swal.fire({
                            title: 'Hapus Temuan',
                            text: `Yakin menghapus temuan: "${temuanToRemove.temuan}" dari daftar?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Hapus!',
                            cancelButtonText: 'Batal',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setTemuanMonev(temuanMonev.filter(item => item.id !== temuanToRemove.id));
                            }
                        });
                    }}
                >
                    Hapus
                </CButton>
            );
          },
		}),
    ];

    const columnsAbsen = [
		columnHelper.display({
		  id: 'no',
		  header: () => 'No',
		  cell: ({ row }) => row.index + 1,
		}),
        columnHelper.accessor('nama', {
            id: 'nama',
            header: () => 'Nama',
            cell: ({ row }) => <p className="m-0">{row.original.nama}</p>
        }),
        columnHelper.accessor('jabatan', {
            id: 'jabatan',
            header: () => 'Jabatan',
            cell: ({ row }) => <p className="m-0">{row.original.jabatan}</p>
        }),
        columnHelper.accessor('ttd', {
            id: 'ttd',
            header: () => 'TTD',
            cell: ({ row }) =>
                row.original.ttd ? (
                    <img
                        src={`${import.meta.env.BASE_URL}/backend/TTD/${row.original.ttd}`}
                        alt="Specimen TTD"
                        style={{ width: 60, height: "auto", objectFit: "contain" }}
                    />
                ) : (
                    <p className="m-0">-</p>
            ),
        }),
		columnHelper.display({
		  id: 'aksi',
		  header: () => 'Aksi',
		  cell: ({ row }) => {
            return (
                <CButton 
                    color="danger" 
                    className='text-white'
                    size="sm" 
                    onClick={() => {
                        const absenToRemove = row.original;
                        Swal.fire({
                            title: 'Hapus Temuan',
                            text: `Yakin menghapus: "${absenToRemove.nama}" dari daftar?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Hapus!',
                            cancelButtonText: 'Batal',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setAbsensiMonev(absensiMonev.filter(item => item.id !== absenToRemove.id));
                            }
                        });
                    }}
                >
                    Hapus
                </CButton>
            );
          },
		}),
    ];

    const columnsPerbaikan = [
		columnHelper.display({
		  id: 'no',
		  header: () => 'No',
		  cell: ({ row }) => row.index + 1,
		}),
        columnHelper.accessor('temuan', {
            id: 'temuan',
            header: () => 'Temuan',
            cell: ({ row }) => <p className="m-0">{row.original.temuan}</p>
        }),
        columnHelper.accessor('perbaikan', {
            id: 'perbaikan',
            header: () => 'Perbaikan',
            cell: ({ row }) => <p className="m-0">{row.original.perbaikan}</p>
        }),
        columnHelper.accessor('eviden', {
            id: 'eviden',
            header: () => 'Eviden',
            cell: ({ row }) =>
                row.original.eviden ? (
                    <img
                        src={`${import.meta.env.BASE_URL}/backend/DOK/${row.original.eviden}`}
                        alt="Eviden"
                        style={{ width: 120, height: "auto", objectFit: "contain" }}
                    />
                ) : (
                    <p className="m-0">-</p>
            ),
        }),
		columnHelper.display({
		  id: 'aksi',
		  header: () => 'Aksi',
		  cell: ({ row }) => {
            return (
                <CButton 
                    color="danger" 
                    className='text-white'
                    size="sm" 
                    onClick={() => {
                        const perbaikanToRemove = row.original;
                        Swal.fire({
                            title: 'Hapus Tindak Lanjut',
                            text: `Yakin menghapus: "${perbaikanToRemove.perbaikan}" dari daftar?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Hapus!',
                            cancelButtonText: 'Batal',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setPerbaikanMonev(perbaikanMonev.filter(item => item.id !== perbaikanToRemove.id));
                            }
                        });
                    }}
                >
                    Hapus
                </CButton>
            );
          },
		}),
    ];

    return(
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className='mb-2'>
                        <CCol sm={8}>
                        <h4 className="card-title mb-0">
                            Monev Generator
                        </h4>
                        <div className="small text-body-secondary mt-1">{formattedBulanSaja(date1)} - {formattedTahunSaja(date1)}</div>
                        </CCol>
                        <CCol sm={4} className="d-none d-md-block">                        
                            <div className="vstack gap-0">
                                <h5 className='mb-0 me-2 text-center'>Periode</h5>
                                <DatePicker 
                                    selected={startDate}
                                    dateFormat='MMMM yyyy' 
                                    locale={id} 
                                    onChange={handleChangeDate}
                                    className='form-control text-center'
                                    showMonthYearPicker
                                />
                            </div>
                        </CCol>
                    </CRow>

                    <hr className="mt-0" />

                    {idjudulMonev && dataMonev.length > 0 ? (
                        <CAlert color="success" className="d-flex align-items-center">
                            <CIcon icon={icons.cilThumbUp} className="flex-shrink-0 me-2" width={24} height={24} />
                            <div>Monevnya ada cuyy</div>
                        </CAlert>
                    ) : idjudulMonev && dataMonev.length == 0 ? (
                        <CAlert color="warning" className="d-flex align-items-center">
                            <CIcon icon={icons.cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                            <div>Monevnya belom ada hayoo ..</div>
                        </CAlert>
                    ) : !idjudulMonev && dataMonev.length == 0 ? (
                        <></>
                    ) : null}

                    <CRow className='mb-2'>
                        <CCol>
                            <CRow>
                                <CCol>
                                    <div className={`border-start border-start-4 border-start-primary py-1 px-3`}>
                                        <Formik
                                            initialValues={{
                                                judul: idjudulMonev ? idjudulMonev.value : '',
                                                tgl_laporan_monev: dateMonev ? dateMonev : '',
                                                bulan: dateMonev ? format(dateMonev, "MMMM") : '',
                                                tahun: dateMonev ? format(dateMonev, "yyyy") : '',
                                                setiap: '',
                                                temuan: '',
                                                tgl_notulen_monev: '',
                                                tempat: '',
                                                peserta: '',
                                                pimpinan_monev: '',
                                                notulis_monev: '',
                                                tanya_jawab: '',
                                                nomor_surat: '',
                                                tgl_surat_monev: '',
                                                kepada: '',
                                                dokumentasi: null,
                                                absen: '',
                                                tindak_lanjut: '',
                                                diinput_tanggal: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            }}
                                            validationSchema={MonevSchema}
                                            onSubmit={(values, { resetForm }) => {
                                                console.log(values);
                                            }}
                                        >
                                            {formik => (
                                                <>
                                                    <CForm>
                                                        <CRow>
                                                            <CFormLabel className="col-form-label text-truncate small fs-6">Judul</CFormLabel>
                                                            {loadingJudulMonev ? (
                                                                <div className="pt-3 text-center">
                                                                    <CSpinner color="primary" variant="grow" />
                                                                </div>
                                                            ) : errorJudulMonev ? (
                                                                <CAlert color="warning" className="d-flex align-items-center">
                                                                    <CIcon icon={icons.cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                                                                    <div>Error dalam pengambilan data</div>
                                                                </CAlert>
                                                            ) : (
                                                                <>
                                                                    <CreateableSelect
                                                                        options={judulMonev}
                                                                        value={selectedJudul}
                                                                        onChange={(data) => {
                                                                            handleChangeSelect(data);
                                                                            formik.setFieldValue('judul', data ? data.value : '');
                                                                            formik.setFieldTouched('judul', true);
                                                                            setFormikTemuan(formik);
                                                                        }}
                                                                        onBlur={() => formik.setFieldTouched('judul', true)}
                                                                        onCreateOption={handleCreateSelect}
                                                                        placeholder="Pilih atau ketik monev yg ingin kau generate..."
                                                                        className='mb-2'
                                                                    />
                                                                    {formik.errors.judul && formik.touched.judul && (
                                                                        <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                            {formik.errors.judul}
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </CRow>
                                                        <CRow>
                                                            {loadingDataMonev ? (
                                                                <div className="pt-3 text-center">
                                                                    <CSpinner color="primary" variant="grow" />
                                                                </div>
                                                            ) : errorDataMonev ? (
                                                                <CAlert color="warning" className="d-flex align-items-center">
                                                                    <CIcon icon={icons.cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                                                                    <div>Error dalam pengambilan data</div>
                                                                </CAlert>
                                                            ) : (
                                                                <>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <DatePicker 
                                                                            selected={dateMonev}
                                                                            dateFormat="EEEE, d MMMM yyyy 'Pukul' HH:mm"
                                                                            className='form-control w-150'
                                                                            onChange={(date) => {
                                                                                setDateMonev(date);
                                                                                //console.log(format(date, "yyyy-MM-dd HH:mm:ss"));
                                                                                formik.setFieldValue('tgl_laporan_monev', format(date, "yyyy-MM-dd HH:mm:ss"));
                                                                                formik.setFieldValue('bulan', format(date, "MMMM"));
                                                                                formik.setFieldValue('tahun', format(date, "yyyy"));
                                                                                formik.setFieldValue('tgl_notulen_monev', format(date, "yyyy-MM-dd HH:mm:ss"));
                                                                            }}
                                                                            onBlur={() => {
                                                                                formik.setFieldTouched('tgl_laporan_monev', true);
                                                                                formik.setFieldTouched('bulan', true);
                                                                                formik.setFieldTouched('tahun', true);
                                                                                formik.setFieldTouched('tgl_notulen_monev', true);
                                                                            }}                                                                                                     
                                                                            locale={id}
                                                                            showTimeSelect
                                                                        />
                                                                        {formik.errors.tgl_laporan_monev && formik.touched.tgl_laporan_monev && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.tgl_laporan_monev}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Bulan Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <DatePicker 
                                                                            selected={dateMonev}
                                                                            dateFormat="MMMM"
                                                                            className='form-control w-50'                                                                                                        
                                                                            locale={id}
                                                                            disabled
                                                                        />
                                                                        {formik.errors.bulan && formik.touched.bulan && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.bulan}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tahun Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <DatePicker 
                                                                            selected={dateMonev}
                                                                            dateFormat="yyyy"
                                                                            className='form-control w-30'                                                                                        
                                                                            locale={id}
                                                                            disabled
                                                                        />
                                                                        {formik.errors.tahun && formik.touched.tahun && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.tahun}
                                                                            </div>
                                                                        )}
                                                                    </div> 
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Setiap</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormSelect 
                                                                            aria-label="Default select example"
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            name='setiap'
                                                                            value={formik.values.setiap}
                                                                            className='w-30'
                                                                            invalid={formik.touched.setiap && !!formik.errors.setiap}
                                                                            feedbackInvalid={formik.errors.setiap}
                                                                        >
                                                                            <option value=''>-- Pilih --</option>
                                                                            <option value="Hari">Hari</option>
                                                                            <option value="Minggu">Minggu</option>
                                                                            <option value="1 Bulan">1 Bulan</option>
                                                                            <option value="3 Bulan">3 Bulan</option>
                                                                            <option value="6 Bulan">6 Bulan</option>
                                                                        </CFormSelect>
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Temuan</CFormLabel>
                                                                    <div className='mb-2 ps-3' >
                                                                        <TableDinamis data={temuanMonev} columns={columns} RenderSelect={<SelectTemuan formik={formik} />} KetKosong={'Tidak ada temuan'} />
                                                                        {formik.errors.temuan && formik.touched.temuan && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.temuan}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Notulen Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <DatePicker 
                                                                            selected={dateMonev}
                                                                            dateFormat="EEEE, d MMMM yyyy"
                                                                            className='form-control w-120'                                                                                                                        
                                                                            locale={id}
                                                                            disabled
                                                                        />
                                                                        {formik.errors.tgl_notulen_monev && formik.touched.tgl_notulen_monev && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.tgl_notulen_monev}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tempat Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormInput 
                                                                            placeholder="Tempat Rapat Monev" 
                                                                            autoComplete="tempat"
                                                                            name='tempat'
                                                                            type='text'
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik.values.tempat}
                                                                            invalid={formik.touched.tempat && !!formik.errors.tempat}
                                                                            feedbackInvalid={formik.errors.tempat}
                                                                        />
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Peserta Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormTextarea
                                                                            placeholder='Peserta Rapat Monev'
                                                                            autoComplete='peserta'
                                                                            rows={4}
                                                                            name='peserta'
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik.values.peserta}
                                                                            invalid={formik.touched.peserta && !!formik.errors.peserta}
                                                                        />
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Pimpinan Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>                                                            
                                                                        <CreateableSelect
                                                                            options={selectPegawai}
                                                                            onCreateOption={() => handleCreatePegawai()}
                                                                            value={formik.values.pimpinan_monev}
                                                                            isClearable
                                                                            placeholder="Pilih atau ketik pimpinan monev..."
                                                                            onChange={(data) => formik.setFieldValue('pimpinan_monev', data ? data.value : '')}
                                                                            onBlur={() => formik.setFieldTouched('pimpinan_monev', true)}                                                                            
                                                                        />                                                                        
                                                                        {formik.errors.pimpinan_monev && formik.touched.pimpinan_monev && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.pimpinan_monev}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Notulis Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>                                                            
                                                                        <CreateableSelect
                                                                            options={selectPegawai}
                                                                            onCreateOption={() => handleCreatePegawai()}
                                                                            isClearable
                                                                            placeholder="Pilih atau ketik notulis monev..."
                                                                            onChange={(data) => formik.setFieldValue('notulis_monev', data ? data.value : '')}
                                                                            onBlur={() => formik.setFieldTouched('notulis_monev', true)}                                                                            
                                                                        />
                                                                        {formik.errors.notulis_monev && formik.touched.notulis_monev && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.notulis_monev}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tanya Jawab (di notulen Monev)</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormTextarea
                                                                            placeholder='Tanya Jawab Rapat Monev'
                                                                            autoComplete='tanya_jawab'
                                                                            rows={6}
                                                                            name='tanya_jawab'
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik.values.tanya_jawab}
                                                                            invalid={formik.touched.tanya_jawab && !!formik.errors.tanya_jawab}
                                                                            feedbackInvalid={formik.errors.tanya_jawab}
                                                                        />
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Nomor Surat Undangan Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormInput 
                                                                            placeholder="Nomor Surat Undangan Monev" 
                                                                            autoComplete="nomor_surat"
                                                                            name='nomor_surat'
                                                                            type='text'
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik.values.nomor_surat}
                                                                            invalid={formik.touched.nomor_surat && !!formik.errors.nomor_surat}
                                                                            feedbackInvalid={formik.errors.nomor_surat}                                                                            
                                                                        />
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Surat Undangan Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <DatePicker 
                                                                            selected={dateUndanganMonev}
                                                                            dateFormat="EEEE, d MMMM yyyy"
                                                                            className='form-control w-120'
                                                                            onChange={(date) => {
                                                                                setDateUndanganMonev(date);
                                                                                formik.setFieldValue('tgl_surat_monev', format(date, "yyyy-MM-dd HH:mm:ss"));
                                                                            }}                                                                      
                                                                            onBlur={() => formik.setFieldTouched('tgl_surat_monev', true)}                                                       
                                                                            locale={id}
                                                                        />
                                                                        {formik.errors.tgl_surat_monev && formik.touched.tgl_surat_monev && (
                                                                            <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                                                                {formik.errors.tgl_surat_monev}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tujuan Surat Undangan Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <CFormTextarea
                                                                            placeholder='Tujuan Surat Undangan Monev'
                                                                            autoComplete='kepada'
                                                                            rows={4}
                                                                            name='kepada'
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            value={formik.values.kepada}
                                                                            invalid={formik.touched.kepada && !!formik.errors.kepada}
                                                                            feedbackInvalid={formik.errors.kepada}                                                                            
                                                                        />
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Dokumentasi Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <ReactImageUploading
                                                                            multiple={true}
                                                                            value={formik.values.dokumentasi}
                                                                            maxNumber={5}
                                                                            maxFileSize={5000000}
                                                                            onChange={(imageList) => {
                                                                                //setImagesDokumentasi(imageList);
                                                                                formik.setFieldValue('dokumentasi', imageList);
                                                                            }}
                                                                            onError={(errors) => {
                                                                                if (errors.maxNumber) {
                                                                                    Swal.fire({
                                                                                        icon: "warning",
                                                                                        title: "Maksimal 5 Gambar",
                                                                                        text: "Tidak bisa mengupload lebih dari 5 gambar Woy!"
                                                                                    });
                                                                                }
                                                                                if (errors.maxFileSize) {
                                                                                    Swal.fire({
                                                                                        icon: "error",
                                                                                        title: "File Terlalu Besar",
                                                                                        text: "Ukuran maksimal per file adalah 5MB Woy!"
                                                                                    });
                                                                                }
                                                                                if (errors.acceptType) {
                                                                                    Swal.fire({
                                                                                        icon: "error",
                                                                                        title: "Format Tidak Didukung",
                                                                                        text: "Tsk, Hanya file JPG, JPEG, atau PNG yang diperbolehkan."
                                                                                    });
                                                                                }
                                                                            }}
                                                                            dataURLKey='data_url'
                                                                            acceptType={['png', 'jpg', 'jpeg']}    
                                                                        >
                                                                            {({
                                                                                imageList,
                                                                                onImageUpload,
                                                                                onImageRemove,
                                                                                isDragging,
                                                                                dragProps,
                                                                            }) => ( 
                                                                                <div 
                                                                                    className='dropzone'
                                                                                    onClick={onImageUpload}
                                                                                >
                                                                                    <div {...dragProps} className={`${isDragging ? 'dragging' : ''}`}>
                                                                                            <CRow className='flex-wrap justify-content-start'>
                                                                                                {imageList.map((image, index) => (
                                                                                                    <CCol key={index}>
                                                                                                        <div className="image-item">
                                                                                                            <CImage rounded thumbnail src={image.data_url} alt="" width="100" />
                                                                                                            <div className="image-item__btn-wrapper">
                                                                                                                <CButton color='danger' size='sm' className='mt-2' onClick={() => onImageRemove(index)}><CIcon icon={icons.cilTrash} /></CButton>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </CCol>
                                                                                                ))}
                                                                                            </CRow>
                                                                                        <p className='mt-1' style={{'fontSize' : '13px'}}>Tarik dan Letakan / Klik untuk pilih Dokumentasi mu disini <b>(hanya menerima PNG/JPG MAX 5 Pcs saja!)</b></p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </ReactImageUploading>
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Absensi Peserta Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <TableDinamis data={absensiMonev} columns={columnsAbsen} RenderSelect={<SelectPegawai formik={formik} />} KetKosong={'Tidak ada yg ikut'}/>
                                                                    </div>
                                                                    <CFormLabel className="col-form-label text-truncate small fs-6">Tindak Lanjut Monev</CFormLabel>
                                                                    <div className='mb-2 ps-3'>
                                                                        <TableDinamis data={perbaikanMonev} columns={columnsPerbaikan} RenderSelect={<SelectPerbaikan formik={formik} />} KetKosong={'Tidak ada tindak lanjut'}/>
                                                                    </div>
                                                                    <div className='mt-4 mb-2 ps-3 d-flex justify-content-end'>
                                                                        <CButton onClick={() => formik.submitForm()} color='primary'>
                                                                            <CIcon icon={icons.cilFile} className="me-2" /> Generate Monev
                                                                        </CButton>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </CRow>                                            
                                                    </CForm>
                                                </>
                                            )}
                                        </Formik>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CCardBody>
                <CCardFooter>
                    <CRow>
                        asdasd
                    </CRow>
                </CCardFooter>
            </CCard>
            <CModal 
                visible={showModalTemuan} 
                onClose={() => setShowModalTemuan(false)}
                alignment="center"
                aria-labelledby="VerticallyCentered"
                scrollable
                backdrop='static'
                keyboard
            >
                <CModalHeader closeButton={() => setShowModalTemuan(false)}>
                    <CModalTitle>Tambah Temuan</CModalTitle>
                </CModalHeader>                
                <Formik
                    initialValues={{
                        temuan: newTemuan || '',
                        kendala: '',
                        rekomendasi: '',
                        ket: '',
                    }}
                    validationSchema={TemuanSchema}
                    onSubmit={(values, { resetForm }) => {
                        handleSaveTemuan(values, resetForm);
                    }}
                >
                    {formik => (
                        <>
                            <CModalBody>    
                                <CForm>
                                    <CFormInput 
                                        value={formik.values.temuan}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.temuan && !!formik.errors.temuan}
                                        feedbackInvalid={formik.errors.temuan}
                                        placeholder="Input Temuan" 
                                        autoComplete="temuan"
                                        name='temuan'
                                        type='text'
                                        label="Temuan Baru"
                                    />
                                    <CFormTextarea
                                        value={formik.values.kendala}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.kendala && !!formik.errors.kendala}
                                        feedbackInvalid={formik.errors.kendala}
                                        placeholder='Kendala terkait temuan'
                                        autoComplete='kendala'
                                        rows={4}
                                        name='kendala'
                                        label="Kendala"
                                    />
                                    <CFormTextarea
                                        value={formik.values.rekomendasi}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.rekomendasi && !!formik.errors.rekomendasi}
                                        feedbackInvalid={formik.errors.rekomendasi}
                                        placeholder='Rekomendasi terkait temuan'
                                        autoComplete='rekomendasi'
                                        rows={4}
                                        name='rekomendasi'
                                        label="Rekomendasi"
                                    />
                                    <CFormTextarea
                                        value={formik.values.ket}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.ket && !!formik.errors.ket}
                                        feedbackInvalid={formik.errors.ket}
                                        placeholder='Keterangan terkait temuan'
                                        autoComplete='ket'
                                        rows={4}
                                        name='ket'
                                        label="Keterangan"
                                    />
                                </CForm>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setShowModalTemuan(false)}><FontAwesomeIcon icon={faicons.faClose} color='white' />Tutup</CButton>
                                <CButton color="primary" onClick={() => formik.submitForm()}><FontAwesomeIcon icon={faicons.faSave} color='white' /> Simpan</CButton>
                            </CModalFooter>
                        </>
                    )}
                </Formik>
            </CModal>

            <CModal 
                visible={showModalPegawai} 
                onClose={() => setShowModalPegawai(false)}
                alignment="center"
                aria-labelledby="VerticallyCentered"
                scrollable
                backdrop='static'
                keyboard
            >
                <CModalHeader closeButton={() => setShowModalPegawai(false)}>
                    <CModalTitle>Tambah Pegawai</CModalTitle>
                </CModalHeader>                
                <Formik
                    initialValues={{
                        nama: newPegawai || '',
                        jabatan: '',
                    }}
                    validationSchema={validationSchemaPegawai}
                    onSubmit={(values, { resetForm }) => {
                        handleSavePegawai(values, resetForm);
                    }}
                >
                    {formik => (
                        <>
                            <CModalBody>    
                                <CForm>
                                    <CFormInput 
                                        value={formik.values.nama}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.nama && !!formik.errors.nama}
                                        feedbackInvalid={formik.errors.nama}
                                        placeholder="Input Nama Pegawai" 
                                        autoComplete="nama"
                                        name='nama'
                                        type='text'
                                        label="Nama Pegawai"
                                    />
                                    <CFormInput 
                                        value={formik.values.jabatan}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.jabatan && !!formik.errors.jabatan}
                                        feedbackInvalid={formik.errors.jabatan}
                                        placeholder="Input Jabatan Pegawai" 
                                        autoComplete="jabatan"
                                        name='jabatan'
                                        type='text'
                                        label="Jabatan Pegawai"
                                    />
                                    <div className='mb-3'></div>
                                    <ReactImageUploading
                                        multiple
                                        value={images}
                                        maxNumber={maxNumber}
                                        maxFileSize={5000000}
                                        onChange={imgOnChange}
                                        dataURLKey='data_url'
                                        acceptType={['png']}    
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps,
                                        }) => ( 
                                            <div 
                                                className='dropzone'
                                                onClick={onImageUpload}
                                            >
                                                <div {...dragProps} className={`${isDragging ? 'dragging' : ''}`}>
                                                        <CRow className='flex-wrap justify-content-start'>
                                                            {imageList.map((image, index) => (
                                                                <CCol key={index}>
                                                                    <div className="image-item">
                                                                        <CImage rounded thumbnail src={image.data_url} alt="" width="100" />
                                                                        <div className="image-item__btn-wrapper">
                                                                            <CButton color='danger' size='sm' className='mt-2' onClick={() => onImageRemove(index)}><CIcon icon={icons.cilTrash} /></CButton>
                                                                        </div>
                                                                    </div>
                                                                </CCol>
                                                            ))}
                                                        </CRow>
                                                    <p className='mt-1' style={{'fontSize' : '13px'}}>Tarik dan Letakan / Klik untuk pilih Specimen TTD mu disini <b>(hanya menerima PNG tanpa BACKGROUND dan MAX 1 Pcs saja!)</b></p>
                                                </div>
                                            </div>
                                        )}
                                    </ReactImageUploading>
                                </CForm>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setShowModalPegawai(false)}><FontAwesomeIcon icon={faicons.faClose} color='white' />Tutup</CButton>
                                <CButton color="primary" onClick={() => formik.submitForm()}><FontAwesomeIcon icon={faicons.faSave} color='white' /> Simpan</CButton>
                            </CModalFooter>
                        </>
                    )}
                </Formik>
            </CModal>

            <CModal 
                visible={showModalPerbaikan} 
                onClose={() => setShowModalPerbaikan(false)}
                alignment="center"
                aria-labelledby="VerticallyCentered"
                scrollable
                backdrop='static'
                keyboard
            >
                <CModalHeader closeButton={() => setShowModalPegawai(false)}>
                    <CModalTitle>Tambah Tindak Lanjut</CModalTitle>
                </CModalHeader>                
                <Formik
                    initialValues={{
                        temuan: '',
                        perbaikan: newPerbaikan || '',
                        eviden: '',
                    }}
                    validationSchema={PerbaikanSchema}
                    onSubmit={(values, { resetForm }) => {
                        handleSavePerbaikan(values, resetForm);
                    }}
                >
                    {formik => (
                        <>
                            <CModalBody>    
                                <CForm>
                                    <CreateableSelect
                                        options={selectTemuan}
                                        isClearable
                                        onChange={(data) => {
                                            if (data) {
                                                const filter = dataTemuan.find(
                                                    (item) => String(item.id) === String(data.value)
                                                );
                                                formik.setFieldValue('temuan', filter.id);
                                            }
                                        }}
                                        value={selectTemuan.find(option => option.value === formik.values.temuan) || null}
                                        onBlur={formik.handleBlur}                                                
                                        placeholder="Pilih atau ketik temuan..."                                        
                                    />                                    
                                    {formik.errors.temuan && formik.touched.temuan && (
                                        <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                            {formik.errors.temuan}
                                        </div>
                                    )}
                                    <CFormInput 
                                        value={formik.values.perbaikan}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.perbaikan && !!formik.errors.perbaikan}
                                        feedbackInvalid={formik.errors.perbaikan}
                                        placeholder="Input Tindak Lanjut nya" 
                                        autoComplete="perbaikan"
                                        name='perbaikan'
                                        type='text'
                                        label="Tindak Lanjut"
                                    />
                                    <div className='mb-3'></div>
                                    <ReactImageUploading
                                        multiple={false}
                                        value={imagesPerbaikan}
                                        maxNumber={1}
                                        maxFileSize={5000000}
                                        onChange={(imageList) => {
                                            setImagesPerbaikan(imageList);
                                        
                                            if (imageList.length > 0) {
                                                formik.setFieldValue("eviden", imageList[0].file);
                                            } else {
                                                formik.setFieldValue("eviden", '');
                                            }
                                        }}
                                        dataURLKey='data_url'
                                        acceptType={['png', 'jpg', 'jpeg']}    
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemove,
                                            isDragging,
                                            dragProps,
                                        }) => ( 
                                            <div 
                                                className='dropzone'
                                                onClick={onImageUpload}
                                            >
                                                <div {...dragProps} className={`${isDragging ? 'dragging' : ''}`}>
                                                        <CRow className='flex-wrap justify-content-start'>
                                                            {imageList.map((image, index) => (
                                                                <CCol key={index}>
                                                                    <div className="image-item">
                                                                        <CImage rounded thumbnail src={image.data_url} alt="" width="100" />
                                                                        <div className="image-item__btn-wrapper">
                                                                            <CButton color='danger' size='sm' className='mt-2' onClick={() => onImageRemove(index)}><CIcon icon={icons.cilTrash} /></CButton>
                                                                        </div>
                                                                    </div>
                                                                </CCol>
                                                            ))}
                                                        </CRow>
                                                    <p className='mt-1' style={{'fontSize' : '13px'}}>Tarik dan Letakan / Klik untuk pilih Eviden Tindak Lanjutmu mu disini <b>(hanya menerima PNG/JPG MAX 1 Pcs saja!)</b></p>
                                                </div>
                                            </div>
                                        )}
                                    </ReactImageUploading>
                                    {formik.errors.eviden && formik.touched.eviden && (
                                        <div className='mt-2' style={{ color: "red", fontSize: "13px" }}>
                                            {formik.errors.eviden}
                                        </div>
                                    )}
                                    <div style={{marginBottom: '100px'}}></div>
                                </CForm>
                            </CModalBody>
                            <CModalFooter>
                                <CButton color="secondary" onClick={() => setShowModalPerbaikan(false)}><FontAwesomeIcon icon={faicons.faClose} color='white' />Tutup</CButton>
                                <CButton color="primary" onClick={() => formik.submitForm()}><FontAwesomeIcon icon={faicons.faSave} color='white' /> Simpan</CButton>
                            </CModalFooter>
                        </>
                    )}
                </Formik>
            </CModal>
        </>
    );
};

export default Monev;