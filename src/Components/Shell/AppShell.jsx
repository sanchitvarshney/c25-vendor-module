import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Select,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import Logo from "../Logo";

const WIDTH = 248;
const MINI = 68;

export default function AppShell({
  user,
  navItems,
  session,
  sessionOptions,
  onSessionChange,
  onLogout,
  notificationCount,
  notificationPending,
  notificationsNode,
  showTestSwitch,
  testPage,
  testLoading,
  onTestChange,
  children,
}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [userAnchor, setUserAnchor] = useState(null);
  const [bellAnchor, setBellAnchor] = useState(null);
  const collapsed = isDesktop && mini;
  const width = collapsed ? MINI : WIDTH;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0f172a",
        color: "#cbd5e1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, height: 64 }}>
        <Logo />
        {!collapsed && (
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.1 }}>IMS</Typography>
            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Vendor Portal</Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ px: 1.25, py: 1.5, flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.to;
          return (
            <Tooltip key={item.to} title={collapsed ? item.label : ""} placement="right">
              <ListItemButton
                component={RouterLink}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: active ? "#fff" : "inherit",
                  bgcolor: active ? "primary.main" : "transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                  "&:hover": { bgcolor: active ? "primary.dark" : "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: collapsed ? 0 : 38 }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      {!collapsed && (
        <Typography sx={{ px: 2, pb: 2, fontSize: 11, color: "#64748b" }}>
          MSCorpres Automation Pvt. Ltd.
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop ? true : mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isDesktop ? width : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isDesktop ? width : WIDTH,
            border: 0,
            transition: "width .2s",
            overflowX: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <IconButton
              edge="start"
              onClick={() => (isDesktop ? setMini((m) => !m) : setMobileOpen(true))}
            >
              {isDesktop && !mini ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Select
              size="small"
              value={session}
              onChange={(e) => onSessionChange(e.target.value)}
              sx={{ minWidth: 130, fontWeight: 600 }}
            >
              {sessionOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ flex: 1 }} />
            {showTestSwitch && (
              <FormControlLabel
                label={testPage ? "Test" : "Live"}
                control={
                  <Switch
                    size="small"
                    checked={testPage}
                    disabled={testLoading}
                    onChange={(e) => onTestChange(e.target.checked)}
                  />
                }
              />
            )}
            <IconButton onClick={(e) => setBellAnchor(e.currentTarget)}>
              <Badge
                badgeContent={notificationCount}
                color={notificationPending ? "warning" : "success"}
              >
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <Box
              onClick={(e) => setUserAnchor(e.currentTarget)}
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", ml: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
                {user?.userName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ display: { xs: "none", sm: "block" }, fontWeight: 600 }}>
                {user?.userName?.split(" ")[0]}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 1.5, md: 3 }, minWidth: 0 }}>
          {children}
        </Box>
      </Box>

      <Menu anchorEl={userAnchor} open={!!userAnchor} onClose={() => setUserAnchor(null)}>
        <MenuItem disabled sx={{ opacity: "1 !important" }}>
          <Box>
            <Typography fontWeight={700}>{user?.userName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setUserAnchor(null);
            onLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Popover
        anchorEl={bellAnchor}
        open={!!bellAnchor}
        onClose={() => setBellAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            width: 380,
            maxWidth: "90vw",
            "& .notifications": { position: "static !important", width: "100% !important" },
          }}
        >
          {notificationsNode}
        </Box>
      </Popover>
    </Box>
  );
}
