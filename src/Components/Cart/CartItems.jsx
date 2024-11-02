import { useEffect, useState } from "react";
import api from "../../Api/Api";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

function CartItems() {
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const GetCartItems = async () => {
    const token = Cookies.get("authToken");
    if (!token) {
      console.log("User not authenticated");
      return;
    }

    try {
      const cartResponse = await api.get("/CardItem", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartItems = cartResponse.data;
      const fetchedProducts = [];

      for (const item of cartItems) {
        try {
          const productResponse = await api.get(`/Product/${item.productId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchedProducts.push({
            ...productResponse.data,
            quantity: item.quantity,
            id: item.id,
          });
        } catch (error) {
          console.log(
            `Error fetching product with ID: ${item.productId}`,
            error
          );
        }
      }
      setCartProducts(fetchedProducts);
      const initialTotal = fetchedProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      setTotalPrice(initialTotal.toFixed(2));
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedProducts = cartProducts.map((product) =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    );

    setCartProducts(updatedProducts);

    const updatedTotal = updatedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    setTotalPrice(updatedTotal.toFixed(2));
  };
  const handleRemove = async (id) => {
    const token = Cookies.get("authToken");

    if (!token) {
      console.log("User not authenticated");
      return;
    }
    try {
      await api.delete(`/CardItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartProducts((prev) => {
        const updatedProducts = prev.filter((item) => item.id !== id);

        // احسب السعر الإجمالي بعد التحديث
        const updatedTotal = updatedProducts.reduce((acc, product) => {
          return acc + product.price * product.quantity;
        }, 0);

        setTotalPrice(updatedTotal.toFixed(2)); // تحديث السعر الإجمالي
        return updatedProducts; // ارجع القائمة المحدثة
      });
      toast.success("Product deleted from Cart!", {
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
      console.log("Error deleting product from Cart:", error);
      toast.error("Failed to delete product. Please try again.", {
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
    GetCartItems();
  }, []);

  return (
    <div className="py-14 min-h-screen">
      {" "}
      {/* لضبط ارتفاع الشاشة */}
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
        <h1 className="text-2xl font-bold mb-4">Welcome to your Cart</h1>
        <div className="overflow-x-auto">
          {cartProducts.length === 0 ? ( // تحقق إذا كانت السلة فارغة
            <p className="text-center text-gray-500">No products yet</p> // عرض رسالة في حالة عدم وجود منتجات
          ) : (
            <>
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
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((data) => (
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
                      {/* Quantity Input with Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                            onClick={() =>
                              updateQuantity(
                                data.id,
                                data.quantity > 1 ? data.quantity - 1 : 1
                              )
                            }
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <input
                            type="number"
                            id="Quantity"
                            value={data.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                data.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                            onClick={() =>
                              updateQuantity(data.id, data.quantity + 1)
                            }
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      {/* Total Price */}
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {(data.price * data.quantity).toFixed(2)} USD
                        </p>
                      </td>
                      <td className="px-6 py-4">
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
              {/* Total Price Section */}
              <div className="mt-4 text-right">
                <h2 className="text-lg font-bold">Total: {totalPrice} USD</h2>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartItems;
