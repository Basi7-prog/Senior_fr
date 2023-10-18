'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trainer.belongsTo(models.User);
      models.User.hasOne(Trainer)
      Trainer.belongsTo(models.Course);
      models.Course.hasMany(Trainer);
    }
  }
  Trainer.init({
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    assignedBy: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trainer',
  });
  return Trainer;
};