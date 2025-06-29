import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET!);
    (req as any).id = (decoded as { id: string }).id;
    (req as any).role = (decoded as { id: string; role: string }).role;
    console.log("Token verified:", (req as any).id, (req as any).role);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
