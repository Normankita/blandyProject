import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Wrench, Package } from "lucide-react"; // Assuming lucide-react has these
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { fetchData } = useData(); // Don't use 'data' from context as we fetch multiple things
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    vehiclesTotal: 0,
    vehiclesInGarage: 0,
    vehiclesInProgress: 0,
    partsTotal: 0,
    lowStockParts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Fetch Vehicles
        const { data: vehicles } = await fetchData({ path: "vehicles" });

        // Fetch Parts
        const { data: parts } = await fetchData({ path: "parts" });

        setStats({
          vehiclesTotal: vehicles.length,
          vehiclesInGarage: vehicles.filter(v => v.status === "In Garage").length,
          vehiclesInProgress: vehicles.filter(v => v.status === "In Progress").length,
          partsTotal: parts.length,
          lowStockParts: parts.filter(p => p.stockQuantity < 5).length,
        });

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Garage Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/vehicles')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-500" /> Vehicles In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.vehiclesInProgress}</p>
            <p className="text-sm text-gray-500">Total in garage: {stats.vehiclesTotal}</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/inventory')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-6 h-6 text-green-500" /> Parts Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.partsTotal}</p>
            <p className="text-sm text-gray-500">Types of parts</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/inventory')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-red-500" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{stats.lowStockParts}</p>
            <p className="text-sm text-gray-500">Parts with &lt; 5 stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions or Lists could go here */}
    </div>
  );
};

export default DashboardPage;
