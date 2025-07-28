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
import { useQuery, useQueries } from '@tanstack/react-query';

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
                column: 'tb_monev.id, tb_monev.judul, tb_monev.bulan, tb_monev.tahun, tb_monev.kepada, tb_monev.unit, tb_monev.hari, tb_monev.tanggal, tb_monev.pukul, tb_monev.tempat, tb_monev.absen, tb_monev.tujuan_monev, tb_monev.dasar, tb_monev.uji_petik, tb_monev.kendala, tb_monev.tujuan_lanjut, tb_monev.temuan, tb_monev.hasil',
                from: 'tb_monev',
                where: `judul = ${idjudulMonev.value} AND DATE_FORMAT(tanggal, '%Y-%m') = '${formattedTahunSajaNumber(date1)}-${formattedBulanSajaNumber(date1)}'`,
            }),
        enabled: !!idjudulMonev && !!date1,
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