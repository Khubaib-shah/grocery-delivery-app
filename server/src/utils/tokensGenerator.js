import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};
