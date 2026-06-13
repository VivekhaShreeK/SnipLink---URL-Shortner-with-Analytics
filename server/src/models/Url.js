const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Url = sequelize.define('Url', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  originalUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Original URL is required',
      },
    },
  },
  shortCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customAlias: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  lastVisitedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  timestamps: true,
});

// Associations
Url.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Url, { foreignKey: 'userId' });

// Getter for effectiveCode (virtual in mongoose)
Object.defineProperty(Url.prototype, 'effectiveCode', {
  get() {
    return this.customAlias || this.shortCode;
  },
});

// Getter for _id and user to maintain compatibility with Mongoose's `._id` and `.user` references
Object.defineProperty(Url.prototype, '_id', {
  get() {
    return this.id;
  },
});

Object.defineProperty(Url.prototype, 'user', {
  get() {
    return this.userId;
  },
});

// Check if URL is expired method
Url.prototype.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// toJSON override to match mongoose structure
Url.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.user = values.userId;
  values.effectiveCode = this.effectiveCode;
  return values;
};

module.exports = Url;
