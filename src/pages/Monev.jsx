import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
import { formattedBulanSajaNumber, formattedTahunSajaNumber, formattedBulanSaja, formattedDate, formattedDateTime, formattedTime, formattedTimeMysql, formattedTgl, formattedTahunSaja, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';
import { useDropzone } from 'react-dropzone';
import RSelect from 'react-select';

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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilWarning,
  cilThumbUp
} from '@coreui/icons'
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

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

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone();

    const [tambahTTD, setTambahTTD] = useState(false);

    const handleTambahTTD = () => {
        setTambahTTD(!tambahTTD);
    };

    const { data: judulMonev = [], isLoading: loadingJudulMonev, error: errorJudulMonev } = useQuery({
        queryKey: ['judulMonev'],
        queryFn: () => ambilData({ column: 'id AS value, judul AS label', from: 'tb_judul', where: 1 }),
    });

    const [idjudulMonev, setIdJudul] = useState(null);

    const handleChangeSelect = (selectedOption) => {
        setIdJudul(selectedOption);
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

    useEffect(() => {
      if (dataMonev.length > 0) {
        setMonevLocal({ ...dataMonev[0] });
      }else{
        setMonevLocal(null);
      }
    }, [dataMonev]);
    
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
                                                    selected={monevLocal ? new Date(monevLocal.tanggal) : ''}
                                                    onChange={(date) => setMonevLocal({ ...monevLocal, tanggal: formattedDateTime(date) })}
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
                                                    onChange={(e => setMonevLocal({ ...monevLocal, kepada: e.target.value }))}
                                                />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Unit</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Unit Monev`}
                                                        defaultValue={monevLocal ? monevLocal.unit : ''}
                                                        onChange={(e => setMonevLocal({ ...monevLocal, unit: e.target.value }))}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tempat</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Tempat Rapat Monev`}
                                                        defaultValue={monevLocal ? monevLocal.tempat : ''}
                                                        onChange={(e => setMonevLocal({ ...monevLocal, tempat: e.target.value }))}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Ttd</CFormLabel>
                                                {!tambahTTD && !monevLocal ? (
                                                    <>
                                                        <CButton 
                                                            color='info ms-2 text-white fw-bold w-20'
                                                            onClick={handleTambahTTD}
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
                                                                            defaultValue={
                                                                                (() => {
                                                                                    const ttdObj = typeof monevLocal?.ttd === 'string' ? JSON.parse(monevLocal.ttd) : monevLocal?.ttd;
                                                                                    return ttdObj?.nama || '';
                                                                                })()
                                                                            }
                                                                            onChange={(e) => setMonevLocal({ ...monevLocal, ttd: JSON.stringify({ ...JSON.parse(monevLocal.ttd), nama: e.target.value }) })}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <CFormInput
                                                                            className="form-control"
                                                                            placeholder={`Jabatan Pejabat yang TTD`}
                                                                            defaultValue={
                                                                                (() => {
                                                                                    const ttdObj = typeof monevLocal?.ttd === 'string' ? JSON.parse(monevLocal.ttd) : monevLocal?.ttd;
                                                                                    return ttdObj?.jabatan || '';
                                                                                })()
                                                                            }
                                                                            onChange={(e) => setMonevLocal({ ...monevLocal, ttd: JSON.stringify({ ...JSON.parse(monevLocal.ttd), jabatan: e.target.value }) })}
                                                                        />
                                                                    </td>
                                                                    <td className='w-30'>
                                                                        {(() => {
                                                                            const ttdObj = typeof monevLocal?.ttd === 'string' ? JSON.parse(monevLocal.ttd) : monevLocal?.ttd;

                                                                            if (monevLocal && ttdObj?.ttd) {
                                                                                return (
                                                                                    <img
                                                                                        src={`${import.meta.env.BASE_URL}/TTD/${ttdObj.ttd}`}
                                                                                        alt="Preview"
                                                                                        style={{ width: '50px', height: '50px' }}
                                                                                    />
                                                                                );
                                                                            } else {
                                                                                return (
                                                                                    <div {...getRootProps()} className='dropzone'>
                                                                                    <input {...getInputProps()} />
                                                                                    <p style={{ fontSize: 'smaller' }}>
                                                                                        Drag & drop file di sini, atau klik untuk pilih file. <b>Hanya menerima PNG yang background-nya transparan</b>
                                                                                    </p>
                                                                                    <ul>
                                                                                        {acceptedFiles.map(file => (
                                                                                        <li key={file.path}>{file.path} - {file.size} bytes</li>
                                                                                        ))}
                                                                                    </ul>
                                                                                    </div>
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