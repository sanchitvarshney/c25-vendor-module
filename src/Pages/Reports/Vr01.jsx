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

const Vr01 = () => {
  document.title = "All RM Transaction";
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
  const getRows = async () => {
    try {
      setLoading("fetch");
      const response = await imsAxios.post("/vr01/partTransaction", {
        date: searchInput,
      });
      const { data } = response;
      console.log(data);
      if (data.code === 200) {
        const arr = data.response.data.map((row, index) => ({
          id: index + 1,
          date: row.date,
          part: row.part,
          part_code: row.part_code,
          type: row.type,
          qty: row.qty,
          hsn: row.hsn,
          txn_id: row.txn_id,
        }));
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
                    <MyDatePicker setDateRange={setSearchInput} />
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

// id: index + 1,
//         date: row.date,
//         requiredQty: row.ord_qty,
//         sku: row.sku_name,
//         product: row.sku_code,
//         transactionId:
const columns = [
  {
    headerName: "#",
    width: 30,
    field: "id",
  },
  {
    headerName: "Date",
    Width: 200,
    field: "date",
  },
  {
    headerName: "Part",
    width: 130,
    field: "part",
  },
  {
    headerName: "Part Code",
    width: 250,
    field: "part_code",
  },
  {
    headerName: "Type",
    width: 200,
    field: "type",
  },
  {
    headerName: "Quantity",
    width: 150,
    field: "qty",
  },
  {
    headerName: "HSN",
    width: 150,
    field: "hsn",
  },
  {
    headerName: "Transaction Id",
    width: 150,
    field: "txn_id",
  },
];

export default Vr01;
