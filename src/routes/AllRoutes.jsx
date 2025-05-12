    import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import pages from '../pages';
import admin from '../pages/admin';
import student from '../pages/student';
import staff from '../pages/supervisor';
import ProtectedRoutes from './ProtectedRoutes';
import useTitle from '../hooks/useTitle';


const AllRoutes = () => {
    const { LoginPage, RegisterPage, PageNotFound, CreateProfile, UnAuthorized } = pages;
    const { DashboardPage, Invoice, Projects, RegisterAdmin, Users, UserProfile } = admin;
    const { StudentDashboardPage } = student;
    const {StaffDashboardPage} = staff;
    const location = useLocation();
    useTitle()
    return (
        <AnimatePresence mode='wait'>
            
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<ProtectedRoutes><LoginPage /></ProtectedRoutes>} />
                <Route path='/login' element={<ProtectedRoutes ><LoginPage /></ProtectedRoutes>} />
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/create-profile' element={<ProtectedRoutes><CreateProfile/></ProtectedRoutes>}/>
                <Route path='/student-dashboard' element={<ProtectedRoutes student profiled><StudentDashboardPage/></ProtectedRoutes>}/>
                <Route path='/admin-dashboard' element={<ProtectedRoutes admin profiled><DashboardPage/></ProtectedRoutes>}/>
                <Route path='/staff-dashboard' element={<ProtectedRoutes staff profiled><StaffDashboardPage/></ProtectedRoutes>}/>
                <Route path='/invoice' element={<ProtectedRoutes admin student staff profiled><Invoice/></ProtectedRoutes>}/>
                <Route path='/profile' element={<ProtectedRoutes profiled><UserProfile/></ProtectedRoutes>}/>
                <Route path='/projects' element={<ProtectedRoutes admin staff profiled><Projects/></ProtectedRoutes>}/>
                <Route path='/admin-register' element={<ProtectedRoutes admin profiled><RegisterAdmin/></ProtectedRoutes>}/>
                <Route path='/users' element={<ProtectedRoutes admin profiled><Users/></ProtectedRoutes>}/>
                <Route path='/unauthorized' element={<UnAuthorized/>}/>
                <Route path='/*' element={<PageNotFound />} />
            </Routes>
        </AnimatePresence>


    );
};

export default AllRoutes;