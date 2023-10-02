'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Proposal.belongsTo(models.Department);
      models.Department.hasMany(Proposal);
      Proposal.belongsTo(models.TrainingType);
      models.TrainingType.hasMany(Proposal);
    }
  }
  Proposal.init({
    topic: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    numberOfFacilitator: DataTypes.INTEGER,
    targetProfession: DataTypes.STRING,
    numberOfTrainer: DataTypes.INTEGER,
    numberOfTrainee: DataTypes.INTEGER,
    budget: DataTypes.DECIMAL,
    requestDate: DataTypes.DATEONLY,
    budgetApprovedRejectedDate: DataTypes.DATE,
    venueApprovedRejectedDate: DataTypes.DATE,
    approveBudgetStatus: DataTypes.BOOLEAN,
    trainingTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Proposal',
  });
  return Proposal;
};