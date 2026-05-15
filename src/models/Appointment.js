import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const Appointment = sequelize.define('Appointment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
  },
  service: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  internal_notes: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'appointments',
  underscored: true
});

export default Appointment;
