import axios from "axios";
// import Cookies from "js-cookie"; // استيراد مكتبة الكوكيز

var api = axios.create({
  baseURL: "https://localhost:7272/api",

});

// إعداد الـ Interceptor لإضافة التوكن في الـ headers
// api.interceptors.request.use(
//   (config) => {
//     // استخدام الكوكيز لاسترداد التوكن
//     const token = Cookies.get("authToken"); // استرداد التوكن من الكوكيز
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;
