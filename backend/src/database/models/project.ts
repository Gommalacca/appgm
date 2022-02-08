"use strict";
import { Model } from "sequelize";

interface ProjectAttributes {
  id: number;
  name: string;
  locality: string;
  digitalSignature: string;
  companyId: number;
  startAt: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Project extends Model<ProjectAttributes> implements ProjectAttributes {
    id!: number;
    name!: string;
    locality!: string;
    digitalSignature!: string;
    companyId!: number;
    startAt!: Date;
    static associate(models: any) {
      Project.belongsTo(models.Companies, { foreignKey: "companyId" });
      Project.belongsToMany(models.Users, {
        as: "workers",
        through: "ProjectAssignments",
      });
      Project.hasMany(models.Notes);
      Project.hasMany(models.Hours);
      Project.hasMany(models.Reports);
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      digitalSignature: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Projects",
      paranoid: true,
    }
  );
  return Project;
};
