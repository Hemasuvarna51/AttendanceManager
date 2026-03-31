// src/api/leave.api.js
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

const leaveRef = collection(db, "leaves");

export const createLeave = async (leave) => {
  return await addDoc(leaveRef, {
    ...leave,
    status: "Pending",
    createdAt: new Date().toISOString(),
  });
};

export const fetchLeaves = async () => {
  const snapshot = await getDocs(leaveRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateLeaveStatusAPI = async (id, status) => {
  const refDoc = doc(db, "leaves", id);
  return await updateDoc(refDoc, { status });
};