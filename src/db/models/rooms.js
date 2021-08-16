'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Card, User}) {
      this.belongsTo(User, {foreignKey: 'id_user'})
      this.belongsTo(Card, {foreignKey: 'id_card'})
    }
  }
  Rooms.init({
    id_user: {
     type: DataTypes.INTEGER,
    },
    id_card: {
      type: DataTypes.INTEGER,
    }, 
    room_number: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rooms',
  });
  return Rooms;
};
