import { Col, Divider, Form, Input, Row } from "antd";
import Typography from "antd/es/typography/Typography";
import React from "react";

function ChalllanInwardRow() {
  return (
    <Form layout="vertical" size="small">
      <Typography.Title level={5}>Component name</Typography.Title>
      <Row gutter={8}>
        <Col span={4}>
          <Form.Item label="Qty">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Rate">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Value">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Location">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="HSN">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Remark">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={8}>
        <Col>
          <Typography.Text
            style={{ color: "#8CBCFF", fontSize: "0.7rem", cursor: "pointer" }}
          >
            Add Row
          </Typography.Text>
        </Col>
        <Col>
          <Typography.Text
            style={{ color: "#8CBCFF", fontSize: "0.7rem", cursor: "pointer" }}
          >
            Remove Row
          </Typography.Text>
        </Col>
      </Row>
      <Divider />
    </Form>
  );
}

export default ChalllanInwardRow;
