import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box display="flex" width="100%" height="100vh"> {/* Use 100vh for full viewport height */}
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="240px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1} display="flex" flexDirection="column" height="100vh"> {/* Make sure this takes the full height */}
        <Box position="sticky" top={0} zIndex={10}>
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </Box>
        <Box padding="10px" overflow="auto" flexGrow={1} height="100%">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
