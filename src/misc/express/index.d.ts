import { User } from '@prisma/client';
import * as firebase from 'firebase-admin';
import { PaginationContext } from '../pagination/pagination.dto';
export {};

export type FirebaseAuthPayload = firebase.auth.DecodedIdToken & {
  name?: string;
};

export type RequestContext = {
  firebaseAuthPayload?: FirebaseAuthPayload;
  authUser?: User;
  pagination?: PaginationContext;
  trackingId?: string;
  loggerContext?: NestLoggerRequestContext;
};

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends FirebaseAuthPayload {}

    interface Request {
      context?: RequestContext;
    }
  }
}
