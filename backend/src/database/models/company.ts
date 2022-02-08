"use strict";
import { Model } from "sequelize";

interface CompanyAttributes {
  id: number;
  name: string;
  projectsLimit: number;
  expireAt: Date;
  ownerId: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Company extends Model<CompanyAttributes> implements CompanyAttributes {
    id!: number;
    name!: string;
    projectsLimit!: number;
    expireAt!: Date;
    ownerId!: string;

    extendExpireTime!: (month: number) => Promise<Company>;
    setExpireTime!: (month: number) => Promise<Company>;

    static associate(models: any) {
      Company.belongsTo(models.Users, {
        as: "owner",
        foreignKey: "ownerId",
      });

      Company.belongsTo(models.Users, {
        as: "moderator",
        foreignKey: "moderatorId",
      });

      Company.belongsToMany(models.Users, {
        as: "employee",
        through: "EmployeesAssignments",
      });

      Company.hasMany(models.Projects, {
        as: "projects",
        foreignKey: "companyId",
      });
    }
  }

  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      projectsLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Companies",
      hooks: {
        beforeCreate: (company) => {
          const date = new Date();
          const month = date.getMonth();
          date.setMonth(month + 1);
          company.expireAt = date;
        },
      },
    }
  );

  Company.prototype.extendExpireTime = async function (month: number) {
    const date: Date = new Date();
    date.setMonth(date.getMonth() + month);
    this.expireAt = date;
    return await this.save();
  };

  Company.prototype.setExpireTime = async function (month: number) {
    const date: Date = new Date();
    date.setMonth(month);
    this.expireAt = date;
    return await this.save();
  };

  return Company;
};
