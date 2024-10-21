import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { User, users } from '../models/User';
import { parseJSON } from '../utils/jsonParser';
import { isValidUUID } from '../utils/isValidUuid';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { username, age, hobbies } = await parseJSON(req);
    if (!username || typeof age !== 'number' || !Array.isArray(hobbies)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Required fields are missing' }));
      return;
    }
    const newUser: User = { id: uuidv4(), username, age, hobbies };
    users.push(newUser);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON' }));
  }
};

export const getUserById = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'User not found' }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid userId format' }));
    return;
  }
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }
  try {
    const { username, age, hobbies } = await parseJSON(req);
    users[index] = { id: userId, username, age, hobbies };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users[index]));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON' }));
  }
};

export const deleteUser = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid userId format' }));
    return;
  }
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }
  users.splice(index, 1);
  res.writeHead(204).end();
};
