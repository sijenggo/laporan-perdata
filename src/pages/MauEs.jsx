import React, { useState, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import { subMonths } from "date-fns";
import { id } from 'date-fns/locale';
import { formattedBulanSaja, formattedDate, formattedTgl, formattedTglJam, formattedTahunSaja, formattedBiaya, alur_permohonan, alur_gugatan, alur_gugatan_sederhana } from '../components/services';

import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTabs,
  CTabList,
  CTab,
  CNav,
  CNavItem,
  CNavLink,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CSpinner,
  CAlert,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilWarning,
  cilReload
} from '@coreui/icons'
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';

import axios from '../components/axois'
const SELECT = '/data_eis';

const ambilDataEis = async ({ unsur, date1, date2 }) => {
    try{
        const response = await axios.get(SELECT, {
            params: {
                unsur: unsur,
                date1: date1,
                date2: date2,
            },
        });
        const dataRaw = response.data.data;
        return dataRaw.map((item, i) => ({ No: i + 1, ...item }));
    }catch (error) {
        console.error("Terjadi kesalahan saat ambilDataEis:", error);
    }
};

const formatValueByKey = (key, value) => {
    if (/Tgl.*Jam/i.test(key)) {
        if (value !== null && value !== '-') {
            return formattedTglJam(value);
        }
    } else if (/Tgl/i.test(key)) {
        if (value !== null && value !== '-') {
            return formattedTgl(value);
        }
    } else if (/Biaya/i.test(key)) {
        if (value !== null && value !== '-') {
            return formattedBiaya(value);
        }
    } else if (/Amar/i.test(key)) {
        if (value !== null && value !== '-') {
            return value = value.length > 25 ? value.slice(0, 25) + '...' : value;
        }
    }else if (/File/i.test(key)) {
        const baseUrl = "http://192.168.3.7/SIPP311/resources/file/delegasi/masuk/";
        if (value !== null && value !== '-') {
            const fileUrl = `${baseUrl}${value}`;
            return (
                <CButton 
                    color="secondary" 
                    size="sm" 
                    onClick={() => window.open(fileUrl, '_blank')}
                >
                    File
                </CButton>
            );
        }
    }
    return value;
};

