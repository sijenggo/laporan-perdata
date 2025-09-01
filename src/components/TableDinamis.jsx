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

export const TableDinamis = ({columns, data, updateData, RenderSelect}) =>{
    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        meta: {
          updateData
        }
    });
    return(
        <>
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
                {
                    table.getRowModel().rows.length === 0 ? (
                        <tr>
                        <td colSpan={table.getAllColumns().length} className="text-center">
                            Tidak ada Temuan
                        </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                            <td className={cell.id} key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                            ))}
                        </tr>
                        ))
                    )
                }
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
                            {/*<CButton 
                                color='primary float-start' 
                                className=''
                            >
                                <CIcon icon={cilPlus} className="flex-shrink-0" />
                            </CButton>*/}
                        </td>
                    </tr>
                </CTableFoot>
            </CTable>
            <>
                {RenderSelect}
            </>
        </>
    )
}