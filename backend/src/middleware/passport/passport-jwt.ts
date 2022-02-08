import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from "../../config/config";
import db from "../../database/models";
import logging from "../../config/logging";

const NAMESPACE = "PASSPORT - JWT";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.server.token.secret,
};

export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await db.Users.findOne({
      where: { id: payload.id },
      include: ["owner", "moderator", "employee"],
    });

    // Fast way maybe in future.

    if (user.role !== "user") user.isStaff = true;
    if (user.owner !== null) {
      user.company = user.owner;
      user.company.isStaff = true;
    }
    if (user.moderator !== null) {
      user.company = user.moderator;
      user.company.isStaff = true;
    }
    if (user.employee.length !== 0) user.employee = user.employee;

    const projectsAssignments = await db.ProjectAssignments.findAll({
      where: { UserId: user.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });
    const projects: IProjectAssignment[] = projectsAssignments;
    user.projects = projects;
    const companies = await user.getOwner(); // Get company if owner
    if (companies) {
      user.company = companies;
    }

    if (user) {
      return done(null, user);
    }

    return done(null, false);
  }  catch (error: Error | any) {
    if (error instanceof Error) {
      logging.info(NAMESPACE, error.message);
    }
    return done(error);
  }
});
