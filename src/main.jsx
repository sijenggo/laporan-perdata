import React,{ StrictMode, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux'
import 'core-js'
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from './components/store'
import { useSelector } from 'react-redux'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@coreui/coreui/dist/css/coreui.min.css'
import './assets/scss/style.scss'
import 'react-datepicker/dist/react-datepicker.css'

import { CSpinner, useColorModes } from '@coreui/react';

// Containers
const DefaultLayout = React.lazy(() => import('./compages/DefaultLayout'))

//Pages
import { Dashboard, Page404, LaporanBulananPerdata, MauEs, Monev } from './_nav';

const queryClient = new QueryClient();

const App = () => {
	const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
	const storedTheme = useSelector((state) => state.ui.theme)
	//console.log('storedTheme', storedTheme)

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.href.split('?')[1])
		const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
		if (theme) {
			setColorMode(theme)
		}

		if (isColorModeSet()) {
			return
		}

		setColorMode(storedTheme)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return(
		<BrowserRouter basename="/laper">
		<Suspense fallback={<div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>}>
				<Routes>
				<Route element={<DefaultLayout />}>
					<Route index element={<Dashboard />} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="lapbulperdata" element={<LaporanBulananPerdata />} />
					<Route path="maues" element={<MauEs />} />
					<Route path="monev" element={<Monev />} />
					<Route path="*" element={<Page404 />} />
				</Route>

				{/* catch all */}
				<Route path="*" element={<Page404 />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
        	<QueryClientProvider client={queryClient}>
				<App /> 
			</QueryClientProvider>
		</PersistGate>
	</Provider>
);

