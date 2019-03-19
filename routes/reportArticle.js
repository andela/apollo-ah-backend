import express from 'express';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/:articleId/report',
  authenticate);

router.get('/:articleId/report',
  authenticate);

export default router;
