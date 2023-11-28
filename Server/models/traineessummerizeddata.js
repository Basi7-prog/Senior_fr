'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TraineesSummerizedData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TraineesSummerizedData.belongsTo(models.Trainee);
      models.Trainee.hasMany(TraineesSummerizedData);
    }
  }
  TraineesSummerizedData.init({
    fullName: DataTypes.STRING,
    profession: DataTypes.STRING,
    eduLevel: DataTypes.STRING,
    telephoneNo: DataTypes.STRING,
    traineeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TraineesSummerizedData',
  });
  return TraineesSummerizedData;
};