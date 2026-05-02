import { notFound } from "next/navigation";

import FirebaseCheckClient from "./FirebaseCheckClient";

export default function FirebaseCheck() {
  if (process.env.NODE_ENV !== "development") notFound();

  return <FirebaseCheckClient />;
}
