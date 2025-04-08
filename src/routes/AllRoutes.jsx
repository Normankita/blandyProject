import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import pages from '../pages';


const AllRoutes = () => {
    const { LoginPage, RegisterPage } = pages;
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage/>}/>

                <Route path='/*' element={<LoginPage />} />
            </Routes>
        </AnimatePresence>


    );
};

export default AllRoutes;