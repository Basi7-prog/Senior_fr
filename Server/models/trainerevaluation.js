'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trainerEvaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trainerEvaluation.belongsTo(models.Trainer)
      models.Trainer.hasMany(trainerEvaluation)
      trainerEvaluation.belongsTo(models.Course)
      models.Course.hasMany(trainerEvaluation)
    }
  }
  trainerEvaluation.init({
    trainerId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    dateOfEvaluation: DataTypes.DATE,
    Personality_keeping_including_wearing_style: DataTypes.DECIMAL,
    Training_materials_preparation_status: DataTypes.DECIMAL,
    Training_methods_used: DataTypes.DECIMAL,
    Facilitation_skill: DataTypes.DECIMAL,
    Comprehensive_Knowledge_regarding_to_course_title: DataTypes.DECIMAL,
    Comprehensive_practical_skill_regarding_to_course_title: DataTypes.DECIMAL,
    Punctuality: DataTypes.DECIMAL,
    CRC_Decipline: DataTypes.DECIMAL,
    Total_score_out: DataTypes.DECIMAL,
    voteAmount:DataTypes.INTEGER,
    Decision_made_for_the_next_training_Competent_Not_competent: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'trainerEvaluation',
  });
  return trainerEvaluation;
};