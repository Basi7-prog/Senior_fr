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
    OverallTrainingContent: DataTypes.INTEGER,
    TrainingMethods: DataTypes.INTEGER,
    TrainersFacilitationSkill: DataTypes.INTEGER,
    ParticipationStatus: DataTypes.INTEGER,
    RefreshmentServices: DataTypes.INTEGER,
    TrainingVenue: DataTypes.INTEGER,
    TrainingMaterialsPreparation: DataTypes.INTEGER,
    ExperienceSharing: DataTypes.INTEGER,
    TimeAllocationForEachCourseTitle: DataTypes.INTEGER,
    OverallTrainingFacilitation: DataTypes.INTEGER,
    OverallTrainingCoordination: DataTypes.INTEGER,
    ratingTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseRating',
  });
  return CourseRating;
};