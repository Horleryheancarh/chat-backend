import { Router } from 'express';
import { 
  createRoom, 
  joinRoom, 
  getUserRooms, 
  getRoomMessages 
} from '../controllers/room.controller';
import { authenticateUser } from '../middleware/auth';


const router = Router();

router.use(authenticateUser);

router.post('/create', createRoom);
router.post('/join', joinRoom);
router.get('/my-rooms', getUserRooms);
router.get('/:roomId/messages', getRoomMessages);

export default router;
