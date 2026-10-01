import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const Toolbar = () => (
  <GridToolbarContainer sx={{ p: 1, gap: 0.5 }}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <Box sx={{ flex: 1 }} />
    <GridToolbarQuickFilter debounceMs={300} />
  </GridToolbarContainer>
);

const NoRows = () => (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
    <InboxOutlinedIcon sx={{ fontSize: 44, opacity: 0.5 }} />
    <Typography variant="body2" mt={1}>No data to display</Typography>
  </Box>
);

export default function DataGridTable({ rows = [], columns, loading, ...rest }) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={!!loading}
      density="compact"
      disableSelectionOnClick
      pageSize={100}
      rowsPerPageOptions={[25, 50, 100, 500]}
      onCellKeyDown={(p, e) => e.stopPropagation()}
      components={{ Toolbar, NoRowsOverlay: NoRows, LoadingOverlay: LinearProgress }}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        "& .MuiDataGrid-columnHeaders": { bgcolor: "#f1f5f9", fontWeight: 700 },
        "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within": { outline: "none" },
        "& .MuiDataGrid-row:hover": { bgcolor: "#f0fdfa" },
      }}
      {...rest}
    />
  );
}
