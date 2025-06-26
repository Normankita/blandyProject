import React from 'react';

const CardDataStats = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  level,
  children,
}) => {
  return (
    <div className="rounded-sm bg-white dark:bg-gray-900 p-6 shadow-xl shadow-slate-900/10 dark:shadow-black/40  py-6 px-7.5 shadow-default duration-300 ease-in-out transform hover:scale-105 shadow-3xl text-black dark:text-white cursor-pointer" >
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 duration-300  ">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold  duration-300">
            {total}
          </h4>
          <span className="text-sm font-medium">{title? title : "card"}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp && 'text-meta-3'
          } ${levelDown && 'text-meta-5'} `}
        >
          {rate}

          {levelUp && (
            <svg class="w-6 h-6 text-green-900 dark:text-green-300 duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v13m0-13 4 4m-4-4-4 4"/>
          </svg>
          
          )}
          {levelDown && (
            <svg class="w-6 h-6 text-red-800 dark:text-red-300 duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 14-4-4m4 4 4-4"/>
          </svg>
          
          )}
          {level &&(
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/>
          </svg>
          
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
