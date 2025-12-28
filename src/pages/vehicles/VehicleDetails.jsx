import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSingleDoc, updateData, fetchData, loading, setLoading } = useData();

  const [vehicle, setVehicle] = useState(null);
  const [parts, setParts] = useState([]);
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);

  // Add Part Form
  const [selectedPartId, setSelectedPartId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadVehicle();
    loadParts();
  }, [id]);

  const loadVehicle = async () => {
    if (id === 'new') return; // We'll handle 'new' separately or redirect
    setLoading(true);
    const data = await fetchSingleDoc("vehicles", id);
    if (data) {
      setVehicle(data);
    } else {
      toast.error("Vehicle not found");
      navigate("/vehicles");
    }
    setLoading(false);
  };

  const loadParts = async () => {
    const { data } = await fetchData({ path: "parts" });
    setParts(data);
  };

  const handleStatusChange = async (newStatus) => {
    if (!vehicle) return;
    try {
      await updateData("vehicles", vehicle.id, { status: newStatus });
      setVehicle({ ...vehicle, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAddPart = async () => {
    if (!selectedPartId || quantity <= 0) {
      toast.error("Please select a part and valid quantity");
      return;
    }

    const part = parts.find(p => p.id === selectedPartId);
    if (!part) return;

    if (part.stockQuantity < quantity) {
      toast.error(`Not enough stock. Available: ${part.stockQuantity}`);
      return;
    }

    const partEntry = {
      partId: part.id,
      name: part.name,
      partNumber: part.partNumber,
      quantity: Number(quantity),
      unitPrice: part.sellingPrice,
      totalPrice: part.sellingPrice * Number(quantity),
      addedAt: new Date().toISOString()
    };

    try {
      // Update Vehicle
      const currentParts = vehicle.partsUsed || [];
      await updateData("vehicles", vehicle.id, {
        partsUsed: [...currentParts, partEntry]
      });

      // Update Part Stock
      await updateData("parts", part.id, {
        stockQuantity: part.stockQuantity - quantity
      });

      // Refresh Local State
      setVehicle(prev => ({ ...prev, partsUsed: [...(prev.partsUsed || []), partEntry] }));
      setParts(prev => prev.map(p => p.id === part.id ? { ...p, stockQuantity: p.stockQuantity - quantity } : p));

      toast.success("Part added to job card");
      setIsAddPartOpen(false);
      setQuantity(1);
      setSelectedPartId("");

    } catch (err) {
      console.error(err);
      toast.error("Failed to add part");
    }
  };

  const handleRemovePart = async (index, partEntry) => {
    if (!confirm("Remove this part from the job card? Stock will be restored.")) return;

    try {
      // Restore Stock
      const part = parts.find(p => p.id === partEntry.partId);
      if (part) { // Only if part still exists
        await updateData("parts", partEntry.partId, {
          stockQuantity: part.stockQuantity + partEntry.quantity
        });
      }

      // Remove from Vehicle
      const updatedParts = [...(vehicle.partsUsed || [])];
      updatedParts.splice(index, 1);

      await updateData("vehicles", vehicle.id, { partsUsed: updatedParts });

      setVehicle(prev => ({ ...prev, partsUsed: updatedParts }));
      // Reload parts to get fresh stock
      loadParts();
      toast.success("Part removed");

    } catch (err) {
      toast.error("Failed to remove part");
    }
  };

  if (loading && !vehicle) return <div className="p-6"><Skeleton count={5} /></div>;
  if (!vehicle && id !== 'new') return <div className="p-6">Vehicle not found.</div>;

  // Fallback for creating new vehicle if we reused this component (optional, otherwise use modal in List)
  if (id === 'new') {
    return <div className="p-6">New Vehicle Form (Implement if needed)</div>;
  }

  const totalPartsCost = vehicle.partsUsed?.reduce((sum, p) => sum + p.totalPrice, 0) || 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{vehicle.plateNumber}</h1>
          <p className="text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
          <p className="text-sm text-gray-400">Owner: {vehicle.ownerName}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full font-bold uppercase text-sm ${vehicle.status === "Completed" ? "bg-green-100 text-green-800" :
              vehicle.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
            }`}>
            {vehicle.status}
          </span>
          <select
            className="border rounded p-1 text-sm bg-white dark:bg-slate-900"
            value={vehicle.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="In Garage">In Garage</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Issues / Description */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-lg shadow-slate-900/10 dark:shadow-black/40">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">Issues / Diagnosis</h3>
          <div className="prose dark:prose-invert">
            {vehicle.issues ? (
              <div dangerouslySetInnerHTML={{ __html: vehicle.issues }} />
            ) : <p className="text-gray-400 italic">No notes added.</p>}
          </div>
        </div>

        {/* Parts Used */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded shadow-lg shadow-slate-900/10 dark:shadow-black/40">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-xl font-bold">Parts & Materials</h3>
            <button
              onClick={() => setIsAddPartOpen(true)}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
            >
              + Add Part
            </button>
          </div>

          {!vehicle.partsUsed || vehicle.partsUsed.length === 0 ? (
            <p className="text-gray-400 italic">No parts added.</p>
          ) : (
            <div className="space-y-3">
              {vehicle.partsUsed.map((part, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-slate-800 rounded">
                  <div>
                    <p className="font-semibold">{part.name} <span className="text-xs text-gray-500">({part.partNumber})</span></p>
                    <p className="text-sm">Quantity: {part.quantity} x ${part.unitPrice}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">${part.totalPrice}</span>
                    <button
                      onClick={() => handleRemovePart(idx, part)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <span className="font-bold text-lg">Total Cost:</span>
                <span className="font-bold text-xl text-green-600">${totalPartsCost}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddPartOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded flex flex-col gap-4 w-full max-w-md">
            <h3 className="text-lg font-bold">Add Part to Job</h3>

            <select
              className="w-full border p-2 rounded"
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
            >
              <option value="">-- Select Part --</option>
              {parts.map(p => (
                <option key={p.id} value={p.id} disabled={p.stockQuantity <= 0}>
                  {p.name} (Stock: {p.stockQuantity}) - ${p.sellingPrice}
                </option>
              ))}
            </select>

            <div className="flex flex-col">
              <label className="text-sm mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setIsAddPartOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleAddPart} className="px-4 py-2 bg-blue-600 text-white rounded">Add Part</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
