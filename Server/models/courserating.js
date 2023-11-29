'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CourseRating.belongsTo(models.rating_type);
      models.rating_type.hasMany(CourseRating);
      CourseRating.belongsTo(models.Course);
      models.Course.hasMany(CourseRating);
    }
  }
  CourseRating.init({
    courseId:DataTypes.INTEGER,
    excellent: DataTypes.INTEGER,
    veryGood: DataTypes.INTEGER,
    UnableToDecide: DataTypes.INTEGER,
    poor: DataTypes.INTEGER,
    veryPoor: DataTypes.INTEGER,
    ratingTypeId: DataTypes.INTEGER,
    ExpectedNoOfParticipants: DataTypes.INTEGER,
    TotalParticipanted: DataTypes.INTEGER,
    ResponseRate: DataTypes.INTEGER,
    SatisfactionRate: DataTypes.INTEGER,
    UnableToDecideRate: DataTypes.INTEGER,
    PoorSatisfactionRate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseRating',
  });
  return CourseRating;
};