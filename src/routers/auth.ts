import auth from "../controllers/auth";
import users from "../controllers/users";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";
import upload from "../middlewares/upload.middleware";
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');

function authRouter(app: any) {
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user: any, done: any) {
    done(null, user)
  })
  passport.deserializeUser(function(user: any, done: any) {
    done(null, user)
  })
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "https://prod-api.truyenhinhkhoinghiep.com/auth/facebook/callback",
      },
      function(accessToken: any, refreshToken: any, profile: any, cb: any) {
        return cb(null, profile)
      }
    )
  )
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Credentials here.
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Credentials here.
      callbackURL:"https://prod-api.truyenhinhkhoinghiep.com/auth/google/callback",
      passReqToCallback:true
    },
    function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
      return done(null, profile);
    }
  ));
  const permission = new PermissionMiddleware();
  app.route("/api/auth/register").post(auth.register);
  app.route("/api/auth/login").post(auth.login);
  app.route("/api/auth/refetch").post(auth.refetch);
  app.route("/api/auth/confirmation").post(auth.confirmation);
  app.route("/api/auth/forgot-password").post(auth.forgotPassword);
  // facebook
  app.get("/auth/facebook", passport.authenticate("facebook"));
  app.get("/auth/facebook/callback", auth.redirectFacebook);
  app.get(
    "/auth/facebook/verify",
    passport.authenticate("facebook", { failWithError: true }), auth.loginFacebook, auth.handleFailed);
  // google
  app.get("/auth/google", passport.authenticate("google",{
    scope: ['profile', 'email']
  }));
  app.get("/auth/google/callback", auth.redirectGoogle);
  app.get(
    "/auth/google/verify",
    passport.authenticate("google", { failWithError: true }), auth.loginGoogle, auth.handleFailed);
  // pocket
  app.route("/api/auth/pocket").post(auth.loginPocket);
  // profile
  app
    .route("/auth/me")
    .get(permission.role(["admin", "projecter", "user"]), auth.me);
  app
    .route("/auth/profile")
    .put(permission.role([ROLE.ADMIN, ROLE.USER]), auth.updateUserProfile);
  app
    .route("/auth/avatar")
    .post(permission.role(["admin", "projecter", "user"]), upload.uploadImage.fields([
      { 
        name: 'avatar', 
        maxCount: 1
      }
    ]),users.updateImages, auth.uploadAvatar);
  app
    .route("/api/contact")
    .post(auth.sendMailContact);
}

export default authRouter;
