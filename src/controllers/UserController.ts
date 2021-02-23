import { Request, Response } from 'express';
class UserController {
    async create(req: Request, res: Response) {
        const user = req.body;
        console.log(user);
        return res.send({user});
    }
}

export { UserController }