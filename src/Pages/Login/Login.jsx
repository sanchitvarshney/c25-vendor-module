import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAuth } from "../../Features/loginSlice.js/loginSlice";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";

const Login = () => {
  document.title = "IMS Login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, message, loading } = useSelector((state) => state.login);
  const [inpVal, setInpVal] = useState({
    username: "",
    password: "",
  });
  const { Title, Link, Text } = Typography;
  const inputHandler = (name, value) => {
    setInpVal(() => {
      return {
        ...inpVal,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    const { username, password } = inpVal;
    if (username === "" && password === "") {
      toast.error("Please fill the field");
    } else if (username === "") {
      toast.error("username Field is Empty");
    } else if (password === "") {
      toast.error("password fill is empty");
    } else {
      dispatch(
        loginAuth({ username: inpVal.username, password: inpVal.password })
      );
    }
  };
  useEffect(() => {
    if (message?.length > 0) {
      if (user) {
        navigate("/jobwork-analysis");
        // toast.success(message);
      }
    }
  }, [user]);
  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [navigate]);
  return (
    <div style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        <Col
          span={8}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              height: "100vh",
              width: "100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "-600px 00px",
              backgroundColor: "#ecf4fc !important",
              backgroundImage:
                "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICA8ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9Im5vbmUiPg0KDQogICA8Y2lyY2xlIHI9IjU3MCIgY3k9IjEwMDAiIGN4PSIxNDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9InBhbGV2aW9sZXRyZWQiIG9wYWNpdHk9IjAuMDciIC8+DQogICANCiAgIDxjaXJjbGUgcj0iMTIiIGN5PSI4MDAiIGN4PSI2OTAiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNDUiIHN0cm9rZT0icHVycGxlIiBzdHJva2Utd2lkdGg9IjciIC8+DQogICA8Y2lyY2xlIHI9IjEyIiBjeT0iNjYwIiBjeD0iODAwIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjciIHN0cm9rZT0iIzRCN0RBMCIgc3Ryb2tlLXdpZHRoPSI3IiAvPg0KICAgPGNpcmNsZSByPSIxNiIgY3k9IjY1MCIgY3g9IjExMDAiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNiIgc3Ryb2tlPSIjZmZjMTEzIiBzdHJva2Utd2lkdGg9IjEwIiAvPg0KICAgDQoNCiAgIDxjaXJjbGUgcj0iMzAwIiBjeT0iMTA1MCIgY3g9IjQ1MCIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC4zIiBzdHJva2U9ImdyZWVuIiBzdHJva2Utd2lkdGg9IjEyIiAvPg0KICAgPGNpcmNsZSByPSIyMjAiIGN5PSI4MDAiIGN4PSIxNDUwIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjI3IiBzdHJva2U9InJlZCIgc3Ryb2tlLXdpZHRoPSIxMiIgLz4NCiAgIDxjaXJjbGUgcj0iNTUwIiBjeT0iMTIwMCIgY3g9IjE2MDAiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNCIgc3Ryb2tlPSIjZmZjMTEzIiBzdHJva2Utd2lkdGg9IjEyIiAvPg0KDQogIDwvZz4NCjwvc3ZnPg==)",
            }}
          >
            <Row>
              <Row style={{ height: "100%", width: "100%" }} justify="center">
                <Col style={{ paddingTop: "5vh", zIndex: 2 }} span={6}>
                  <img
                    alt="MSCorpres Logo"
                    style={{ width: "100%" }}
                    src="./../assets/images/mscorpres_auto_logo.png"
                  />
                </Col>
              </Row>
              <Row style={{ width: "100%" }} justify="center">
                <Col style={{ whiteSpace: "nowrap", marginTop: 30 }}>
                  <Title level={5}>Stay Tuned With Updated Stocks!</Title>
                  <Divider />
                </Col>
              </Row>
            </Row>
            <Row justify="center" style={{ marginTop: "80%" }}>
              <Col offset={1}>
                <Text>
                  IMS from 2019 - 2022. All Rights reserved | Performance &
                  security by
                  <Link
                    style={{ marginLeft: 5 }}
                    href="https://www.mscorpres.com"
                  >
                    MSCorpres Automation Pvt. Ltd.
                  </Link>
                </Text>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={16}>
          <Row
            justify="center"
            style={{ width: "100%", height: "100%" }}
            align="middle"
          >
            <Col span={12}>
              <Title
                style={{
                  color: "gray",
                  textAlign: "center",
                  marginBottom: 20,
                }}
                level={4}
              >
                Secure Login To IMS
              </Title>
              <Form
                name="basic"
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label="Username / Mobile / CRN Number"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please provide either your email or phone number or CRN Nunber",
                    },
                  ]}
                >
                  <Input
                    value={inpVal.username}
                    onChange={(e) => inputHandler("username", e.target.value)}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    value={inpVal.password}
                    onChange={(e) => inputHandler("password", e.target.value)}
                    size="large"
                  />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                  <Button
                    loading={loading}
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
