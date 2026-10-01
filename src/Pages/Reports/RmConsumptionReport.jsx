import { Card, Col, Form, Row, Space, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadCSV } from "../../Components/exportToCSV";
import MyDataTable from "../../Components/MyDataTable";
import MySelect from "../../Components/MySelect";
import showToast from "../../Components/MyToast";
import SearchHeader from "../../Components/SearchHeader";
import SummaryCard from "../../Components/SummaryCard";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { setLocations } from "../../Features/loginSlice.js/loginSlice";
import { toast } from "react-toastify";
import { imsAxios } from "../../axiosInterceptor";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
function RmConsumptionReport() {
  document.title = "RM Location Query";
  const [searchLoading, setSearchLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [summaryData, setSummaryData] = useState([
    { title: "Component" },
    { title: "Part Code" },
    { title: "Cat Part Code" },
    // { title: "ClosingQty" },
  ]);
  const [form] = Form.useForm();
  useEffect(() => {
    getLocations();
  }, []);

  const [pageLoading, setPageLoading] = useState(false);

  const { locations: locationOptions } = useSelector((state) => state.login);
  // console.log("locationOptions", locationOptions);
  const [searchObj, setSearchObj] = useState({
    part_code: "",
    location: locationOptions[0]?.value,
  });
  const dispatch = useDispatch();
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
  const getRows = async () => {
    setFetchLoading(true);
    searchObj.location = searchObj.location.value;
    console.log("searchObj", searchObj);
    const response = await imsAxios.post("/jwreport/vq02", searchObj);

    const { data } = response;
    if (data.code === 200) {
      const { data2 } = data.response;
      const { data1 } = data.response;
      // console.log("data1", data1);
      // console.log("data2", data2);

      let arr = data2.map((row, index) => ({
        ...row,
        id: index,
      }));
      setRows(arr);

      let summaryArr = [
        { title: "Component", description: data.response.data1.component },
        { title: "Part Code", description: data.response.data1.partno },
        {
          title: "Cat Part Code",
          description: `${data.response.data1.new_partno} `,
        },
      ];
      setSummaryData(summaryArr);
      setFetchLoading(false);
    }
    // const { data2 } = response;
    // if (data.responseCode === "200") {
    //   console.log("arrr", arr);

    //   setSummaryData(summaryArr);
    // }
    else {
      // showToast("Error", data.message, "error");
      setRows([]);
      toast.error(data.message.msg);
    }
    setFetchLoading(false);
  };
  const getPartCodes = async (search) => {
    setSelectLoading(true);
    const response = await imsAxios.post("/backend/getComponentByNameAndNo", {
      search: search,
    });
    // console.log("data", data);
    let { data } = response;
    setSelectLoading(false);
    if (response.success) {
      let arr = data.map((row) => ({
        value: row.id,
        text: row.text,
      }));
      // console.log("arr", arr);

      setAsyncOptions(arr);
    } else {
      setAsyncOptions([]);
    }
  };

  const columns = [
    { headerName: "Sr. No", field: "serial_no", width: 80 },
    { headerName: "Date", field: "date", width: 150 },
    {
      headerName: "Trans Type",
      field: "transaction_type",
      width: 80,
      renderCell: ({ row }) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div
            style={{
              justifyItems: "center",
              alignItems: "center",
              height: 12,
              width: 12,
              borderRadius: 500,
              background: row.transaction_type === "INWARD" ? "#39B689" : "red",
            }}
          ></div>
        </div>
      ),
    },
    { headerName: "Qty In", field: "qty_in", width: 100 },
    { headerName: "Qty Out", field: "qty_out", width: 100 },
    { headerName: "Location Inward", field: "location_in", width: 150 },
    { headerName: "Location Outward", field: "location_out", width: 150 },
    // { headerName: "Type", field: "type", width: 150 },
    { headerName: "Transaction", field: "transaction", width: 150 },
    { headerName: "Mode", field: "mode", width: 150 },
    { headerName: "Transaction By", field: "transaction_by", width: 150 },
    { headerName: "Vendor", field: "vendor", width: 150 },
    // { headerName: "Key", field: "key", width: 150 },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rows, columns, "RM Consumption Report");
  };

  const searchBar = () => (
    <Form layout="vertical">
      <Space>
        <div style={{ width: 200 }}>
          <Form.Item label="Part Code">
            <MyAsyncSelect
              placeholder="Search Part Code"
              selectLoading={selectLoading}
              optionsState={asyncOptions}
              onBlur={() => setAsyncOptions([])}
              value={searchObj.part_code}
              loadOptions={getPartCodes}
              onChange={(value) => {
                setSearchObj((obj) => ({
                  ...obj,
                  part_code: value,
                }));
              }}
            />
          </Form.Item>
        </div>
        <div style={{ width: 300 }}>
          <Form.Item label="Select Location">
            <MySelect
              // placeholder="Select Location"
              labelInValue
              value={searchObj.location?.text}
              options={locationOptions}
              onChange={(value) => {
                setSearchObj((obj) => ({
                  ...obj,
                  location: value,
                }));
              }}
            />
          </Form.Item>
        </div>

        <CommonIcons
          action="searchButton"
          loading={searchLoading}
          onClick={getRows}
        />
        <CommonIcons action="downloadButton" onClick={handleDownloadExcel} />
      </Space>
    </Form>
  );
  return (
    <div style={{ height: "90%" }}>
      <SearchHeader title="RM Consumption Report" searchBar={searchBar} />
      <Row gutter={4} style={{ height: "100%", padding: "0px 5px" }}>
        <Col span={4}>
          <SummaryCard summary={summaryData} loading={fetchLoading} />
        </Col>
        <Col span={20}>
          <div style={{ height: "95%" }}>
            <MyDataTable loading={fetchLoading} data={rows} columns={columns} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default RmConsumptionReport;
