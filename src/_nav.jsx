import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilFolderOpen,
  cilAccountLogout
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    roles: [],
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'Laporan',
  },
  {
    component: CNavItem,
    roles: [],
    name: 'Laporan Bulanan Perdata',
    to: '/lapbulperdata',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  /*{
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },*/
]

export default _nav
