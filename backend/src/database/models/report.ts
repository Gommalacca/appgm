"use strict";
import { Model } from "sequelize";

interface ReportAttributes {
  id: number;
  projectId: number;
  workers: string[];
  digitalSignature: string;
  projectName: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Report extends Model<ReportAttributes> implements ReportAttributes {
    id!: number;
    projectId!: number;
    workers!: string[];
    digitalSignature!: string;
    projectName!: string;

    static associate(models: any) {}
  }

  Report.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      workers: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },

      digitalSignature: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Reports",
      paranoid: true,
    }
  );
  return Report;
};
