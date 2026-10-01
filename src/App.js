import React, { useState, useEffect, useRef } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Rout from "./Routes/Routes";
import { useSelector, useDispatch } from "react-redux/es/exports";
import "./axiosInterceptor";
import "buffer";
import {
  logout,
  setNotifications,
  setFavourites,
  setTestPages,
  setLocations,
  setUser,
  setSession,
} from "./Features/loginSlice.js/loginSlice";
import UserMenu from "./Components/UserMenu";
import Logo from "./Components/Logo";
import socket from "./Components/socket.js";
import Notifications from "./Components/Notifications";
import Layout, { Content, Header } from "antd/lib/layout/layout";
import { Badge, Row, Select, Space, Switch, notification } from "antd";
import { AiOutlineFund } from "react-icons/ai";
// icons import
import {
  MessageOutlined,
  BellFilled,
  StarFilled,
  StarOutlined,
  MenuOutlined,
  UserOutlined,
  LoadingOutlined,
  SlidersOutlined,
  CalculatorOutlined,
  MinusOutlined,
  RadiusBottomrightOutlined,
  CopyOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import InternalNav from "./Components/InternalNav";
import showToast from "./Components/MyToast";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { imsAxios } from "./axiosInterceptor";
import {
  getCurrentFinancialYearSession,
  getFinancialYearSessionOptions,
} from "./utils/financialYear";

const App = () => {
  const { user, notifications, currentLinks } = useSelector(
    (state) => state.login
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSideBar, setShowSideBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessageDrawer, setShowMessageDrawer] = useState(false);
  const [showMessageNotifications, setShowMessageNotifications] =
    useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const { pathname } = useLocation();
  const [internalLinks, setInternalLinks] = useState([]);
  const [testToggleLoading, setTestToggleLoading] = useState(false);
  const [testPage, setTestPage] = useState(false);
  const notificationsRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    // getItem(
    //   <Link to="/finance/payments">Finance</Link>,
    //   "F",
    //   <WalletOutlined />
    // ),
    // getItem("Requests", "A", <SlidersOutlined />, [
    //   getItem(
    //     <Link to="/requests/pending">Pending Requests</Link>,
    //     "/requests/requests/pending"
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/requests/pending">Transfer Requests</Link>,
    //     "/requests/requests/transfer"
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/requests/completed">Completed Requests</Link>,
    //     "/requests/requests/completed"
    //     // <MinusOutlined />
    //   ),
    // ]),
    // getItem(
    //   <Link to="/rm_consumption">RM Consumption</Link>,
    //   "/rm_consumption",
    //   <MinusOutlined />
    // ),
    // getItem(
    //   <Link to="/PhysicalStock">Physical Stock</Link>,
    //   "/PhysicalStock",
    //   <AiOutlineFund />
    // ),
    // getItem("SFG", "B", <RadiusBottomrightOutlined />, [
    //   getItem(
    //     <Link to="/sfg/create">Create</Link>,
    //     "/sfg/create"
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/sfg/view">View SFG</Link>,
    //     "/sfg/create"
    //     // <MinusOutlined />
    //   ),
    // ]),
    // getItem("Reports", "C", <CalculatorOutlined />, [
    //   getItem(
    //     <Link to="/reports/rm_stock">RM Stock</Link>,
    //     "/reports/rm_stock"
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/vr01">VR01</Link>
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/vr02">VR02</Link>
    //     // <MinusOutlined />
    //   ),
    //   getItem(
    //     <Link to="/vr03">VR03</Link>
    //     // <MinusOutlined />
    //   ),
    // ]),
    getItem(
      <Link to="/jobwork-analysis">Job work Analysis</Link>,
      "/rm_consumption",
      <CopyOutlined />
    ),
       getItem(
      <Link to="/jobwork-inventory-report">Job Work Inventory Report</Link>,
      "/jobwork-inventory-report",
      <UnorderedListOutlined />
    ),
  ];
  const items1 = [
    // getItem(<Link to="/myprofile">Profile</Link>, "B", <UserOutlined />),
    // getItem(<Link to="/messenger">Messenger</Link>, "C", <MessageOutlined />),
  ];

  const logoutHandler = async () => {
    try {
      if (user?.token) {
        await imsAxios.post(
          "/auth/logout",
        );
      }
    } catch (error) {
      console.log("logout api failed", error);
    } finally {
      dispatch(logout());
    }
  };
  const deleteNotification = (id) => {
    let arr = notifications;
    arr = arr.filter((not) => not.ID !== id);
    dispatch(setNotifications(arr));
  };
  const handleFavPages = async (status) => {
    let favs = user.favPages;

    if (!status) {
      setFavLoading(true);
      const { data } = await imsAxios.post("/backend/favouritePages", {
        pageUrl: pathname,
        source: "react",
      });
      setFavLoading(false);
      if (data.code === 200) {
        favs = JSON.parse(data.data);
      } else {
        toast.error(data.message.msg);
      }
    } else {
      let page_id = favs.filter((f) => f.url === pathname)[0].page_id;
      setFavLoading(true);
      const { data } = await imsAxios.post("/backend/removeFavouritePages", {
        page_id,
      });
      setFavLoading(false);
      if (data.code === 200) {
        let fav = JSON.parse(data.data);
        favs = fav;
      } else {
        toast.error(data.message.msg);
      }
    }
    dispatch(setFavourites(favs));
  };
  socket.on("connect", () => {
    console.log("WebSocket connected!!");
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("WebSocket disconnected:", reason);
  });
  const handleChangePageStatus = (value) => {
    let status = value ? "TEST" : "LIVE";
    // console.log(value);
    socket.emit("setPageStatus", {
      page: pathname,
      status: status,
    });
    setTestToggleLoading(true);
    setTestPage(value);
  };
  const getLocations = async () => {
    // setPageLoading(true);
    const { data } = await imsAxios.get("/jwvendor/fetchAllotedLocation");
    // setPageLoading(false);

    if (data.code == 200) {
      let arr = data.data.map((row) => ({
        text: row.text,
        value: row.id,
      }));
      dispatch(setLocations(arr));
    }
  };
  // notifications recieve handlers
  //extract the information
  function decodeJwt(token) {
    var base64Payload = token.split(".")[1];
    var payload = decodeURIComponent(
      atob(base64Payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(payload);
  }
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        setShowSideBar(false);
      }
    });
    var getTokenFromUrl = searchParams.get("token");
    if (getTokenFromUrl) {
      var payload = decodeJwt(getTokenFromUrl);

      imsAxios.defaults.headers["Authorization"] = getTokenFromUrl;
      imsAxios.defaults.headers["session"] = getCurrentFinancialYearSession();
      localStorage.setItem(
        "loggedInUserVendor",
        JSON.stringify({
          token: getTokenFromUrl,
          email: payload.crn_email,
          emailConfirmed: "C",
          favPages: "[]",
          id: payload.crn_id,
          mobileConfirmed: "C",
          passwordChanged: "C",
          phone: payload.crn_mobile,
          token: getTokenFromUrl,
          userName: payload.user_name,
        })
      );
      dispatch(
        setUser({
          token: getTokenFromUrl,
          email: payload.crn_email,
          emailConfirmed: "C",
          favPages: "[]",
          id: payload.crn_id,
          mobileConfirmed: "C",
          passwordChanged: "C",
          phone: payload.crn_mobile,
          token: getTokenFromUrl,
          userName: payload.user_name,
        })
      );
      navigate("/requests/pending");
    }
    if (user) {
      socket.emit("fetch_notifications", { source: "react" });
    }
    getLocations();
  }, []);

  useEffect(() => {
    if (user && !user.session) {
      dispatch(setSession(getCurrentFinancialYearSession()));
    }
  }, [dispatch, user]);
  
  useEffect(() => {
    if (!user && !searchParams.get("token")) {
      navigate("/login");
    } else if (user) {
      if (user.token) {
        socket.emit("fetch_notifications", { source: "react" });
        getLocations();
      }
      // getting new notification
      getLocations();
      socket.on("socket_receive_notification", (data) => {
        console.log("new notifications file recieved");
        if (data.type === "message") {
          let arr = notificationsRef.current.filter(
            (not) => not.conversationId !== data.conversationId
          );
          arr = [data, ...arr];
          if (arr) {
            dispatch(setNotifications(arr));
          }
          setNewNotification(data);
        } else if (data[0].msg_type === "file") {
          data = data[0];
          let arr = notificationsRef.current;
          arr = arr.map((not) => {
            if (not.notificationId === data.notificationId) {
              return {
                ...data,
                type: data.msg_type,
                title: data.request_txt_label,
                details: data.req_date,
                file: JSON.parse(data.other_data).fileUrl,
              };
            } else {
              return not;
            }
          });
          if (arr) {
            dispatch(setNotifications(arr));
          }
          setNewNotification(data);
        }
      });
      // getting all notifications
      socket.on("all-notifications", (data) => {
        let arr = data.data;
        console.log("allnotifications", arr);
        arr = arr.map((row) => {
          return {
            ...row,
            type: row.msg_type,
            title: row.request_txt_label,
            details: row.req_date,
            file: JSON.parse(row.other_data).fileUrl,
          };
        });
        dispatch(setNotifications(arr));
      });
      // event for starting detail
      socket.on("download_start_detail", (data) => {
        console.log("start details arrived");
        if (data.title && data.details) {
          let arr = notificationsRef.current;
          arr = [data, ...arr];
          dispatch(setNotifications(arr));
        }
      });
      // getting percentages
      socket.on("getting-loading-percentage", (data) => {
        let arr = notificationsRef.current;
        console.log("percentage", data);
        if (
          arr.filter((row) => row.notificationId === data.notificationId)[0]
        ) {
          arr = arr.map((row) => {
            if (row.notificationId === data.notificationId) {
              let obj = row;
              obj = {
                ...row,
                ...data,
              };
              return obj;
            } else {
              return row;
            }
          });
        } else {
          arr = [data, ...arr];
        }
        dispatch(setNotifications(arr));
      });
      socket.on("getPageStatus", (data) => {
        setTestToggleLoading(false);
        let pages;
        if (user.testPages) {
          pages = user.testPages;
        } else {
          pages = [];
        }

        let arr = [];
        for (const property in data) {
          if (property.includes("/")) {
            if (data[property] === "TEST") {
              console.log("open");
              let obj = { url: property, status: data[property] };
              arr = [obj, ...arr];
            }
            if (data[property] === "LIVE" && property.includes("/")) {
              pages = pages.filter((page) => page.url === property);
            }
          }
        }
        console.log("recieved status", arr);
        dispatch(setTestPages(arr));
        pages.map((page) => {
          if (page.url === pathname) {
            setTestPage(true);
          } else {
            setTestPage(false);
          }
        });
      });
    }
  }, [user]);
  useEffect(() => {
    setShowSideBar(false);
    setShowMessageNotifications(false);
    setShowNotifications(false);
  }, [navigate]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);
  useEffect(() => {
    if (newNotification?.type) {
      console.log("new notification arrived");
      if (Notification.permission === "default") {
        Notification.requestPermission(function (permission) {
          if (permission === "default") {
            let notification = new Notification(newNotification.title, {
              body: newNotification.message,
            });
            notification.onclick = () => {
              notification.close();
              window.parent.focus();
            };
          }
        });
      } else {
        let notification = new Notification(newNotification?.title, {
          body: newNotification?.message,
        });
        notification.onclick = () => {
          notification.close();
          window.parent.focus();
        };
      }
    }
  }, [newNotification]);
  useEffect(() => {
    if (showMessageNotifications) {
      {
        setShowNotifications(false);
      }
    }
  }, [showMessageNotifications]);
  useEffect(() => {
    if (showNotifications) {
      {
        setShowMessageNotifications(false);
      }
    }
  }, [showNotifications]);
  useEffect(() => {
    if (user?.testPages) {
      let match = user.testPages.filter((page) => page.url === pathname)[0];
      if (match) {
        setTestPage(true);
      } else {
        setTestPage(false);
      }
    }
  }, [navigate, user]);
  useEffect(() => {
    setInternalLinks(currentLinks);
  }, [currentLinks]);
  const options = [{ label: "A-21 [BRMSC012]", value: "BRMSC012" }];
  const sessionOptions = getFinancialYearSessionOptions(2022);
    const handleSelectSession = (value) => {
    dispatch(setSession(value));
  };

  return (
    <div style={{ height: "100vh" }}>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        limit={1}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <Layout
        style={{
          width: "100%",
          top: 0,
        }}
      >
        {/* header start */}
        {user && (
          <Layout style={{ height: "100%" }}>
            <Header
              style={{
                zIndex: 4,
                height: 45,
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Row style={{ width: "100%" }} justify="space-between">
                <Space size="large">
                  <MenuOutlined
                    onClick={() => {
                      setShowSideBar((open) => !open);
                    }}
                    style={{
                      color: "white",
                      marginLeft: 12,
                      fontSize: window.innerWidth > 1600 && "1rem",
                    }}
                  />

                  <Space
                    style={{
                      color: "white",
                      fontSize: "1rem",
                    }}
                  >
                    <Logo />
                    IMS
                  </Space>
                  {/* <div className="location-select">
                    <Select
                      style={{ width: 200, color: "white" }}
                      options={options}
                      bordered={false}
                      value="BRMSC012"
                    />
                  </div> */}
                   <div className="location-select">
                    <Select
                      style={{ width: 200, color: "white" }}
                      options={sessionOptions}
                      bordered={false}
                      placeholder="Select Session"
                      onChange={(value) => handleSelectSession(value)}
                      value={user.session || getCurrentFinancialYearSession()}
                    />
                  </div>
                </Space>
                <Space
                  size="large"
                  style={{
                    position: "relative",
                  }}
                >
                  {user.type && user.type.toLowerCase() === "developer" && (
                    <Switch
                      loading={testToggleLoading}
                      checked={testPage}
                      onChange={(value) => handleChangePageStatus(value)}
                      checkedChildren="Test"
                      unCheckedChildren="Live"
                    />
                  )}

                  {/* <div>
                    <Badge
                      size="small"
                      style={{
                        background: notifications.filter(
                          (not) => not?.loading || not?.status === "pending"
                        )[0]
                          ? "#EAAE0F"
                          : "green",
                      }}
                      count={
                        notifications.filter((not) => not?.type !== "message")
                          ?.length
                      }
                    >
                      <BellFilled
                        onClick={() => setShowNotifications((n) => !n)}
                        style={{
                          fontSize: 18,
                          color: "white",
                          // marginRight: 8,
                        }}
                      />
                    </Badge>
                    {showNotifications && (
                      <Notifications
                        source={"notifications"}
                        showNotifications={showNotifications}
                        notifications={notifications.filter(
                          (not) => not?.type !== "message"
                        )}
                        deleteNotification={deleteNotification}
                      />
                    )}
                  </div>
                  <div>
                    {/* <Badge
                      size="small"
                      count={
                        notifications.filter((not) => not?.type === "message")
                          .length
                      }
                    >
                      <MessageOutlined
                        onClick={() => setShowMessageDrawer(true)}
                        style={{
                          fontSize: 18,
                          cursor: "pointer",
                          color: "white",
                        }}
                      />
                    </Badge> */}
                  {/* </div> */}
                  <div>
                    <Badge
                      size="small"
                      style={{
                        background: notifications.filter(
                          (not) => not?.loading || not?.status === "pending"
                        )[0]
                          ? "#EAAE0F"
                          : "green",
                      }}
                      count={
                        notifications.filter((not) => not?.type !== "message")
                          ?.length
                      }
                    >
                      <BellFilled
                        onClick={() => setShowNotifications((n) => !n)}
                        style={{
                          fontSize: 18,
                          color: "white",
                          // marginRight: 30,
                        }}
                      />
                    </Badge>
                    {showNotifications && (
                      <Notifications
                        source={"notifications"}
                        showNotifications={showNotifications}
                        notifications={notifications.filter(
                          (not) => not?.type !== "message"
                        )}
                        deleteNotification={deleteNotification}
                      />
                    )}
                  </div>
                  <div>
                    <Badge
                      size="small"
                      count={
                        notifications.filter((not) => not?.type == "message")
                          .length
                      }
                    >
                      <MessageOutlined
                        onClick={() => setShowMessageDrawer(true)}
                        style={{
                          fontSize: 18,
                          cursor: "pointer",
                          color: "white",
                          // marginRight: 90,
                        }}
                      />
                    </Badge>
                  </div>
                  <UserMenu user={user} logoutHandler={logoutHandler} />
                </Space>
              </Row>
            </Header>
          </Layout>
        )}
        {/* header ends */}
        {/* sidebar starts */}
        <Layout style={{ height: "100%" }}>
          {user && (
            <Sidebar
              items={items}
              items1={items1}
              className="site-layout-background"
              key={1}
              setShowSideBar={setShowSideBar}
              showSideBar={showSideBar}
            />
          )}
          {/* sidebar ends */}
          <Layout
            onClick={() => {
              setShowNotifications(false);
              setShowMessageNotifications(false);
            }}
            style={{ height: "100%" }}
          >
            <Content style={{ height: "100%" }}>
              <InternalNav links={internalLinks} />

              <div
                style={{
                  height: "calc(100vh - 50px)",
                  width: "100%",
                  opacity: testPage ? 0.5 : 1,
                  pointerEvents: testPage ? "none" : "all",

                  overflowX: "hidden",
                }}
              >
                {/* <MessageModal
                  showMessageDrawer={showMessageDrawer}
                  setShowMessageDrawer={setShowMessageDrawer}
                /> */}
                <Routes>
                  {Rout.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={<route.main />}
                    />
                  ))}
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
//
