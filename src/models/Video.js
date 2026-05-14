import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Video = sequelize.define('Video', {
  youtube_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  thumbnail: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General'
  },
  published_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'videos',
  underscored: true
});

export default Video;
