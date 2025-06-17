import { useData } from "../../contexts/DataContext";
import { useEffect, useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import ActivityItem from "../../components/dashboard/ActivityItem";

const StaffDashboardPage = () => {
  const { userProfile, fetchData } = useData();
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [mous, setMous] = useState([]);

  useEffect(() => {
    if (!userProfile) return;
    fetchAllData();
  }, [userProfile]);

  const fetchAllData = async () => {
    const [studentData, projectData, mouData] = await Promise.all([
      fetchData({
        path: "users",
        filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
      }),
      fetchData({
        path: "projects",
        filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
        sort: { field: "createdAt", direction: "desc" },
      }),
      fetchData({
        path: "mous",
        filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
      }),
    ]);
    setStudents(studentData.data);
    setProjects(projectData.data);
    setMous(mouData.data);
  };

  return (
    <div className="p-6 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {userProfile?.name || "Supervisor"}
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Assigned Students" count={students.length} />
        <StatCard label="Submitted Projects" count={projects.length} />
        <StatCard label="MOUs" count={mous.length} />
      </div>

      {/* Recent Activities */}
      <h2 className="text-xl font-semibold mb-2">Recent Project Submissions</h2>
      <div className="space-y-2">
        {projects.length === 0 ? (
          <p>No recent projects submitted.</p>
        ) : (
          projects.map((project) => (
            <>
            
            <ActivityItem
              key={project.id}
              title={project.title}
              studentName={students.find((student)=>student.uid===project.studentId)?.name}
              createdAt={project.createdAt}
              status={project.status}
            />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffDashboardPage;
