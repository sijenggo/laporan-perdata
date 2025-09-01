import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
import { formattedBulanSajaNumber, formattedTahunSajaNumber, formattedBulanSaja, formattedDate, formattedDateTime, formattedTime, formattedTimeMysql, formattedTgl, formattedTahunSaja, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';
import Dropzone from 'react-dropzone';
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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilWarning,
  cilThumbUp
} from '@coreui/icons'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import Swal from 'sweetalert2';
import { TableDinamis } from '../components/TableDinamis';
import ReactImageUploading from 'react-images-uploading';

const ambilData = async ({ column, from, where }) => {
    try {
        const response = await axios.get('http://localhost:956/api_laper/ambildata', {
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
    const [previewURL, setPreviewURL] = useState(null);

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
            const res = await axios.post("http://localhost:956/api_laper/kirimdata", {
                table: "tb_judul",
                data: { judul: judulBaru }, // ✅ cukup kirim judul
            });
            return res.data; // axios otomatis parse JSON
        },
        onSuccess: (data, judulBaru) => {
          if (data.success) {
            Swal.fire({title : 'Tambah Judul',icon: 'success', 'text' : 'Berhasil menambahkan judul baru!'});
            // Tambahin ke cache react-query biar gak nunggu refetch
            queryClient.setQueryData(["judulMonev"], (old = []) => [
              ...old,
              { value: data.insertId, label: judulBaru },
            ]);
    
            // Set select langsung ke judul baru
            setIdJudul({ value: data.insertId, label: judulBaru });
            setSelectedJudul({ value: data.insertId, label: judulBaru });
          }
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

    const { data: dataTemuan = [], isLoading: isLoadingTemuan, error: errorDataTemuan } = useQuery({
        queryKey: ['dataTemuan'],
        queryFn: () =>
            ambilData({
                column: 'id AS value, temuan AS label',
                from: 'tb_temuan',
                where: 1,
            }),
    });

    const { data: dataTemuanMonev = [], isLoading: isLoadingTemuanMonev, error: errorDataTemuanMonev } = useQuery({
        queryKey: ['dataTemuanMonev'],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_temuan',
                where: 1,
            }),
    });
    
    useEffect(() => {
        if (dataMonev && dataMonev.length > 0 && dataTemuan.length > 0) {
            // Ambil string "1,2,3" lalu ubah ke array angka [1,2,3]
            const temuanIds = dataMonev[0].temuan.split(",").map((id) => id.trim()).filter(Boolean);
        
            // Filter dataTemuan berdasarkan id
            const filtered = dataTemuanMonev.filter((item) =>
                temuanIds.includes(String(item.id))
            );
        
            setTemuanMonev(filtered);
        }
    }, [dataMonev, dataTemuan]);

    const tambahTemuanMutation = useMutation({
        mutationFn: async (temuan) => {
            const res = await axios.post("http://localhost:956/api_laper/kirimdata", {
                table: "tb_temuan",
                data: temuan, // ✅ cukup kirim judul
            });
            return res.data; // axios otomatis parse JSON
        },
        onSuccess: (data, temuanBaru) => {
          if (data.success) {
            Swal.fire({title : 'Tambah Judul',icon: 'success', 'text' : 'Berhasil menambahkan judul baru!'});
            const filter = { value: data.insertId, label: temuanBaru.temuan };
            
            queryClient.setQueryData(["dataTemuanMonev"], (old = []) => [
              ...old,{ id: data.insertId, temuan: temuanBaru.temuan, kendala: temuanBaru.kendala, rekomendasi: temuanBaru.rekomendasi, ket: temuanBaru.ket }
            ]);
            
            setTemuanMonev([...temuanMonev, filter]);
          }
        },
    });

    const SelectTemuan = () =>{
        return(
            <>
                <CreateableSelect
                    options={dataTemuan}
                    isClearable
                    onChange={(data) => {
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

                            const filter = dataTemuanMonev.find(
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
                            <CIcon icon={cilThumbUp} className="flex-shrink-0 me-2" width={24} height={24} />
                            <div>Monevnya ada cuyy</div>
                        </CAlert>
                    ) : idjudulMonev && dataMonev.length == 0 ? (
                        <CAlert color="warning" className="d-flex align-items-center">
                            <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
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
                                                        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
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
                                                        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                                                        <div>Error dalam pengambilan data</div>
                                                    </CAlert>
                                                ) : (
                                                    <>
                                                        <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal Monev</CFormLabel>
                                                        <div className='m-0 ps-3'>
                                                            <DatePicker 
                                                                selected={dateMonev}
                                                                dateFormat="EEEE, d MMMM yyyy 'Pukul' HH:mm"
                                                                className='form-control w-130'
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
                                                            <TableDinamis data={temuanMonev} columns={columns} SelectTemuan={<SelectTemuan />} />
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
        </>
    );
};

export default Monev;