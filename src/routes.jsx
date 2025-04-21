import React from 'react'

const Dashboard = React.lazy(() => import('./pages/Home'));
const Page404 = React.lazy(() => import('./pages/Page404'))
const LaporanBulananPerdata = React.lazy(() => import(`./pages/LaporanBulananPerdata`))

const routes = [
  { path: '/', exact: true, name: 'Home', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lapbulperdata', name: 'Laporan Bulanan Perdata', element: LaporanBulananPerdata },
  { path: '/*', name: '404', element: Page404 },
]

export {
  routes,
  Dashboard,
  Page404,
  LaporanBulananPerdata
}