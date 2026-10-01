import axios from "axios";
import { toast } from "react-toastify";
import { getCurrentFinancialYearSession } from "./utils/financialYear";
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => {
  return uuidv4();
};
const generateTriggerUidHeader = () => {
  const uid = generateUniqueId().replaceAll("-", "");
  const timestamp = formatTimestamp();
  return `${uid}:${timestamp}`;
};

const formatTimestamp = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(now.getFullYear()).slice(-4); // Last 2 digits of the year
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};

const link = process.env.REACT_APP_API_BASE_URL;
const socketLink = process.env.REACT_APP_SOCKET_BASE_URL;

const imsAxios = axios.create({
  baseURL: link,
  headers: {
    "Authorization": JSON.parse(localStorage.getItem("loggedInUserVendor"))
      ?.token,
  },
});

imsAxios.interceptors.request.use((config) => {
  config.headers["x-trigger-uid"] = generateTriggerUidHeader();
  return config;
});

imsAxios.interceptors.response.use(
  (response) => {
    if (response.data?.success !== undefined) {
      console.log("this is the response from axios interceptor", response.data);
      return response.data;
    }
    return response;
  },
  (error) => {
    console.log("this is the error response", error.response);
    // if (error.response.status === 404) {
    //   toast.error("Some Internal error occured");
    // } else {
    toast.error(error.response.data);
    if (error.response.data.message) {
      toast.error(error.response.data.message.msg);
    }
    // }
    return error.response;
  }
);

let branch =
  JSON.parse(localStorage.getItem("otherData"))?.company_branch ?? "BRMSC012";
let session =
  JSON.parse(localStorage.getItem("otherData"))?.session ??
  getCurrentFinancialYearSession();

imsAxios.defaults.headers["Company-Branch"] = branch;
imsAxios.defaults.headers["Session"] = session;

export { imsAxios, socketLink };
