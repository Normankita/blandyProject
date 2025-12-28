import React, { useState } from 'react';
import useTableData from '@/hooks/useTableData';
import { useData } from '@/contexts/DataContext';
import { toast } from 'react-toastify';
import TableComponent from '../admin/components/TableComponent';
import ProjectModal from '../admin/components/ProjectModal';

const PartsInventory = () => {
  const { addData, updateData } = useData();
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [partForm, setPartForm] = useState({
    partNumber: '',
    name: '',
    category: '',
    description: '',
    costPrice: '',
    sellingPrice: '',
    stockQuantity: '',
    supplier: '',
    location: '',
  });

  // Load all parts
  const { formattedData: parts, loading, refreshData } = useTableData({
    path: 'parts',
  });

  const resetForm = () => {
    setPartForm({
      partNumber: '',
      name: '',
      category: '',
      description: '',
      costPrice: '',
      sellingPrice: '',
      stockQuantity: '',
      supplier: '',
      location: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (part) => {
    setPartForm({
      partNumber: part.partNumber || '',
      name: part.name || '',
      category: part.category || '',
      description: part.description || '',
      costPrice: part.costPrice || '',
      sellingPrice: part.sellingPrice || '',
      stockQuantity: part.stockQuantity || '',
      supplier: part.supplier || '',
      location: part.location || '',
    });
    setSelectedPart(part);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSavePart = async () => {
    if (!partForm.name.trim() || !partForm.partNumber.trim()) {
      toast.error('Part Name and Part Number are required.');
      return;
    }

    const payload = {
      ...partForm,
      costPrice: Number(partForm.costPrice),
      sellingPrice: Number(partForm.sellingPrice),
      stockQuantity: Number(partForm.stockQuantity),
    };

    try {
      if (isEditing && selectedPart) {
        await updateData('parts', selectedPart.id, payload);
        toast.success('Part updated successfully!');
      } else {
        await addData('parts', payload);
        toast.success('Part added successfully!');
      }
      setShowModal(false);
      refreshData();
      resetForm();
      setSelectedPart(null);
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to save part.');
      console.error(err);
    }
  };

  const customHeaders = {
    partNumber: 'Part #',
    name: 'Part Name',
    category: 'Category',
    stockQuantity: 'Stock',
    sellingPrice: 'Price',
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Parts Inventory</h1>
        <button
          onClick={openCreateModal}
          className="text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
        >
          Add New Part
        </button>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : parts.length === 0 ? (
        <div className="flex flex-col items-center mt-16 text-center text-gray-700">
           
          <p className="text-lg">No parts in inventory.</p>
        </div>
      ) : (
        <TableComponent
          ItemData={parts}
          headers={['partNumber', 'name', 'category', 'stockQuantity', 'sellingPrice']}
          title="Parts List"
          isLoading={loading}
          headerLabels={customHeaders}
          customActions={(part) => (
            <div className="flex flex-row gap-1 items-center">
              <button
                className="text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40 "
                onClick={() => setSelectedPart(part)}
              >
                  <span className='flex flex-row gap-1 items-center'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  View
                </span>
              </button>

              <button
                className="text-blue-700 bg-white border border-blue-300 focus:outline-none hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-slate-800"
                onClick={() => openEditModal(part)}
              >
                <span className='flex flex-row gap-1 items-center'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  Edit
                </span>
              </button>
            </div>
          )}
        />
      )}

      {/* View Part Modal */}
      {selectedPart && !isEditing && (
        <ProjectModal
          title={`Part Details: ${selectedPart.name}`}
          onClose={() => setSelectedPart(null)}
        >
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Part Number:</strong> {selectedPart.partNumber}</p>
            <p><strong>Category:</strong> {selectedPart.category}</p>
            <p><strong>Cost Price:</strong> ${Number(selectedPart.costPrice).toFixed(2)}</p>
            <p><strong>Selling Price:</strong> ${Number(selectedPart.sellingPrice).toFixed(2)}</p>
            <p><strong>Stock Quantity:</strong> {selectedPart.stockQuantity}</p>
            <p><strong>Supplier:</strong> {selectedPart.supplier || 'N/A'}</p>
            <p><strong>Location:</strong> {selectedPart.location || 'N/A'}</p>
          </div>
          <p className="mt-4"><strong>Description:</strong> {selectedPart.description || 'N/A'}</p>
        </ProjectModal>
      )}

      {/* Create/Edit Part Modal */}
      {showModal && (
        <ProjectModal
          title={isEditing ? `Edit Part: ${partForm.name}` : "Add New Part"}
          onClose={() => {
            setShowModal(false);
            setSelectedPart(null);
            setIsEditing(false);
            resetForm();
          }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Part Number"
                value={partForm.partNumber}
                onChange={(e) => setPartForm({ ...partForm, partNumber: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Part Name"
                value={partForm.name}
                onChange={(e) => setPartForm({ ...partForm, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Category (e.g. Engine, Body)"
                    value={partForm.category}
                    onChange={(e) => setPartForm({ ...partForm, category: e.target.value })}
                    className="w-full border p-2 rounded"
                />
                 <input
                    type="text"
                    placeholder="Supplier"
                    value={partForm.supplier}
                    onChange={(e) => setPartForm({ ...partForm, supplier: e.target.value })}
                    className="w-full border p-2 rounded"
                />
            </div>
          
            <div className="grid grid-cols-3 gap-4">
               <input
                type="number"
                placeholder="Cost Price"
                value={partForm.costPrice}
                onChange={(e) => setPartForm({ ...partForm, costPrice: e.target.value })}
                className="w-full border p-2 rounded"
              />
               <input
                type="number"
                placeholder="Selling Price"
                value={partForm.sellingPrice}
                onChange={(e) => setPartForm({ ...partForm, sellingPrice: e.target.value })}
                className="w-full border p-2 rounded"
              />
               <input
                type="number"
                placeholder="Stock Qty"
                value={partForm.stockQuantity}
                onChange={(e) => setPartForm({ ...partForm, stockQuantity: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
             <input
                    type="text"
                    placeholder="Shelf Location"
                    value={partForm.location}
                    onChange={(e) => setPartForm({ ...partForm, location: e.target.value })}
                    className="w-full border p-2 rounded"
                />

            <textarea
              rows="3"
              placeholder="Description"
              value={partForm.description}
              onChange={(e) => setPartForm({ ...partForm, description: e.target.value })}
              className="w-full border p-2 rounded"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleSavePart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Save Changes" : "Add Part"}
              </button>
            </div>
          </div>
        </ProjectModal>
      )}
    </div>
  );
};

export default PartsInventory;
