import { Strategy } from "passport-local";
import db from "../../database/models";
import logging from "../../config/logging";

const NAMESPACE = "PASSPORT - LOGIN";

export default new Strategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      var user = await db.Users.findOne({
        where: { email: email },
        include: ["employee"],
      });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      const validate = await user.verifyPassword(password);
      if (!validate) {
        return done(null, false, { message: "Wrong Password" });
      }
      const company = await user.getOwner();
      
      return done(
        null,
        { user, company },
        { message: "Logged in Successfully" }
      );
    } catch (error:Error | any) {
      if (error instanceof Error) {
        logging.info(NAMESPACE, error.message);
      }
      return done(error);
    }
  }
);
