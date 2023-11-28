'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trainee.belongsTo(models.User);
      models.User.hasOne(Trainee)
      Trainee.belongsTo(models.Course);
      models.Course.hasMany(Trainee);
    }
  }
  Trainee.init({
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    attendance: DataTypes.TEXT('long'),
    preTest: DataTypes.INTEGER,
    postTest: DataTypes.INTEGER,
    isNowTrainer: DataTypes.BOOLEAN,
    trainerRate:DataTypes.BOOLEAN,
    courseRate:DataTypes.BOOLEAN,
    certified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trainee',
  });
  return Trainee;
};