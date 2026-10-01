import React from "react";

import { useState, useEffect } from "react";
import { Col, Input, Row, Space, Button } from "antd";
import MySelect from "../../Components/MySelect";
import MyDatePicker from "../../Components/MyDatePicker";
import MyDataTable from "../../Components/MyDataTable";
import axios from "axios";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { toast } from "react-toastify";
import printFunction, {
  downloadFunction,
} from "../../Components/printFunction";
import { imsAxios } from "../../axiosInterceptor";

const ViewSFG = () => {
  document.title = "View SFG";
  const [wise, setWise] = useState("DATE");

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [rows, setRows] = useState([]);
  const [showView, setShowView] = useState(false);

  const printwocompleted = async (row) => {
    try {
      setLoading("fetch");
      const response = await imsAxios.post(
        "/createwo/print_wo_completed_list",
        {
          transaction: row.transactionId,
        }
      );
      const { data } = response;
      printFunction(response.data.data.buffer.data);
      toast.success(data.message);
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadwocompleted = async (row) => {
    try {
      setLoading("fetch");
      const response = await imsAxios.post(
        "/createwo/print_wo_completed_list",
        {
          transaction: row.transactionId,
        }
      );
      const { data } = response;
      downloadFunction(response.data.data.buffer.data);
      toast.success(data.message);
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  };
  const downloadCol = () => {
    downloadCSV(rows, columns, "VR01 Report");
  };
  const options = [
    { text: "Date Wise", value: "DATE" },
    { text: "SFG Wise", value: "SFG" },
    { text: "JW wise", value: "JW" },
  ];
  const getRows = async () => {
    try {
      setLoading("fetch");
      const response = await imsAxios.post("/jwvendor/vendorSfgInwardList", {
        wise: wise,
        data: searchInput,
      });
      const { data } = response;
      console.log(data);
      if (data.code === 200) {
        const arr = data.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        console.log("arr", arr);
        setRows(arr);
      } else {
        toast.error(data.message.msg);
        setRows([]);
      }
    } catch (error) {
      console.log("some error occured while fetching rows", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setSearchInput("");
  }, [wise]);

  return (
    <>
      <div style={{ height: "90%" }}>
        <Row style={{ padding: 5, paddingTop: 0 }} justify="space-between">
          <Col>
            <Space>
              <div style={{ paddingBottom: "10px" }}>
                <Space>
                  <div style={{ width: 250 }}>
                    <MySelect
                      options={options}
                      value={wise}
                      onChange={(value) => setWise(value)}
                    />
                  </div>
                  <div style={{ width: 250 }}>
                    {wise === "DATE" ? (
                      <MyDatePicker setDateRange={setSearchInput} />
                    ) : (
                      <Input
                        placeholder="Enter Code"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    )}
                  </div>

                  <Button
                    onClick={getRows}
                    loading={loading === "fetch"}
                    type="primary"
                  >
                    Fetch
                  </Button>
                </Space>
              </div>
            </Space>
          </Col>
          <CommonIcons
            action="downloadButton"
            onClick={downloadCol}
            type="primary"
          />
        </Row>
        <div style={{ height: "95%", paddingRight: 5, paddingLeft: 5 }}>
          <MyDataTable
            loading={loading === "fetch"}
            data={rows}
            columns={columns}
          />
        </div>
      </div>
    </>
  );
};

// {
//     "code": 200,
//     "status": "success",
//     "data": [
//         {
//             "jw_id": "JWORD/23-24/0150",
//             "jw_challan": "JW/23-24/0510",
//             "sku": "SFG105",
//             "qty": "1",
//             "rate": "0.01",
//             "create_date": "09-01-2024",
//             "create_by": "Somendra Yadav"
//         }
//     ]
// }

const columns = [
  {
    headerName: "#",
    width: "50",
    field: "id",
  },
  {
    headerName: "Jw Id",
    flex: 1,
    field: "jw_id",
  },
  {
    headerName: "Jw Challan",
    flex: 1,
    field: "jw_challan",
  },
  {
    headerName: "SKU",
    flex: 1,
    field: "sku",
  },
  {
    headerName: "Qty",
    flex: 1,
    field: "qty",
  },
  {
    headerName: "Rate",
    width: "100",
    flex: 1,
    field: "rate",
  },
  {
    headerName: "Created Date",
    flex: 1,
    field: "create_date",
  },
  {
    headerName: "Created By",
    flex: 1,
    field: "create_by",
  },
];

export default ViewSFG;
