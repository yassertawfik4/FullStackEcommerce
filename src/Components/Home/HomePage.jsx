// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "react-toastify/dist/ReactToastify.css";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import image from "../../assets/watch.svg";
import image2 from "../../assets/image33.svg";
import image3 from "../../assets/Group 16.svg";
// Import required modules
import { Pagination, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import api from "../../Api/Api";
import "./HomePage.css";
import HomeProduct from "../homeProduct/HomeProduct";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
function HomePage() {
  const [dataProduct, setDataProduct] = useState([]);

  const getCatogry = async () => {
    try {
      const response = await api.get("/Category");
      setDataProduct(response.data);
    } catch (erorr) {
      console.log(erorr);
    }
  };
  useEffect(() => {
    getCatogry();
  }, []);

  return (
    <>
      <div>
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
          <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper mt-14"
          >
            {/* Add your slides here */}
            <SwiperSlide className="flex justify-between relative px-16 bg-[#212844] h-[316px] w-[80%] rounded-lg">
              <div className="mt-16 text-white">
                <h3 className="text-2xl pb-4">
                  Best Deal Online On Smart Watches
                </h3>
                <h1 className="text-5xl font-bold pb-4">SMART WEARABLE.</h1>
                <p className="text-xl">UP to 80% OFF</p>
              </div>
              <div className="relative">
                <img className="w-[250px] relative z-30" src={image} alt="" />
              </div>
              <img
                className="absolute z-20 top-0 h-full right-0"
                src={image3}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide className="flex justify-between px-16 relative bg-[#212844] h-[316px] w-[80%] rounded-lg">
              <div className="mt-16 text-white">
                <h3 className="text-2xl pb-4">
                  Best Deal Online On Smart Watches
                </h3>
                <h1 className="text-5xl font-bold pb-4">SAMSUNG PHONES.</h1>
                <p className="text-xl">UP to 80% OFF</p>
              </div>
              <img className="w-[250px] relative z-30" src={image2} alt="" />
              <img
                className="absolute z-20 top-0 h-full right-0"
                src={image3}
                alt=""
              />
            </SwiperSlide>
          </Swiper>
          <div className="my-16 ">
            <h3 className="font-bold my-10 relative after:block after:w-[20%] after:h-[3px] after:bg-[#008ECC] after:absolute after:bottom-[-10px] after:left-0">
              Shop From <span className="text-[#008ECC]">Top Category</span>
            </h3>
          </div>
          <div className="my-20 flex justify-center  md:justify-start gap-16 items-center flex-wrap">
            {dataProduct.map((data) => (
              <div key={data.id} className="text-center relative ">
                <div className="bg-[#F5F5F5] relative flex justify-center items-center p-5 w-[124px] h-[124px] rounded-[50%] border-2 transition-all duration-200 hover:border-[#008ECC]">
                  <Link to={`/Categorydetails/${data.id}`}>
                    {" "}
                    <img className="" src={data.image} alt={data.name} />
                  </Link>
                </div>
                <Link
                  to={`/Categorydetails/${data.id}`}
                  className="font-bold my-2"
                >
                  {data.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomeProduct />
    </>
  );
}

export default HomePage;
