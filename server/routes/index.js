import { Router } from 'express';
import user from '../controllers/user.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import message from '../controllers/message.js';

const router = Router();

router.post('/user/register', user.register);
router.post('/user/login', user.login);
router.get('/user/check-auth', authMiddleware, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user,
  });
});
router.get(`/user/:userId`, user.getUser);
router.get(`/user/nickname/:userNickname`, user.getUserByNickname);

router.get('/message/:userId', message.getUsersChats);

export default router;
