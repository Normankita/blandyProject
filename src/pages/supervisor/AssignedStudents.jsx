import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";

const AssignedStudents = () => {
  const { userProfile, fetchData, updateData } = useData();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (userProfile) loadStudents();
  }, [userProfile]);

  const loadStudents = async () => {
    try {
      const { data } = await fetchData({
        path: "users",
        filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
      });
      setStudents(data);
    } catch (err) {
      toast.error("Failed to fetch students");
    }
  };

  const loadProjectsForStudent = async (studentId) => {
    try {
      const { data } = await fetchData({
        path: "projects",
        filters: [
          { field: "studentId", op: "==", value: studentId },
        ],
      });
      setProjects(data);
    } catch (err) {
      toast.error("Failed to load student projects");
    }
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setProjects([]);
    await loadProjectsForStudent(student.id);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleFeedback = async (newStatus) => {
    try {
      await updateData("projects", selectedProject.id, {
        feedback: selectedProject.feedback || "",
        status: newStatus,
        reviewedAt: Timestamp.now(),
        reviewedBy: userProfile.uid,
      });

      toast.success(`Project ${newStatus}`);
      setSelectedProject(null);
      loadProjectsForStudent(selectedStudent.id);
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Assigned Students</h2>

      {/* Student List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => handleStudentClick(student)}
            className={`cursor-pointer p-4 rounded shadow-lg ${
              selectedStudent?.id === student.id
                ? "bg-blue-100 dark:bg-blue-950/50 border-blue-500"
                : "bg-white dark:bg-slate-800"
            } hover:bg-blue-50 dark:hover:bg-blue-950 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border`}
          >
            <h3 className="text-lg font-semibold dark:text-gray-100">{student.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">{student.registrationNumber}</p>
            <p className="text-xs text-gray-400 dark:text-gray-300">{student.program}</p>
          </div>
        ))}
      </div>

      {/* Project List */}
      {selectedStudent && (
        <div>
          <h3 className="text-xl font-semibold mt-6 mb-2">
            Projects for {selectedStudent.name}
          </h3>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects submitted yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white dark:bg-gray-800 rounded p-4 cursor-pointer hover:ring duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border"
                >
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.abstract}</p>
                  <p className="text-xs text-gray-400">Status: {project.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-red-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <h4>Description</h4>``
                <div
                  dangerouslySetInnerHTML={{ __html: selectedProject.description }}
                />
              </div>

              {/* GitHub Link */}
              {selectedProject.github && (
                <p>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View GitHub Repository
                  </a>
                </p>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="block font-semibold mb-1">Supervisor Feedback:</label>
                <textarea
                  rows="4"
                  className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
                  value={selectedProject.feedback || ""}
                  onChange={(e) =>
                    setSelectedProject({
                      ...selectedProject,
                      feedback: e.target.value,
                    })
                  }
                />
              </div>

              {/* Approve/Reject */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => handleFeedback("approved")}
                  className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleFeedback("rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;
