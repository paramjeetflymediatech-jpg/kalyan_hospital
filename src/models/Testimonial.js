import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Testimonial = sequelize.define('Testimonial', {
  google_review_id: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
  },
  text: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING(512),
  },
  score: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
  },
  time: {
    type: DataTypes.STRING,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'testimonials',
  underscored: true
});

export default Testimonial;
