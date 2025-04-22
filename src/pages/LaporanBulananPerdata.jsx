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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilWarning
} from '@coreui/icons'
import { useQuery } from '@tanstack/react-query';

import axios from '../components/axois'
const SELECT = '/ambil_data';

const ambilData = async ({ column, from, where }) => {
    try{
        const response = await axios.get(SELECT, {
            params: {
                column: column,
                from: from,
                where: where,
            },
        });
        const dataRaw = response.data.data;
        return dataRaw.map((item, i) => ({ no: i + 1, ...item }));
    }catch (error) {
        console.error("Terjadi kesalahan saat ambilData:", error);
    }
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

    const { data: dataPerdata = [], isLoadingDataPerdata, isErrorDataPerdata } = useQuery({
        queryKey: ['dataPerdata', date1, date2],
        queryFn: () =>
        ambilData({
            column: 'perkara_id, nomor_perkara, alur_perkara_id, tahapan_terakhir_id, tanggal_pendaftaran, diinput_tanggal, diedit_tanggal',
            from: 'perkara',
            where: `COALESCE(diedit_tanggal, diinput_tanggal) BETWEEN '${date1}' AND '${date2}'`,
        }),
    });
    
    const dataConverted = useMemo(() => {
        if (!dataPerdata || isLoadingDataPerdata || isErrorDataPerdata) return [];
      
        return dataPerdata.map(s => ({
          ...s,
          alur_perkara_id: Number(s.alur_perkara_id),
          tahapan_terakhir_id: Number(s.tahapan_terakhir_id),
          tanggal_pendaftaran: new Date(s.tanggal_pendaftaran),
        }));
    }, [dataPerdata, isLoadingDataPerdata, isErrorDataPerdata]);
      
    
    const filteredData = useMemo(() => {
        return {
            permohonan: dataConverted.filter(s =>
                alur_permohonan.includes(s.alur_perkara_id)
            ),
            gugatan: dataConverted.filter(s=>
                alur_gugatan.includes(s.alur_perkara_id)
            ),
            gugatan_sederhana: dataConverted.filter(s=>
                alur_gugatan_sederhana.includes(s.alur_perkara_id)
            ),
        };
    }, [dataConverted, alur_gugatan, alur_gugatan_sederhana, alur_permohonan]);

    const KomponenLaporan = useMemo(() => [
        {
            title: 'Perkara Permohonan',
            color: 'warning',
            data:{
                sisa: filteredData.permohonan.filter(item => {
                    const tahapBukan15 = item.tahapan_terakhir_id !== 15;
                    const tanggal = new Date(item.tanggal_pendaftaran);
                    const tidakDiAntara = tanggal < date1 || tanggal > date2;
                    return tahapBukan15 && tidakDiAntara;
                }),
            }
        },
        {
            title: 'Perkara Gugatan',
            color: 'success'
        },
        {
            title: 'Perkara Gugatan Sederhana',
            color: 'info'
        },
        {
            title: 'Perkara Perdata Banding',
            color: 'danger'
        },
        {
            title: 'Perkara Perdata Kasasi',
            color: 'primary'
        },
        {
            title: 'Perkara Perdata Peninjauan Kembali',
            color: 'info'
        },
        {
            title: 'Perkara Eksekusi',
            color: 'danger'
        },
    ], [filteredData.permohonan]);

    console.log(KomponenLaporan, filteredData.permohonan)

    return(
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CRow className='mb-2'>
                        <CCol sm={8}>
                        <h4 className="card-title mb-0">
                            Laporan Bulanan Perdata
                        </h4>
                        <div className="small text-body-secondary mt-1">{formattedBulanSaja(date1)} - {formattedBulanSaja(date2)} {formattedTahunSaja(date1)}</div>
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

                    {isLoadingDataPerdata ? (
                        <div className="pt-3 text-center">
                            <CSpinner color="primary" variant="grow" />
                        </div>
                    ) : isErrorDataPerdata ? (
                        <CAlert color="warning" className="d-flex align-items-center">
                            <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                            <div>Error dalam pengambilan data</div>
                        </CAlert>
                    ) : (
                        <>
                            <CRow className='mb-2'>
                                {KomponenLaporan.map((komponen, index) => (
                                    <CCol xs={12} md={6} xl={6} key={index}>
                                        <CRow>
                                            <CCol xs={12}>
                                                <div className={`border-start border-start-4 border-start-${komponen.color} py-1 px-3`}>
                                                    <div className={`text-${komponen.color} text-truncate`}>{komponen.title}</div>
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
                                ))}

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
                        </>
                    )}
                    
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

                    <CRow>
                        <CCol>
                            <div className="border-start border-start-4 border-start-black py-1 px-3">
                                <div className="text-black mb-3">Perkara perdata yg melebihi 5 Bulan</div>
                                <CTable hover bordered>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">No.</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Nomor Perkara</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Majelis Hakim / PP</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Pendaftaran</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Sidang Pertama</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tgl Putusan</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                            <CTableDataCell>Mark</CTableDataCell>
                                            <CTableDataCell>Otto</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                            <CTableDataCell>Jacob</CTableDataCell>
                                            <CTableDataCell>Thornton</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                            <CTableDataCell>@fat</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                            <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                                            <CTableDataCell>@twitter</CTableDataCell>
                                            <CTableDataCell>@mdo</CTableDataCell>
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