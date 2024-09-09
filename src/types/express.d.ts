

import { UserAttributes } from '../models/User'; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes; // You can also use a more specific type if needed
    }
  }
}
