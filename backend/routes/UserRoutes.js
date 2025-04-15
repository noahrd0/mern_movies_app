import express from 'express';
import { verifyToken } from '../config/auth.js';
import {
    registrerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
} from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', registrerUser);
router.post('/login', loginUser);
router.get('/getuser/:id', verifyToken, getUser);
router.put('/updateuser/:id', verifyToken, updateUser);
router.delete('/deleteuser/:id', verifyToken, deleteUser);
router.get('/getallusers', verifyToken, getUser);

export default router;