"use strict";
import { Model } from "sequelize";

interface EmployeesAssignmentsAttributes {
  UserId: string;
  CompanyId: number;
  AdvancedUser: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class EmployeesAssignments
    extends Model<EmployeesAssignmentsAttributes>
    implements EmployeesAssignments
  {
    UserId!: string;
    CompanyId!: number;
    AdvancedUser!: boolean;

    static associate(models: any) {}

    toJSON() {
      return {
        ...this.get(),
        email: undefined,
        valid: undefined,
        role: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
  }

  EmployeesAssignments.init(
    {
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      CompanyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Companies",
          key: "id",
        },
      },
      AdvancedUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "EmployeesAssignments",
    }
  );
  return EmployeesAssignments;
};
