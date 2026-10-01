import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAuth } from "../../Features/loginSlice.js/loginSlice";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../../Components/Logo";

const Login = () => {
  document.title = "IMS Login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, message, loading } = useSelector((state) => state.login);
  const [inpVal, setInpVal] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const inputHandler = (name, value) =>
    setInpVal((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = inpVal;
    if (username === "" && password === "") {
      toast.error("Please fill the field");
    } else if (username === "") {
      toast.error("username Field is Empty");
    } else if (password === "") {
      toast.error("password fill is empty");
    } else {
      dispatch(loginAuth({ username, password }));
    }
  };

  useEffect(() => {
    if (message?.length > 0 && user) {
      navigate("/jobwork-analysis");
    }
  }, [user]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          background: "linear-gradient(145deg,#0f172a 0%,#115e59 100%)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Logo />
          <Typography variant="h6" color="inherit">
            IMS Vendor Portal
          </Typography>
        </Stack>
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Stay in sync with
            <br />
            your job work stock.
          </Typography>
          <Typography sx={{ color: "#99f6e4", maxWidth: 420 }}>
            Track job work orders, component consumption and inventory movement in one place.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          Performance &amp; security by{" "}
          <Link href="https://www.mscorpres.com" sx={{ color: "#5eead4" }}>
            MSCorpres Automation Pvt. Ltd.
          </Link>
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Paper variant="outlined" sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" gutterBottom>
            Welcome back
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Sign in to continue to IMS
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Stack spacing={2.5}>
              <TextField
                label="Username / Mobile / CRN Number"
                value={inpVal.username}
                onChange={(e) => inputHandler("username", e.target.value)}
                autoFocus
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={inpVal.password}
                onChange={(e) => inputHandler("password", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
