import React, { useState, useEffect } from 'react';
import useTableData from '@/hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import TableComponent from './components/TableComponent';
import ProjectModal from './components/ProjectModal'; // Adjust path if needed
import { toast } from 'react-toastify';

const DepartmentsPage = () => {
  const { addData, updateData } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    headOfDepartment: '',
    officeLocation: '',
  });

  // Load all departments
  const { formattedData: departments, loading, refreshData } = useTableData({
    path: 'departments',
  });

  // Load staff users for head of department selection
  const { formattedData: staffUsers, loading: loadingStaff } = useTableData({
    path: 'users',
    filters: [{ field: 'role', op: '==', value: 'staff' }],
  });

  // Helper to show the head of department's name by ID (if available)
  const getHeadOfDepartmentName = (headId) => {
    if (!headId) return 'N/A';
    const user = staffUsers.find((staff) => staff.id === headId);
    return user ? user.name : 'N/A';
  };

  // Reset form to empty
  const resetForm = () => {
    setDepartmentForm({
      name: '',
      description: '',
      headOfDepartment: '',
      officeLocation: '',
    });
  };

  // Open modal for creating new department
  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  // Open modal for editing a department
  const openEditModal = (dept) => {
    setDepartmentForm({
      name: dept.name || '',
      description: dept.description || '',
      headOfDepartment: dept.headOfDepartment || '',
      officeLocation: dept.officeLocation || '',
    });
    setSelectedDepartment(dept);
    setIsEditing(true);
    setShowModal(true);
  };

  // Create or update department based on mode
  const handleSaveDepartment = async () => {
    if (!departmentForm.name.trim()) {
      toast.error('Department name is required.');
      return;
    }

    try {
      if (isEditing && selectedDepartment) {
        await updateData('departments', selectedDepartment.id, departmentForm);
        toast.success('Department updated successfully!');
      } else {
        await addData('departments', departmentForm);
        toast.success('Department created successfully!');
      }
      setShowModal(false);
      refreshData();
      resetForm();
      setSelectedDepartment(null);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to save department.');
      console.error(err);
    }
  };
  const transform={
    headOfDepartment: (value) => getHeadOfDepartmentName(value),
  }
  const customHeaders={
    headOfDepartment: 'Head of Department',
  officeLocation: 'Office Location',
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Departments</h1>
        <button
          onClick={openCreateModal}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
        >
          Create Department
        </button>
      </div>

      {loading ? (
        <p>Loading departments...</p>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center mt-16 text-center text-gray-500">
          <img
            src="/no-data.svg"
            alt="No departments"
            className="w-64 h-64 mb-4"
          />
          <p className="text-lg">No departments found.</p>
        </div>
      ) : (
        <TableComponent
          ItemData={departments}
          headers={['name', 'headOfDepartment', 'officeLocation']}
          title="Department List"
          isLoading={loading}
          transformFields={transform}
          headerLabels={customHeaders}
          customActions={(dept) => (
            <div className="flex flex-row gap-1 items-center">
              <button
                className="text-gray-900 bg-white border border-blue-300 focus:outline-none hover:bg-blue-100 focus:ring-4 focus:ring-blue-100 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:border-blue-600 dark:hover:bg-slate-950 dark:hover:border-blue-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 "
                onClick={() => setSelectedDepartment(dept)}
              >
                <span className='flex flex-row gap-1 items-center'>
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  <p>View</p>
                </span>
              </button>

              <button
                className="text-gray-900 bg-white border border-blue-300 focus:outline-none hover:bg-blue-100 focus:ring-4 focus:ring-blue-100 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:border-blue-600 dark:hover:bg-slate-950 dark:hover:border-blue-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 "
                onClick={() => openEditModal(dept)}
              >
                <span className='flex flex-row gap-1 items-center'>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                    </svg>
                    <p>Edit</p>
                  </span>
              </button>
            </div>
          )}
          dataRenderOverrides={{
            headOfDepartment: (id) => getHeadOfDepartmentName(id),
          }}
        />
      )}

      {/* View Department Modal */}
      {selectedDepartment && !isEditing && (
        <ProjectModal
          title={`Department: ${selectedDepartment.name}`}
          onClose={() => setSelectedDepartment(null)}
        >
          <p><strong>Name:</strong> {selectedDepartment.name}</p>
          <p><strong>Description:</strong> {selectedDepartment.description || 'N/A'}</p>
          <p><strong>Head of Department:</strong> {getHeadOfDepartmentName(selectedDepartment.headOfDepartment)}</p>
          <p><strong>Office Location:</strong> {selectedDepartment.officeLocation || 'N/A'}</p>
        </ProjectModal>
      )}

      {/* Create/Edit Department Modal */}
      {showModal && (
        <ProjectModal
          title={isEditing ? `Edit Department: ${departmentForm.name}` : "Create New Department"}
          onClose={() => {
            setShowModal(false);
            setSelectedDepartment(null);
            setIsEditing(false);
            resetForm();
          }}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Department Name"
              value={departmentForm.name}
              onChange={(e) =>
                setDepartmentForm({ ...departmentForm, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <textarea
              rows="3"
              placeholder="Description"
              value={departmentForm.description}
              onChange={(e) =>
                setDepartmentForm({ ...departmentForm, description: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <select
              value={departmentForm.headOfDepartment}
              onChange={(e) =>
                setDepartmentForm({ ...departmentForm, headOfDepartment: e.target.value })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select Head of Department (optional) --</option>
              {loadingStaff ? (
                <option disabled>Loading staff...</option>
              ) : (
                staffUsers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.email})
                  </option>
                ))
              )}
            </select>
            <input
              type="text"
              placeholder="Office Location"
              value={departmentForm.officeLocation}
              onChange={(e) =>
                setDepartmentForm({ ...departmentForm, officeLocation: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveDepartment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </ProjectModal>
      )}
    </div>
  );
};

export default DepartmentsPage;
