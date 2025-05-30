import React from "react";

const ProjectModal = ({ title, onClose, children }) => {
  return (
    <div className="h-screen fixed z-50 w-full inset-0 backdrop-blur-xs bg-slate-50/20 dark:bg-slate-900/20 shadow-3xl shadow-slate-900/40 dark:shadow-black/40">
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-red-500 font-bold text-lg">✕</button>
          </div>

          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
