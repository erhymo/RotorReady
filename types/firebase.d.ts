declare module "@/lib/firebase/client" {
  export const auth: any;
  export const db: any;
}

declare module "firebase/firestore" {
  export const getFirestore: any;
  export const getDoc: any;
  export const doc: any;
  export const collection: any;
  export const addDoc: any;
  export const setDoc: any;
  export const doc: any;
  export const getDoc: any;
  export const deleteDoc: any;
}
