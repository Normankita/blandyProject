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


    const { formattedData: supervisors, loading: loadingSupervisors } = useTableData({
        path: 'users',
        filters: [{ field: 'role', op: '==', value: 'staff' }],
    });

    const { formattedData: students, loading: loadingStudents } = useTableData({
        path: 'users',
        filters: [{ field: 'role', op: '==', value: 'student' }],
    });

    const { formattedData: departments, loading: loadingDepartments } = useTableData({
        path: 'departments'
    });

    const filteredSupervisors = supervisors.filter(
        (sup) =>
            sup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sup.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddStudentToSupervisor = async (student) => {
        if (!selectedSupervisor) return;

        if (student.department !== selectedSupervisor.department) {
            toast.warning('Student must belong to the same department as the supervisor.');
            return;
        }
        if(!selectedSupervisor.panelId){
            toast.warning('Supervisor must be belonging to a panel.');
            return;
        }

        const updatedStudent = {
            ...student,
            supervisorId: selectedSupervisor.uid,
            panelId: selectedSupervisor.panelId || null,
        };

        const alreadyAssigned = assignedStudents.some((s) => s.uid === student.uid);
        if (!alreadyAssigned) {
            try {
                await updateData('users', student.id, {
                    supervisorId: selectedSupervisor.uid,
                    panelId: selectedSupervisor.panelId || null,
                });

                setAssignedStudents((prev) => [...prev, updatedStudent]);
                toast.success(`${student.name} assigned successfully.`);
            } catch (err) {
                toast.error(`Failed to assign ${student.name}`);
            }
        }
    };


    const handleRemoveStudentFromSupervisor = async (studentId) => {
        try {
            await updateData('users', studentId, {
                supervisorId: '',
                panelId: '',
            });

            setAssignedStudents((prev) => prev.filter((s) => s.uid !== studentId));
            toast.success('Student removed from supervisor.');
        } catch (err) {
            toast.error('Failed to remove student.');
        }
    };


    const localUnassignedStudents = students.filter(
        (student) =>
            !student.supervisorId &&
            !assignedStudents.some((s) => s.uid === student.uid) &&
            selectedSupervisor && student.department === selectedSupervisor.department
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
                    className="border-2 border-gray-500 p-2 rounded w-full max-w-md duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
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
                                const alreadyAssigned = students.filter(
                                    (s) => s.supervisorId === supervisor.uid
                                );
                                setAssignedStudents(alreadyAssigned);
                            }}
                            className="cursor-pointer border rounded-lg p-4 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-950 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
                        >
                            <h3 className="font-bold text-lg">{supervisor.name}</h3>
                            <p className="text-sm text-gray-600">{departments.find((d) => d.id === supervisor.department)?.name || 'No Department'}</p>
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
                        <p><strong>Department:</strong> {departments.find((d) => d.id === selectedSupervisor.department)?.name || 'N/A'}</p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Assigned Students</h2>
                        <TableComponent
                            ItemData={assignedStudents}
                            headers={['name', 'email']}
                            title="Students under Supervision"
                            isLoading={false}
                            customActions={(student) => (
                                <button
                                    className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100"
                                    onClick={() => handleRemoveStudentFromSupervisor(student.uid)}
                                >
                                    Remove
                                </button>
                            )}
                        />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Eligible Students for Assignment</h2>
                        <TableComponent
                            ItemData={localUnassignedStudents}
                            headers={['name', 'email']}
                            title="Unassigned Students"
                            isLoading={loadingStudents}
                            customActions={(student) => (
                                <button
                                    className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-green-700 dark:hover:border-green-600 dark:border-green-600 hover:bg-green-100 border-green-300 focus:ring-green-100"
                                    onClick={() => handleAddStudentToSupervisor(student)}
                                >
                                    Assign
                                </button>
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisionPage;
