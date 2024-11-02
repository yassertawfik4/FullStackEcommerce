import { useContext, useEffect, useState } from "react";
import api from "../../Api/Api";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

function FavoriteItems() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch favorite items
  const GetFavoriteItems = async () => {
    const token = Cookies.get("authToken");

    if (!token) {
      console.log("User not authenticated");
      return;
    }

    try {
      const favoritesResponse = await api.get("/FavoriteItems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const favoriteItems = favoritesResponse.data;
      const fetchedProducts = [];

      for (const item of favoriteItems) {
        try {
          const productResponse = await api.get(`/Product/${item.productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchedProducts.push({
            ...productResponse.data,
            id: item.id, // Favorite ID
          });
        } catch (error) {
          console.log(
            `Error fetching product with ID: ${item.productId}`,
            error
          );
        }
      }
      setFavoriteProducts(fetchedProducts);
    } catch (error) {
      console.log("Error fetching favorite items:", error);
    }
  };

  // Add to cart function
  const addToCart = async (favoriteItemId) => {
    if (!isLoggedIn) {
      navigate("/loginPage");
      return;
    }

    const token = Cookies.get("authToken");
    const userId = Cookies.get("userId");
    if (!token) {
      console.log("User not authenticated");
      return;
    }

    try {
      // أولاً، احصل على تفاصيل العناصر المفضلة
      const favoritesResponse = await api.get("/FavoriteItems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const favoriteItems = favoritesResponse.data;
      const favoriteItem = favoriteItems.find(
        (item) => item.id === favoriteItemId
      );

      if (!favoriteItem) {
        console.log("Favorite item not found");
        return;
      }

      const productId = favoriteItem.productId; // احصل على productId من المفضل
      console.log(productId);
      // تحقق مما إذا كان المنتج موجودًا في عربة التسوق
      const cartResponse = await api.get("/CardItem", {
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
          userId: userId, // تأكد من أن userId معرف وصحيح
          productId: productId, // استخدم productId الذي تم الحصول عليه من المفضلة
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

  // Handle remove favorite item function
  const handleRemove = async (favoriteId) => {
    // Accept favorite ID as argument
    console.log("Deleting favorite item with ID:", favoriteId);
    const token = Cookies.get("authToken");

    if (!token) {
      console.log("User not authenticated");
      return;
    }

    try {
      await api.delete(`/FavoriteItems/${favoriteId}`, {
        // Use favorite ID
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavoriteProducts((prev) =>
        prev.filter((item) => item.id !== favoriteId)
      );
      toast.success("Product deleted from favorite!", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error deleting product from favorites:", error);
      toast.error(" Error deleting product from favorites!", {
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

  // Centralized toast configuration

  useEffect(() => {
    GetFavoriteItems();
  }, []);

  return (
    <div className="py-14 min-h-screen">
      {" "}
      {/* ضبط ارتفاع الشاشة */}
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
        <h1 className="text-2xl font-bold mb-4">Welcome In Your Favorite</h1>
        <div className="overflow-x-auto">
          {favoriteProducts.length === 0 ? ( // تحقق من وجود المنتجات
            <p className="text-center text-gray-500">No products yet</p> // رسالة عند عدم وجود منتجات
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {favoriteProducts.map((data) => (
                  <tr key={data.id} className="border-t">
                    {/* Product Image */}
                    <td className="px-6 py-4">
                      <img
                        src={data.imageUrl}
                        alt={data.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <h3 className="font-semibold">{data.name}</h3>
                    </td>
                    {/* Product Price */}
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{data.price} USD</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{data.quantity}</p>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => addToCart(data.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(data.id)}
                        className="text-red-500 hover:underline ml-4"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoriteItems;
