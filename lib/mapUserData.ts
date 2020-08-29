import UserType from "../types/user";
export const mapUserData = (user: firebase.User) => {
  const { uid, email } = user;
  return {
    id: uid,
    email,
  } as UserType;
};
