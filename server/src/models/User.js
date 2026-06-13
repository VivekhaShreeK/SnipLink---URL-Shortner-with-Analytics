const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [2, 50],
        msg: 'Name must be 2-50 characters',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'An account with this email already exists.',
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.password && user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
});

// Compare password method
User.prototype.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Getter for _id to maintain compatibility with Mongoose's `._id` references
Object.defineProperty(User.prototype, '_id', {
  get() {
    return this.id;
  },
});

// Remove password from JSON representation by default
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  // Make sure _id is included in JSON to match mongoose
  values._id = values.id;
  return values;
};

module.exports = User;
