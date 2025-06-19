import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import { Timestamp } from "firebase/firestore";
import ProjectModal from "../admin/components/ProjectModal"; // import your dialog-based ProjectModal

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
        fetchData({ 
          path: "projects" ,
          filters: [{ field: "supervisorId", op: "==", value: userProfile.uid }],
        }),
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
        acceptance: newStatus === "published",
      });

      toast.success(`Project ${newStatus}`);
      setSelectedProject(null);
      const refreshedProjects = await fetchData({ path: "projects" });
      setProjects(refreshedProjects.data);
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  const filteredProjects = selectedStudent
    ? projects.filter((p) => p.studentId === selectedStudent.uid)
    : [];
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Assigned Students</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.uid}
            onClick={() => handleStudentClick(student)}
            className={`cursor-pointer p-4 rounded shadow-lg ${selectedStudent?.uid === student.uid
              ? "bg-yellow-100 dark:bg-yellow-950/50 border-yellow-500"
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
            <span>
              {projects.filter((p) => p.studentId === student.uid && p.status !== "draft").length}/
              {projects.filter((p) => p.studentId === student.uid).length}
            </span>
          </div>
        ))}
      </div>

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
                  className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
                >
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-gray-500">{project.abstract}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    Status:
                    <span className="font-semibold p-1 rounded-sm m-2 bg-gray-300 dark:bg-gray-700">
                      {project.status}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          title={selectedProject.title}
          onClose={() => setSelectedProject(null)}
        >
          <div className="prose dark:prose-invert max-w-none">
            <h4>Description</h4>
            <div
              dangerouslySetInnerHTML={{ __html: selectedProject.description }}
            />
          </div>

          {selectedProject.github && (
            <p>
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noreferrer"
                className="text-yellow-950 underline flex items-center"
              >
                <svg class="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
                </svg>

                GitHub Repo
              </a>
            </p>
          )}

          {selectedProject.documentUrl && (
            <a
              href={selectedProject.documentUrl}
              className="text-yellow-500 underline ml-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex">
                <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
                </svg>
                Document
              </span>
            </a>
          )}

          <div>
            <label className="block font-semibold mb-1">Supervisor Feedback:</label>
            <textarea
              rows="4"
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
              value={selectedProject.feedback || ""}
              onChange={selectedProject.status !== "draft" ? null : (e) =>
                setSelectedProject({
                  ...selectedProject,
                  feedback: e.target.value,
                })
              }
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button
              onClick={() => handleFeedback("published")}
              className={`${selectedProject.status !== "draft"
                ? "bg-gray-500 cursor-not-allowed"
                : "cursor-pointer bg-green-500"
                } text-white px-4 py-2 rounded duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border`}
              disabled={selectedProject.status !== "draft"}
            >
              Publish
            </button>
            <button
              onClick={() => handleFeedback("rejected")}
              className={`${selectedProject.status !== "draft"
                ? "bg-gray-500 cursor-not-allowed"
                : "cursor-pointer bg-red-500"
                } text-white px-4 py-2 rounded duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40 border`}
              disabled={selectedProject.status !== "draft"}
            >
              Reject
            </button>
          </div>
        </ProjectModal>
      )}
    </div>
  );
};

export default AssignedStudents;