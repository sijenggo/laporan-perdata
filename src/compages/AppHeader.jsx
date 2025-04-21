import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
CContainer,
CDropdown,
CDropdownItem,
CDropdownMenu,
CDropdownToggle,
CHeader,
CHeaderNav,
CHeaderToggler,
CNavLink,
CNavItem,
useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilContrast, cilMenu, cilMoon, cilSun, cilWarning } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { setSidebarShow } from '../components/uiSlice' // Import action dari Redux Toolkit
import { useOutletContext, useNavigate } from 'react-router-dom' // Import useOutletContext

const AppHeader = () => {
	const headerRef = useRef()
	const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const sidebarShow = useSelector((state) => state.ui.sidebarShow) // Perbaikan akses state Redux

	useEffect(() => {
	document.addEventListener('scroll', () => {
		headerRef.current &&
		headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
	})
	}, []);

	return (
		<CHeader position="sticky" className="mb-2 p-0" ref={headerRef}>
			<CContainer className="border-bottom px-4" fluid>
				<CHeaderToggler
					onClick={() => dispatch(setSidebarShow(!sidebarShow))} // Gunakan action dari Redux Toolkit
					style={{ marginInlineStart: '-14px' }}
				>
					<CIcon icon={cilMenu} size="lg" />
				</CHeaderToggler>
				<CHeaderNav className="ms-auto">
					<CNavItem>
						<CNavLink>
							<CIcon icon={cilBell} size="lg" />
						</CNavLink>
					</CNavItem>
				</CHeaderNav>
				<CHeaderNav>
					<li className="nav-item py-1">
						<div className="vr h-100 mx-2 text-body text-opacity-75"></div>
					</li>
					<CDropdown variant="nav-item" placement="bottom-end">
						<CDropdownToggle caret={false}>
							{colorMode === 'dark' ? (
								<CIcon icon={cilMoon} size="lg" />
							) : colorMode === 'auto' ? (
								<CIcon icon={cilContrast} size="lg" />
							) : (
								<CIcon icon={cilSun} size="lg" />
							)}
						</CDropdownToggle>

						<CDropdownMenu>
							<CDropdownItem
								active={colorMode === 'light'}
								className="d-flex align-items-center"
								as="button"
								type="button"
								onClick={() => setColorMode('light')}
							>
								<CIcon className="me-2" icon={cilSun} size="lg" /> Light
							</CDropdownItem>

							<CDropdownItem
								active={colorMode === 'dark'}
								className="d-flex align-items-center"
								as="button"
								type="button"
								onClick={() => setColorMode('dark')}
							>
								<CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
							</CDropdownItem>

							<CDropdownItem
								active={colorMode === 'auto'}
								className="d-flex align-items-center"
								as="button"
								type="button"
								onClick={() => setColorMode('auto')}
							>
								<CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
							</CDropdownItem>
						</CDropdownMenu>
					</CDropdown>
					<li className="nav-item py-1">
						<div className="vr h-100 mx-2 text-body text-opacity-75"></div>
					</li>
					{/*<AppHeaderDropdown />*/}
				</CHeaderNav>
			</CContainer>
	
			<CContainer className="px-4 mt-0" fluid>
				<AppBreadcrumb />
			</CContainer>
		</CHeader>
	);
};

export default AppHeader
