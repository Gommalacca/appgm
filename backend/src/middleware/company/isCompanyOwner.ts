import { Request, Response, NextFunction } from 'express';
const NAMESPACE = 'ISCOMPANYOWNER - COMPANY - MIDDLEWEARE';

const isCompanyOwner = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) return res.status(400).json({ message: "Must be logged !" });
    if (req.user.company === null || req.user.company === undefined) return res.status(401).json({ message: "You must have a company!" });
    if (req.user.company.ownerId !== req.user.id) return res.status(401).json({ message: "You aren't the owner!" });
    next();
};

export default isCompanyOwner;
