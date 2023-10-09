'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facilitator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Facilitator.belongsTo(models.Course)
      models.Course.hasMany(Facilitator)
      Facilitator.belongsTo(models.User)
      models.User.hasOne(Facilitator)
    }
  }
  Facilitator.init({
    courseId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Facilitator',
  });
  return Facilitator;
};