import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const sendTokenCookie = (res, token) => {
  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
  });
};
