import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import useTableData from '@/hooks/useTableData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MouPage = () => {
  const { deleteData, userProfile } = useData();

  const { formattedData: mous, loading } = useTableData(
    {
      path: 'mous',
      filters: [{ field: 'submitter', op: '==', value: userProfile.uid }],
      sort: { field: 'createdAt', direction: 'desc' }
    }
  );
  console.log(userProfile.uid);
  const navigate = useNavigate();

  const [selectedMou, setSelectedMou] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this MOU?")) {
      try {
        await deleteData('mous', id);
        toast.success('MOU deleted successfully.');
        setDialogOpen(false);
      } catch (error) {
        toast.error('Failed to delete MOU.');
      }
    };
  };
  const handleCardClick = (mou) => {
    setSelectedMou(mou);
    setDialogOpen(true);
  };

  const handleEdit = (mou) => {
    navigate("/mou-edit", { state: { mou } });
  };

  return (
    <div className="p-6">
      <div className='flex flex-row justify-between'>
        <h1 className="text-2xl font-bold mb-4">All MOUs</h1>
        <button onClick={() => navigate("/mou-create")} className='flex flex-row gap-2 items-center text-slate-900 bg-white border border-blue-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-blue-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-blue-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-blue-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300 '>
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h4M9 3v4a1 1 0 0 1-1 1H4m11 6v4m-2-2h4m3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
          </svg>

          <span>
            Create New
          </span>

        </button>
      </div>


      {loading ? (
        <div>Loading MOUs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mous.map((mou) => (
            <div
              key={mou.id}
              className="border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 cursor-pointer"
              onClick={() => handleCardClick(mou)}
            >
              <h2 className="text-lg font-semibold">{mou.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{mou.description}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${mou.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                mou.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                {mou.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for MOU details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          {selectedMou && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMou.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-700">{selectedMou.description}</p>
                <p className="text-sm text-gray-500">Status: <strong>{selectedMou.status}</strong></p>
                <p className="text-sm text-gray-500">Created At: {new Date(selectedMou.createdAt).toLocaleString()}</p>
              </div>

              {selectedMou.status === 'pending' && (
                <DialogFooter className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMou.id)}
                    className={`text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100`}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => toast.info("Under construction")}
                    className={`text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-blue-700 dark:hover:border-blue-600 dark:border-blue-600 hover:bg-blue-100 border-blue-300 focus:ring-blue-100`}
                  >
                    Edit
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MouPage;
