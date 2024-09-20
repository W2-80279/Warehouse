import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData);
      fetchTables(); // Fetch tables after upload
      setFile(null); // Reset file input
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/files/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableClick = (tableName) => {
    navigate(`/datatables/${tableName}`); // Navigate to the data table
  };

  return (
    <Paper style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4">Upload File</Typography>
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Available Tables</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Table Name</TableCell>
              <TableCell>Original File Name</TableCell>
              <TableCell>Upload Time</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.tableName}>
                <TableCell>{table.tableName}</TableCell>
                <TableCell>{table.originalFileName}</TableCell>
                <TableCell>{new Date(table.uploadTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleTableClick(table.tableName)}>
                    View Data
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FileUpload;
