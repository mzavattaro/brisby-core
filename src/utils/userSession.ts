import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export const UserSession = (): Session['user'] | null => {
  const { data: sessionData } = useSession();

  return sessionData?.user;
};
