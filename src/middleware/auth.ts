import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken"
import { User } from "../models";
import { JWT_SECRET } from "../config";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized'});
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET!, { expiresIn: '24h' })
};
