const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Url = require('./Url');

const Visit = sequelize.define('Visit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  urlId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Url,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ip: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  userAgent: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  browser: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  os: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  device: {
    type: DataTypes.STRING,
    defaultValue: 'unknown',
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'Unknown',
  },
  referrer: {
    type: DataTypes.STRING,
    defaultValue: 'Direct',
  },
}, {
  timestamps: false,
  indexes: [
    {
      fields: ['urlId', 'timestamp'],
    },
  ],
});

// Associations
Visit.belongsTo(Url, { foreignKey: 'urlId', as: 'urlDetail' });
Url.hasMany(Visit, { foreignKey: 'urlId', onDelete: 'CASCADE' });

// Getter for _id and url to maintain compatibility with Mongoose's `._id` and `.url` references
Object.defineProperty(Visit.prototype, '_id', {
  get() {
    return this.id;
  },
});

Object.defineProperty(Visit.prototype, 'url', {
  get() {
    return this.urlId;
  },
});

// toJSON override to match mongoose structure
Visit.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.url = values.urlId;
  return values;
};

module.exports = Visit;
