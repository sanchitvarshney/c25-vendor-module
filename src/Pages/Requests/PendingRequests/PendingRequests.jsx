import { useEffect, useState } from "react";
import { Button, Col, Space } from "antd";
import MySelect from "../../../Components/MySelect";
import MyDatePicker from "../../../Components/MyDatePicker";
import TableActions, {
  CommonIcons,
} from "../../../Components/TableActions.jsx/TableActions";
import MyDataTable from "../../../Components/MyDataTable";
import axios from "axios";
import showToast from "../../../Components/MyToast";
import SearchHeader from "../../../Components/SearchHeader";
import ChallanInward from "./ChallanInward";
import { toast } from "react-toastify";
import { Flex } from "@adobe/react-spectrum";
import { downloadCSV } from "../../../Components/exportToCSV";
import socket from "../../../Components/socket";
import { v4 } from "uuid";
import { useSelector } from "react-redux";
import { imsAxios } from "../../../axiosInterceptor";

function PendingRequests() {
  document.title = "Pending Requests";
  const [wise, setWise] = useState("datewise");
  const [searchInput, setSearchInput] = useState("");
  const [rows, setRows] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [challanInward, setChallanInward] = useState(false);
  const { user, notifications } = useSelector((state) => state.login);

  const wiseOptions = [{ text: "Date Wise", value: "datewise" }];
  const getRows = async () => {
    // showToast(
    //   "new Notification",
    //   "this is a new notification nigga",
    //   "success"
    // );
    console.log("searchInput", searchInput);
    setSearchLoading(true);
    const { data } = await imsAxios.post("/jwvendor/fetchPendingJWChallan", {
      searchBy: wise,
      searchValue: searchInput,
    });
    if (data.code == 200) {
      let arr = data.response.data.map((row, index) => ({
        ...row,
        index: index + 1,
        id: index,
      }));

      setRows(arr);
    } else {
      console.log("hello");
      setRows([]);
      toast.error(data.message.msg);
    }
    setSearchLoading(false);
  };
  const downloadData = () => {
    // downloadCSV(rows, colcolumns, "Pending Report");
    let newId = v4();
    let arr = notifications;

    // if (!user.company_branch) {
    //   toast.error("Please select a branch to download report");
    //   return;
    // }
    // const payload = {
    //   date: dateRange,
    //   notificationId: newId,
    // };
    // console.log("payload", payload);
    // console.log("here in socket");
    socket.emit("vendorReqPending", {
      otherdata: JSON.stringify({
        searchValue: searchInput,
        searchBy: wise,
      }),
      notificationId: newId,
    });
  };
  const colcolumns = [
    { headerName: "Sr. No.", field: "index", width: 70 },
    { headerName: "Jobwork ID", field: "jobwork", flex: 1 },
    { headerName: "Challan Id", field: "challan", flex: 1 },
    { headerName: "Insert Date", field: "insert_dt", flex: 1 },
    { headerName: "Insert By", field: "insert_by", flex: 1 },
  ];
  const columns = [
    { headerName: "Sr. No.", field: "index", width: 70 },
    { headerName: "Jobwork ID", field: "jobwork", flex: 1 },
    { headerName: "Challan Id", field: "challan", flex: 1 },
    { headerName: "Insert Date", field: "insert_dt", flex: 1 },
    { headerName: "Insert By", field: "insert_by", flex: 1 },
    {
      headerName: "Action",
      field: "action",
      type: "actions",
      flex: 1,
      getActions: ({ row }) => [
        <TableActions
          action="add"
          onClick={() =>
            setChallanInward({ challan: row.challan, jw: row.jobwork })
          }
        />,
      ],
    },
  ];
  const searchBar = () => (
    <Space>
      <div style={{ width: 200 }}>
        <MySelect
          value={wise}
          onChange={(value) => setWise(value)}
          options={wiseOptions}
        />
      </div>
      <div style={{ width: 300 }}>
        {wise === "datewise" && <MyDatePicker setDateRange={setSearchInput} />}
      </div>
      <CommonIcons
        action="searchButton"
        loading={searchLoading}
        onClick={getRows}
      />
    </Space>
  );

  return (
    <div style={{ height: "90%" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <Col span={23}>
          <SearchHeader title="Pending Requests" searchBar={searchBar} />
        </Col>
        {/* <Button action="download" /> */}
        <CommonIcons
          type="secondary"
          onClick={downloadData}
          disabled={rows.length === 0}
          action={"downloadButton"}
        />
      </div>
      <ChallanInward
        challanInward={challanInward}
        setChallanInward={setChallanInward}
        getRows={getRows}
      />
      <div style={{ height: "100%", padding: "0px 5px" }}>
        <MyDataTable loading={searchLoading} columns={columns} rows={rows} />
      </div>
    </div>
  );
}

export default PendingRequests;
