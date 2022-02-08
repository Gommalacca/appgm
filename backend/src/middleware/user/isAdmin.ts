import { Request, Response, NextFunction } from 'express';
const NAMESPACE = 'ISADMIN - MIDDLEWARE';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user === undefined || req.user === null)
        return res.status(400).json({ message: 'Must be logged in' })

    if (req.user.role === 'admin') {
        return next();
    }

    res.status(400).json({
        message: 'Unauthorized'
    });
};

export default isAdmin;
