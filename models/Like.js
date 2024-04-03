const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class Like extends Model {}

Like.init(
  {
   status: {
    type: DataTypes.ENUM('notLiked', 'liked'),
      defaultValue: 'notLiked'
   },
   userId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assuming each post must have a user
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  },
  {
    sequelize,
  }
);

module.exports = Like;