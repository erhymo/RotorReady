export function mapAuthError(code?: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email is already in use.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak (minimum 6 characters).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/network-request-failed":
      return "Network error — please try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/operation-not-allowed":
      return "Sign-in is not enabled for this method.";
    default:
      return "Something went wrong. Please try again later.";
  }
}

