import { Card, Col, Row, Skeleton } from "antd";
import React from "react";

function TaxDetailCard({ totalValues, loading }) {
  return (
    <Card style={{ height: "100%" }} size="small" title="Tax Detail">
      <Row gutter={[0, 4]}>
        <Skeleton
          paragraph={false}
          style={{ width: "100%" }}
          rows={1}
          loading={loading}
          active
        />
        <Skeleton
          paragraph={false}
          style={{ width: "100%" }}
          rows={1}
          loading={loading}
          active
        />
        <Skeleton
          paragraph={false}
          style={{ width: "100%" }}
          rows={1}
          loading={loading}
          active
        />
        <Skeleton
          paragraph={false}
          style={{ width: "100%" }}
          rows={1}
          loading={loading}
          active
        />
        {!loading &&
          totalValues?.map((row) => (
            <Col span={24} key={row.label}>
              <Row>
                <Col
                  span={18}
                  style={{
                    fontSize: window.innerWidth > 1600 ? "0.9rem" : "0.7rem",
                    fontWeight:
                      totalValues?.indexOf(row) == totalValues.length - 1 &&
                      600,
                  }}
                >
                  {row.label}
                </Col>
                <Col span={6} className="right">
                  {row.sign?.toString() == "" ? (
                    ""
                  ) : (
                    <span
                      style={{
                        fontSize:
                          window.innerWidth > 1600 ? "0.9rem" : "0.7rem",
                        fontWeight:
                          totalValues?.indexOf(row) == totalValues.length - 1 &&
                          600,
                      }}
                    >
                      ({row.sign?.toString()}){" "}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: window.innerWidth > 1600 ? "0.9rem" : "0.7rem",
                      fontWeight:
                        totalValues?.indexOf(row) == totalValues.length - 1 &&
                        600,
                    }}
                  >
                    {Number(
                      row.values?.reduce((partialSum, a) => {
                        return partialSum + Number(a);
                      }, 0)
                    ).toFixed(2)}
                  </span>
                </Col>
              </Row>
            </Col>
          ))}
      </Row>
    </Card>
  );
}

export default TaxDetailCard;