const MauEs = () =>{
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

    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState('kinerja');
    const [visible, setVisible] = useState(false);
    const [ModalContent, setModalContent] = useState({
        judul: '',
        data: [],
    });

    const handleShowModal = ({judul, data}) => {
        setModalContent({
          judul: judul,
          data: data,
        });
        setVisible(true);
    };

    const dataEIS = [
        { header: "kinerja",
            items: [
                {
                    unsur: 'kin1',
                    judul: '1. Penyelesaian Perkara Tepat Waktu',
                    detail: 'Penyelesaian perkara dalam waktu 5 (lima) Bulan (PIDANA - Tgl.Pendaftaran s/d Tgl.Putusan / PERDATA - Tgl.Sidang Pertama s/d Tgl.Putusan)',
                },
                {
                    unsur: 'kin2',
                    judul: '2. Rilis Versi SIPP',
                    detail: 'Versi SIPP yang terpasang di satuan kerja',
                },
                {
                    unsur: 'kin3',
                    judul: '3. Kesesuaian Kode Satker Nomor Perkara',
                    detail: 'Kesesuaian kode satker pada nomor perkara sesuai dengan SK KMA Nomor: 44/KMA/SK/III/2014',
                },
                {
                    unsur: 'kin4',
                    judul: '4. Jangka Waktu Pelaksanaan Delegasi Masuk',
                    detail: 'Waktu Pelaksanaan Delegasi Masuk Maksimal 7 Hari Kerja',
                },
                {
                    unsur: 'kin5',
                    judul: '5. Pelaksanaan Mediasi',
                    detail: 'Keberhasilan Pelaksanaan Mediasi',
                }
            ]
        },
        { header: "kepatuhan",
            items: [
                {
                    unsur: 'kep1',
                    judul :'1. Pendaftaran Perkara',
                    detail: 'Kepatuhan pendaftaran perkara dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep2',
                    judul: '2. Pencatatan Barang Bukti',
                    detail: 'Kepatuhan Pengguna dalam mengisi Barang Bukti',
                },
                {
                    unsur: 'kep3',
                    judul: '3. Penetapan Hakim',
                    detail: 'Kepatuhan penetapan majelis/hakim dalam waktu maksimal 3 (tiga) hari',
                },
                {
                    unsur: 'kep4',
                    judul: '4. Penetapan Panitera Pengganti',
                    detail: 'Kepatuhan penetapan panitera pengganti dalam waktu maksimal 3 (tiga) hari',
                },
                {
                    unsur: 'kep5',
                    judul: '5. Penetapan Jurusita/Jurusita Pengganti',
                    detail: 'Kepatuhan penetapan jurusita dalam waktu maksimal 3 (tiga) hari',
                },
                {
                    unsur: 'kep6',
                    judul: '6. Penetapan Hari Sidang Pertama',
                    detail: 'Kepatuhan penetapan hari sidang pertama dalam waktu maksimal 3 (tiga) hari',
                },
                {
                    unsur: 'kep7',
                    judul: '7. Penginputan Tuntutan',
                    detail: 'Ketepatan Waktu dalam input Tuntutan dalam suatu perkara',
                },
                {
                    unsur: 'kep8',
                    judul: '8. Penginputan Putusan Akhir',
                    detail: 'Ketepatan Waktu dalam input Putusan dalam suatu perkara',
                },
                {
                    unsur: 'kep9',
                    judul: '9. Penginputan Minutasi',
                    detail: 'Kepatuhan penginputan minutasi maksimal 1x24 jam',
                },
                {
                    unsur: 'kep10',
                    judul: '10. Pelaksanaan Minutasi',
                    detail: 'Ketepatan waktu dalam melakukan minutasi dalam waktu 7 Hari (Pidana) dan 14 Hari (Perdata)',
                },
                {
                    unsur: 'kep11',
                    judul: '11. Penginputan Permohonan Banding',
                    detail: 'Kepatuhan waktu dalam input Permohonan Banding dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep12',
                    judul: '12. Penginputan Permohonan Kasasi',
                    detail: 'Kepatuhan waktu dalam input Permohonan Kasasi dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep13',
                    judul: '13. Penginputan Permohonan Peninjauan Kembali',
                    detail: 'Kepatuhan waktu dalam input Permohonan Peninjauan Kembali dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep14',
                    judul: '14. Pengiriman Berkas Banding',
                    detail: `
                            a. Pelaksanaan Pemberitahuan Permohonan Banding
                            b. Pemberitahuan Pelaksanaan Pemeriksaan Berkas (Inzage)
                            c. Pengiriman Berkas Banding ke Pengadilan Tinggi - 30 Hari (Perdata)/ 14 Hari (Pidana)
                            `,
                },
                {
                    unsur: 'kep15',
                    judul: '15. Pengiriman Berkas Kasasi',
                    detail: `
                            a. Pelaksanaan Pemberitahuan Permohonan Kasasi
                            b. Penerimaan Memori Kasasi
                            c. Penyerahan Memori Kasasi Kepada Termohon
                            d. Pengiriman Berkas Kasasi ke Mahkamah Agung`,
                },
                {
                    unsur: 'kep16',
                    judul: '16. Pengiriman Berkas Peninjauan Kembali',
                    detail: `
                            a. Pelaksanaan Pemberitahuan Permohonan PK
                            b. Penerimaan Memori PK
                            c. Penerimaan Kontra Memori PK
                            d. Pengiriman Berkas PK ke Mahkamah Agung`,
                },
                {
                    unsur: 'kep17',
                    judul: '17. Pemberitahuan Putusan/Penetapan',
                    detail: 'Kepatuhan waktu dalam input tanggal pemberitahuan putusan dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep18',
                    judul: '18. Penginputan Penetapan Majelis/Hakim',
                    detail: 'Kepatuhan waktu dalam input penetapan Majelis Hakim/Hakim dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep19',
                    judul: '19. Penginputan Penunjukan Panitera Pengganti',
                    detail: 'Kepatuhan waktu dalam input penunjukan Panitera Pengganti dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep20',
                    judul: '20. Penginputan Penetapan Hari Sidang',
                    detail: 'Kepatuhan waktu dalam input penetapan hari sidang dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep21',
                    judul: '21. Penginputan Penetapan Jurusita/Jurusita Pengganti',
                    detail: 'Kepatuhan waktu dalam input penunjukan Jurusita/Jurusita Pengganti dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep22',
                    judul: '22. Penginputan Data Pelaksanaan Delegasi',
                    detail: 'Kepatuhan waktu dalam input Data Pelaksanaan Delegasi dalam waktu 1x24 jam',
                },
                {
                    unsur: 'kep23',
                    judul: '23. Kepatuhan Penundaan Jadwal Sidang (Query masih belum pasti)',
                    detail: 'Kepatuhan input penundaan jadwal sidang dalam waktu 1x24 jam (Query masih belum pasti)',
                },
                {
                    unsur: 'kep24',
                    judul: '24. Penginputan Penetapan Perpanjangan Penahanan',
                    detail: 'Kepatuhan penginputan perpanjangan penahanan maksimal 1x24 jam sejak tanggal penetapan',
                },
                {
                    unsur: 'kep25',
                    judul: '25. Unggah Putusan Akhir (Query masih belum pasti)',
                    detail: 'Kepatuhan unggah dokumen Putusan Akhir maksimal 1x24 jam sejak tanggal putus (Query masih belum pasti)',
                },
                ]
            },
            { header: "kelengkapan",
                items: [
                {
                    unsur: 'kel1',
                    judul: '1. E-Document Dakwaan/Petitum',
                    detail: 'Kelengkapan Dokumen Elektronik dalam pendaftaran perkara (Data Umum)',
                },
                {
                    unsur: 'kel2',
                    judul: '2. Pencatatan Saksi (Query masih belum pasti)',
                    detail: 'Kelengkapan pencatatan Data Saksi (Query masih belum pasti)',
                },
                {
                    unsur: 'kel3',
                    judul: '3. E-Document Tuntutan (Query masih belum pasti)',
                    detail: 'Kelengkapan Dokumen Elektronik Tuntutan (Query masih belum pasti)',
                },
                {
                    unsur: 'kel4',
                    judul: '4. E-Document Putusan Akhir/Penetapan',
                    detail: 'Kelengkapan Dokumen Elektronik Putusan',
                },
                {
                    unsur: 'kel5',
                    judul: '5. Data Lapor Mediasi',
                    detail: 'Kesesuaian pencatatan Tanggal Lapor Mediasi',
                },
                {
                    unsur: 'kel6',
                    judul: '6. Data Diversi',
                    detail: 'Kesesuaian pencatatan Tanggal Lapor Diversi ',
                },
                {
                    unsur: 'kel7',
                    judul: '7. Data Nilai Sengketa',
                    detail: 'Kesesuaian pencatatan Nilai Sengketa dalam Perkara Gugatan Sederhana',
                },
                {
                    unsur: 'kel8',
                    judul: '8. Dokumen Elektronik Berita Acara Sidang',
                    detail: 'Ketersediaan Dokumen Berita Acara Sidang',
                },
                {
                    unsur: 'kel9',
                    judul: '9. Dokumen Elektronik Relaas Panggilan Sidang Pertama',
                    detail: 'Ketersediaan Dokumen Berita Relaas (Query masih belum pasti)',
                },
                {
                    unsur: 'kel10',
                    judul: '10. Dokumen Elektronik Rencana Persidangan (Court Callendar) (Query masih belum pasti)',
                    detail: 'Ketersediaan Dokumen Elektronik Rencana Persidangan (Court Callendar) (Query masih belum pasti)',
                },
                {
                    unsur: 'kel11',
                    judul: '11. Dokumen Elektronik Putusan Anonimisasi',
                    detail: 'Ketersediaan Dokumen Elektronik Putusan yang sudah dilakukan Anonimisasi (SK KMA 2-144/KMA/SK/VIII/2022)',
                },
            ]
        },
        { header: "kesesuaian",
            items: [
                {
                    unsur: 'kes1',
                    judul: '1. Agenda Sidang Terakhir',
                    detail: 'Kesesuaian Agenda Sidang Terakhir dengan status perkara putus',
                },
                {
                    unsur: 'kes2',
                    judul: '2. Tanggal Putusan dan Tanggal Sidang Terakhir',
                    detail: 'Kesesuaian Tanggal Sidang Terakhir dengan Tanggal Putusan',
                },
                {
                    unsur: 'kes3',
                    judul: '3. Publikasi Pihak',
                    detail: 'Kesesuaian Publikasi Perkara sesuai SK KMA Nomor 2-144/KMA/SK/VIII/2022',
                },
                {
                    unsur: 'kes4',
                    judul: '4. Pelaksanaan BHT',
                    detail: 'Ada Atau Tidaknya Pencatatan BHT pada suatu perkara',
                },
                {
                    unsur: 'kes5',
                    judul: '5. Penahanan',
                    detail: 'Kesesuaian pencatatan penahanan habis sebelum perkara putus',
                },
                {
                    unsur: 'kes6',
                    judul: '6. Sisa Biaya Perkara Tk Pertama',
                    detail: 'Kesesuaian pencatatan pengembalian sisa panjar',
                },
                {
                    unsur: 'kes10',
                    judul: '10. Pengarsipan Perkara (Query masih belum pasti)',
                    detail: 'Kesesuaian Waktu Pelaksanaan Pengarsipan Perkara (Query masih belum pasti)',
                }
            ]
        },
    ];

    const filteredData = useMemo(() =>{
        return dataEIS.find(item => item.header === activeTab);
    });

    const allUnsurKeys = dataEIS.flatMap(d => d.items.map(i => i.unsur));

    const queries = useQueries({
        queries: allUnsurKeys.map((unsur) => ({
          queryKey: ['data-eis', unsur, date1, date2],
          queryFn: () => ambilDataEis({unsur: unsur, date1: date1, date2: date2})
        }))
    });

    const refreshQueries = () => {
        queries.forEach((query) => {
            queryClient.invalidateQueries(query.queryKey);
        });
    }

    const dataMap = useMemo(() => {
        return allUnsurKeys.reduce((acc, unsur, i) => {
          acc[unsur] = queries[i];
          return acc;
        }, {});
    }, [queries]);

    console.log(dataMap);

    return(
        <>
            <CCard className="mb-4">
                <CCardBody>
                <CButton onClick={() => refreshQueries()} color='primary' className="float-end"><CIcon icon={cilReload} size="lg" /></CButton>
                    <CRow className='mb-2'>
                        <CCol>
                        <h4 className="card-title mb-0">
                            Monitoring Aplikasi EIS dan SIPP
                        </h4>
                        <div className="small text-body-secondary mt-1">{formattedBulanSaja(date1)} - {formattedBulanSaja(date2)} {formattedTahunSaja(date1)}</div>
                        </CCol>
                        <CCol xs={12} sm={12} md={4} xl={4} className="d-md-block">                        
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
                    
                    <CRow>
                        <CCol>
                            <CNav variant="tabs" role="tablist" layout='fill'>
                                <CNavItem>
                                    <CNavLink style={{ cursor: 'pointer'}} active={activeTab == 'kinerja'} onClick={()=>setActiveTab('kinerja')}>
                                        Kinerja
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink style={{ cursor: 'pointer'}} active={activeTab == 'kepatuhan'} onClick={()=>setActiveTab('kepatuhan')}>
                                        Kepatuhan
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink style={{ cursor: 'pointer'}} active={activeTab == 'kelengkapan'} onClick={()=>setActiveTab('kelengkapan')}>
                                        Kelengkapan
                                    </CNavLink>
                                </CNavItem>
                                <CNavItem>
                                    <CNavLink style={{ cursor: 'pointer'}} active={activeTab == 'kesesuaian'} onClick={()=>setActiveTab('kesesuaian')}>
                                        Kesesuaian
                                    </CNavLink>
                                </CNavItem>
                            </CNav>
                        </CCol>
                    </CRow>

                    <CRow>
                        <CCol>
                            <CAccordion flush>
                                {filteredData?.items.map((item, index) => {
                                    const dataQuery = dataMap[item.unsur];
                                    const isLoading = dataQuery?.isLoading;
                                    const error = dataQuery?.error;
                                    const data = dataQuery?.data;
                                    const dataTdkSesuai = dataQuery?.data?.filter(item => item.kesesuaian === 1) ?? [];
                                    const dataSesuai = dataQuery?.data?.filter(item => item.kesesuaian === 0) ?? [];

                                    return (
                                        <CAccordionItem key={index}>
                                            <CAccordionHeader>
                                                <b>{item.judul}</b>
                                                {dataTdkSesuai.length > 0 &&(
                                                    <CBadge color='danger' className="mx-2">{dataTdkSesuai.length}</CBadge>
                                                )}
                                            </CAccordionHeader>
                                            <CAccordionBody>
                                                <CRow>
                                                    <CCol xs={12} md={6} xl={6} className='d-flex flex-column justify-content-center mb-3'>
                                                        {item.detail.trim().split('\n').map((para, paraIndex) => (
                                                            <p className='m-0' key={paraIndex}>{para}</p>
                                                        ))}
                                                    </CCol>
                                                    <CCol xs={12} md={6} xl={6} className='d-flex flex-column justify-content-center'>
                                                        {isLoading ? (
                                                            <div className="pt-3 text-center">
                                                                <CSpinner color="primary" variant="grow" />
                                                            </div>
                                                        ) : error ? (
                                                            <CAlert color="warning" className="d-flex align-items-center">
                                                                <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                                                                <div>Error dalam pengambilan data</div>
                                                            </CAlert>
                                                        ) : item.unsur !== 'kin2' && item.unsur !== 'kin3' ? (
                                                            <CTable responsive='sm' small striped bordered hover style={{fontSize: '0.75em'}} className='text-center'>
                                                                <CTableHead className='text-wrap align-middle'>
                                                                    <CTableRow>
                                                                        <th style={{cursor: 'pointer'}} className='hoverable' onClick={() => handleShowModal({judul: item.judul, data:data})}>Jumlah</th>
                                                                        <th>Sesuai</th>
                                                                        <th>Tidak</th>
                                                                    </CTableRow>
                                                                </CTableHead>
                                                                <CTableBody>
                                                                    <tr>
                                                                        <td>{data.length}</td>
                                                                        <td>{dataSesuai.length}</td>
                                                                        <td>{dataTdkSesuai.length}</td>
                                                                    </tr>
                                                                </CTableBody>
                                                            </CTable>
                                                        ) : (
                                                            <CTable responsive='sm' small striped bordered hover style={{fontSize: '0.75em'}} className='text-center'>
                                                                <CTableHead className='text-wrap align-middle'>
                                                                    <CTableRow>
                                                                        {Object.keys(data[0])
                                                                        .filter((key) => key !== 'No')
                                                                        .map((key) => (
                                                                            <th key={key}>{key}</th>
                                                                        ))}
                                                                    </CTableRow>
                                                                </CTableHead>
                                                                <CTableBody>
                                                                    {data.map((item, index) => (
                                                                        <tr key={index}>
                                                                        {Object.entries(item)
                                                                            .filter(([key]) => key !== 'No')
                                                                            .map(([key, value], valueIndex) => (
                                                                            <td key={valueIndex}>
                                                                                {formatValueByKey(key, value)}
                                                                            </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </CTableBody>
                                                            </CTable>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                                <CRow>
                                                    <CCol>
                                                        {isLoading ? (
                                                            <div className="pt-3 text-center">
                                                                <CSpinner color="primary" variant="grow" />
                                                            </div>
                                                        ) : error ? (
                                                            <CAlert color="warning" className="d-flex align-items-center">
                                                                <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                                                                <div>Error dalam pengambilan data</div>
                                                            </CAlert>
                                                        ) : dataTdkSesuai.length > 0 && (
                                                            <CTable responsive='sm' small striped bordered hover style={{fontSize: '0.75em'}} className='text-center'>
                                                                <CTableHead className='text-wrap align-middle'>
                                                                    <CTableRow>
                                                                        {Object.keys(dataTdkSesuai[0])
                                                                        .filter((key) => key !== 'kesesuaian')
                                                                        .map((key) => (
                                                                            <th key={key}>{key}</th>
                                                                        ))}
                                                                    </CTableRow>
                                                                </CTableHead>
                                                                <CTableBody>
                                                                    {dataTdkSesuai.map((item, index) => (
                                                                        <tr key={index}>
                                                                        {Object.entries(item)
                                                                            .filter(([key]) => key !== 'kesesuaian')
                                                                            .map(([key, value], valueIndex) => (
                                                                            <td key={valueIndex}>
                                                                                {formatValueByKey(key, value)}
                                                                            </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </CTableBody>
                                                            </CTable>
                                                        )}
                                                    </CCol>
                                                </CRow>
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    )
                                })}
                            </CAccordion>
                        </CCol>
                    </CRow>

                    <CModal
                        alignment="center"
                        scrollable
                        visible={visible}
                        onClose={() => setVisible(false)}
                        aria-labelledby="VerticallyCenteredScrollableExample2"
                        dialogClassName="modal-90w"
                        size='xl'
                    >
                        <CModalHeader>
                            <CModalTitle id="VerticallyCenteredScrollableExample2">{ModalContent.judul}</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            {ModalContent.data.length > 0 ? (
                                <CTable responsive='sm' small striped bordered hover style={{fontSize: '0.75em'}} className='text-center'>
                                    <CTableHead className='text-wrap align-middle'>
                                        <CTableRow>
                                            {Object.keys(ModalContent.data[0])
                                            .filter((key) => key !== 'kesesuaian')
                                            .map((key) => (
                                                <th key={key}>{key}</th>
                                            ))}
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {ModalContent.data.map((item, index) => (
                                            <tr key={index}>
                                            {Object.entries(item)
                                                .filter(([key]) => key !== 'kesesuaian')
                                                .map(([key, value], valueIndex) => (
                                                <td key={valueIndex}>
                                                    {formatValueByKey(key, value)}
                                                </td>
                                                ))}
                                            </tr>
                                        ))}
                                </CTableBody>
                                </CTable>       
                            ) : null}
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                                Close
                            </CButton>
                        </CModalFooter>
                    </CModal>
                </CCardBody>
            </CCard>
        </>
    );
};

export default MauEs;