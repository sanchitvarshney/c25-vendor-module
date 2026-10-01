import { toast } from "react-toastify";
import useLoading from "./useLoading";

const useApi = () => {
  const { loading, setLoading } = useLoading();

  const executeFun = async (fun, loadingLabel) => {
    try {
      let message = "";
      setLoading(loadingLabel, true);
      const response = await fun();
      // console.log("this is the response up 123", response);
      if (response.data.success !== undefined) {
        if (response.data.success && response.data.message) {
          toast.success(response.data.messae);
        } else if (!response.data.success && response.data.message) {
          toast.error(response.data.messae);
        }
        return response.data;
      }
      if (response.success !== undefined) {
        if (response.success && response.message) {
          toast.success(response?.message ?? response.data?.message);
        } else if (!response.success && response.message) {
          toast.error(response.message);
        }
        return response;
      }
      if (typeof response?.data === "string") {
        console.log("in the first one");
        if (response?.status === 200) {
          toast.success(response?.data);
          return {
            data: null,
            success: true,
            error: false,
            message: null,
          };
        } else {
          console.log("in the second one");
          toast.error(response?.data);
          return {
            data: null,
            error: true,
          };
        }
      }
      if (
        response.data &&
        response?.data?.code &&
        response?.data?.code !== 200 &&
        typeof response?.data.message.msg === "string"
      ) {
        console.log("in the third one");
        message = response?.data.message.msg;
        throw new Error(message);
      } else if (
        response?.data.code === 200 &&
        response?.data.message &&
        response?.data.message.length &&
        typeof response?.data.message === "string"
      ) {
        console.log("in the fourth one");
        message = response?.data.message;
        toast.success(message);
      }

      return {
        data: response?.data,
        error: false,
        success: true,
        message,
      };
    } catch (error) {
      let message = "";
      if (typeof error === "string") {
        message = error;
        console.log("in the fifth one");
      } else if (error instanceof Error) {
        console.log("in the sixth one");
        message = error.message;
      }
      console.log("Some error occured in the api", error);
      toast.error(message);

      return {
        data: null,
        error: true,
        success: false,
        message,
      };
    } finally {
      setLoading(loadingLabel, false);
    }
  };
  return { executeFun, loading };
};

export default useApi;
