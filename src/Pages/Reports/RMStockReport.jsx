import { Card, Col, Form, Row, Space, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import MyDataTable from "../../Components/MyDataTable";
import MySelect from "../../Components/MySelect";
import showToast from "../../Components/MyToast";
import SearchHeader from "../../Components/SearchHeader";
import SummaryCard from "../../Components/SummaryCard";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { setLocations } from "../../Features/loginSlice.js/loginSlice";
import { toast } from "react-toastify";
import { imsAxios } from "../../axiosInterceptor";
import useApi from "../../hooks/useApi";
import { getComponentOptions } from "../../api/general";
import { convertSelectOptions } from "../../utils/general";
function RMStockReport() {
  document.title = "RM Location Query";
  const [searchLoading, setSearchLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [summaryData, setSummaryData] = useState([
    { title: "Component" },
    { title: "Part Code" },
    { title: "ClosingQty" },
  ]);
  useEffect(() => {
    getLocations();
  }, []);

  const { executeFun, loading } = useApi();

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
    // console.log("searchObj", searchObj);
    // change to trigger deployment
    searchObj.location = locationOptions[0]?.value;
    const response = await imsAxios.post("/jwreport/vq01", searchObj);

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
        { title: "part Code", description: data.response.data1.partno },
        {
          title: "Closing Quantity",
          description: `${data.response.data1.closingqty} ${data.response.data1.uom}`,
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
    const response = await executeFun(
      () => getComponentOptions(search),
      "select"
    );

    setAsyncOptions(response.data);
    // setSelectLoading(true);
    // const { data } = await imsAxios.post("/backend/getComponentByNameAndNo", {
    //   search: search,
    // });
    // setSelectLoading(false);
    // if (data[0]) {
    //   let arr = data.map((row) => ({
    //     value: row.id,
    //     text: row.text,
    //   }));
    //   setAsyncOptions(arr);
    // } else {
    //   setAsyncOptions([]);
    // }
  };

  const columns = [
    { headerName: "Sr. No", field: "serial_no", width: 80 },
    { headerName: "Date", field: "date", flex: 1 },
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
    { headerName: "Qty In", field: "qty_in", flex: 1 },
    { headerName: "Qty Out", field: "qty_out", flex: 1 },
    { headerName: "Location Inward", field: "location_in", flex: 1 },
    { headerName: "Location Outward", field: "location_out", flex: 1 },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rows, columns, "RM Stock Report");
  };

  const searchBar = () => (
    <Form layout="vertical">
      <Space>
        <div style={{ width: 200 }}>
          <Form.Item label="Part Code">
            <MyAsyncSelect
              placeholder="Search Part Code"
              selectLoading={loading("select")}
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
            />{" "}
          </Form.Item>
        </div>
        <div style={{ width: 300 }}>
          {" "}
          <Form.Item label="Select Location">
            <MySelect
              placeholder="Select Location"
              labelInValue
              value={locationOptions[0]?.text}
              // options={locationOptions}
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
      <SearchHeader title="RM Stock" searchBar={searchBar} />
      <Row gutter={4} style={{ height: "100%", padding: "0px 5px" }}>
        <Col span={6}>
          <SummaryCard summary={summaryData} loading={fetchLoading} />
        </Col>
        <Col span={18}>
          <div style={{ height: "97%" }}>
            <MyDataTable loading={fetchLoading} data={rows} columns={columns} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default RMStockReport;
