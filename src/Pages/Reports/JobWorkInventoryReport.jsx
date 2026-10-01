import { useState } from "react";
import { toast } from "react-toastify";
import { Button, CircularProgress, Paper, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { imsAxios } from "../../axiosInterceptor";
import { downloadCSV } from "../../Components/exportToCSV";
import DateRangeField from "../../Components/ui/DateRangeField";
import DataGridTable from "../../Components/ui/DataGridTable";
import CellText from "../../Components/ui/CellText";
import PageHeader from "../../Components/ui/PageHeader";

const JobWorkInventoryReport = () => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [searchDateRange, setSearchDateRange] = useState("");
  const vendor = localStorage.getItem("vendor");

  const getSearchResults = async () => {
    setRows([]);
    if (!searchDateRange) {
      toast.error("Please select start and end dates for the results");
      return;
    }
    setSearchLoading(true);
    const { data, success, message } = await imsAxios.post("/report37", {
      data: searchDateRange,
      wise: "date",
      vendor: vendor,
    });
    setSearchLoading(false);
    if (success) {
      setRows(
        data?.map((row, index) => ({ ...row, id: index + 1, index: index + 1 })) ?? []
      );
    } else if (message) {
      toast.error(message);
    }
  };

  return (
    <>
      <PageHeader
        title="Job Work Inventory Report"
        subtitle="Opening, inward, outward and closing stock by component"
        actions={
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={rows.length === 0}
            onClick={() => downloadCSV(rows, columns, "Job Work Inventory Report")}
          >
            Export CSV
          </Button>
        }
      />
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-start" }}>
          <DateRangeField setDateRange={setSearchDateRange} />
          <Button
            variant="contained"
            sx={{ height: 40, minWidth: 110 }}
            startIcon={searchLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
            disabled={searchLoading || !searchDateRange}
            onClick={getSearchResults}
          >
            Search
          </Button>
        </Stack>
      </Paper>
      <div style={{ height: "calc(100vh - 290px)", minHeight: 360 }}>
        <DataGridTable loading={searchLoading} rows={rows} columns={columns} />
      </div>
    </>
  );
};

export default JobWorkInventoryReport;

const qty = (headerName, field, width = 110) => ({ headerName, field, width, align: "right", headerAlign: "right" });

const columns = [
  { headerName: "#", width: 50, field: "id" },
  {
    headerName: "Part",
    field: "PART",
    width: 130,
    renderCell: ({ row }) => <CellText text={row.PART} />,
  },
  {
    headerName: "Component",
    width: 350,
    field: "COMPONENT",
    renderCell: ({ row }) => <CellText text={row.COMPONENT} />,
  },
  { headerName: "Unit", width: 90, field: "UNIT" },
  qty("Opening Qty", "Opening"),
  qty("Opening Rate", "OpeningRate"),
  qty("Opening Value", "OpeningValue"),
  qty("Inward Qty", "Inward"),
  qty("Inward Rate", "InwardRate"),
  qty("Inward Value", "InwardValue"),
  qty("Outward Qty", "Outward"),
  qty("Outward Rate", "OutwardRate"),
  qty("Outward Value", "OutwardValue"),
  qty("Closing Qty", "closing"),
  qty("Closing Rate", "closingRate"),
  qty("Closing Value", "closingValue"),
];
