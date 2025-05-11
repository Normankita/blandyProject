import React from 'react';
import Goback from '../components/Goback';

const UnAuthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen gap-12 py-8">
            <svg
                className="h-[50vh] aspect-video"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                fill="none"
            >
                <g id="freepik--background-simple--inject-3">
                    <path
                        d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
                        fill="#3B82F6"
                    />
                    <path
                        d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
                        fill="#fff"
                        opacity="0.7"
                    />
                </g>
                {/* Add remaining SVG groups/elements here if needed */}
            </svg>
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Unauthorized</h1>
                <p className="text-lg text-gray-600 mt-2">
                    You don't have permission to access this page.
                </p>
            </div>
            <Goback page="login"/>
        </div>
    );
};

export default UnAuthorized;
