import { createServer } from 'http';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';


dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const server = createServer(userRoutes); 

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server

