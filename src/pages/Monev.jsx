import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
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

import Swal from 'sweetalert2';
import { TableDinamis } from '../components/TableDinamis';
import ReactImageUploading from 'react-images-uploading';

import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchemaPegawai = Yup.object({
    nama: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Nama pegawai yg bener isinya, jgn alay')
        .required('Tidak boleh kosong woyy!'),
    jabatan: Yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Jabatan pegawai yg bener isinya, jgn alay')
        .required('Tidak boleh kosong woyy!'),
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

    const [dateMonev, setDateMonev] = useState(firstDayOfMonth);
    const [dateUndanganMonev, setDateUndanganMonev] = useState(firstDayOfMonth);

    const handleChangeDate = (newDate) => {
        setStartDate(newDate);
        setDate1(formattedDate(newDate));
    };

    const [tambahTTD, setTambahTTD] = useState(false);

    const handleTambahTTD = () => {
        setTambahTTD(!tambahTTD);
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

    const { data: dataTemuan = [], isLoading: isLoadingTemuan, error: errorDataTemuan } = useQuery({
        queryKey: ['dataTemuan'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_temuan',
                where: 1,
            }),
    });

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

    const selectPegawai = useMemo(() =>{
        if (!dataPegawai || dataPegawai.length === 0) return [];
        return dataPegawai.map(item => ({
            value: item.id,
            label: `${item.nama} | ${item.jabatan}`,
        }));
    }, [dataPegawai]);
    
    useEffect(() => {
        if (dataMonev && dataMonev.length > 0) {
            const temuanIds = dataMonev[0].temuan.split(",").map((id) => id.trim()).filter(Boolean);
            const pegawaiIds = dataMonev[0].absen.split(",").map((id) => id.trim()).filter(Boolean);

            const filteredTemuan = dataTemuan.filter((item) =>
                temuanIds.includes(String(item.id))
            );

            const filteredAbsensi = dataPegawai.filter((item) =>
                pegawaiIds.includes(String(item.id))
            );

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
        } else {
            setTemuanMonev((prev) => (prev.length > 0 ? [] : prev));
            setAbsensiMonev((prev) => (prev.length > 0 ? [] : prev));
        }
    }, [dataMonev, dataTemuan, dataPegawai]);

    const [showModalPegawai, setShowModalPegawai] = useState(false);
    const [images, setImages] = useState([]);
    const maxNumber = 1;

    const imgOnChange = (imageList, addUpdateIndex) =>{
        //console.log(imageList, addUpdateIndex);
        setImages(imageList);
    }
    
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
                Swal.fire({
                    title: "Tambah Pegawai",
                    icon: "success",
                    text: "Ciye bikin pegawai baru!",
                });
                //setAbsensiMonev((prev) => [...prev, data.pegawai]);
                queryClient.invalidateQueries(["dataPegawai"]);
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

    const handleCreatePegawai = () =>{
        setShowModalPegawai(true);
    };

    const SelectPegawai = () =>{
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
                            setAbsensiMonev([...absensiMonev, filter]);
                        }
                    }}
                    onCreateOption={() => handleCreatePegawai()}                   
                    placeholder="Pilih atau ketik pegawai yg ada..."
                />
            </>
        )
    };

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
            Swal.fire({title : 'Tambah Judul',icon: 'success', 'text' : 'Berhasil menambahkan judul baru!'});
            //console.log(data, temuanBaru);           
            queryClient.invalidateQueries(['dataTemuan']);
            //setTemuanMonev([...temuanMonev, temuanBaru]);
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

    const SelectTemuan = () =>{
        return(
            <>
                <CreateableSelect
                    options={selectTemuan}
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
                            setTemuanMonev([...temuanMonev, filter]);
                        }
                    }}
                    onCreateOption={(temuan) => {
                        Swal.fire({
                            title: 'Tambah Temuan',
                            html: `
                                <p>Kamu akan menambahkan temuan: <b>${temuan}</b></p>
                                <textarea id="kendala" class="swal2-textarea" placeholder="Kendala"></textarea>
                                <textarea id="rekomendasi" class="swal2-textarea" placeholder="Rekomendasi"></textarea>
                                <textarea id="ket" class="swal2-textarea" placeholder="Keterangan"></textarea>
                            `,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Ya, Tambah!',
                            cancelButtonText: 'Batal',
                            preConfirm: () => {
                                const kendala = document.getElementById('kendala').value;
                                const rekomendasi = document.getElementById('rekomendasi').value;
                                const ket = document.getElementById('ket').value;
                        
                                if (!kendala || !rekomendasi || !ket) {
                                    Swal.showValidationMessage('Semua field wajib diisi!');
                                    return false;
                                }
                        
                                return { temuan, kendala, rekomendasi, ket };
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                tambahTemuanMutation.mutate(result.value);
                            }
                        });
                    }}                      
                    placeholder="Pilih atau ketik temuan..."
                />
            </>
        )
    };

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
            header: () => 'jabatan',
            cell: ({ row }) => <p className="m-0">{row.original.jabatan}</p>
        }),
        columnHelper.accessor('ttd', {
            id: 'ttd',
            header: () => 'TTD',
            cell: ({ row }) => <p className="m-0">{row.original.ttd}</p>
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
                                                    <CreateableSelect
                                                        options={judulMonev}
                                                        value={selectedJudul}
                                                        onChange={handleChangeSelect}
                                                        onCreateOption={handleCreateSelect}
                                                        placeholder="Pilih atau ketik monev yg ingin kau generate..."
                                                    />
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
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateMonev}
                                                                dateFormat="EEEE, d MMMM yyyy 'Pukul' HH:mm"
                                                                className='form-control w-150'
                                                                onChange={(date) => setDateMonev(date)}                                                                                                                             
                                                                locale={id}
                                                                showTimeSelect
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Bulan Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateMonev}
                                                                dateFormat="MMMM"
                                                                className='form-control w-50'                                                                                                                                  
                                                                locale={id}
                                                                disabled
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tahun Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateMonev}
                                                                dateFormat="yyyy"
                                                                className='form-control w-30'                                                                                                                                  
                                                                locale={id}
                                                                disabled
                                                            />
                                                        </div> 
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Setiap</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormSelect className='w-30'>
                                                                <option>-- Pilih --</option>
                                                                <option value="Hari">Hari</option>
                                                                <option value="Minggu">Minggu</option>
                                                                <option value="Bulan">Bulan</option>
                                                                <option value="3 Bulan">3 Bulan</option>
                                                                <option value="6 Bulan">6 Bulan</option>
                                                            </CFormSelect>
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Temuan</CFormLabel>
                                                        <div className='m-0 ps-3' >
                                                            <TableDinamis data={temuanMonev} columns={columns} RenderSelect={<SelectTemuan />} />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Notulen Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateMonev}
                                                                dateFormat="EEEE, d MMMM yyyy"
                                                                className='form-control w-120'                                                                                                                        
                                                                locale={id}
                                                                disabled
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tempat Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormInput 
                                                                placeholder="Tempat Rapat Monev" 
                                                                autoComplete="tempat"
                                                                name='tempat'
                                                                type='text'
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Peserta Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormTextarea
                                                                placeholder='Peserta Rapat Monev'
                                                                autoComplete='peserta'
                                                                rows={4}
                                                                name='peserta'
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Pimpinan Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>                                                            
                                                            <CreateableSelect
                                                                options={selectPegawai}
                                                                onCreateOption={() => handleCreatePegawai()}
                                                                isClearable
                                                                placeholder="Pilih atau ketik pimpinan monev..."
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Notulis Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>                                                            
                                                            <CreateableSelect
                                                                options={selectPegawai}
                                                                onCreateOption={() => handleCreatePegawai()}
                                                                isClearable
                                                                placeholder="Pilih atau ketik notulis monev..."
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tanya Jawab (di notulen Monev)</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormTextarea
                                                                placeholder='Tanya Jawab Rapat Monev'
                                                                autoComplete='tanya'
                                                                rows={6}
                                                                name='tanya'
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Nomor Surat Undangan Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormInput 
                                                                placeholder="Nomor Surat Undangan Monev" 
                                                                autoComplete="nomor_surat"
                                                                name='nomor_surat'
                                                                type='text'
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Surat Undangan Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateUndanganMonev}
                                                                dateFormat="EEEE, d MMMM yyyy"
                                                                className='form-control w-120'
                                                                onChange={(date) => setDateUndanganMonev(date)}                                                                                                                             
                                                                locale={id}
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tujuan Surat Undangan Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <CFormTextarea
                                                                placeholder='Tujuan Surat Undangan Monev'
                                                                autoComplete='tujuan_surat'
                                                                rows={4}
                                                                name='tujuan_surat'
                                                            />
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Dokumentasi Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            belum ada
                                                        </div>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Absensi Peserta Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <TableDinamis data={absensiMonev} columns={columnsAbsen} RenderSelect={<SelectPegawai />} />
                                                        </div>
                                                    </>
                                                )}
                                            </CRow>                                            
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
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
                        nama: '',
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
        </>
    );
};

export default Monev;