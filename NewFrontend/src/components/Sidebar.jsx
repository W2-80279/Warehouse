import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  Category,
  Warehouse,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Client Facing", icon: null },
  { text: "Item", icon: <ShoppingCartOutlined /> },
  { text: "Category", icon: <Category /> },
  { text: "Supplier", icon: <ReceiptLongOutlined /> },
  {
    text: "Rack Management",
    icon: <Warehouse />, // You can change this icon as per your preference
    subItems: [
      { text: "RackForm" },
      { text: "Racks" }, 
      { text: "Rack-Slot" },
      
    ],
  },
  { text: "Sales", icon: null },
  { text: "Overview", icon: <PointOfSaleOutlined /> },
  { text: "Daily", icon: <TodayOutlined /> },
  { text: "Monthly", icon: <CalendarMonthOutlined /> },
  { text: "Breakdown", icon: <PieChartOutlined /> },
  { text: "Management", icon: null },
  { text: "Admin", icon: <AdminPanelSettingsOutlined /> },
  { text: "Performance", icon: <TrendingUpOutlined /> },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const [openRack, setOpenRack] = useState(false); // For rack dropdown
  const [openManagement, setOpenManagement] = useState(false); // For rack management dropdown
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1)); // Set active route based on pathname
  }, [pathname]);

  const handleNavigation = (text) => {
    const lcText = text.toLowerCase();
    navigate(`/${lcText}`); // Navigate to the selected route
    setActive(lcText); // Update active state
  };

  const handleRackClick = () => {
    setOpenRack(!openRack); // Toggle the rack dropdown
  };

  const handleManagementClick = () => {
    setOpenManagement(!openManagement); // Toggle the rack management dropdown
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
              height: "100vh",
              overflow: "auto", // Allow scrolling
              "&::-webkit-scrollbar": {
                width: "6px", // Thin scrollbar width
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: theme.palette.mode === "light" ? "#d3d3d3" : "#a9a9a9", // Darker off-white for light mode, grey for dark mode
                borderRadius: "10px", // Rounded scrollbar
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: theme.palette.mode === "light" ? "#f0f0f0" : "#2c2c2c", // Lighter off-white for light mode, darker grey for dark mode
              },
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    WAREhOUSE
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, subItems }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }

                const lcText = text.toLowerCase();

                return (
                  <React.Fragment key={text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={
                          subItems && text === "Rack Management"
                            ? handleManagementClick // Toggle rack management dropdown
                            : subItems
                            ? handleRackClick // Toggle rack dropdown
                            : () => handleNavigation(text) // Navigate
                        }
                        sx={{
                          backgroundColor:
                            active === lcText
                              ? theme.palette.secondary[300]
                              : "transparent",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[100],
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            ml: "2rem",
                            color:
                              active === lcText
                                ? theme.palette.primary[600]
                                : theme.palette.secondary[200],
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        {subItems ? (
                          text === "Rack Management" ? ( // Check if it's the Rack Management item
                            openManagement ? <ExpandLess /> : <ExpandMore />
                          ) : (
                            openRack ? <ExpandLess /> : <ExpandMore />
                          )
                        ) : active === lcText ? (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        ) : null}
                      </ListItemButton>
                    </ListItem>
                    {subItems && text === "Rack Management" && (
                      <Collapse in={openManagement} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subItems.map(({ text: subText, icon: subIcon }) => {
                            const lcSubText = subText.toLowerCase();
                            return (
                              <ListItemButton
                                key={subText}
                                sx={{ pl: 4 }}
                                onClick={() => handleNavigation(subText)}
                              >
                                <ListItemIcon sx={{ ml: "0.5rem" }}>{subIcon}</ListItemIcon>
                                <ListItemText primary={subText} />
                              </ListItemButton>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                    {subItems && text === "Rack" && (
                      <Collapse in={openRack} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subItems.map((subItem) => (
                            <ListItemButton
                              key={subItem}
                              sx={{ pl: 4 }}
                              onClick={() => handleNavigation(subItem)}
                            >
                              <ListItemText primary={subItem} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
