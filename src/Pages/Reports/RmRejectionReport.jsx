import { useState, useEffect } from "react";
import { Col, Input, Row, Space, Button } from "antd";
import MySelect from "../../Components/MySelect";
import MyDatePicker from "../../Components/MyDatePicker";
import MyDataTable from "../../Components/MyDataTable";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { CommonIcons } from "../../Components/TableActions.jsx/TableActions";
import { downloadCSV } from "../../Components/exportToCSV";
import MyAsyncSelect from "../../Components/MyAsyncSelect";
import { toast } from "react-toastify";
import printFunction, {
  downloadFunction,
} from "../../Components/printFunction";
import { imsAxios } from "../../axiosInterceptor";

const RmRejectionReport = () => {
  document.title = "RM Rejection";
  const [wise, setWise] = useState("txn_id");
  const actionColumn = {
    headerName: "",
    field: "actions",
    width: 10,
    type: "actions",
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => {
          setShowView({
            woId: row.transactionId,
            subjectId: row.bomid,
            sku: row.productId,
          });
        }}
        label="View"
      />,
      // <GridActionsCellItem
      //   showInMenu
      //   // disabled={loading}
      //   onClick={() => {
      //     downloadwocompleted(row);
      //   }}
      //   label="Re Open"
      // />,
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => printwocompleted(row)}
        label="Print"
      />,
      <GridActionsCellItem
        showInMenu
        // disabled={loading}
        onClick={() => {
          downloadwocompleted(row);
        }}
        label="Download"
      />,
    ],
  };
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
  // "txn_id / txn_part / txn_date"
  useEffect(() => {
    if (wise) {
      setSearchInput("");
    }
  }, [wise]);

  const options = [
    { text: "Transaction Id", value: "txn_id" },
    { text: "Transaction Part", value: "txn_part" },
    { text: "Transaction Date", value: "txn_date" },
  ];
  const getRows = async () => {
    console.log("searchInput", searchInput);
    try {
      setLoading("fetch");
      const response = await imsAxios.post("/vr04", {
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
        // console.log("arr", arr);
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
                  {wise === "txn_date" ? (
                    <div style={{ width: 250 }}>
                      <MyDatePicker setDateRange={setSearchInput} />
                    </div>
                  ) : (
                    <div style={{ width: 250 }}>
                      <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        // onChange={(value) => setSearchInput(value)}
                        // setDateRange={setSearchInput}
                        placeholder="Search here"
                      />
                    </div>
                  )}
                  {/* <div style={{ width: 250 }}>
                    <MyDatePicker setDateRange={setSearchInput} />
                  </div> */}

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
        <div style={{ height: "90%", paddingRight: 5, paddingLeft: 5 }}>
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

// id: index + 1,
//         date: row.date,
//         requiredQty: row.ord_qty,
//         sku: row.sku_name,
//         product: row.sku_code,
//         transactionId:
// {
//         "part_no": "P3741",
//         "part_name": "Battery 3.7V, 2000mah without BMS",
//         "unit": "Pcs",
//         "qty": "10",
//         "hsn": "--",
//         "doc_ref": "JW/23-24/0065",
//         "doc_date": "--",
//         "create_dt": "21-12-2023 11:03:40",
//         "create_by": "user_name",
//     }

// "data": {
//     "part_no": "PART_CODE",
//     "part_name": "PART_NAME",
//     "unit": "UOM",
//     "qty": 00,
//     "txn_id": 123000,
//     "txn_remark": "NA",
//     "create_dt": "DD-MM-YYYY HH:mm:ss",
//     "create_by": "NAME"
// }

const columns = [
  {
    headerName: "#",
    width: "50",
    field: "id",
  },
  {
    headerName: "Part Code",
    width: "100",
    field: "part_no",
  },
  {
    headerName: "Part Name",
    width: "250",
    field: "part_name",
  },
  {
    headerName: "Qty",
    width: "50",
    field: "qty",
  },
  {
    headerName: "Unit",
    flex: 1,
    field: "unit",
  },
  {
    headerName: "Transacton Id",
    width: "140",
    field: "txn_id",
  },
  {
    headerName: "Created Date",
    width: "150",
    field: "create_dt",
  },
  {
    headerName: "Created By",
    width: 150,
    field: "create_by",
  },
  {
    headerName: "Transaction Remark",
    width: "250",
    field: "txn_remark",
  },
];

export default RmRejectionReport;
