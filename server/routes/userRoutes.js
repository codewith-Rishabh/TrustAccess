import express from 'express';
import userAuth from '../middlewares/userAuth.middleware.js';
import { getUserData } from '../controllers/userData.Controller.js';
const userRouter = express.Router();


userRouter.get('/data',userAuth, getUserData )


export default userRouter;