import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteButton from "../components/SiteButton";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { toast } from "react-toastify";
import ProjectTitle from "@/components/ProjectTitle";

const RegisterPage = () => {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    rePassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [matchedUser, setMatchedUser] = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { fetchData, addData, deleteData } = useData();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await fetchData({ path: "users" });
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, rePassword } = userForm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const existing = users.find((u) => u.email === email);

    if (existing) {
      if (existing.secretpass) {
        setMatchedUser(existing);
        setShowSecretModal(true);
        setLoading(false);
      } else {
        setError("This email is already in use.");
        setLoading(false);
      }
      return;
    }

    await proceedToRegister();
  };

  const proceedToRegister = async () => {
    const { email, password } = userForm;
    try {
      const { user } = await register(email, password);
      const newUser = {
        ...matchedUser,
        email,
        uid: user.uid,
      };
      delete newUser.secretpass;

      await addData("users", newUser, user.uid);
      if (matchedUser?.id) {
        await deleteData("users", matchedUser.id);
      }

      toast.success("Account created successfully!");
      navigate("/create-profile");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecretSubmit = () => {
    if (secretInput.trim() === matchedUser.secretpass) {
      setShowSecretModal(false);
      proceedToRegister();
    } else {
      toast.error("Invalid secret key. Please contact admin or use a different email.");
      setUserForm({ email: "", password: "", rePassword: "" });
      setSecretInput("");
      setShowSecretModal(false);
    }
  };

  return (
    <section className="bg-slate-200 dark:bg-gray-900 min-h-screen min-w-screen max-w-screen max-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <ProjectTitle/>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="w-full sm:max-w-md p-6 bg-slate-50 dark:bg-slate-900 rounded shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={userForm.email} onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white" required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" name="password" value={userForm.password} onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white" required />
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" name="rePassword" value={userForm.rePassword} onChange={handleChange}
                className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white" required />
            </div>

            <SiteButton text="Sign Up" loading={loading} loadText="Registering..." />
            <p className="text-sm">
              Already have an account? <Link to="/login" className="text-yellow-600">Login here</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Enter Secret Key</h2>
            <input
              type="text"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              placeholder="Secret key"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSecretModal(false)} className="px-4 py-2 bg-gray-400 rounded text-white">
                Cancel
              </button>
              <button onClick={handleSecretSubmit} className="px-4 py-2 bg-yellow-600 rounded text-white">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RegisterPage;
