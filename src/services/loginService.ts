import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

interface UserCredentials {
  email: string;
  password: string;
}

export async function signInUser({ email, password }: UserCredentials) {
  await signInWithEmailAndPassword(getAuth(), email, password);
}
export function validateLogin(email: string, password: string): string | null {
  if (!email || !password) {
    return "Fyll i både email och lösenord!";
  }
  if (!email.includes("@")) {
    return "Ogiltig email-adress!";
  }
  if (password.length < 6) {
    return "Lösenordet måste vara minst 6 tecken!";
  }
  return null;
}

export function getLoginError(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Felaktig email eller lösenord.";
    case "auth/user-not-found":
      return "Ingen användare med denna email hittades.";
    case "auth/wrong-password":
      return "Felaktigt lösenord.";
    case "auth/invalid-email":
      return "Ogiltig email-adress.";
    case "auth/too-many-requests":
      return "För många inloggningsförsök. Försök igen senare.";
    default:
      return "Ett fel uppstod vid inloggning. Försök igen.";
  }
}

export default {
  validateLogin,
  getLoginError,
};
