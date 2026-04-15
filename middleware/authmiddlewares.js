import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authmiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).send({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 

    next(); 
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" });
  }
};

export default authmiddleware;