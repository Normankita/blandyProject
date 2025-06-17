import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-black/60 bg-white/60">
      <div className="relative">
        <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
        <img
          src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
          alt="Loading Avatar"
          className="rounded-full h-28 w-28 relative mb-8 animate-pulse mx-auto"
        />
        <span className="mt-13 font-extrabold text-purple-500 text-lg">
            Please wait...
        </span>
      </div>
    </div>
  );
};

export default Loading;
