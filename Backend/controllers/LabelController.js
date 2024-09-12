const Label = require('../models/Label');

// Get all labels
exports.getAllLabels = async (req, res) => {
    try {
        const labels = await Label.findAll();
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching labels', error });
    }
};

// Get label by ID
exports.getLabelById = async (req, res) => {
    try {
        const label = await Label.findByPk(req.params.id);
        if (!label) return res.status(404).json({ message: 'Label not found' });
        res.status(200).json(label);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching label', error });
    }
};

// Create a new label
exports.createLabel = async (req, res) => {
    const { rackItemId, labelCode, dateGenerated } = req.body;
    try {
        const newLabel = await Label.create({
            rackItemId,
            labelCode,
            dateGenerated
        });
        res.status(201).json(newLabel);
    } catch (error) {
        res.status(500).json({ message: 'Error creating label', error });
    }
};

// Update a label
exports.updateLabel = async (req, res) => {
    try {
        const label = await Label.findByPk(req.params.id);
        if (!label) return res.status(404).json({ message: 'Label not found' });
        
        const { rackItemId, labelCode, dateGenerated } = req.body;
        await label.update({
            rackItemId,
            labelCode,
            dateGenerated
        });
        res.status(200).json(label);
    } catch (error) {
        res.status(500).json({ message: 'Error updating label', error });
    }
};

// Delete a label
exports.deleteLabel = async (req, res) => {
    try {
        const label = await Label.findByPk(req.params.id);
        if (!label) return res.status(404).json({ message: 'Label not found' });

        await label.destroy();
        res.status(204).json({ message: 'Label deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting label', error });
    }
};
