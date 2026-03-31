import express from 'express'; 
import { getChats, createChat , deleteChat } from '../controllers/chatController.js';

import { protect } from '../middlewares/auth.js';

const chatRouter = express.Router(); 

chatRouter.get('/create',protect,createChat); 
chatRouter.get('/get',protect,getChats); 
chatRouter.get('/delete',protect,deleteChat); 

export default chatRouter;  