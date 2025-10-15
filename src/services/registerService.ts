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

export function validateRegister(
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!email || !password || !confirmPassword) {
    return "Fyll i alla fält!";
  }
  if (!email.includes("@")) {
    return "Ogiltig email-adress!";
  }
  if (password.length < 6) {
    return "Lösenordet måste vara minst 6 tecken!";
  }
  if (password !== confirmPassword) {
    return "Lösenorden matchar inte!";
  }
  return null;
}

export function getRegisterError(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Den här e-postadressen är redan registrerad. Försök logga in istället.";
    case "auth/invalid-email":
      return "Ogiltig e-postadress. Kontrollera och försök igen.";
    case "auth/weak-password":
      return "Lösenordet är för svagt. Använd minst 6 tecken.";
    case "auth/network-request-failed":
      return "Nätverksfel. Kontrollera din internetanslutning.";
    default:
      return "Ett fel uppstod vid registrering. Försök igen.";
  }
}

export async function registerHandler(
  email: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const validationError = validateRegister(email, password, confirmPassword);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const user = await registerWithEmail(email, password);
    console.log("Registrerad användare:", user);
    return { success: true, user };
  } catch (error: any) {
    console.error("Fel vid registrering:", error);
    const errorMessage = getRegisterError(error.code);
    return { success: false, error: errorMessage };
  }
}

export default {
  registerWithEmail,
  validateRegister,
  getRegisterError,
  registerHandler,
};
