import React, { useEffect, useState } from "react";
import axios from "axios";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Storage, SwapHoriz, Inventory } from "@mui/icons-material";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import BreakdownChart from "../../components/BreakdownChart";
import StatBox from "../../components/StatBox";
import DetailsPage from "../movement/DetailsPage";
import RackSlotChart from "../../components/RackSlotChart"; // Importing RackSlotChart

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const token = localStorage.getItem("token");

  // State to store counts
  const [itemCount, setItemCount] = useState(0);
  const [rackCount, setRackCount] = useState(0);
  const [slotCount, setSlotCount] = useState(0);
  const [stockMovementCount, setStockMovementCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Function to fetch counts from API
  const fetchCounts = async () => {
    try {
      const itemResponse = await axios.get(`http://localhost:5000/api/items`, { headers: { Authorization: `Bearer ${token}` } });
      setItemCount(itemResponse.data.totalItems);

      const rackResponse = await axios.get(`http://localhost:5000/api/racks/rack/count`, { headers: { Authorization: `Bearer ${token}` } });
      setRackCount(rackResponse.data.total);

      const slotResponse = await axios.get(`http://localhost:5000/api/rack-slots/rack/count`, { headers: { Authorization: `Bearer ${token}` } });
      setSlotCount(slotResponse.data.total);

      const stockMovementResponse = await axios.get(`http://localhost:5000/api/stock-movements/count/stock`, { headers: { Authorization: `Bearer ${token}` } });
      setStockMovementCount(stockMovementResponse.data.total);

      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error("Error fetching counts:", error);
      setIsError(true);
    }
  };

  // useEffect to periodically fetch counts every 5 seconds
  useEffect(() => {
    fetchCounts(); // Fetch counts initially
    const intervalId = setInterval(() => {
      fetchCounts();
    }, 5000); // Set interval to 5 seconds (5000 milliseconds)

    return () => clearInterval(intervalId); // Clear interval when component unmounts
  }, [token]);

  return (
    <FlexBetween>
      <Box 
        sx={{
          background: `linear-gradient(135deg, rgba(${theme.palette.primary.main}, 0.1), rgba(${theme.palette.secondary.main}, 0.1))`, // Very faded gradient
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
        }}
      >
        <FlexBetween>
          <Header title="Warehouse" subtitle="Welcome to your Warehouse management dashboard" />
        </FlexBetween>

        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="160px"
          gap="20px"
          sx={{
            "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
          }}
        >
          {/* ROW 1 */}
          <StatBox
            title="Total Racks"
            value={isLoading ? 'Loading...' : isError ? 'Error' : rackCount}
            description="Racks"
            icon={<Storage sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            sx={{ 
              "&:hover": { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" },
              transition: "0.3s",
              borderRadius: "1rem",
              background: theme.palette.background.default,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <StatBox
            title="Total Slots"
            value={isLoading ? 'Loading...' : isError ? 'Error' : slotCount}
            description="Slots"
            icon={<Inventory sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            sx={{ 
              "&:hover": { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" },
              transition: "0.3s", 
              borderRadius: "1rem",
              background: theme.palette.background.default,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* RackSlotChart */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              background: theme.palette.background.alt,
              borderRadius: "1rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              p: "1rem",
            }}
          >
            <RackSlotChart />
          </Box>

          <StatBox
            title="Stock Movements"
            value={isLoading ? 'Loading...' : isError ? 'Error' : stockMovementCount}
            description="Moving Stock"
            icon={<SwapHoriz sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            sx={{ 
              "&:hover": { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" },
              transition: "0.3s", 
              borderRadius: "1rem",
              background: theme.palette.background.default,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
          <StatBox
            title="Total Items"
            value={isLoading ? 'Loading...' : isError ? 'Error' : itemCount}
            description="Items in inventory"
            icon={<Inventory sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
            sx={{ 
              "&:hover": { boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" },
              transition: "0.3s", 
              borderRadius: "1rem",
              background: theme.palette.background.default,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />

          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 3"
            sx={{
              backgroundColor: theme.palette.background.alt,
              p: "1rem",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              height: "100%",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.secondary[100], mb: "1rem" }}
            >
              Stock Movement Details
            </Typography>
            <Box
              sx={{
                maxHeight: "auto",
                overflowY: "auto",
              }}
            >
              <DetailsPage limit={5} />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 3"
            backgroundColor={theme.palette.background.alt}
            p="1.5rem"
            borderRadius="1rem"
            sx={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", display: 'flex', flexDirection: 'column', alignItems: 'center' }} // Centering the content
          >
            <Typography variant="h6" sx={{ color: theme.palette.secondary[100], mb: "3rem" }}>
              Stock Distribution by Category
            </Typography>
            <BreakdownChart />
            <Typography variant="h6" sx={{ color: theme.palette.secondary[100], mt: "3rem" }}>
              All Available Category
            </Typography>
          </Box>

  
        </Box>
      </Box>
    </FlexBetween>
  );
};

export default Dashboard; 
