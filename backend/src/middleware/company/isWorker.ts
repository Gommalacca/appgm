import { Request, Response, NextFunction } from "express";
import logging from "../../config/logging";
import { IUser } from "interfaces";

const NAMESPACE = "isWorker Middleware";
const isWorker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUser | undefined = req.user;
    if (!user) {
      return res.status(401).json({ message: "Must be logged in!" });
    }
    if (user.role === "admin") return next();
    if (user.company !== undefined && user.company !== null) return next();
    if (user.employee === undefined || user.employee.length === 0)
      return res.status(401).json({ message: "Must me an employee first" });
    if (user.projects === undefined || user.projects.length === 0)
      return res
        .status(401)
        .json({ message: "Need to work in 1 project at least!" });

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

export default isWorker;
