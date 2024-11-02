import { useContext, useState } from "react";
import api from "../../Api/Api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function LoginPage() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const loginData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/Account/login", { userName, password });
      const { token, expiration, userId } = response.data;
      console.log(response.data);
      login(userId, token, expiration);
      toast.success("You have successfully logged in.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
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
       
        <form onSubmit={loginData}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              UserName
            </label>
            <input
              type="text"
              id="username"
              aria-label="UserName"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="UserName"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              aria-label="Password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-blue-500 hover:underline">
              Create An Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
