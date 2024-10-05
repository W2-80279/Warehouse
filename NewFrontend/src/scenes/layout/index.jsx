import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box display="flex" width="100%" height="100vh"> {/* Use height: 100vh to ensure full viewport height */}
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        {/* Position the Navbar at the top and ensure no blank space */}
        <Box position="sticky" top={0} zIndex={10}> {/* Use position: sticky */}
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </Box>
        {/* Main content */}
        <Box padding="20px" overflow="auto" height="calc(100vh - 64px)"> {/* Adjust height based on Navbar height */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
