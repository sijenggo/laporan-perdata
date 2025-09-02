import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilFolderOpen,
  cilAccountLogout
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const Dashboard = React.lazy(() => import('./pages/Home'));
const Page404 = React.lazy(() => import('./pages/Page404'))
const LaporanBulananPerdata = React.lazy(() => import(`./pages/LaporanBulananPerdata`))
const MauEs = React.lazy(() => import(`./pages/MauEs`))
const Monev = React.lazy(() => import(`./pages/Monev`))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lapbulperdata', name: 'Laporan Bulanan Perdata', element: LaporanBulananPerdata },
  { path: '/maues', name: 'Mau Es', element: MauEs },
  { path: '/monev', name: 'Monev Generator', element: Monev },
  { path: '/*', name: '404', element: Page404 },
]

export {
  routes,
  Dashboard,
  Page404,
  LaporanBulananPerdata,
  MauEs,
  Monev
}

export const _nav = [
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
    component: CNavItem,
    roles: [],
    name: 'Mau Es',
    to: '/maues',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  /*{
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
  {
    component: CNavItem,
    roles: [],
    name: 'Monev Generator',
    to: '/monev',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },*/
  /*{
    component: CNavItem,
    name: 'Logout',
    to: '/logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },*/
]
