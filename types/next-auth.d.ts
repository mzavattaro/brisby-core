/* eslint-disable */

import { User } from 'next-auth';
import { Permission, Team, TeamMembership } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

type UserId = string;

declare module 'next-auth' {
  interface User {
    id: UserId;
    buildingComplexId?: string;
    organisationId?: string;
  }
  interface Session {
    user: User & {
      id: UserId;
      buildingComplexId?: string;
      organisationId?: string;
    };
  }
}
