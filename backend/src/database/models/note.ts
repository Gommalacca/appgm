"use strict";
import { Model } from "sequelize";

interface NoteAttributes {
  id: number;
  note: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Note extends Model<NoteAttributes> implements NoteAttributes {
    id!: number;
    note!: string;

    static associate(models: any) {
      Note.belongsTo(models.Users, { as: "user", foreignKey: "UserId" });
      Note.belongsTo(models.Projects, {
        as: "projectId",
        foreignKey: "ProjectId",
      });
    }
  }

  Note.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      note: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Notes",
    }
  );

  return Note;
};
