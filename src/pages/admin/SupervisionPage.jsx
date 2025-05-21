import React, { useState } from 'react';
import useTableData from '../../hooks/useTableData';
import TableComponent from './components/TableComponent';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';

const SupervisionPage = () => {
    const { updateData } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [assignedStudents, setAssignedStudents] = useState([]);

    // Grab all supervisors (staff) from db
    const { formattedData: supervisors, loading: loadingSupervisors } = useTableData({
        path: 'users',
        filters: [{ field: 'role', op: '==', value: 'staff' }],
    });

    // Grab all students from db
    const { formattedData: students, loading: loadingStudents } = useTableData({
        path: 'users',
        filters: [{ field: 'role', op: '==', value: 'student' }],
    });

    // Only show supervisors that match what you type in the search box
    const filteredSupervisors = supervisors.filter(
        (sup) =>
            sup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sup.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // When you click "Assign" on a student, add them to the list for this supervisor
    const handleAddStudentToSupervisor = (student) => {
        if (!selectedSupervisor) return;

        const updatedStudent = { ...student, supervisorId: selectedSupervisor.id };

        // Don't add the same student twice
        setAssignedStudents((prev) =>
            prev.some((s) => s.id === student.id) ? prev : [...prev, updatedStudent]
        );
    };

    // When you hit "Commit Changes", actually update the db for all assigned students
    const handleCommitChanges = async () => {
        try {
            await Promise.all(
                assignedStudents.map((student) =>
                    updateData('users', student.id, { supervisorId: selectedSupervisor.id })
                )
            );
            toast.success('All students successfully assigned!');
            setAssignedStudents([]);
        } catch (err) {
            console.error('Error committing assignments:', err);
            toast.error('Failed to assign students.');
        }
    };

    // Figure out which students are NOT assigned to any supervisor yet
    const localUnassignedStudents = students.filter(
        (student) =>
            !student.supervisorId && // no supervisor in db
            !assignedStudents.some((s) => s.id === student.id) // not already in our local list
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Assign Supervisors to Students</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search supervisor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full max-w-md"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingSupervisors ? (
                    <p>Loading supervisors...</p>
                ) : filteredSupervisors.length === 0 ? (
                    <p>No supervisors match the search.</p>
                ) : (
                    filteredSupervisors.map((supervisor) => (
                        <div
                            key={supervisor.id}
                            onClick={() => {
                                setSelectedSupervisor(supervisor);
                                // When you click a supervisor, show all students already assigned to them
                                const alreadyAssigned = students.filter(
                                    (s) => s.supervisorId === supervisor.id
                                );
                                setAssignedStudents(alreadyAssigned);
                            }}
                            className="cursor-pointer border rounded-lg p-4 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-950 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
                        >
                            <h3 className="font-bold text-lg">{supervisor.name}</h3>
                            <p className="text-sm text-gray-600">{supervisor.department || 'No Department'}</p>
                        </div>
                    ))
                )}
            </div>

            {selectedSupervisor && (
                <div className="mt-10">
                    <div className="border rounded-lg p-4 mb-6 shadow-lg shadow-slate-900/10 dark:shadow-black/40 bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950 duration-300">
                        <h2 className="text-xl font-semibold mb-2">Supervisor Details</h2>
                        <p><strong>Name:</strong> {selectedSupervisor.name}</p>
                        <p><strong>Email:</strong> {selectedSupervisor.email}</p>
                        <p><strong>Department:</strong> {selectedSupervisor.department || 'N/A'}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Assigned Students</h2>
                        {/* This table shows all students currently assigned to this supervisor */}
                        <TableComponent
                            ItemData={assignedStudents}
                            headers={['name', 'email']}
                            title="Students under Supervision"
                            isLoading={false}
                            customActions={() => null}
                        />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Unassigned Students</h2>
                        {/* This table shows students who don't have a supervisor yet */}
                        <TableComponent
                            ItemData={localUnassignedStudents}
                            headers={['name', 'email']}
                            title="Unassigned Students"
                            isLoading={loadingStudents}
                            customActions={(student) => (
                                <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => handleAddStudentToSupervisor(student)}
                                >
                                    Assign
                                </button>
                            )}
                        />
                    </div>

                    <div className="mt-4">
                        {/* When you click this, all the assignments get saved to the db */}
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleCommitChanges}
                        >
                            Commit Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisionPage;
