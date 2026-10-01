import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
export default function MySelect({
  options,
  selectLoading,
  size,
  value,
  onChange,
  disabled,
  labelInValue,
  mode,
  placeholder,
}) {
  return (
    <Select
      labelInValue={labelInValue}
      mode={mode}
      placeholder={placeholder}
      disabled={disabled}
      allowClear
      value={value === "" ? null : value}
      notFoundContent={selectLoading ? <Spin size="small" /> : null}
      onChange={onChange}
      onSearch={(value) => console.log(value)}
      optionFilterProp="text"
      size={size ? size : "default"}
      style={{
        width: "100%",
      }}
      fieldNames={{ label: "text" }}
      showSearch
      showArrow={true}
      filterOption={(input, option) =>
        (option?.text?.toString()?.toLowerCase() ?? "").includes(input)
      }
      options={options}
    />
  );
}
