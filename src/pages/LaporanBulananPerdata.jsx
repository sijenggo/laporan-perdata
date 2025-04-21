import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { id } from 'date-fns/locale';
import { format, subMonths } from "date-fns";

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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
} from '@coreui/icons'

const formattedDate = (date) =>{
    return format(date, 'yyyy-MM-dd');
};
const formattedTgl = (date) =>{
    return format(date, 'd MMMM yyyy', {locale: id});
};
const formattedBulanSaja = (date) =>{
    return format(date, 'MMMM', {locale: id});
};

const LaporanBulananPerdata = () =>{
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);
    const [date1, setDate1] = useState(formattedDate(firstDayOfMonth));
    const [date2, setDate2] = useState(formattedDate(lastDayOfMonth));

    const handleChangeDate = ([newStartDate, newEndDate]) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      
        if (newStartDate && newEndDate) {
          const date1 = formattedDate(newStartDate);
          const isSameMonth = newStartDate.getMonth() === newEndDate.getMonth();
          const date2 = formattedDate(
            isSameMonth
              ? new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0)
              : new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0)
          );
      
          setDate1(date1);
          setDate2(date2);
        }
    };

    return(
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className='mb-2'>
                        <CCol sm={8}>
                        <h4 className="card-title mb-0">
                            Laporan Bulanan Perdata
                        </h4>
                        <div className="small text-body-secondary mt-1">{formattedTgl(date1)}</div>
                        </CCol>
                        <CCol sm={4} className="d-none d-md-block">                        
                            <div className="vstack gap-0">
                                <h5 className='mb-0 me-2 text-center'>Periode</h5>
                                <DatePicker 
                                    selected={startDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat='MMMM yyyy' 
                                    locale={id} 
                                    onChange={handleChangeDate}
                                    className='form-control text-center'
                                    showMonthYearPicker
                                    selectsRange
                                />
                            </div>
                        </CCol>
                    </CRow>

                    <hr className="mt-0" />

                    <CRow className='mb-2'>
                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-warning py-1 px-3">
                                        <div className="text-warning text-truncate">Perkara Permohonan</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-success py-1 px-3">
                                        <div className="text-success">Perkara Gugatan</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>
                        
                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-info py-1 px-3">
                                        <div className="text-info">Perkara Gugatan Sederhana</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-danger py-1 px-3">
                                        <div className="text-danger">Perkara Banding</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-primary py-1 px-3">
                                        <div className="text-primary">Perkara Kasasi</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-info py-1 px-3">
                                        <div className="text-info">Perkara Peninjauan Kembali</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-danger py-1 px-3">
                                        <div className="text-danger">Perkara Eksekusi</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(subMonths(date1, 1))}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(subMonths(date1, 1))}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Putus / Dicabut Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Putus / Dicabut Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Sisa Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Sisa Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>

                        <CCol xs={12} md={6} xl={6}>
                            <CRow>
                                <CCol xs={12}>
                                    <div className="border-start border-start-4 border-start-success py-1 px-3">
                                        <div className="text-success">Delegasi</div>
                                        <CForm>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Delegasi Masuk Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Delegasi Masuk Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Delegasi Keluar Bulan {formattedBulanSaja(date1)}</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Delegasi Keluar Bulan ${formattedBulanSaja(date1)}`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Delegasi Masuk Telah dilaksanakan</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Delegasi Masuk Telah dilaksanakan`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                            <CRow>
                                                <CFormLabel className="col-form-label text-truncate small fs-6">Delegasi Masuk Belum dilaksanakan</CFormLabel>
                                                <CInputGroup>
                                                    <CFormInput
                                                        placeholder={`Delegasi Masuk Belum dilaksanakan`}
                                                        aria-describedby="button-addon2"
                                                    />
                                                    <CButton type="button" color="secondary" variant="outline" id="button-addon2">
                                                        Lihat
                                                    </CButton>
                                                </CInputGroup>
                                            </CRow>
                                        </CForm>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>

                    <hr className="mt-0" />

                    <CRow>
                        <CCol>
                            <div className="border-start border-start-4 border-start-black py-1 px-3">
                                <div className="text-black mb-3">Perkara Eksekusi</div>
                                <CTable hover bordered>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Nomor Perkara</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Aanmaning</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Sita Eksekusi</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Eksekusi</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                            <CTableDataCell>Mark</CTableDataCell>
                                            <CTableDataCell>Otto</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                            <CTableDataCell>Jacob</CTableDataCell>
                                            <CTableDataCell>Thornton</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                            <CTableDataCell>@fat</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                            <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                                            <CTableDataCell>@twitter</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </div>
                        </CCol>
                    </CRow>

                </CCardBody>
            </CCard>
        </>
    );
};

export default LaporanBulananPerdata;