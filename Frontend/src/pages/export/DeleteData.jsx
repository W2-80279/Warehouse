import React from 'react';
import axios from 'axios';

const DeleteData = ({ tableName, recordId, onSuccess }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/data/${tableName}/${recordId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onSuccess(); // Notify parent component of success
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteData;
