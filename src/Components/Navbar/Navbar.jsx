import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/Api";
import { AuthContext } from "../Context/AuthProvider";

function Navbar() {
  // State to manage the mobile menu visibility
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/Account/logout");
      logout();
      navigate("/loginPage");
      // Cookies.remove("authToken"); // إزالة ملف تعريف الارتباط عند تسجيل الخروج
      // setIsLoggedIn(false); // تحديث الحالة إلى غير مسجل دخول
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 shadow-sm">
      <nav className="relative bg-white dark:bg-gray-900">
        <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
          <div className="flex items-center justify-between">
            <Link to={"/"}>
              <img
                className="w-auto h-6 sm:h-7"
                src="https://merakiui.com/images/full-logo.svg"
                alt="Logo"
              />
            </Link>

            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                aria-label="toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent md:mt-0 md:p-0 md:top-0 md:relative md:w-auto md:opacity-100 md:translate-x-0 ${
              isOpen ? "block" : "hidden md:flex"
            }`}
          >
            <div className="flex flex-col md:flex-row md:mx-6">
              <Link
                className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                to={"/"}
              >
                Home
              </Link>
              <Link
                className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                to={"/Shop"}
              >
                Shop
              </Link>
              <Link
                className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                to={"/Favorite"}
              >
                <i className="fa-regular fa-heart"></i>
              </Link>
              <Link
                className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                to={"/Cart"}
              >
                <i className="fa-solid fa-shop"></i>
              </Link>
              {isLoggedIn ? (
                <button
                  className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <Link
                    className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                    to={"/loginPage"}
                  >
                    Login
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    className="my-2 font-bold text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0"
                    to={"/register"}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
