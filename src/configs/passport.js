const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/UserModel");

passport.use(
  "user",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          console.warn("User not registered:", email);
          return done(null, false, {
            name: "IncorrectUsernameError",
            message: "User not registered",
          });
        }

        // WARNING: Avoid doing this in a production environment. It's insecure.
        const passwordMatch = user.password === password;

        if (!passwordMatch) {
          console.warn("Incorrect password:", email);
          return done(null, false, {
            name: "IncorrectPasswordError",
            message: "Incorrect password",
          });
        }

        console.log("User authenticated successfully:", email);
        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error.message);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    console.error("Deserialization error:", error.message);
    done(error, false);
  }
});

module.exports = passport;
