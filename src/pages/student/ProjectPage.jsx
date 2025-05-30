import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import TipTapEditor from "../../components/TipTapEditor";

const ProjectPage = () => {
  const { userProfile, fetchData, addData, updateData, deleteData, uploadFile, deleteFile } = useData();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    abstract: "",
    github: "",
    status: "draft",
  });

  useEffect(() => {
    if (!userProfile) return;
    loadProjects();
  }, [userProfile]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await fetchData({
        path: "projects",
        filters: [{ field: "studentId", op: "==", value: userProfile.uid }],
        sort: { field: "createdAt", direction: "desc" },
      });
      setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
    if (project) {
      setForm({
        title: project.title,
        abstract: project.abstract,
        github: project.github || "",
        status: project.status || "draft",
      });
      setEditorContent(project.description || "");
    } else {
      setForm({ title: "", abstract: "", github: "", status: "draft" });
      setEditorContent("");
      setFile(null);
    }
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

const handleSave = async () => {
  setLoading(true);
  const storagePath = `StudentsProjectDocuments/${userProfile.uid}/${file?.name}`;
  let documentUrl = "";

  try {
    if (file) {
      if (currentProject?.documentUrl) {
        deleteFile(currentProject.documentUrl);
      }
      documentUrl = await uploadFile(file, storagePath);
    }

    if (!documentUrl && currentProject?.documentUrl) {
      documentUrl = currentProject.documentUrl;
    }

    const baseData = {
      ...form,
      description: editorContent,
      studentId: userProfile.uid,
      supervisorId: userProfile.supervisorId,
      panelId: userProfile.panelId || null, 
      documentUrl,
    };

    if (currentProject) {
      await updateData("projects", currentProject.id, {
        ...baseData,
        updatedAt: new Date(),
      });
      toast.success("Project updated");
    } else {
      await addData("projects", {
        ...baseData,
        createdAt: new Date(),
      });
      toast.success("Project submitted");
    }

    setLoading(false);
    setIsModalOpen(false);
    loadProjects();
  } catch (err) {
    setLoading(false);
    toast.error("Failed to save project");
    console.log("here", err);
  }
};


  const handleDelete = async (id) => {
    const documentToDelete = projects.find((p) => p.id === id);
    if (window.confirm("Delete this project?")) {
      if (documentToDelete.status !== "draft") {
        toast.error("Only draft projects can be deleted");
      }
      else {
        try {
          if (documentToDelete?.documentUrl) {
            deleteFile(documentToDelete.documentUrl);
          }
          await deleteData("projects", id);
          toast.success("Project deleted");
          loadProjects();
        } catch (err) {
          toast.error("Failed to delete project");
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {userProfile.supervisorId ? (
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => openModal()}>
          Submit New Project
        </button>
      ) : (
        <span>Please make sure you are assigned a supervisor</span>
      )}

      {loading ? (
        <Skeleton count={4} />
      ) : projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((p) => (
            <li key={p.id} className="border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="italic">{p.abstract}</p>
              <div className="prose prose-sm dark:prose-invert mt-2" dangerouslySetInnerHTML={{ __html: p.description }} />
              {p.github && (
                <a href={p.github} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                  GitHub Link
                </a>
              )}
              {p.documentUrl && (
                <a href={p.documentUrl} className="text-blue-500 underline ml-4" target="_blank" rel="noopener noreferrer">
                  <span className="flex">
                    <svg className="w-8 h-8 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" />
                    </svg>
                    <p>Download Document</p>
                  </span>
                </a>
              )}
              <div className="mt-2 flex space-x-2">
                <button className="mr-auto cursor-pointer" onClick={() => openModal(p)}>
                  <span>
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                    </svg>

                  </span>
                </button>
                <button className="ml-auto cursor-pointer" onClick={() => handleDelete(p.id)}>
                  <span>
                    <svg className={`w-6 h-6 ${p.status === "draft" ? "text-red-500 dark:text-red-600" : "text-gray-800 dark:text-gray-300"} `} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                    </svg>

                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects submitted yet.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-3xl space-y-4">
            <h2 className="text-xl font-bold">{currentProject ? "Edit Project" : "Submit New Project"}</h2>

            <input
              name="title"
              placeholder="Project Title"
              className="w-full p-2 border"
              value={form.title}
              onChange={handleChange}
            />
            <input
              name="abstract"
              placeholder="Abstract"
              className="w-full p-2 border"
              value={form.abstract}
              onChange={handleChange}
            />
            <input
              name="github"
              placeholder="GitHub URL (optional)"
              className="w-full p-2 border"
              value={form.github}
              onChange={handleChange}
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2 border"
            />

            <TipTapEditor content={editorContent} setContent={setEditorContent} />

            <div className="flex justify-between">
              <button className="mr-2 bg-red-500 p-2 rounded text-gray-50 shadow-2xl cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className={` p-2 rounded text-gray-50 shadow-2xl ${loading ? "cursor-not-allowed bg-zinc-300" : "bg-zinc-500 cursor-pointer"}`} onClick={handleSave}>{currentProject ? "Update" : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
