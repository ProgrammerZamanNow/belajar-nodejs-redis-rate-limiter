import {prismaClient} from "../application/database.js";
import {isAllowed} from "../service/rate-limiter-service.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    if (!token) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });
        if (!user) {
            res.status(401).json({
                errors: "Unauthorized"
            }).end();
        } else {
            if(await isAllowed(user)){
              req.user = user;
              next();
            } else {
              res.status(429).json({
                errors: "Too many request"
              }).end();
            }
        }
    }
}
