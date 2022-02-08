/*
    Description: Check if user is an employee then pass to next function.
*/

import logging from '../../config/logging';
import { Request, Response, NextFunction } from 'express';
import { IUser } from 'interfaces';
const NAMESPACE = 'ISEMPLOYEE - COMPANY - MIDDLEWEARE';

const isEmployee = (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) return res.status(401).json({ message: "Must be logged in !" });

    try {
        const user: IUser = req.user;

        if (user.isStaff) return next();
        if (user.company !== undefined) return next();

        if (user.employee === undefined || user.employee.length === 0) {
            return res.status(401).json({
                message: "I'm sorry but it turns out that you are not part of any company!"
            });
        }

        return next();
    } catch (error: Error | any) {
        if (error instanceof Error) {
            logging.info(NAMESPACE, error.message);
        }
        return res.status(500).json({
            message: "Internal server error!"
        })
    }

};

export default isEmployee;
