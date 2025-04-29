import React from 'react';

const LoadingAdmin = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-transparent">
            <div className="h-20 w-20 animate-spin rounded-full border-8 border-gray-300 border-t-blue-600" />
        </div>
    );
};

export default LoadingAdmin;
