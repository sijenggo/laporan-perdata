import { CButton, CFormInput, CTable, CTableBody, CTableFoot, CTableHead, CTableHeaderCell } from '@coreui/react';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
} from '@tanstack/react-table';
import CIcon from '@coreui/icons-react'
import {
  cilPlus
} from '@coreui/icons'
import Dropzone from 'react-dropzone';
import Swal from 'sweetalert2';

export const TableDinamis = ({columns, data, onAddrow, updateData}) =>{
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        meta: {
          updateData
        }
    });
    return(
        <CTable striped bordered hover responsive>
            <CTableHead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <CTableHeaderCell className="text-center" key={header.id}>
                                {header.isPlaceholder ? null : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </CTableHeaderCell>
                        ))}
                    </tr>
                ))}
            </CTableHead>
            <CTableBody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                    const cellValue = cell.getValue();
                    return (
                    <td className={cell.id} key={cell.id}>
                        {cellValue === '' || cellValue === null || cellValue === undefined ? (
                            cell.column.id !== 'ttd' ? (
                                <CFormInput
                                    type="text"
                                    placeholder="Isi datanya dongs.."
                                    onBlur={(e) => {
                                        const rowIndex = row.index;
                                        const updatedData = [...table.options.data];
                                        updatedData[rowIndex] = {
                                            ...updatedData[rowIndex],
                                            [cell.column.id]: e.target.value,
                                        };
                                        // Update data ke parent
                                        if (typeof table.options.meta?.updateData === 'function') {
                                            table.options.meta.updateData(updatedData);
                                        }
                                    }}
                                />
                            ) : (                                
                                <>
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

                                            const rowIndex = row.index;
                                            const updatedData = [...table.options.data];
                                            updatedData[rowIndex] = {
                                                ...updatedData[rowIndex],
                                                [cell.column.id]: file.name,
                                            };
                                            // Update data ke parent
                                            if (typeof table.options.meta?.updateData === 'function') {
                                                table.options.meta.updateData(updatedData);
                                            }
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
                                </>
                            )
                        ) : (
                            cell.column.id !== 'ttd' ? (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                            ) : (
                                <>
                                    <img
                                        src={`${import.meta.env.BASE_URL}/TTD/${cellValue}` || ''}
                                        alt="Preview"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </>
                            )
                        )}
                    </td>
                    );
                })}
                </tr>
            ))}
            </CTableBody>

            <CTableFoot>
                <tr>
                    <td colSpan={columns.length}>
                        {/*<CButton 
                            color='success float-end ms-2 text-white' 
                            className=''
                            onClick={onSave}
                        >
                            Simpan
                        </CButton>*/}
                        <CButton 
                            color='primary float-end' 
                            className=''
                            onClick={onAddrow}
                        >
                            <CIcon icon={cilPlus} className="flex-shrink-0" />
                        </CButton>
                    </td>
                </tr>
            </CTableFoot>
        </CTable>
    )
}