const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Story extends Model {}

Story.init(
    {
      imageSource : {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Assuming each post must have a user
      },
    },
    {
  
      sequelize,
      hooks: {
        afterCreate: (story, options) => {
          // Define the time period after which the story should be deleted (e.g., 1 hour)
          const deletionTime = new Date();
          deletionTime.setHours(deletionTime.getHours() + 1); // 1 hour from now
          
          // Schedule deletion of the story after the specified time
          setTimeout(async () => {
            try {
              // Delete the story
              await Story.destroy({ where: { id: story.id } });
              console.log(`Story ${story.id} deleted after 1 hour.`);
            } catch (error) {
              console.error('Error deleting story:', error);
            }
          }, deletionTime - Date.now());
        },
    }
    }
  );
  
  module.exports = Story;