import jwt from "jsonwebtoken";
export const verifyToken = async (req, reply) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startWith("Bearer ")) {
      return reply.status(401).send({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    console.log(error);
    return reply
      .status(403)
      .send({ message: "Invalid or expired token", error });
  }
};
