const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categoryRoutes');
const auditRoutes = require('./routes/auditRoutes');
const itemRoutes = require('./routes/itemRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const labelRoutes = require('./routes/labelRoutes');
const rackRoutes = require('./routes/rackRoutes');
const rackItemRoutes = require('./routes/rackItemRoutes');
const rackSlotRoutes = require('./routes/rackSlotRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');
const roleRoutes = require('./routes/roles');
const fileRoutes = require('./routes/fileRoutes'); // Import file routes

const { sequelize } = require('./config/db'); // Import the Sequelize instance
const FileMetadata = require('./models/fileMetadata'); // Import the FileMetadata model
require('dotenv').config(); // Load environment variables

// Import models and associations
require('./models/associations'); // Ensure associations are set up

// Middleware
app.use(express.json());
app.use(cors()); // Consider configuring CORS options if needed

// Test database connection and sync models
sequelize.sync({ force: false })
    .then(async () => {
        console.log('Database connected and models synchronized.');
        // Sync the FileMetadata model
        await FileMetadata.sync(); // Ensure metadata table is created
        console.log('FileMetadata table synchronized.');
    })
    .catch(err => {
        console.error('Error syncing the database:', err);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/audit-trail', auditRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/racks', rackRoutes);
app.use('/api/rack-items', rackItemRoutes);
app.use('/api/rack-slots', rackSlotRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/files', fileRoutes); // Use file routes

// Default route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Authentication API'); // Consider removing or updating for production
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs error stack trace
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
