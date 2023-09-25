'use strict';
const {
  Model
} = require('sequelize');
// const department = require('./department');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Department);
      models.Department.hasMany(User);
      
      User.belongsTo(models.CPD);
      models.CPD.hasMany(User);
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    profession: DataTypes.STRING,
    userType: DataTypes.STRING,
    password: DataTypes.STRING,
    departmentId:DataTypes.INTEGER,
    cpdId:DataTypes.INTEGER,
    Dob: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};