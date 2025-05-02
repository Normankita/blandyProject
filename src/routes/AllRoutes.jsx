import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import pages from '../pages';
import admin from '../pages/admin';
import student from '../pages/student';
import ProtectedRoutes from './ProtectedRoutes';
import useTitle from '../hooks/useTitle';
import ProfiledRoutes from './ProfiledRoutes';  


const AllRoutes = () => {
    const { LoginPage, RegisterPage, PageNotFound, CreateProfile } = pages;
    const { DashboardPage, Invoice, Projects, RegisterAdmin, Users, UserProfile } = admin;
    const { StudentDashboardPage } = student;
    const location = useLocation();
    useTitle()
    return (
        <AnimatePresence mode='wait'>
            
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<LoginPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/create-profile' element={<ProtectedRoutes><CreateProfile/></ProtectedRoutes>}/>
                <Route path='/student-dashboard' element={<ProtectedRoutes><StudentDashboardPage/></ProtectedRoutes>}/>
                <Route path='/admin-dashboard' element={<ProfiledRoutes><ProtectedRoutes><DashboardPage/></ProtectedRoutes></ProfiledRoutes>}/>
                <Route path='/invoice' element={<ProtectedRoutes><Invoice/></ProtectedRoutes>}/>
                <Route path='/profile' element={<ProtectedRoutes><UserProfile/></ProtectedRoutes>}/>
                <Route path='/projects' element={<ProtectedRoutes><Projects/></ProtectedRoutes>}/>
                <Route path='/admin-register' element={<ProtectedRoutes><RegisterAdmin/></ProtectedRoutes>}/>
                <Route path='/users' element={<ProtectedRoutes><Users/></ProtectedRoutes>}/>
                <Route path='/*' element={<PageNotFound />} />
            </Routes>
        </AnimatePresence>


    );
};

export default AllRoutes;