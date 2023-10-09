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
      Course.belongsTo(models.Proposal);
      models.Proposal.hasOne(Course);
    }
  }
  Course.init({
    proposalId: DataTypes.INTEGER,
    courseStatus: DataTypes.BOOLEAN,
    creditHr: DataTypes.INTEGER,
    courseRating: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};