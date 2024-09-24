import { UserAttributes } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      files?: Express.Multer.File[]; // Fix typing for `files`
      user?: UserAttributes;         // Assuming `user` is added to the request after authentication
    }
  }
}
