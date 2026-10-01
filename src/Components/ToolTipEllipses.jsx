import { Tooltip, Typography } from "antd";
import React from "react";

export default function ToolTipEllipses({ text, type, copy }) {
  return (
    <Tooltip
      overlayStyle={{ fontSize: "0.7rem", color: "white" }}
      placement="topLeft"
      title={text}
      color="#245181"
    >
      {type == "Paragraph" ? (
        <Typography.Text ellipsis={{ width: "100%" }}> {text} </Typography.Text>
      ) : (
        <Typography.Text
          copyable={copy && { tooltips: false }}
          style={{
            fontSize: window.innerWidth < 1600 ? "0.7rem" : "0.8rem",
            width: "100%",
          }}
          ellipsis={{ width: "100%" }}
        >
          {text}
        </Typography.Text>
      )}
    </Tooltip>
  );
}
