import React, { useEffect, useState } from "react";
import { Box, Chip, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";

const ISO = "YYYY-MM-DD";

const presets = [
  { label: "Today", from: () => dayjs(), to: () => dayjs() },
  { label: "Last 7 days", from: () => dayjs().subtract(7, "d"), to: () => dayjs() },
  { label: "This month", from: () => dayjs().startOf("month"), to: () => dayjs() },
  {
    label: "Last month",
    from: () => dayjs().subtract(1, "month").startOf("month"),
    to: () => dayjs().subtract(1, "month").endOf("month"),
  },
  { label: "Last 3 months", from: () => dayjs().subtract(89, "d"), to: () => dayjs() },
];

// Reports "DD-MM-YYYY-DD-MM-YYYY" through setDateRange, same as the old MyDatePicker.
export default function DateRangeField({ setDateRange, format = "DD-MM-YYYY" }) {
  const [from, setFrom] = useState(dayjs().subtract(89, "d").format(ISO));
  const [to, setTo] = useState(dayjs().format(ISO));

  useEffect(() => {
    if (from && to) {
      setDateRange(dayjs(from).format(format) + "-" + dayjs(to).format(format));
    } else {
      setDateRange("");
    }
  }, [from, to]);

  const today = dayjs().format(ISO);
  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <TextField
          label="From"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: to || today }}
        />
        <TextField
          label="To"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: from, max: today }}
        />
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
        {presets.map((p) => (
          <Chip
            key={p.label}
            size="small"
            label={p.label}
            variant="outlined"
            onClick={() => {
              setFrom(p.from().format(ISO));
              setTo(p.to().format(ISO));
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
