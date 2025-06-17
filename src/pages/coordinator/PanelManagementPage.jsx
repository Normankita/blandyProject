import React, { useState } from 'react';
import useTableData from '../../hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import TableComponent from '../admin/components/TableComponent';
import ProjectModal from '../admin/components/ProjectModal';
import { toast } from 'react-toastify';

const PanelManagementPage = () => {
  const { addData, updateData } = useData();

  const [selectedPanel, setSelectedPanel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentId: '',
  });

  const { formattedData: panels, refreshData: refreshPanels } = useTableData({ path: 'panels' });
  const { formattedData: departments } = useTableData({ path: 'departments' });
  const { formattedData: supervisors, loading: loadingSupervisors } = useTableData({
    path: 'users',
    filters: [{ field: 'role', op: '==', value: 'staff' }],
  });

  const handleCreatePanel = async () => {
    const { name, description, departmentId } = formData;
    if (!name || !departmentId) {
      toast.error('Name and department are required');
      return;
    }

    try {
      await addData('panels', {
        name,
        description,
        departmentId,
        supervisorIds: [],
      });
      toast.success('Panel created');
      setFormData({ name: '', description: '', departmentId: '' });
      setShowModal(false);
      refreshPanels();
    } catch (err) {
      toast.error('Error creating panel');
    }
  };

  const handleAddSupervisor = async (supervisorId) => {
    console.log(supervisorId);
    if (!selectedPanel) return;

    const currentIds = selectedPanel.supervisorIds || [];
    if (currentIds.includes(supervisorId)) return;
    if (currentIds.length >= 3) {
      return toast.warning('A panel can only have 3 supervisors');
    }

    const updated = [...currentIds, supervisorId];

    try {
      // Update panel with new supervisor list
      await updateData('panels', selectedPanel.id, { supervisorIds: updated });

      // Update supervisor with panelId
      await updateData('users', supervisorId, { panelId: selectedPanel.id });

      setSelectedPanel({ ...selectedPanel, supervisorIds: updated });
      toast.success('Supervisor added to panel and updated!');
    } catch (error) {
      console.error('Failed to add supervisor to panel:', error);
      toast.error('Failed to add supervisor to panel');
    }
  };


  const handleRemoveSupervisor = async (supervisorId) => {
    if (!selectedPanel) return;
    const updated = selectedPanel.supervisorIds.filter((id) => id !== supervisorId);
    await updateData('panels', selectedPanel.id, { supervisorIds: updated });
    setSelectedPanel({ ...selectedPanel, supervisorIds: updated });
  };

  const getSupervisorById = (id) => supervisors.find((sup) => sup.uid === id);

  const availableSupervisors = selectedPanel
    ? supervisors.filter(
      (sup) =>
        sup.department === selectedPanel.departmentId &&
        !selectedPanel.supervisorIds.includes(sup.uid)
    )
    : [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Panel Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
        >
          Create Panel
        </button>
      </div>

      {/* Panels list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {panels.length === 0 ? (
          <p>No panels available.</p>
        ) : (
          panels.map((panel) => (
            <div
              key={panel.id}
              onClick={() => setSelectedPanel(panel)}
              className={`border p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-950 duration-300 shadow-lg ${selectedPanel?.id === panel.id ? 'ring-2 ring-yellow-500' : ''
                }`}
            >
              <h3 className="font-bold text-lg">{panel.name}</h3>
              <p className="text-sm text-gray-500">{panel.description}</p>
              <p className="text-xs text-gray-400">
                {panel.supervisorIds?.length || 0} assigned
              </p>
            </div>
          ))
        )}
      </div>

      {selectedPanel && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Panel: {selectedPanel.name}</h2>

          <TableComponent
            ItemData={selectedPanel.supervisorIds.map(getSupervisorById).filter(Boolean)}
            headers={['name', 'email']}
            title="Assigned Supervisors"
            customActions={(sup) => (
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleRemoveSupervisor(sup.uid)}
              >
                Remove
              </button>
            )}
          />

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Assign New Supervisors</h3>
            <TableComponent
              ItemData={availableSupervisors}
              headers={['name', 'email']}
              title="Eligible Supervisors"
              isLoading={loadingSupervisors}
              customActions={(sup) => (
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleAddSupervisor(sup.uid)}
                >
                  Assign
                </button>
              )}
            />
          </div>
        </div>
      )}

      {/* Create Panel Modal */}
      {showModal && (
        <ProjectModal title="Create New Panel" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Panel Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="Enter panel name"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="Optional panel description"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <button
                onClick={handleCreatePanel}
                className="bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Save Panel
              </button>
            </div>
          </div>
        </ProjectModal>
      )}
    </div>
  );
};

export default PanelManagementPage;
