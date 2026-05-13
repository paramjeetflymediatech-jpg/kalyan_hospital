import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  google_review_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Google Review',
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  score: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recovery: {
    type: DataTypes.STRING,
    defaultValue: 'N/A',
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
});

export default Testimonial;
