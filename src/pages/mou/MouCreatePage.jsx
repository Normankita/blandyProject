import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TableComponent from '../admin/components/TableComponent';
import useTableData from '@/hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const MouCreatePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedParties, setSelectedParties] = useState([]);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [mouId, setMouId] = useState(null);
    const [isEditable, setIsEditable] = useState(true);
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);



    const location = useLocation();
    const { addData, updateData, userProfile, uploadFile } = useData();

    const navigate = useNavigate();
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const { formattedData: users, loading: loadingUsers, refreshData } = useTableData({
        path: 'users',
        sort: { field: 'createdAt', direction: 'desc' },
    });

    const reviewers = users.filter(user => user.role === 'staff' && user.isReviewer && !user.secretpass && (user.uid !== userProfile?.uid));
    const parties = users.filter(user => !user.isReviewer && !user.secretpass && (user.uid !== userProfile?.uid));

    // Populate form if editing
    useEffect(() => {
        const stateMou = location.state?.mou;
        if (stateMou) {
            setIsEditMode(true);
            setMouId(stateMou.id);
            setTitle(stateMou.title || '');
            setDescription(stateMou.description || '');
            setIsEditable(stateMou?.status === 'pending');
            setSelectedReviewers(stateMou.reviewers || []);
            setSelectedParties((stateMou.parties || []));

        }
    }, [location.state]);


    const toggleParty = (user) => {
        if (!isEditable) return;
        setSelectedParties(prev =>
            prev.some(p => p.partyId === user.uid)
                ? prev.filter(p => p.partyId !== user.uid)
                : [...prev, { partyId: user.uid, signedAt: null }]
        );
    };


    const toggleReviewer = (user) => {
        if (!isEditable) return;

        const exists = selectedReviewers.some(r => r.reviewerId === user.uid);
        if (exists) {
            setSelectedReviewers(prev => prev.filter(r => r.reviewerId !== user.uid));
        } else {
            setSelectedReviewers(prev => [
                ...prev,
                {
                    reviewerId: user.uid,
                    decision: null,
                    comment: '',
                    decidedAt: null
                }
            ]);
        }
    };


    const handleSubmit = async () => {
        setSubmitting(true);
        const storagePath = `MouDocuments/${userProfile.uid}/${file?.name}`;
        let documentUrl = "";

        if (file) {
            documentUrl = await uploadFile(file, storagePath);
        }

        if (!title || !description || selectedParties.length === 0 || selectedReviewers.length === 0) {
            toast.error('Please fill in all fields and select parties and reviewers.');
            return;
        }

        const data = {
            title,
            description,
            parties: selectedParties,
            reviewers: selectedReviewers,
            updatedAt: new Date().toISOString(),
            documentUrl,
            status: 'pending'
        };


        try {
            if (isEditMode && mouId) {
                await updateData('mous', mouId, data);
                toast.success('MOU updated successfully.');
                navigate('/mou');
            } else {
                await addData('mous', {
                    ...data,
                    createdAt: new Date().toISOString(),
                    submitter: userProfile.uid
                });
                toast.success('MOU created successfully.');
                navigate('/mou');

            }

            setTitle('');
            setDescription('');
            setSelectedParties([]);
            setSelectedReviewers([]);
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? 'update' : 'create'} MOU.`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6  duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40">
            <h1 className="text-2xl font-bold">{isEditMode ? 'Edit MOU' : 'Create MOU'}</h1>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="MOU Title"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditable}
                />

                <textarea
                    placeholder="MOU Description"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    disabled={!isEditable}
                />
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="max-w-xs p-2 border duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border-gray-300 rounded  cursor-pointer"
                />
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-2">Select Involved Parties</h2>
                <TableComponent
                    ItemData={parties}
                    headers={['name', 'email']}
                    isLoading={loadingUsers}
                    customActions={(user) => (
                        <Button
                            size="sm"
                            variant={selectedParties.find(p => p.partyId === user.uid) ? 'destructive' : 'default'}

                            onClick={() => toggleParty(user)}
                            disabled={submitting || !title || !description}                        >
                            {selectedParties.find(p => p.partyId === user.uid) ? 'Remove' : 'Add'}

                        </Button>
                    )}
                />
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Select Reviewers</h2>
                <TableComponent
                    ItemData={reviewers}
                    headers={['name', 'email']}
                    isLoading={loadingUsers}
                    customActions={(user) => {
                        const isSelected = selectedReviewers.some(r => r.reviewerId === user.uid);
                        return (
                            <Button
                                size="sm"
                                variant={isSelected ? 'destructive' : 'default'}
                                onClick={() => toggleReviewer(user)}
                                disabled={submitting || !title || !description || selectedParties.length === 0}
                            >
                                {isSelected ? 'Remove' : 'Add'}
                            </Button>
                        );
                    }}
                />

            </div>

            {isEditable && (
                <div className="flex justify-end">
                    <Button className="flex flex-row gap-2 items-center text-slate-900 bg-white border border-yellow-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-yellow-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-yellow-600 dark:hover:bg-slate-950 dark:hover:border-slate-600 dark:focus:ring-yellow-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 duration-300 " onClick={handleSubmit}
                        disabled={submitting || !title || !description || selectedParties.length === 0 || selectedReviewers.length === 0}>
                        {isEditMode ? 'Update MOU' : 'Submit MOU'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MouCreatePage;
