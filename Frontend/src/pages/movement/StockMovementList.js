import React, { useEffect, useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StockMovementList = () => {
    const [stockMovements, setStockMovements] = useState([]);

    useEffect(() => {
        const fetchStockMovements = async () => {
            try {
                const response = await axios.get('/api/stock-movements');
                setStockMovements(response.data);
            } catch (error) {
                console.error('Error fetching stock movements:', error);
            }
        };

        fetchStockMovements();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Stock Movements
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/stock-movements/create">
                Create Stock Movement
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Movement ID</TableCell>
                            <TableCell>Item ID</TableCell>
                            <TableCell>From Rack</TableCell>
                            <TableCell>From Slot</TableCell>
                            <TableCell>To Rack</TableCell>
                            <TableCell>To Slot</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stockMovements.map((movement) => (
                            <TableRow key={movement.movementId}>
                                <TableCell>{movement.movementId}</TableCell>
                                <TableCell>{movement.itemId}</TableCell>
                                <TableCell>{movement.fromRackId}</TableCell>
                                <TableCell>{movement.fromSlotLabel}</TableCell>
                                <TableCell>{movement.toRackId}</TableCell>
                                <TableCell>{movement.toSlotLabel}</TableCell>
                                <TableCell>{movement.quantity}</TableCell>
                                <TableCell>{new Date(movement.movementDate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StockMovementList;
