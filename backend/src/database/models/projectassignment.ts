"use strict";
import { Model } from "sequelize";

interface ProjectAssignmentAttributes {
  ProjectId: number;
  UserId: number;
  name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ProjectAssignment
    extends Model<ProjectAssignmentAttributes>
    implements ProjectAssignmentAttributes
  {
    ProjectId!: number;
    UserId!: number;
    name!: string;
  }

  ProjectAssignment.init(
    {
      ProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "ProjectAssignments",
    }
  );
  return ProjectAssignment;
};
