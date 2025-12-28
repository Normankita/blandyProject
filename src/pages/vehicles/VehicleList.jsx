import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import useTableData from "@/hooks/useTableData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TableComponent from "../admin/components/TableComponent";

const VehicleList = () => {
  const { deleteData, userProfile } = useData();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  const { formattedData: vehicles, loading } = useTableData({
    path: "vehicles",
    sort: { field: "createdAt", direction: "desc" },
  });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this vehicle record?")) {
      try {
        await deleteData("vehicles", id);
        toast.success("Vehicle deleted");
      } catch (err) {
        toast.error("Error deleting vehicle");
      }
    }
  };

  const transform = {
    status: (value) => (
      <span className={`p-1 rounded px-2 uppercase text-sm font-semibold shadow-slate-900/10 dark:shadow-black/40 ${value === "In Progress" ? "bg-blue-500/60" :
          value === "In Garage" ? "bg-gray-500/60" :
            value === "Completed" ? "bg-green-500/60" :
              value === "Delivered" ? "bg-yellow-800/60" : "bg-gray-500/60"
        }`}>
        {value ?? "Unknown"}
      </span>
    ),
    createdAt: (value) => value ? new Date(value.seconds * 1000).toLocaleDateString() : "N/A"
  };

  const headerLabels = {
    plateNumber: "Plate Number",
    ownerName: "Owner",
    make: "Make",
    model: "Model",
    createdAt: "Date In",
  };

  const filterOut = ["id", "ownerContact", "vin", "issues", "updatedAt", "files", "partsUsed"];

  const renderActions = (vehicle) => {
    return (
      <div className="space-x-4 flex flex-row">
        <button
          className="text-gray-900 bg-white border focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-yellow-700 dark:hover:border-yellow-600 dark:border-yellow-600 hover:bg-yellow-100 border-yellow-300 focus:ring-yellow-100"
          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
        >
          <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Details
        </button>
        {userProfile?.role === "admin" && (
          <button
            className="text-gray-900 bg-white border focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100"
            onClick={() => handleDelete(vehicle.id)}
          >
            <svg className="w-6 h-6 text-red-500 dark:text-white" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
            </svg>
            Delete
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles In Garage</h1>
        <button
          onClick={() => navigate('/vehicles/new')} // Assuming we'll have a create page or use modal here. For MVP let's reuse details page for new? Or just a modal.
          // Actually, let's create a 'new' route or just specific id 'new'
          className="text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-slate-900 dark:text-white dark:border-gray-600 dark:hover:bg-slate-950 dark:hover:border-gray-600 dark:focus:ring-gray-700 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
        >
          Register Vehicle
        </button>
      </div>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No vehicles found.</div>
      ) : (
        <TableComponent
          ItemData={vehicles}
          headers={['plateNumber', 'make', 'model', 'year', 'ownerName', 'status', 'createdAt']}
          title="Vehicle List"
          isLoading={loading}
          excludeFields={filterOut}
          transformFields={transform}
          customActions={renderActions}
          headerLabels={headerLabels}
        />
      )}
    </div>
  );
};

export default VehicleList;
