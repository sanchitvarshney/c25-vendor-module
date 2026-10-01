import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

export default function CellText({ text, copy }) {
  const [copied, setCopied] = useState(false);
  const value = text ?? "";
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Tooltip title={String(value)} placement="top-start" enterDelay={400}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", minWidth: 0 }}>
        <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </Box>
        {copy && value !== "" && (
          <IconButton size="small" onClick={handleCopy} sx={{ ml: 0.5, p: 0.25 }}>
            {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
          </IconButton>
        )}
      </Box>
    </Tooltip>
  );
}
