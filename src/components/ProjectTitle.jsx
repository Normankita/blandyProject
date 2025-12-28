import React from 'react';

const ProjectTitle = () => {
    return (
        <a href="#" className="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <span className='flex flex-col items-center w-full'><img src="/car_garage.svg" alt="Garage LOgo" className='h-30 w-30' /></span>
            <span className="uppercase flex flex-col items-center overflow-auto text-center"><p>GARAGE MANAGEMENT SYSTEM</p></span>
        </a>
    );
};

export default ProjectTitle;