import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";

export class FirebaseClient {
  static async deleteDocument(
    collectionName: string,
    documentId: string,
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);

    return deleteDoc(docRef);
  }

  static async updateDocument(
    collectionName: string,
    documentId: string,
    data: any,
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);

    return updateDoc(docRef, data);
  }

  static async insertDocument(
    collectionName: string,
    data: any,
  ): Promise<DocumentReference<any, DocumentData>> {
    return addDoc(collection(db, collectionName), data);
  }

  static async getCollection(
    collectionName: string,
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    const q = query(collection(db, collectionName));
    return getDocs(q);
  }

  static async getCollectionWithDateFilter(
    collectionName: string,
    startDate: string,
    endDate: string,
  ): Promise<QuerySnapshot<DocumentData, DocumentData>> {
    const q = query(
      collection(db, collectionName),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
    );

    return getDocs(q);
  }

  static async getDocument(
    collectionName: string,
    documentId: string,
  ): Promise<DocumentSnapshot<DocumentData, DocumentData>> {
    const docRef = doc(db, collectionName, documentId);
    return getDoc(docRef);
  }
}
