import { useSession } from "next-auth/react";

export const userSession = () => {
  const { data: sessionData } = useSession();
  if (sessionData?.user) {
    return sessionData?.user;
  }
  return sessionData?.user;
};
