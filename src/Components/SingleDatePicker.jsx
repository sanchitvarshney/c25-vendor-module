import React, { useEffect } from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import { useState } from "react";

export default function SingleDatePicker({
  setDate,
  placeholder,
  size,
  daysAgo,
  row,
  value,
  inputHandler,
  tablePicker,
  name,
  disabled,
  format,
}) {
  const onChange = (date, dateString) => {
    if (tablePicker) {
      inputHandler(name, dateString, row.id);
      return;
    }
    if (setDate) {
      setDate(dateString);
    }
  };
  useEffect(() => {
    if (setDate) {
      if (daysAgo) {
        setDate(
          daysAgo &&
            dayjs()
              .subtract(daysAgo, "d")
              .format(format ?? "DD-MM-YYYY")
        );
      } else {
        setDate(value);
      }
    }
  }, []);

  return (
    <DatePicker
      disabled={disabled}
      size={size ?? "default"}
      style={{ width: "100%", height: "100%" }}
      format={format ?? "DD-MM-YYYY"}
      value={
        daysAgo
          ? dayjs().subtract(daysAgo, "d")
          : value && dayjs(value, format ?? "DD-MM-YYYY")
      }
      onChange={onChange}
      placeholder={placeholder && placeholder}
    />
  );
}
