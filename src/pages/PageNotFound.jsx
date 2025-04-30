import React from 'react';
import { motion } from 'framer-motion';
import useTitle from '../hooks/useTitle';

const styles = {
    pageNotFound: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        color: '#333',
    },
    gears: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    gear: {
        width: '50px',
        height: '50px',
        margin: '0 10px',
        animation: 'spin 2s linear infinite',
    },
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
};

const PageNotFound = () => {

    useTitle("Page Not Found"); // Custom hook to set the document title
    return (
        <motion.div 
        initial={{ width: 0 }}
        animate={{ width: window.innerWidth }}
        exit={{ x: window.innerWidth }}
        transition={{ type: "tween", duration: 0.5 }}
        >
           
            <div style={styles.pageNotFound} className='bg-gray-200 dark:bg-gray-950 duration-300 ease-in-out transform hover:scale-105'>
<img className='h-130 mt-17 relative rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl shadow-slate-900/10 dark:shadow-black/40' src="/NotFound.svg" alt="" />
            <div className='font-display text-base text-slate-900 dark:text-slate-50'>
                <h1 >404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist yet!.</p>
            </div>
        </div>
            
            
        </motion.div>
    );
};

export default PageNotFound;