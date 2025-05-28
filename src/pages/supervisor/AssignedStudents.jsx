import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";

const AssignedStudents = () => {
  const { userProfile, fetchData, updateData } = useData();
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (userProfile) {
      loadStudentsAndProjects();
    }
  }, [userProfile]);

  const loadStudentsAndProjects = async () => {
    try {
      const [studentsRes, projectsRes] = await Promise.all([
        fetchData({
          path: "users",
          filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
        }),
        fetchData({ path: "projects" }),
      ]);

      setStudents(studentsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
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
      // Refresh all project data after status change
      const refreshedProjects = await fetchData({ path: "projects" });
      setProjects(refreshedProjects.data);
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  const filteredProjects = selectedStudent
    ? projects.filter((p) => p.studentId === selectedStudent.id)
    : [];

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
                : "bg-slate-50 dark:bg-slate-800"
            }  hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40`}
          >
            <h3 className="text-lg font-semibold dark:text-gray-100">
              {student.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {student.registrationNumber}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-300">
              {student.program}
            </p>
            <span>{projects.filter((p) => p.studentId === student.id && p.status !== "draft").length}/{projects.filter((p) => p.studentId === student.id).length}</span>
          </div>
        ))}
      </div>

      {/* Project List */}
      {selectedStudent && (
        <div>
          <h3 className="text-xl font-semibold mt-6 mb-2">
            Projects for {selectedStudent.name}
          </h3>
          {filteredProjects.length === 0 ? (
            <p className="text-gray-500">No projects submitted yet.</p>
          ) : (
            <ul className="space-y-2">
              {filteredProjects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 "
                >
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.abstract}</p>
                  <p className="text-xs text-gray-400 mt-3">Status: <span className="font-semibold p-1 rounded-sm m-2 bg-gray-300 dark:bg-gray-700"> {project.status}</span></p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
      <div className="h-screen min-h-screen fixed z-50 w-full inset-0 backdrop-blur-xs bg-slate-50/20 dark:bg-slate-900/20 duration-300 shadow-3xl shadow-slate-900/40 dark:shadow-black/40">
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
                <h4>Description</h4>
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
              {selectedProject.documentUrl && (
                <a
                  href={selectedProject.documentUrl}
                  className="text-blue-500 underline ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex">
                    <svg
                      className="w-8 h-8"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
                      />
                    </svg>
                    <p>Download Document</p>
                  </span>
                </a>
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
                  onClick={() => handleFeedback("published")}
                  className={`${selectedProject.status!=="draft" ? "bg-gray-500 cursor-not-allowed" : "cursor-pointer bg-green-500"} text-white px-4 py-2 rounded  duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border`}
                  disabled={!selectedProject.status!=="draft"}

                >
                  Publish
                </button>
                <button
                  onClick={() => handleFeedback("rejected")}
                  className={`${selectedProject.status!=="draft" ? "bg-gray-500 cursor-not-allowed" : "cursor-pointer bg-red-500"} text-white px-4 py-2 rounded  duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border`}
                  disabled={!selectedProject.status!=="draft"}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      )}
    </div>
  );
};

export default AssignedStudents;
