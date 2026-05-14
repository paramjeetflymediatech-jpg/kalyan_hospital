import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Seo = sequelize.define('Seo', {
  page_path: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  keywords: {
    type: DataTypes.TEXT,
  },
  og_image: {
    type: DataTypes.STRING,
  },
  header_scripts: {
    type: DataTypes.TEXT,
  },
  footer_scripts: {
    type: DataTypes.TEXT,
  },
  canonical_url: {
    type: DataTypes.STRING,
  },
  og_title: {
    type: DataTypes.STRING,
  },
  og_description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'seo_metadata',
  underscored: true
});

export default Seo;
