import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../Api/Api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { AuthContext } from "../Context/AuthProvider";

function Detailes() {
  const [productCategory, SetProductCategory] = useState(null);
  const params = useParams();
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const getCategoryProducts = async () => {
    try {
      const response = await api.get(`/Product/${params.id}`);
      SetProductCategory(response.data);
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

    const userId = Cookies.get("userId");

    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    try {
      const cartResponse = await api.get(`/CardItem`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const existingProduct = cartResponse.data.find(
        (item) => item.productId === productId
      );

      if (existingProduct) {
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
        const dataToSend = {
          userId: userId,
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

  useEffect(() => {
    getCategoryProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="p-8 rounded-2xl ">
        {productCategory ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {productCategory.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <img
                  src={productCategory.imageUrl}
                  alt={productCategory.name}
                  className="w-full h-80 object-contain rounded-xl transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-lg text-gray-600 mb-6">
                    {productCategory.description}
                  </p>
                  <p className="text-xl font-medium text-gray-800 mb-2">
                    Price:{" "}
                    <span className="text-[#008ECC]">
                      ${productCategory.price}
                    </span>
                  </p>
                  <p className="text-xl font-medium text-gray-800 mb-2">
                    Quantity:{" "}
                    <span className="text-[#008ECC]">
                      {productCategory.quantity}
                    </span>
                  </p>
                  <p className="text-xl font-medium text-gray-800 mb-2">
                    Stock:{" "}
                    <span className="text-[#008ECC]">
                      {productCategory.stock}
                    </span>
                  </p>
                  <p className="text-xl font-medium text-gray-800 mb-2">
                    Category Name:{" "}
                    <span className="text-[#008ECC]">
                      {productCategory.categoryName}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => addToCart(productCategory.id)}
                  className="mt-8 bg-[#008ECC] text-white py-3 px-6 rounded-md border-2 border-[#008ECC] font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-[#008ECC]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center">
            Loading product details...
          </p>
        )}
      </div>
    </div>
  );
}

export default Detailes;
