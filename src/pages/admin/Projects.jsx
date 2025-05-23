import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import useTableData from "@/hooks/useTableData";
import TableComponent from "./components/TableComponent";
import { toast } from "react-toastify";
import ProjectModal from "./components/ProjectModal";

const Projects = () => {
  const { userProfile, deleteData, updateData, fetchSingleDoc } = useData();
  const [selectedProject, setSelectedProject] = useState(null);

  const [supervisorNames, setSupervisorNames] = useState({});
  const [studentNames, setStudentNames] = useState({}); // For storing student ID -> name mappings

  const { formattedData: projects, loading } = useTableData({
    path: "projects",
    sort: { field: "title", direction: "desc" },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const supervisorMap = {};
      const studentMap = {};

      // Get unique IDs
      const uniqueSupervisorIds = [...new Set(projects.map((p) => p.supervisorId))];
      const uniqueStudentIds = [...new Set(projects.map((p) => p.studentId))];

      // Fetch supervisor names if not already fetched
      await Promise.all(
        uniqueSupervisorIds.map(async (uid) => {
          if (uid && !supervisorNames[uid]) {
            const supervisor = await fetchSingleDoc("users", uid);
            if (supervisor) supervisorMap[uid] = supervisor.name;
          }
        })
      );

      // Fetch student names if not already fetched
      await Promise.all(
        uniqueStudentIds.map(async (uid) => {
          if (uid && !studentNames[uid]) {
            const student = await fetchSingleDoc("users", uid);
            if (student) studentMap[uid] = student.name;
          }
        })
      );

      // Update both mappings
      setSupervisorNames((prev) => ({ ...prev, ...supervisorMap }));
      setStudentNames((prev) => ({ ...prev, ...studentMap }));
    };

    if (projects.length > 0) fetchUsers();
  }, [projects]);

  const filterOut = [
    "documentUrl",
    "published",
    "acceptance",
    "abstract",
    "keywords",
    "description",
    "createdAt",
    "id",
    "github",
    "photoUrl",
    "reviewedBy",
    "reviewedAt",
    "averageRating",
    "feedback",
  ];

  const transform = {
    status: (value) => <span className={`p-1 rounded px-2 ${value==="on review" ? "bg-yellow-500/60" : value==="draft"? "bg-gray-500/60" : value==="rejected"? "bg-red-500/60" : "bg-green-500/60"}`}>{value}</span>,
    reviews: (value) => <span className="text-sm p-1 px-2 bg-gray-300 dark:bg-gray-700 rounded-sm">{`${value?.length || 0} reviews`}</span>,
    supervisorId: (value) => supervisorNames[value] || value,
    studentId: (value) => studentNames[value] || value, // Convert student ID to student name
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteData("projects", id);
        toast.success("Project deleted");
      } catch (err) {
        toast.error("Error deleting project");
      }
    }
  };

  const handleReviewSubmit = async (projectId, review) => {
    try {
      const updatedReviews = [...(selectedProject.reviews || []), review];
      const avgRating =
        updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
        updatedReviews.length;

      await updateData("projects", projectId, {
        reviews: updatedReviews,
        status: "on review",
        averageRating: avgRating,
      });

      toast.success("Review submitted");
      setSelectedProject(null);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleApproval = async (projectId, status) => {
    try {
      await updateData("projects", projectId, { status });
      toast.success(`Project ${status}`);
      setSelectedProject(null);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const headerLabels = {
    "supervisorId": "Supervisor",
    "studentId": "Student"
  };

  const renderActions = (project) => {
    const isStudent = userProfile?.role === "student";
    const isAdmin = userProfile?.role === "admin";
    const isStaff = userProfile?.role === "staff";
    const isSupervisor = project.supervisorId === userProfile?.uid;

    return (
      <div className="space-x-4 flex flex-row">
        <button
          className="text-blue-500 underline"
          onClick={() => setSelectedProject(project)}
        >
          <span>
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
              <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </span>
        </button>
        {isAdmin && (
          <button
            className="text-red-500 underline"
            onClick={() => handleDelete(project.id)}
          >
            <span>
              <svg className="w-6 h-6 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {projects.length > 0 && (
        <TableComponent
          ItemData={projects}
          headers={Object.keys(projects[0])}
          title="Projects"
          isLoading={loading}
          excludeFields={filterOut}
          transformFields={transform}
          customActions={renderActions}
          headerLabels={headerLabels}
        />
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          userProfile={userProfile}
          onClose={() => setSelectedProject(null)}
          onSubmitReview={handleReviewSubmit}
          onApproveReject={handleApproval}
          fetchSingleDoc={fetchSingleDoc}
        />
      )}
    </>
  );
};

export default Projects;
