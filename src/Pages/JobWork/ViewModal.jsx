import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { imsAxios } from "../../axiosInterceptor";
import { downloadCSV } from "../../Components/exportToCSV";
import DataGridTable from "../../Components/ui/DataGridTable";

const ViewModal = ({ viewModalOpen, setViewModalOpen }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState([]);
  const [mainData, setMainData] = useState([]);

  const getFecthData = async () => {
    setLoading(true);

    const response = await imsAxios.post("/jobwork/fetchTableAnly", {
      skucode: viewModalOpen.skuKey,
      jw_transaction: viewModalOpen.jwId,
      po_transaction: viewModalOpen.jwId,
    });
    setLoading(false);
    const { data } = response;
    if (data) {
      if (data.code === 200) {
        data.header.map((a) => setView(a));
        let arr = data.data.map((row, index) => ({
          ...row,
          id: v4(),
          index: index + 1,
        }));
        setMainData(arr);
      } else {
        toast.error(data.message.msg);
        setViewModalOpen(false);
      }
    } else {
      setViewModalOpen(false);
      toast.error("Something went wrong");
    }
  };

  const altCell = ({ row }) => {
    // Handle the new backend structure with alts array
    if (row?.alts && Array.isArray(row.alts) && row.alts.length > 0) {
      const altParts = row.alts
        .filter((alt) => alt.alt_component_part !== "N/A")
        .map((alt) => alt.alt_component_part)
        .join(", ");
      const altNames = row.alts
        .filter((alt) => alt.alt_component_name !== "N/A")
        .map((alt) => alt.alt_component_name)
        .join(", ");
      return (
        <Tooltip title={altNames}>
          <span>{altParts}</span>
        </Tooltip>
      );
    }
    const altParts = Array.isArray(row?.alt_component_part)
      ? row.alt_component_part.join(", ")
      : "";
    return (
      <Tooltip title={altParts}>
        <span>{altParts}</span>
      </Tooltip>
    );
  };

  const columns = [
    { field: "index", headerName: "S No.", width: 70 },
    { field: "part_code", headerName: "Part Code", width: 120 },
    { field: "component_name", headerName: "Name", width: 350 },
    { field: "alts", headerName: "Alt Part", width: 150, renderCell: altCell },
    { field: "bom_uom", headerName: "UoM", width: 100 },
    { field: "bom_qty", headerName: "BOM Qty", width: 100 },
    { field: "bom_rate", headerName: "BOM Rate", width: 100 },
    { field: "avgRate", headerName: "Average Rate", width: 120 },
    { field: "required_qty", headerName: "Req. Qty", width: 100 },
    { field: "issue_qty", headerName: "Issue Qty", width: 100 },
    { field: "pending_qty", headerName: "Short/Access", width: 150 },
    { field: "comsump_qty", headerName: "Consumption", width: 120 },
    { field: "rm_return_qty", headerName: "RM Return", width: 120 },
    { field: "p_with_jw", headerName: "Pending With JW", width: 150 },
    { field: "outward_value", headerName: "Outward Value", width: 150 },
    { field: "consump_qty_value", headerName: "Consumption Value", width: 150 },
    { field: "rtn_inward_value", headerName: "RM Return Value", width: 150 },
  ];

  const close = () => {
    setMainData([]);
    setViewModalOpen(false);
  };
  const handleDownload = () => {
    downloadCSV(
      mainData,
      columns,
      `PO analysis FG/SFG : ${viewModalOpen.skuKey} | ${viewModalOpen.jwId}`
    );
  };
  useEffect(() => {
    if (viewModalOpen) {
      getFecthData();
    }
  }, [viewModalOpen]);

  const details = [
    ["JW PO ID", view.jobwork_id],
    ["Jobwork ID", view.jobwork_id],
    ["FG/SFG Name & SKU", view.product_name],
    ["JW PO created by", view.created_by],
    ["FG/SFG BOM of Recipe", view.subject_name],
    ["Registered Date & Time", view.registered_date],
    ["FG/SFG Ord Qty", view.ordered_qty],
    ["Job ID Status", view.jw_status],
    ["FG/SFG processed Qty", view.proceed_qty],
    ["Vendor", view.vendor_name],
  ];

  return (
    <Dialog fullScreen open={!!viewModalOpen} onClose={close}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <IconButton edge="start" onClick={close} sx={{ mr: 1 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }} noWrap>
            FG/SFG : {viewModalOpen?.sku} | {viewModalOpen?.jwId}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleDownload}
            disabled={mainData.length === 0}
          >
            Export CSV
          </Button>
        </Toolbar>
        {loading && <LinearProgress />}
      </AppBar>

      <Box sx={{ p: { xs: 1.5, md: 3 }, bgcolor: "background.default", flex: 1 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {details.map(([label, value]) => (
              <Grid item xs={12} sm={6} md={3} key={label}>
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
                <Typography fontWeight={600}>{value || "—"}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <div style={{ height: "calc(100vh - 330px)", minHeight: 320 }}>
          <DataGridTable loading={loading} columns={columns} rows={mainData} />
        </div>
      </Box>
    </Dialog>
  );
};

export default ViewModal;
