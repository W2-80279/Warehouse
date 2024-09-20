import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditItemModal from './EditItemModal';

const DataTable = () => {
  const { tableName } = useParams(); // Get the tableName from the route parameters
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableName) {
        setError('No table name provided');
        return;
      }

      try {
        console.log(`Fetching data for table: ${tableName}, Page: ${page + 1}, Rows per page: ${rowsPerPage}`);
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/files/data/${tableName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page + 1,
            limit: rowsPerPage,
          },
        });

        console.log('Response received:', response.data);
        
        setData(response.data.rows); // Assuming response contains the data array
        setTotalRows(response.data.total); // Assuming response contains total rows
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, [tableName, page, rowsPerPage]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/files/data/${tableName}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(data.filter(item => item.id !== id));
      setTotalRows(totalRows - 1);
      console.log(`Deleted item with id: ${id}`);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Error deleting item');
    }
  };

  const handleSave = (updatedItem) => {
    setData(data.map(item => (item.id === updatedItem.id ? updatedItem : item)));
    setShowModal(false);
    console.log('Updated item:', updatedItem);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(`Changed to page: ${newPage + 1}`);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
    console.log(`Rows per page changed to: ${event.target.value}`);
  };

  if (!tableName) {
    return <p>No table selected</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data.length) {
    return <p>No data available</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableCell key={header}>{header}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                {headers.map((header) => (
                  <TableCell key={header}>{row[header]}</TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => handleEdit(row)} variant="outlined" color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(row.id)} variant="outlined" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div>
        <Button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0}>Previous</Button>
        <Button onClick={() => handleChangePage(null, page + 1)} disabled={page >= Math.ceil(totalRows / rowsPerPage) - 1}>Next</Button>
        
        <FormControl variant="outlined" margin="normal">
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Rows per page"
          >
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>

        <p>{`Page ${page + 1} of ${Math.ceil(totalRows / rowsPerPage)}`}</p>
      </div>

      {editingItem && (
        <EditItemModal
          open={showModal}
          onClose={() => setShowModal(false)}
          item={editingItem}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DataTable;
