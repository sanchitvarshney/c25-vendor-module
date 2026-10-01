import { Divider, Row, Typography } from "antd";
import React from "react";

function SearchHeader({ title, searchBar }) {
  return (
    <Row justify="space-between" style={{ padding: "5px 10px" }}>
      <Typography.Title style={{ paddingTop: 3 }} type="secondary" level={5}>
        {title}
      </Typography.Title>
      {searchBar && searchBar()}
      <Divider style={{ margin: 0, marginTop: 5, marginBottom: 0 }} />
    </Row>
  );
}

export default SearchHeader;
