import React, { useState } from 'react';
import StockMovementForm from './StockMovementForm';
import StockMovementList from './StockMovementList';

const ParentComponent = () => {
  const [stockMovements, setStockMovements] = useState([]);

  const handleStockMovementAdded = (newMovement) => {
    setStockMovements((prev) => [...prev, newMovement]);
  };

  return (
    <div>
      <StockMovementForm onStockMovementAdded={handleStockMovementAdded} />
      <StockMovementList />
    </div>
  );
};

export default ParentComponent;
