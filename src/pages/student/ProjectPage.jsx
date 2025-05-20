import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import TipTapEditor from "../../components/TipTapEditor";

const ProjectPage = () => {
  const { userProfile, fetchData, addData, updateData, deleteData } = useData();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(true);

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
      console.log(data);
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
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const payload = {
      ...form,
      description: editorContent,
      studentId: userProfile.uid,
      createdAt: new Date(),
    };

    try {
      if (currentProject) {
        await updateData("projects", currentProject.id, payload);
        toast.success("Project updated");
      } else {
        await addData("projects", payload);
        toast.success("Project submitted");
      }

      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await deleteData("projects", id);
        toast.success("Project deleted");
        loadProjects();
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => openModal()}
      >
        Submit New Project
      </button>

      {loading ? (
        <Skeleton count={4} />
      ) : projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="border p-4 rounded dark:bg-gray-800 bg-white"
            >
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="italic">{p.abstract}</p>
              <div
                className="prose prose-sm dark:prose-invert mt-2"
                dangerouslySetInnerHTML={{ __html: p.description }}
              />
              {p.github && (
                <a
                  href={p.github}
                  className="text-blue-500 underline"
                  target="_blank"
                >
                  GitHub Link
                </a>
              )}
              <div className="mt-2 flex space-x-2">
                <button onClick={() => openModal(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
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
            <h2 className="text-xl font-bold">
              {currentProject ? "Edit Project" : "Submit New Project"}
            </h2>

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
            <TipTapEditor content={editorContent} setContent={setEditorContent} />

            <div className="flex justify-between">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleSave}>
                {currentProject ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
