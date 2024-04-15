const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Notification extends Model { }

Notification.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      defaultValue: 'unread'
    }
   
},{
    sequelize, 
});
  
module.exports = Notification;