import { useState } from "react";
import api from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? Number(value) : value,
    });
  };

  const validatePassword = (password) => {
    // Regular expression for password validation
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    setSuccess(null); // Reset success state
    setLoading(true); // Set loading state

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false); // Reset loading state
      return;
    }

    // Check password complexity
    if (!validatePassword(formData.password)) {
      setError(
        "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and symbols."
      );
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const response = await api.post("/Account/register", formData);
      console.log(response.data);
      setSuccess("Registration successful!");
      setFormData({
        firstName: "",
        lastName: "",
        age: 0,
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Registration successful!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/loginPage");
    } catch (error) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-14">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error message */}
          {success && <p className="text-green-500">{success}</p>}{" "}
          {/* Display success message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="age" className="block mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border rounded px-3 py-2 w-full"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
