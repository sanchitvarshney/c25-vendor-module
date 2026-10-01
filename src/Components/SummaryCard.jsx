import { Card, Col, Row, Skeleton, Typography } from "antd";
import React from "react";

function SummaryCard({ summary, title, type, loading }) {
  return (
    <Card title={title} size="small">
      <Row gutter={[0, 8]}>
        {summary?.map((row) => (
          <Col span={24}>
            {row.title && (
              <Typography.Text
                style={{ fontWeight: "bold", display: "block", fontSize: 13 }}
              >
                {row.title}
              </Typography.Text>
            )}
            {row.description && (
              <Typography.Text style={{ fontSize: 12, marginTop: 10 }}>
                {!loading && row.description}
                {loading && (
                  <Skeleton.Input loading={loading} active size="small" block />
                )}
              </Typography.Text>
            )}
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default SummaryCard;
