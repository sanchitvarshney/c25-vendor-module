import React from "react";
import { Spin } from "antd";

export default function Loading({ size }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        height: "100%",
        width: "100%",
        left: "0%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // width: "80px",
        background: "rgba(255,255,255,0.5)",
        zIndex: 99,
      }}
    >
      <Spin size={size} />
    </div>
  );
}
