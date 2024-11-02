import { useContext, useEffect, useState } from "react";
import api from "../../Api/Api";
import { AuthContext } from "../Context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeProduct() {
  const [phones, setPhones] = useState([]);
  const [watches, setWatches] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const getDataCategories = async () => {
    try {
      const phoneResponse = await api.get(`/Product/category/name/phone`);
      const watchResponse = await api.get(`/Product/category/name/watch`);
      setPhones(phoneResponse.data);
      setWatches(watchResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId) => {
    if (!isLoggedIn) {
      navigate("/loginPage");
      return;
    }

    const token = Cookies.get("authToken");
    if (!token) {
      console.log("User not authenticated");
      return;
    }

    // احصل على userId من ملفات تعريف الارتباط أو من الحالة
    const userId = Cookies.get("userId"); // تأكد من أن لديك userId هنا

    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    try {
      // احصل على العناصر في عربة التسوق
      const cartResponse = await api.get(`/CardItem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // تحقق مما إذا كان المنتج موجودًا بالفعل في عربة التسوق
      const existingProduct = cartResponse.data.find(
        (item) => item.productId === productId
      );

      if (existingProduct) {
        // إذا كان المنتج موجودًا، قم بتحديث الكمية
        const updatedData = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        await api.put(`/CardItem/${existingProduct.id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.info("The product is already in the cart!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // إذا لم يكن المنتج موجودًا، أضفه إلى عربة التسوق
        const dataToSend = {
          userId: userId, // استخدم userId الذي تم الحصول عليه
          productId: productId,
          quantity: 1,
        };
        await api.post("/CardItem", dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Product added to cart!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const addToFavorites = async (productId) => {
    if (!isLoggedIn) {
      navigate("/loginPage");
      return;
    }

    const token = Cookies.get("authToken");
    if (!token) {
      console.log("User not authenticated");
      return;
    }

    // احصل على userId من ملفات تعريف الارتباط أو من الحالة
    const userId = Cookies.get("userId"); // تأكد من أن لديك userId هنا

    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    try {
      // استرجاع قائمة المفضلات الحالية
      const favoritesResponse = await api.get("/FavoriteItems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingFavorite = favoritesResponse.data.find(
        (item) => item.productId === productId
      );

      if (existingFavorite) {
        // إذا كان المنتج موجودًا بالفعل في المفضلات، زود الكمية
        const updatedData = {
          ...existingFavorite,
          quantity: existingFavorite.quantity + 1, // زيادة الكمية
        };

        await api.put(`/FavoriteItems/${existingFavorite.id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.info("The product quantity updated in favorites!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // إذا لم يكن موجودًا، أضف المنتج كمفضل جديد
        const dataToSend = {
          userId: userId, // استخدم userId الذي تم الحصول عليه
          productId: productId,
          quantity: 1,
        };

        await api.post("/FavoriteItems", dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Product added to favorites!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error adding product to favorites:", error);
      toast.error("Failed to add product to favorites. Please try again.", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getDataCategories();
  }, []);

  return (
    <div className="mt-24">
      <div className="container mx-auto">
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

        {/* قسم الهواتف */}
        <div className="flex justify-between items-center relative">
          <h3 className="font-bold my-10 relative after:block after:w-full after:h-[3px] after:bg-[#008ECC] after:absolute after:bottom-[-10px] after:left-0">
            Phones
          </h3>
          <Link to={"/Shop"} className="font-bold text-sm">
            View All <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-8">
        {phones.length > 0 ? (
          phones.map((product) => (
            <div
              key={product.id}
              className="relative rounded-lg shadow-md group"
            >
              <div className="absolute top-2 left-2 bg-red-500 font-bold text-white text-sm px-2 py-1 rounded-lg z-10">
                25% Sale
              </div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg h-44"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => addToFavorites(product.id)}
                  className="bg-white p-2 rounded-full shadow-md"
                >
                  <i className="fa-regular fa-heart text-red-500"></i>
                </button>
              </div>
              <div className="mt-2">
                <div className="p-2">
                  <Link to={`/details/${product.id}`} className="font-bold">
                    {product.name}
                  </Link>
                  <p className="text-gray-600 my-2 font-medium">
                    <del>{product.price} USD</del>{" "}
                    {(product.price * 0.75).toFixed(2)} USD
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-[#008ECC] py-2 transition-all duration-150 rounded-md border-2 text-white border-[#008ECC] hover:bg-white hover:text-[#008ECC]"
                  >
                    <i className="fa-solid fa-cart-shopping text-md"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium">
            There is no data yet
          </div>
        )}
      </div>
      

        {/* قسم الساعات */}
        <div className="container mx-auto my-20">
          <div className="flex justify-between items-center relative">
            <h3 className="font-bold my-10 relative after:block after:w-full after:h-[3px] after:bg-[#008ECC] after:absolute after:bottom-[-10px] after:left-0">
              Watches
            </h3>
            <Link to={"/Shop"} className="font-bold text-sm">
              View All <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:grid-cols-4 lg:gap-8">
            {watches.map((product) => (
              <div
                key={product.id}
                className="relative rounded-lg shadow-md group"
              >
                <div className="absolute top-2 left-2 bg-red-500 font-bold text-white text-sm px-2 py-1 rounded-lg z-10">
                  25% Sale
                </div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full rounded-lg h-44"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => addToFavorites(product.id)}
                    className="bg-white p-2 rounded-full shadow-md"
                  >
                    <i className="fa-regular fa-heart text-red-500"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <div className="p-2">
                    <Link to={`/details/${product.id}`} className="font-bold">
                      {product.name}
                    </Link>
                    <p className="text-gray-600 my-2 font-medium">
                      <del>{product.price} USD</del>{" "}
                      {product.price * (25.0 / 100.0)} USD
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-full bg-[#008ECC] py-2 transition-all duration-150 rounded-md border-2 text-white border-[#008ECC] hover:bg-white hover:text-[#008ECC]"
                    >
                      <i className="fa-solid fa-cart-shopping text-md"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;