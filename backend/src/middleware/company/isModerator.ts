import logging from "../../config/logging";
import { Request, Response, NextFunction } from "express";
import { IUser } from "interfaces";
const NAMESPACE = "ISMODERATOR - COMPANY - MIDDLEWEARE";

const isModerator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Must be logged !" });
  try {
    const user: IUser | undefined = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!user.company && !user.employee === undefined)
      return res.status(401).json({ message: "You aren't in a company!" });
    if (
      user.company?.ownerId !== req.user.id &&
      user.company?.moderatorId !== req.user.id
    )
      return res.status(401).json({ message: "Must be owner or moderator!" });
    return next();
  } catch (error: Error | any) {
    if (error instanceof Error) {
      logging.info(NAMESPACE, error.message);
    }
    return res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export default isModerator;
