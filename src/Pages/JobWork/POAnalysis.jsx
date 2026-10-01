import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, CircularProgress, Paper, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { imsAxios } from "../../axiosInterceptor";
import { downloadCSV } from "../../Components/exportToCSV";
import { downloadFunction, printFunction } from "../../Components/printFunction";
import DateRangeField from "../../Components/ui/DateRangeField";
import DataGridTable from "../../Components/ui/DataGridTable";
import CellText from "../../Components/ui/CellText";
import PageHeader from "../../Components/ui/PageHeader";
import ViewModal from "./ViewModal";

const POAnalysis = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [advancedDate, setAdvancedDate] = useState("");
  const vendor = localStorage.getItem("vendor");

  const getRows = async () => {
    const payload = {
      wise: "vendorwise",
      advanced: true,
      dateRange: advancedDate,
      data: vendor,
    };
    setLoading("fetch");
    const response = await imsAxios.post("/jobwork/jw_analysis", payload);
    setLoading(false);
    const { data } = response;
    let arr = [];
    if (data) {
      if (data.code === 200) {
        arr = data.data.map((row, index) => ({
          id: index + 1,
          date: row.date,
          jwId: row.po_sku_transaction,
          vendor: row.vendor,
          sku: row.skucode,
          product: row.skuname,
          reqQty: row.requiredqty,
          status: row.po_status,
          recipeStatus: row.bom_recipe,
          poStatus: row.po_status,
          skuKey: row.sku,
          project_description: row.project_description,
          project_name: row.project_name,
        }));
      } else {
        toast.error(data.message.msg);
      }
    }
    setRows(arr);
  };

  const handlePrint = async (jwId, action) => {
    setLoading("print");
    const response = await imsAxios.post("/jobwork/print_jw_analysis", {
      transaction: jwId,
    });
    setLoading(false);
    const { data } = response;
    if (data) {
      if (action === "print") {
        printFunction(data.data.buffer.data);
      } else {
        downloadFunction(data.data.buffer.data, jwId);
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  const actionColumn = {
    headerName: "",
    field: "actions",
    type: "actions",
    width: 40,
    getActions: ({ row }) => [
      <GridActionsCellItem
        showInMenu
        disabled={row.recipeStatus === "PENDING"}
        label="View"
        onClick={() => setViewModalOpen(row)}
      />,
      <GridActionsCellItem
        showInMenu
        label="Print"
        onClick={() => handlePrint(row.jwId, "print")}
      />,
      <GridActionsCellItem
        showInMenu
        label="Download"
        onClick={() => handlePrint(row.jwId, "download")}
      />,
    ],
  };

  return (
    <>
      <PageHeader
        title="Job Work Analysis"
        subtitle="Job work orders raised against your account"
        actions={
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={rows.length === 0}
            onClick={() => downloadCSV(rows, columns, "PO Analysis Report")}
          >
            Export CSV
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-start" }}>
          <DateRangeField setDateRange={setAdvancedDate} />
          <Button
            variant="contained"
            sx={{ height: 40, minWidth: 110 }}
            startIcon={loading === "fetch" ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
            disabled={loading === "fetch" || !advancedDate}
            onClick={getRows}
          >
            Fetch
          </Button>
        </Stack>
      </Paper>
      <div style={{ height: "calc(100vh - 290px)", minHeight: 360 }}>
        <DataGridTable
          loading={loading === "fetch" || loading === "print"}
          columns={[actionColumn, ...columns]}
          rows={rows}
        />
      </div>
      <ViewModal setViewModalOpen={setViewModalOpen} viewModalOpen={viewModalOpen} />
    </>
  );
};

export default POAnalysis;

const columns = [
  { headerName: "#", width: 50, field: "id" },
  {
    headerName: "Date",
    field: "date",
    width: 150,
    renderCell: ({ row }) => <CellText text={row.date} />,
  },
  {
    headerName: "Jobwork ID",
    field: "jwId",
    width: 210,
    renderCell: ({ row }) => <CellText text={row.jwId} copy />,
  },
  {
    headerName: "Vendor",
    field: "vendor",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row }) => <CellText text={row.vendor} />,
  },
  {
    headerName: "SKU",
    field: "sku",
    width: 150,
    renderCell: ({ row }) => <CellText text={row.sku} copy />,
  },
  {
    headerName: "Product",
    field: "product",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row }) => <CellText text={row.product} />,
  },
  { headerName: "Required Qty", field: "reqQty", width: 130 },
  {
    headerName: "Project ID",
    field: "project_name",
    width: 200,
    renderCell: ({ row }) => <CellText text={row.project_name} copy />,
  },
  {
    headerName: "Project Description",
    field: "project_description",
    width: 220,
    renderCell: ({ row }) => <CellText text={row.project_description} />,
  },
];
