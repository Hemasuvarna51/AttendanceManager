import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTIONS_TO_SEARCH = [
  "employees",
  "users",
  "employee",
  "Employees",
  "Users",
];

export async function findEmployeeByEmail(email, user = null) {
  if (!email && !user) return null;
  const rawEmail = String(email || user?.email || "").trim();
  const cleanEmail = rawEmail.toLowerCase();
  const uid = user?.uid;

  let permissionDenied = false;

  for (const collName of COLLECTIONS_TO_SEARCH) {
    // A. If uid is available, check direct document by UID
    if (uid) {
      try {
        const uidDocSnap = await getDoc(doc(db, collName, uid));
        if (uidDocSnap.exists()) {
          return { docId: uidDocSnap.id, ...uidDocSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }

      // Check query where("uid", "==", uid)
      try {
        const qUid = query(
          collection(db, collName),
          where("uid", "==", uid),
          limit(1)
        );
        const snapUid = await getDocs(qUid);
        if (!snapUid.empty) {
          const docSnap = snapUid.docs[0];
          return { docId: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }
    }

    // B. Check direct document with email as document ID
    if (cleanEmail) {
      try {
        const emailDocSnap = await getDoc(doc(db, collName, cleanEmail));
        if (emailDocSnap.exists()) {
          return { docId: emailDocSnap.id, ...emailDocSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }
    }

    // C. Query where("email", "==", cleanEmail)
    if (cleanEmail) {
      try {
        const q1 = query(
          collection(db, collName),
          where("email", "==", cleanEmail),
          limit(1)
        );
        const snap1 = await getDocs(q1);
        if (!snap1.empty) {
          const docSnap = snap1.docs[0];
          return { docId: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }

      // D. Query where("email", "==", rawEmail)
      if (rawEmail !== cleanEmail) {
        try {
          const q2 = query(
            collection(db, collName),
            where("email", "==", rawEmail),
            limit(1)
          );
          const snap2 = await getDocs(q2);
          if (!snap2.empty) {
            const docSnap = snap2.docs[0];
            return { docId: docSnap.id, ...docSnap.data() };
          }
        } catch (err) {
          if (err?.code === "permission-denied") permissionDenied = true;
        }
      }

      // E. Query where("mail", "==", cleanEmail)
      try {
        const qMail = query(
          collection(db, collName),
          where("mail", "==", cleanEmail),
          limit(1)
        );
        const snapMail = await getDocs(qMail);
        if (!snapMail.empty) {
          const docSnap = snapMail.docs[0];
          return { docId: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }

      // F. Query where("workEmail", "==", cleanEmail)
      try {
        const qWork = query(
          collection(db, collName),
          where("workEmail", "==", cleanEmail),
          limit(1)
        );
        const snapWork = await getDocs(qWork);
        if (!snapWork.empty) {
          const docSnap = snapWork.docs[0];
          return { docId: docSnap.id, ...docSnap.data() };
        }
      } catch (err) {
        if (err?.code === "permission-denied") permissionDenied = true;
      }
    }

    // G. Scan collection fallback
    try {
      const allSnap = await getDocs(collection(db, collName));
      for (const docSnap of allSnap.docs) {
        const data = docSnap.data();
        const docEmail = (
          data.email ||
          data.mail ||
          data.workEmail ||
          data.Email ||
          data.Mail ||
          data.userEmail ||
          ""
        )
          .toString()
          .trim()
          .toLowerCase();

        if (cleanEmail && docEmail === cleanEmail) {
          return { docId: docSnap.id, ...data };
        }
        if (uid && data.uid === uid) {
          return { docId: docSnap.id, ...data };
        }
      }
    } catch (err) {
      if (err?.code === "permission-denied") permissionDenied = true;
    }
  }

  if (permissionDenied) {
    return { error: "permission-denied" };
  }

  return null;
}

export async function authorizeEmployeeAccess(email, user = null) {
  const result = await findEmployeeByEmail(email, user);

  if (result?.error === "permission-denied") {
    return {
      ok: false,
      reason:
        "Database permission denied. Please check your Firestore Security Rules in Firebase Console.",
    };
  }

  if (!result) {
    return {
      ok: false,
      reason: "No employee record found for this email in database. Contact admin.",
    };
  }

  const employee = result;
  const status = (employee.status || "active").toString().trim().toLowerCase();
  if (status === "inactive" || status === "disabled") {
    return {
      ok: false,
      reason: "Your account is marked inactive. Contact admin.",
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

  try {
    const employeeRef = doc(db, "employees", employeeDocId);

    await updateDoc(employeeRef, {
      uid: user.uid,
      authProvider: provider,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to bind employee to user in Firestore:", err);
  }
}