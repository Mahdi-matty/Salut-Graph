const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

class Follow extends Model {}

Follow.init(
  {
    following_user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },

    },
    followed_user_id: {
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