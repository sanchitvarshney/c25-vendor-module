import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Row, Tooltip } from "antd";
import { useState, useEffect } from "react";
import internalLinks from "../Pages/internalLinks";

export default function InternalNav({
  // links,
  placeholder,
  menuWidth,
  additional,
}) {
  const { pathname } = useLocation();
  const [linksList, setLinksList] = useState([]);
  const [current, setCurrent] = useState("");
  const navigate = useNavigate();
  const onClick = (e) => {
    setCurrent(e.key);
  };
  useEffect(() => {
    let key =
      linksList &&
      linksList
        ?.filter((link) => link.routePath === pathname)[0]
        ?.key.toString();

    setCurrent(key);
  }, [linksList, pathname]);

  useEffect(() => {
    let arr = [];
    internalLinks.map((group) => {
      if (group.filter((link) => link.routePath === pathname)[0]) {
        arr = group;
      }
    });
    arr = arr?.map((link, index) => {
      return {
        ...link,
        key: index,
      };
    });
    setLinksList(arr);
    // console.log(arr);
  }, [navigate, pathname]);
  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        padding: 0,
        paddingRight: 10,
        borderBottom: "1px solid #eeeeee",
        marginBottom: 5,
        flexDirection: "row",
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 3,
        background: "white",
      }}
    >
      <div
        style={{
          flex: 1,
          background: "white",
        }}
      >
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          size="small"
          mode="horizontal"
          style={{
            marginBottom: 5,
            width: "100%",
            background: "white",
            // background: "rgb(235, 235, 235)",
          }}
          items={
            linksList &&
            linksList?.map((link, index) => ({
              key: link.key.toString(),
              label: (
                <Tooltip
                  placement="bottomLeft"
                  overlayStyle={{ fontSize: "0.7rem", color: "white" }}
                  color="#245181"
                  title={link.placeholder && link.placeholder}
                >
                  <Link to={link.routePath}>
                    <span>{link.routeName}</span>
                    <span style={{ marginLeft: 5 }}>
                      {pathname === link.routePath && link.placeholder}
                    </span>
                  </Link>
                </Tooltip>
              ),
            }))
          }
        />
      </div>

      {/* {additional && <div style={{ background: "white" }}>{additional()}</div>} */}
    </Row>
  );
}
