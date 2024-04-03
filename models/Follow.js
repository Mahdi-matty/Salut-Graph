const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

class Follow extends Model {}

Follow.init(
  {
    followingUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },

    },
    followedUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize
  }
);

module.exports = Follow;