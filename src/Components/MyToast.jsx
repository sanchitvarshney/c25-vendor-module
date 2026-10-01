// import React from "react";
import { notification } from "antd";

// function showToast({ title, message, type }) {
//   const [api, contextHolder] = notification.useNotification();
const showToast = (title, message, type) => {
  if (!type) {
    notification.open({
      message: title ?? "",
      description: message ?? "",
      placement: "topRight",
      duration: 3,
    });
  } else if (type === "error") {
    notification.error({
      message: title ?? "",
      description: message ?? "",
      placement: "topRight",
      duration: 3,
    });
  } else if (type === "success") {
    notification.success({
      message: title ?? "",
      description: message ?? "",
      placement: "topRight",
      duration: 3,
    });
  }
};
// }

export default showToast;
