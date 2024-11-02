// import { useEffect, useState } from "react";
// import api from "./Api/Api";
import Navbar from "./Components/Navbar/Navbar";
import HomePage from "./Components/Home/HomePage";
import Footer from "./Components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./Components/Auth/LoginPage";
import CartItems from "./Components/Cart/CartItems";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteItems from "./Components/FavoriteItems/FavoriteItems";
import Register from "./Components/Auth/Register";
import Products from "./Components/Shop/Products";
import Detailes from "./Components/Detailes/Detailes";
import CategoryDetailes from "./Components/Detailes/CategoryDetailes";
function App() {
  // const [data, setData] = useState([]);

  // const getData = async () => {
  //   try {
  //     const response = await api.get("/Product/AllProduct");
  //     setData(response.data);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getData();
  // }, []);
  return (
    <>
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
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loginPage" element={<LoginPage />} />
        <Route path="/Cart" element={<CartItems />} />
        <Route path="/Favorite" element={<FavoriteItems />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Shop" element={<Products />} />
        <Route path="/details/:id" element={<Detailes />} />
        <Route path="/Categorydetails/:id" element={<CategoryDetailes />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
