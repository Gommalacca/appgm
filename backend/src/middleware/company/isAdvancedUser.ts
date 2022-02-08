import { Request, Response, NextFunction } from "express";
import logging from "../../config/logging";
import { IUser } from "interfaces";

const NAMESPACE = "isAdvancedUser Middleware";
const isAdvancedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUser | undefined = req.user;
    if (!user) {
      return res.status(401).json({ message: "Must be logged in!" });
    }

    if (user.role === "admin") return next();
    if (user.company !== undefined && user.company !== null) return next();
    if (!user.employee || user.employee?.length == 0)
      return res.status(401).json({ message: "Unauthorized" });
    if (!user.employee[0].EmployeesAssignments.AdvancedUser)
      return res.status(401).json({ message: "Unauthorized!" });
    return next();
  }  catch (error: Error | any) {
    if (error instanceof Error) {
      logging.info(NAMESPACE, error.message);
    }
    return res.status(500).json({
      message: "Ops, internal server error",
    });
  }
};

export default isAdvancedUser;
