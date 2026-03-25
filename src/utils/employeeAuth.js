import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export async function findEmployeeByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();

  const q = query(
    collection(db, "employees"),
    where("email", "==", cleanEmail),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];

  return {
    docId: docSnap.id,
    ...docSnap.data(),
  };
}

export async function authorizeEmployeeAccess(email) {
  const employee = await findEmployeeByEmail(email);

  if (!employee) {
    return {
      ok: false,
      reason: "No employee record found. Contact admin.",
    };
  }

  if ((employee.status || "").toLowerCase() !== "active") {
    return {
      ok: false,
      reason: "Your account is inactive. Contact admin.",
    };
  }

  return {
    ok: true,
    employee,
  };
}

export async function bindEmployeeToUser(
  employeeDocId,
  user,
  provider = "password"
) {
  if (!employeeDocId || !user) return;

  const employeeRef = doc(db, "employees", employeeDocId);

  await updateDoc(employeeRef, {
    uid: user.uid,
    authProvider: provider,
    lastLoginAt: new Date().toISOString(),
  });
}