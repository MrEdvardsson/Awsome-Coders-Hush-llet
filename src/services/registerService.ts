import {
  createUserWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { auth } from "../../firebase-config";

export async function registerWithEmail(
  email: string,
  password: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return credential.user;
}

export default {
  registerWithEmail,
};
