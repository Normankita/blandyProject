import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const { fetchData, data, loading, error } = useData();
  const currentFilter = { field: "role", op: "==", value: "admin" };
  const [filters] = useState([currentFilter]);
  const [sort] = useState(null);

  useEffect(() => {
    fetchData({ path: "users" });
  }, [filters, sort]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  const adminCount = data.filter((u) => u.role === "admin").length;
  const latestAdmins = data
    .filter((u) => u.role === "admin")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Total Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{adminCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Latest Admin Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestAdmins.map((admin) => (
            <Card key={admin.id}>
              <CardHeader>
                <CardTitle className="text-lg">{admin.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
                <div className="mt-2">
                  <Badge variant="outline">{admin.role}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
