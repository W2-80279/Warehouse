const Supplier = require('../models/supplier');

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error });
    }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching supplier', error });
    }
};

// Create a new supplier
exports.createSupplier = async (req, res) => {
    const { supplierName, contactPerson, phone, email, address } = req.body;
    try {
        const newSupplier = await Supplier.create({
            supplierName,
            contactPerson,
            phone,
            email,
            address
        });
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error });
    }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        
        const { supplierName, contactPerson, phone, email, address } = req.body;
        await supplier.update({
            supplierName,
            contactPerson,
            phone,
            email,
            address
        });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Error updating supplier', error });
    }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        await supplier.destroy();
        res.status(204).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supplier', error });
    }
};
