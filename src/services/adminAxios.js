import axios from "axios";
import jwtDecode from "jwt-decode";
import { getBaseUrl } from "utils/utils";

export const adminAxios = axios.create();

const uninterceptedAxios = axios.create();

adminAxios.interceptors.request.use(async (req) => {
  let token = localStorage.getItem("adminAuthToken");
  if (!token) return req;

  const decodedObj = jwtDecode(token);
  if (!decodedObj) return req;

  if (decodedObj.exp * 1000 <= Date.now()) {
    console.log("Outdated Token");
    //needs refresh
    let baseUrl = getBaseUrl();
    try {
      let response = await uninterceptedAxios.get(`${baseUrl}/admin/refresh`, {
        headers: {
          refreshToken: localStorage.getItem("adminRefreshToken"),
        },
      });
      console.log(response);
      localStorage.setItem("adminAuthToken", response.data.authToken);
      req.headers["Authorization"] = `Bearer ${response.data.authToken}`;
    } catch (e) {
      console.log(e);
      return req;
    }
  } else {
    req.headers["Authorization"] = `Bearer ${token}`;
  }
  return req;
});
