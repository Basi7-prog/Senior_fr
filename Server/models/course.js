'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Poposal);
      models.Proposal.hasMany(Course);
    }
  }
  Course.init({
    proposalsId: DataTypes.INTEGER,
    courseStatus: DataTypes.BOOLEAN,
    creditHr: DataTypes.INTEGER,
    cpdId: DataTypes.INTEGER,
    courseRating: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};