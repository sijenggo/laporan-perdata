import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
import { formattedBulanSajaNumber, formattedTahunSajaNumber, formattedBulanSaja, formattedDate, formattedDateTime, formattedTime, formattedTimeMysql, formattedTgl, formattedTahunSaja, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';
import Dropzone from 'react-dropzone';
import RSelect from 'react-select';
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
import { useQuery } from '@tanstack/react-query';

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

    const handleChangeSelect = (selectedOption) => {
        setIdJudul(selectedOption);
        handleChangeMonevLocal({col: 'judul', value: selectedOption.value});
        //console.log(selectedOption)
    };

    const { data: dataMonev = [], isLoading: loadingDataMonev, error: errorDataMonev } = useQuery({
        queryKey: ['dataMonev', idjudulMonev, date1],
        queryFn: () =>
            ambilData({
                column: '*',
                from: 'tb_monev',
                where: `judul = ${idjudulMonev.value} AND DATE_FORMAT(tanggal, '%Y-%m') = '${formattedTahunSajaNumber(date1)}-${formattedBulanSajaNumber(date1)}'`,
            }),
        enabled: !!idjudulMonev,
    });

    const [monevLocal, setMonevLocal] = useState(null);

    const handleChangeMonevLocal = ({col, value}) =>{
        if(monevLocal){
            setMonevLocal({
                ...monevLocal,
                [col]: value
            });
        }else{
            setMonevLocal({
                [col]: value
            });
        }
    };

    useEffect(() => {
      if (dataMonev.length > 0) {
        setMonevLocal({ ...dataMonev[0] });
      }else{
        setMonevLocal(null);
      }
    }, [dataMonev]);

    const columnHelper = createColumnHelper();
    
    const columns = [
        columnHelper.accessor('no', {
            id: 'no',
            header: () => 'No.',
            cell: ({ row }) => <p className="m-0">{row.original.no}</p>
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
            cell: ({ row }) => <p className="m-0">{row.original.ttd}</p>
        }),
    ];

    const [images, setImages] = useState([]);
    const maxNumber = 5;

    const imgOnChange = (imageList, addUpdateIndex) =>{
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    }
      
    useEffect(() =>{
        console.log(monevLocal)
    }, [monevLocal]);

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
                                                    <RSelect
                                                        options={judulMonev}
                                                        onChange={handleChangeSelect}
                                                        isClearable={true}
                                                        placeholder="Pilih atau ketik monev yg ingin kau generate..."
                                                    />
                                                )}
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal</CFormLabel>
                                                <DatePicker
                                                    selected={monevLocal && monevLocal.tanggal ? new Date(monevLocal.tanggal) : null}
                                                    onChange={(date) => handleChangeMonevLocal({col: 'tanggal', value: date})}
                                                    showTimeSelect
                                                    dateFormat="EEEE, d MMMM yyyy HH:mm"
                                                    className='form-control w-30 ms-2'
                                                    locale={id}
                                                />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tujuan Surat</CFormLabel>
                                                <CFormTextarea
                                                    className="form-control ms-2 w-50"
                                                    placeholder={`Tujuan Surat Monev Kemana`}
                                                    rows={4}
                                                    defaultValue={monevLocal ? monevLocal.kepada : ''}
                                                    onChange={(e => handleChangeMonevLocal({col: 'kepada', value: e.target.value}))}
                                                />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Unit</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Unit Monev`}
                                                        defaultValue={monevLocal ? monevLocal.unit : ''}
                                                        onChange={(e => handleChangeMonevLocal({col: 'unit', value: e.target.value}))}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tempat</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Tempat Rapat Monev`}
                                                        defaultValue={monevLocal ? monevLocal.tempat : ''}
                                                        onChange={(e => handleChangeMonevLocal({col: 'tempat', value: e.target.value}))}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Ttd (masih belum final)</CFormLabel>
                                                {!tambahTTD && !monevLocal ? (
                                                    <>
                                                        <CButton 
                                                            color='info ms-2 text-white fw-bold w-20'
                                                            onClick={handleTambahTTD}
                                                            disabled={idjudulMonev ? false : true}
                                                        >
                                                            Tambah TTD
                                                        </CButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CTable className='ms-2'>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <td>Nama Pejabat</td>
                                                                    <td>Jabatan</td>
                                                                    <td>File TTD</td>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                <CTableRow>
                                                                    <td>
                                                                        <CFormInput
                                                                            className="form-control"
                                                                            placeholder="Nama Pejabat yang TTD"
                                                                            value={
                                                                                (() => {
                                                                                  const ttdObj = typeof monevLocal?.ttd === 'string'
                                                                                        ? JSON.parse(monevLocal.ttd)
                                                                                        : monevLocal?.ttd || {};
                                                                                    return ttdObj?.nama || '';
                                                                                })()
                                                                            }
                                                                              onChange={(e) => {
                                                                                const ttdObj = typeof monevLocal?.ttd === 'string'
                                                                                    ? JSON.parse(monevLocal.ttd)
                                                                                    : monevLocal?.ttd || {};
                                                                                const updatedTTD = { ...ttdObj, nama: e.target.value };
                                                                                handleChangeMonevLocal({ col: 'ttd', value: JSON.stringify(updatedTTD) });
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CFormInput
                                                                            className="form-control"
                                                                            placeholder={`Jabatan Pejabat yang TTD`}
                                                                            value={
                                                                                (() => {
                                                                                  const ttdObj = typeof monevLocal?.ttd === 'string'
                                                                                        ? JSON.parse(monevLocal.ttd)
                                                                                        : monevLocal?.ttd || {};
                                                                                    return ttdObj?.jabatan || '';
                                                                                })()
                                                                            }
                                                                              onChange={(e) => {
                                                                                const ttdObj = typeof monevLocal?.ttd === 'string'
                                                                                    ? JSON.parse(monevLocal.ttd)
                                                                                    : monevLocal?.ttd || {};
                                                                                const updatedTTD = { ...ttdObj, jabatan: e.target.value };
                                                                                handleChangeMonevLocal({ col: 'ttd', value: JSON.stringify(updatedTTD) });
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className='w-30'>
                                                                        {(() => {
                                                                            const ttdObj = typeof monevLocal?.ttd === 'string' ? JSON.parse(monevLocal.ttd) : monevLocal?.ttd;

                                                                            if (monevLocal && ttdObj?.ttd) {
                                                                                return (
                                                                                    <img
                                                                                        src={previewURL || `${import.meta.env.BASE_URL}/TTD/${ttdObj.ttd}`}
                                                                                        alt="Preview"
                                                                                        style={{ width: '50px', height: '50px' }}
                                                                                    />
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <Dropzone
                                                                                        accept={{ 'image/png': ['.png'] }}
                                                                                        maxFiles={1}
                                                                                        onDrop={(acceptedFiles, fileRejections) => {
                                                                                            // Cek file yang ditolak
                                                                                            if (fileRejections.length > 0) {
                                                                                            fileRejections.forEach(rejection => {
                                                                                                rejection.errors.forEach(error => {
                                                                                                Swal.fire({
                                                                                                    icon: "error",
                                                                                                    title: "Oops...",
                                                                                                    text: "Dibilang file cuma PNG!",
                                                                                                    footer: '<a href="#">Skill issues!</a>'
                                                                                                });
                                                                                                });
                                                                                            });
                                                                                            return; // Stop di sini kalau file ditolak
                                                                                            }

                                                                                            // Kalau file valid
                                                                                            const file = acceptedFiles[0];
                                                                                            setPreviewURL(URL.createObjectURL(file));
                                                                                            const ttdObj = typeof monevLocal?.ttd === 'string'
                                                                                            ? JSON.parse(monevLocal.ttd)
                                                                                            : monevLocal?.ttd || {};
                                                                                            const updatedTTD = { ...ttdObj, ttd: file.name };
                                                                                            handleChangeMonevLocal({ col: 'ttd', value: JSON.stringify(updatedTTD) });
                                                                                        }}
                                                                                    >
                                                                                        {({getRootProps, getInputProps}) => (
                                                                                            <section className='dropzone'>
                                                                                                <div {...getRootProps()}>
                                                                                                    <input {...getInputProps()} />
                                                                                                    <p className='m-0'>Tarik dan Letakan / Klik untuk pilih TTD mu disini <b>(hanya menerima TTD PNG saja!)</b></p>
                                                                                                </div>
                                                                                            </section>
                                                                                        )}
                                                                                    </Dropzone>
                                                                                );
                                                                            }
                                                                        })()}
                                                                    </td>
                                                                </CTableRow>
                                                            </CTableBody>
                                                        </CTable>
                                                    </>
                                                )}
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Absen (masih belum final)</CFormLabel>
                                                <div className='ms-2'>
                                                <TableDinamis
                                                    columns={columns}
                                                    data={monevLocal && monevLocal?.absen ? JSON.parse(monevLocal.absen) : []}
                                                    onAddrow={() => {
                                                        const absenList = monevLocal?.absen ? JSON.parse(monevLocal.absen) : [];
                                                        const nextNo = absenList.length + 1;
                                                        const newRow = { no: nextNo, nama: '', jabatan: '', ttd: '' };
                                                        const updatedData = [...absenList, newRow];
                                                        handleChangeMonevLocal({ col: 'absen', value: JSON.stringify(updatedData) });
                                                    }}
                                                    updateData={(newData) => {
                                                        handleChangeMonevLocal({
                                                            col: 'absen',
                                                            value: JSON.stringify(newData)
                                                        });
                                                    }}
                                                />
                                                </div>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Dokumentasi (masih belum final)</CFormLabel>
                                                <ReactImageUploading
                                                    multiple
                                                    value={images}
                                                    maxNumber={maxNumber}
                                                    maxFileSize={5000000}
                                                    onChange={imgOnChange}
                                                    dataURLKey='data_url'
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
                                                            className='ms-2 dropzone'
                                                            onClick={onImageUpload}
                                                        >
                                                            <div {...dragProps} className={`${isDragging ? 'dragging' : ''}`}>
                                                                    <CRow className='flex-wrap justify-content-start'>
                                                                        {imageList.map((image, index) => (
                                                                            <CCol key={index}>
                                                                                <div className="image-item">
                                                                                    <CImage rounded thumbnail src={image.data_url} alt="" width="100" />
                                                                                    <div className="image-item__btn-wrapper">
                                                                                        <CButton color='danger' className='mt-2' onClick={() => onImageRemove(index)}>Hapus</CButton>
                                                                                    </div>
                                                                                </div>
                                                                            </CCol>
                                                                        ))}
                                                                    </CRow>
                                                                <p className='m-0 mt-4'>Tarik dan Letakan / Klik untuk pilih Gambar mu disini <b>(hanya menerima gambar JPG, JPEG, PNG dan MAX 5 Pcs saja!)</b></p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </ReactImageUploading>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tujuan Monev</CFormLabel>
                                                <CFormTextarea
                                                    className="form-control ms-2"
                                                    placeholder={`Tujuan Monev`}
                                                    rows={6}
                                                    defaultValue={monevLocal ? monevLocal.tujuan_monev : ''}
                                                    onChange={(e => handleChangeMonevLocal({col: 'tujuan_monev', value: e.target.value}))}
                                                />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Dasar Hukum Monev</CFormLabel>
                                                <CFormTextarea
                                                    className="form-control ms-2"
                                                    placeholder={`Dasar Hukum Monev`}
                                                    rows={6}
                                                    defaultValue={monevLocal ? monevLocal.dasar : ''}
                                                    onChange={(e => handleChangeMonevLocal({col: 'dasar', value: e.target.value}))}
                                                />
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