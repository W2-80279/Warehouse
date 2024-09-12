const Item = require('./Item');
const Category = require('./Category');
const Supplier = require('./Supplier');
const Rack = require('./Rack');
const RackSlot = require('./RackSlot');
const RackItem = require('./RackItem');
const User = require('./User');

// Define associations
Item.belongsTo(Category, { foreignKey: 'categoryId' });
Item.belongsTo(Supplier, { foreignKey: 'supplierId' });
Category.hasMany(Item, { foreignKey: 'categoryId' });
Supplier.hasMany(Item, { foreignKey: 'supplierId' });

RackItem.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(RackItem, { foreignKey: 'itemId' });

Rack.hasMany(RackSlot, { foreignKey: 'rackId' });
RackSlot.belongsTo(Rack, { foreignKey: 'rackId' });

RackItem.belongsTo(RackSlot, { foreignKey: 'rackSlotId' });
RackSlot.hasMany(RackItem, { foreignKey: 'rackSlotId' });

module.exports = {
    Item,
    Category,
    Supplier,
    Rack,
    RackSlot,
    RackItem,
    User
};
