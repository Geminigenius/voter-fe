import axios from "axios";
import jwtDecode from "jwt-decode";
import { getBaseUrl } from "utils/utils";

export const voterAxios = axios.create();

const uninterceptedAxios = axios.create();

voterAxios.interceptors.request.use(async (req) => {
  let token = localStorage.getItem("authToken");
  if (!token) return req;

  const decodedObj = jwtDecode(token);
  if (!decodedObj) return req;

  if (decodedObj.exp * 1000 < Date.now()) {
    //needs refresh
    let baseUrl = getBaseUrl();
    try {
      let response = await uninterceptedAxios.get(`${baseUrl}/voter/refresh`, {
        headers: {
          refreshToken: localStorage.getItem("refreshToken"),
        },
      });
      localStorage.setItem("authToken", response.data.authToken);
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
