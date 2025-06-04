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
  const [studentNames, setStudentNames] = useState({});
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const { formattedData: projects, loading } = useTableData({
    path: "projects",
    sort: { field: "title", direction: "desc" },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const supervisorMap = {};
      const studentMap = {};

      const uniqueSupervisorIds = [...new Set(projects.map((p) => p.supervisorId))];
      const uniqueStudentIds = [...new Set(projects.map((p) => p.studentId))];

      await Promise.all(
        uniqueSupervisorIds.map(async (uid) => {
          if (uid && !supervisorNames[uid]) {
            const supervisor = await fetchSingleDoc("users", uid);
            if (supervisor) supervisorMap[uid] = supervisor.name;
          }
        })
      );

      await Promise.all(
        uniqueStudentIds.map(async (uid) => {
          if (uid && !studentNames[uid]) {
            const student = await fetchSingleDoc("users", uid);
            if (student) studentMap[uid] = student.name;
          }
        })
      );

      setSupervisorNames((prev) => ({ ...prev, ...supervisorMap }));
      setStudentNames((prev) => ({ ...prev, ...studentMap }));
    };

    if (projects.length > 0) fetchUsers();
  }, [projects]);

  const filteredProjects = projects?.filter((p) => p.status !== "draft");
  const eligibleProjects = filteredProjects.filter((p) => p.panelId === userProfile?.panelId);
  const otherProjects = filteredProjects.filter((p) => p.panelId !== userProfile?.panelId);

  const filterOut = [
    "documentUrl", "published", "acceptance", "abstract", "keywords", "description",
    "createdAt", "id", "github", "photoUrl", "reviewedBy", "reviewedAt", "updatedAt",
    "averageRating", "feedback",'panelId',
  ];

  const transform = {
    status: (value) => (
      <span className={`p-1 rounded px-2 uppercase text-sm font-semibold shadow-slate-900/10 dark:shadow-black/40 ${value === "on review" ? "bg-yellow-500/60" :
        value === "draft" ? "bg-gray-500/60" :
          value === "rejected" ? "bg-red-500/60" :
            value === "published" ? "bg-yellow-800/60" :
              value === "accepted" ? "bg-green-500/60" : "bg-blue-500/60"
        }`}>
        {value ?? "Unknown"}
      </span>
    ),
    reviews: (value) => (
      <span className="text-sm p-1 px-2 bg-gray-300 dark:bg-gray-700 rounded-sm">
        {`${value?.length || 0} reviews`}
      </span>
    ),
    supervisorId: (value) => supervisorNames[value] || value,
    studentId: (value) => studentNames[value] || value,
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

/**
 * Submits a review for a project, ensuring the user hasn't already reviewed it.
 * If the review is successful, updates the project's review data and resets the form state.
 * 
 * @param {string} projectId - The ID of the project being reviewed.
 * @param {Object} review - The review object containing details like rating and comments.
 * @throws Will display an error toast if the review submission fails.
 */

  const handleReviewSubmit = async (projectId, review) => {
    const existing = selectedProject.reviews?.find(r => r.reviewerId === userProfile.uid);
    if (existing) {
      toast.warn("You have already reviewed this project.");
      return;
    }

    try {
      const updatedReviews = [...(selectedProject.reviews || []), review];
      const avgRating =
        updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

      await updateData("projects", projectId, {
        reviews: updatedReviews,
        reviewedBy: [...(selectedProject.reviewedBy || []), userProfile.uid],
        status: "on review",
        averageRating: avgRating,
      });

      toast.success("Review submitted");
      setSelectedProject(null);
      setRating(1);
      setComment("");
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
    supervisorId: "Supervisor",
    studentId: "Student",
  };

  const isAdmin = userProfile?.role === "admin";

  const renderActions = (project) => {
    return (
      <div className="space-x-4 flex flex-row">

        <button
          className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-blue-700 dark:hover:border-blue-600 dark:border-blue-600 hover:bg-blue-100 border-blue-300 focus:ring-blue-100"
          onClick={() => setSelectedProject(project)}
        >
          <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          View
        </button>
        {isAdmin && (
          <button
            className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100"
            onClick={() => handleDelete(project.id)}
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

  const canReview =
    selectedProject &&
    userProfile?.role === "staff" &&
    selectedProject.panelId === userProfile.panelId;

  const hasReviewed =
    selectedProject?.reviews?.some((r) => r.reviewerId === userProfile?.uid);

  return (
    <>
      <div className="space-y-10">
        {eligibleProjects.length > 0 ? (!isAdmin &&
          <TableComponent
            ItemData={eligibleProjects}
            headers={Object.keys(eligibleProjects[0])}
            title="Eligible Projects"
            isLoading={loading}
            excludeFields={filterOut}
            transformFields={transform}
            customActions={renderActions}
            headerLabels={headerLabels}
          />
        ) : isAdmin ? (
          <TableComponent
            ItemData={projects ?? []}
            headers={Object.keys(projects[0]??{})}
            title="All Projects"
            isLoading={loading}
            excludeFields={filterOut}
            transformFields={transform}
            customActions={renderActions}
            headerLabels={headerLabels}
          />
        ) : (
          <div className="text-center text-gray-500">No eligible projects found.</div>
        )}

        {otherProjects.length > 0 ? (!isAdmin &&
          <TableComponent
            ItemData={otherProjects}
            headers={projects.length > 0 ? Object.keys(projects[0]) : []}
            title="Other Projects"
            isLoading={loading}
            excludeFields={filterOut}
            transformFields={transform}
            customActions={() => null}
            headerLabels={headerLabels}
          />
        ) : (
          <div className="text-center text-gray-500">No other projects to view.</div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          title={selectedProject.title}
          onClose={() => setSelectedProject(null)}
        >
          <div className="prose dark:prose-invert max-w-none">
            <h4>Description</h4>
            <div dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
          </div>

          {selectedProject.documentUrl && (
            <a href={selectedProject.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-4 flex items-center gap-2 mt-2">
              <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
              </svg>
              Document
            </a>
          )}

          {selectedProject.supervisorId === userProfile.uid && (
            <>
              {selectedProject.reviews?.length >= 3 && (
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleApproval(selectedProject.id, "accepted")}
                    className={`text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center ${selectedProject.averageRating >= 40
                      ? "dark:focus:ring-green-700 dark:hover:border-green-600 dark:border-green-600 hover:bg-green-100 border-green-300 focus:ring-green-100"
                      : "dark:focus:ring-gray-700 dark:hover:border-gray-600 dark:border-gray-600 hover:bg-gray-100 border-gray-300 focus:ring-gray-100"
                      }`}
                    disabled={selectedProject.averageRating < 40}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(selectedProject.id, "rejected")}
                    className="text-gray-900 bg-white border  focus:outline-none focus:ring-4 font-bold rounded-full text-sm px-4 py-1.5 me-2 dark:bg-slate-900 dark:text-white  dark:hover:bg-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-black/40 flex flex-row gap-1 items-center dark:focus:ring-red-700 dark:hover:border-red-600 dark:border-red-600 hover:bg-red-100 border-red-300 focus:ring-red-100"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selectedProject.reviews?.length < 3 && (
                <p className="text-sm text-yellow-600 mt-2">
                  Waiting for all 3 supervisors to submit their reviews.
                </p>
              )}
            </>
          )
          }

          <>
            {canReview && !hasReviewed && (
              <>
                <h4 className="font-semibold mt-4">Submit Your Review</h4>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border p-2 rounded"
                />
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment"
                  className="w-full border p-2 rounded mt-2"
                />
                <button
                  onClick={() =>
                    handleReviewSubmit(selectedProject.id, {
                      reviewerId: userProfile.uid,
                      reviewerName: userProfile.name,
                      rating,
                      comment,
                      reviewedAt: new Date().toISOString(),
                    })
                  }
                  className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </>
            )}
            {canReview && hasReviewed && (
              <p className="text-green-600 mt-4">You have already submitted your review.</p>
            )}
          </>
        </ProjectModal>
      )}
    </>
  );
};

export default Projects;
