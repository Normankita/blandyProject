import React, { useState } from 'react';
import useTableData from '../../hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import TableComponent from '../admin/components/TableComponent';

const ReviewerManagementPage = () => {
    const { updateData } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const { formattedData: staffMembers, loading: loadingStaff, refreshData } = useTableData({
        path: 'users',
        filters: [{ field: 'role', op: '==', value: 'staff' }],
    });

    const reviewers = staffMembers.filter((s) => s.isReviewer === true);
    const nonReviewers = staffMembers.filter((s) => !s.isReviewer);

    const filteredReviewers = reviewers.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredNonReviewers = nonReviewers.filter((s) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleReviewerStatus = async (user, toReviewer = true) => {
        try {
            await updateData('users', user.uid, {
                isReviewer: toReviewer,
            });
            refreshData();
            toast.success(
                `${user.name} has been ${toReviewer ? 'promoted to' : 'removed as'} reviewer.`
            );
        } catch (err) {
            toast.error(`Failed to update reviewer status for ${user.name}.`);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Reviewer Management</h1>

            <div className="p-5 flex flex-col gap-10">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Current Reviewers</h2>
                    <TableComponent
                        ItemData={filteredReviewers}
                        headers={['name', 'email']}
                        title="Reviewer Staff"
                        isLoading={loadingStaff}
                        customActions={(user) => (
                            <button
                                className={`text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100`}
                                onClick={() => toggleReviewerStatus(user, !user.isReviewer)}
                            >
                                <svg class="w-6 h-6 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                                </svg>

                                {user.isReviewer ? 'Demote' : 'Activate'}
                            </button>
                        )}
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Non-Reviewers</h2>
                    <TableComponent
                        ItemData={filteredNonReviewers}
                        headers={['name', 'email']}
                        title="Non-Reviewer Staff"
                        isLoading={loadingStaff}
                        customActions={(user) => (
                            <button
                                className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-green-700 dark:hover:border-green-600 dark:border-green-600 hover:bg-green-100 border-green-300 focus:ring-green-100"
                                onClick={() => toggleReviewerStatus(user, true)}
                            >
                                <svg className="w-6 h-6 text-green-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
                                </svg>

                                Make Reviewer
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewerManagementPage;
