export function mapAuthError(code?: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "E‑posten er allerede i bruk.";
    case "auth/invalid-email":
      return "Ugyldig e‑postadresse.";
    case "auth/weak-password":
      return "Passordet er for svakt (minst 6 tegn).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Feil e‑post eller passord.";
    case "auth/user-not-found":
      return "Fant ingen konto med den e‑posten.";
    case "auth/network-request-failed":
      return "Nettverksfeil – prøv igjen.";
    case "auth/too-many-requests":
      return "For mange forsøk. Vent litt og prøv igjen.";
    case "auth/operation-not-allowed":
      return "Innlogging er ikke aktivert for denne metoden.";
    default:
      return "Noe gikk galt. Prøv igjen senere.";
  }
}

