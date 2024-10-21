// src/routes/userRoutes.ts
import { IncomingMessage, ServerResponse } from 'http';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

export const userRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const urlParts = req.url?.split('/') || [];
  const userId = urlParts[3]; // Assuming /api/users/:id structure

  switch (req.method) {
    case 'GET':
      if (urlParts[2] === 'users' && userId) {
        getUserById(req, res, userId);
      } else {
        getUsers(req, res);
      }
      break;
    case 'POST':
      if (urlParts[2] === 'users') {
        createUser(req, res);
      }
      break;
    case 'PUT':
      if (urlParts[2] === 'users' && userId) {
        updateUser(req, res, userId);
      }
      break;
    case 'DELETE':
      if (urlParts[2] === 'users' && userId) {
        deleteUser(req, res, userId);
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Endpoint not found' }));
  }
};
