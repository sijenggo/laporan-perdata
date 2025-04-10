import React,{ StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@coreui/coreui/dist/css/coreui.min.css'

import { CSpinner } from '@coreui/react';

const Home = React.lazy(() => import('./pages/Home'));

const App = () => (
  <BrowserRouter>
	<Suspense
		fallback={
		<div className="pt-3 text-center">
			<CSpinner color="primary" variant="grow" />
		</div>
		}
	>
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	</Suspense>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
	<StrictMode>
		<App /> 
	</StrictMode>
);

