export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  PROJECTER: "projecter",
};

export const PROVIDER = {
  SYSTEM: "system",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  POCKET: "pocket"
};

export const ACCESS_TOKEN_EXPIRESIN = 2880;
export const REFETCH_TOKEN_EXPIRESIN = 5760;

export const JWT_SECRET = process.env.JWT_SECRET || "djfienuds9032u9832nuidiu";
export const JWT_REFETCH_SECRET =
  process.env.JWT_REFETCH_SECRET || "jadsfojdaofeirjkjakdjfa";

export const DateEnum = {
  ALL: "ALL",
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
  YEAR: "YEAR"
};

export const TEMPLATE_FILE_NAMES = {
  REGISTER: "email-signup.html",
  FORGOT_PASSWORD: "email-forgot-password.html",
  CONTACT: "email-contact.html"
};

export const WEBSITE_NAME = "THKN";