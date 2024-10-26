import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { collection, DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import Guest from "./Guest";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

const guestConverter: FirestoreDataConverter<Guest> = {
  toFirestore(guest: WithFieldValue<Guest>): DocumentData {
    return { firstName: guest.firstName, lastName: guest.lastName, events: guest.events };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Guest {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      firstName: data.firstName,
      lastName: data.lastName,
      events: data.events
    };
  },
};

export const GuestRef = collection(firebase.firestore(), "Guests").withConverter(guestConverter);

export default firebase;