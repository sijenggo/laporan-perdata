import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import { _nav as navigation } from '../_nav'
import { setSidebarShow, setSidebarUnfoldable } from '../components/uiSlice' // Pastikan path ini benar
import { useOutletContext } from 'react-router-dom' // Import useOutletContext

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable) // Perbaikan state
  const sidebarShow = useSelector((state) => state.ui.sidebarShow) // Perbaikan state

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible)) // Gunakan action dari Redux Toolkit
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/dashboard">
          <div className="d-flex flex-column justify-content-start align-items-start mt-2">
            {/*<img src={logofix} style={{ height: 35 }} alt="Logo" />*/}
            <p className='ms-1 mt-2 mb-0 p-0 fs-xsmall'>Laper Laper Laper</p>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarShow(false))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch(setSidebarUnfoldable(!unfoldable))}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
