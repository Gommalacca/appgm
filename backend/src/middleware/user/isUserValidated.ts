
import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../interfaces';

const NAMESPACE = 'ISUSERVALIDATED - COMPANY - MIDDLEWEARE';

const isUserValidated = (req: Request, res: Response, next: NextFunction) => {

    if (req.user === undefined || req.user === null)
        return res.status(400).json({ message: 'Must be logged in' });

    try {
        const user: IUser = req.user;
        if (user.role === 'admin') {
            return next();
        }

        if (user.valid) {
            return next();
        }

        return res.status(401).json({
            message: 'Unauthorized'
        });
    }  catch (error: Error | any) {
        if (error instanceof Error) {
          logging.info(NAMESPACE, error.message);
        }
        return res.status(500).json({
            message: "Internal server error"
        })
    }

};

export default isUserValidated;
