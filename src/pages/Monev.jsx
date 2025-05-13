import React, { useState, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
import { formattedBulanSaja, formattedDate, formattedTgl, formattedTahunSaja, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';

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
  cilWarning
} from '@coreui/icons'
import { useQuery } from '@tanstack/react-query';

import axios from '../components/axois'

const Monev = () =>{
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [date1, setDate1] = useState(formattedDate(firstDayOfMonth));

    const handleChangeDate = (newDate) => {
        setStartDate(newDate);
        setDate1(formattedDate(newDate));
    };

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

                    <CRow className='mb-2'>
                        <CCol>
                            <CRow>
                                <CCol>
                                    <div className={`border-start border-start-4 border-start-primary py-1 px-3`}>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Judul</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-60"
                                                        placeholder={`Judul Monev`}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Bulan</CFormLabel>
                                                    <DatePicker 
                                                        selected={startDate}
                                                        dateFormat='MMMM' 
                                                        locale={id} 
                                                        onChange={handleChangeDate}
                                                        className='form-control text-center w-30 ms-2'
                                                        placeholderText='Pilih Bulan Monev'
                                                        showMonthYearPicker
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tahun</CFormLabel>
                                                    <DatePicker 
                                                        selected={startDate}
                                                        dateFormat='yyyy' 
                                                        locale={id} 
                                                        onChange={handleChangeDate}
                                                        className='form-control text-center w-30 ms-2'
                                                        placeholderText='Pilih Tahun Monev'
                                                        showMonthYearPicker
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tujuan Surat</CFormLabel>
                                                    <CFormTextarea
                                                        className="form-control ms-2 w-50"
                                                        placeholder={`Tujuan Surat Monev Kemana`}
                                                        rows={4}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Unit</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Unit Monev`}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Hari</CFormLabel>
                                                    <CFormSelect className="form-control ms-2 w-20">
                                                        <option value="0">Pilih Hari</option>
                                                    </CFormSelect>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tanggal</CFormLabel>
                                                    <DatePicker 
                                                        selected={startDate}
                                                        dateFormat='dd MMMM yyyy' 
                                                        locale={id} 
                                                        onChange={handleChangeDate}
                                                        className='form-control text-center w-30 ms-2'
                                                        placeholderText='Pilih Tanggal Rapat Monev'
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Pukul</CFormLabel>
                                                    <DatePicker 
                                                        selected={startDate}
                                                        dateFormat="hh:mm aa"
                                                        locale={id} 
                                                        onChange={handleChangeDate}
                                                        className='form-control text-center w-30 ms-2'
                                                        placeholderText='Pilih Jam Rapat Monev'
                                                        timeIntervals={30}
                                                        timeCaption="Time"
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        showTimeCaption={false}
                                                    />
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Tempat</CFormLabel>
                                                    <CFormInput
                                                        className="form-control ms-2 w-80"
                                                        placeholder={`Tempat Rapat Monev`}
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