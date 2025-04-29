import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import pages from '../pages';
import admin from '../pages/admin';
import ProtectedRoutes from './ProtectedRoutes';


const AllRoutes = () => {
    const { LoginPage, RegisterPage } = pages;
    const { DashboardPage, Invoice, Projects, RegisterAdmin, Users } = admin;
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/admin-dashboard' element={<ProtectedRoutes><DashboardPage/></ProtectedRoutes>}/>
                <Route path='/invoice' element={<ProtectedRoutes><Invoice/></ProtectedRoutes>}/>
                <Route path='/projects' element={<ProtectedRoutes><Projects/></ProtectedRoutes>}/>
                <Route path='/admin-register' element={<ProtectedRoutes><RegisterAdmin/></ProtectedRoutes>}/>
                <Route path='/users' element={<ProtectedRoutes><Users/></ProtectedRoutes>}/>
                <Route path='/*' element={<LoginPage />} />
            </Routes>
        </AnimatePresence>


    );
};

export default AllRoutes;