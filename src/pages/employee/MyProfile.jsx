import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getRecords } from "../../utils/attendanceLocalDb";
import { useAuthStore } from "../../store/auth.store";
// payroll store handled by dedicated component; keep employee store for other parts
import { useEmployeeStore } from "../../store/employee.store";
import PayrollRecords from "../../components/PayrollRecords";
import { Mail, Phone, Building2, IdCard, Pencil, Save, X } from "lucide-react";
import barGraph from "../../assets/bar-graph.png"
import present_icon from "../../assets/verified-user.png"
import remove_icon from "../../assets/remove-user.png"
import employee_icon from "../../assets/employee.png"
import upload_icon from "../../assets/upload_icon.png"
import profile_background from "../../assets/profile_background.png"
import profile_icon from "../../assets/profile.png"
import user_icon from "../../assets/user-profile.png"
import document_icon from "../../assets/verified.png"
import leave_icon from "../../assets/absent (1).png"
import attendance_icon from "../../assets/immigration.png"
import attendance1_icon from "../../assets/available (1).png"
import payroll_icon from "../../assets/salary-voucher.png"
import shift_icon from "../../assets/businessman.png"
import work_icon from "../../assets/work.png"
import absence from "../../assets/unavailable.png"
/* ===================== STYLES (UPDATED TO MATCH IMAGE) ===================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  padding: 22px 22px 40px;
  min-height: calc(100vh - 60px);
`;

const Shell = styled.div`
  display: grid;
  gap: 18px;
`;

const ProfileCard = styled.div`
  padding: 22px 22px 0;
  position:relative;
  overflow:hidden;
  box-shadow: 1px 1px 3px black;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 3px;
  img{
    top: 0;
    left: 0;
    opacity: 0.8;
    height: 100%;
    width:100%;
    position: absolute;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 12px;
`;

const IconAction = styled.button`
  height: 44px;
  padding: 0 18px;
  border-radius: 7px;
  border:none;
  background: ${({ $danger }) => ($danger ? "#fff5f5" : "#1e3d91")};
  color: ${({ $danger }) => ($danger ? "#b42318" : "#ffff")};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: 15px;
  z-index:1;

  &:hover {
    box-shadow: 0 14px 30px rgba(30, 44, 78, 0.08);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0px);
  }
`;

const MainRow = styled.div`
  display: grid;
  grid-template-columns: 190px 1fr 380px;
  gap: 26px;
  align-items: center;
  padding: 18px 0px;

  @media (max-width: 980px) {
    grid-template-columns: 170px 1fr;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarWrap = styled.div`
  display: grid;
  justify-items: center;
`;

const AvatarFrame = styled.div`
  width: 160px;
  height: 130px;
  border-radius: 7px;
  background: linear-gradient(135deg, rgba(246, 246, 246, 0.38));
  box-shadow: 1px 2px 3px rgb(58, 58, 58);
  display: grid;
  place-items: center;
  padding:4px 6px;
  z-index:1;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius:14px;
  object-fit: cover;
  z-index:1;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 54px;
  color: #000000fe;
  z-index:1;
`;

const AvatarUploadBtn = styled.label`
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #133683cc;
  color: #ffffff;
  cursor: pointer;
  font-weight: 100;
  font-size: 14px;
  z-index:1;

  &:hover {
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.14);
    filter: brightness(0.98);
  }

  input[type="file"] {
    display: none;
  }
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  z-index:1;
`;

const Name = styled.div`
  font-size: 37px;
  font-weight: 500;
  color: #010e38;
  letter-spacing: -0.6px;
  line-height: 1.2;
  font-style: italic;
  z-index:1;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  z-index:1;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e6edf6;
  color: #334155;
  font-weight: 900;
  font-size: 14px;
  z-index: 1;
`;
const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const MiniPill = styled.button`
  height: 38px;
  padding: 0 12px;
  border-radius: 5px;
  background: #133683d6;
  color: white;
  font-weight: 900;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border:none;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    border-color: #d7e3f3;
  }
`;

const RolePill = styled.div`
  height: 38px;
  padding: 0 14px;
  border-radius: 5px;
  background: #133683d6;
  color: white;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;

`;

const RightInfo = styled.div`
  display: grid;
  gap: 16px;
  padding:20px;
  position:relative;
  margin:30px -80px;
  width:100%;
  height:90%;
  border-radius:20px;
  overflow:hidden;
  z-index:0.9;

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }

  
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 18px 120px 1fr 0.1fr; 
  align-items: center;
  position:relative;
  color: #000000;
  gap:10px;
  .k {
    color: #000000be;
    font-size: 16px;
    font-weight: 800;
  }

  .v {
    font-weight: 900;
    font-size: 15px;
    color: #000000e8;
  }

  svg {
    opacity: 0.9;
    color: #111;
  }

  input{
    width: 100%;
  }
  input::placeholder{
    color: rgb(133, 133, 133);
    font-weight:100;

  }
`;

const Divider = styled.div`
  height: 1.5px;
  background: #d0d0d0;
  z-index: 2;
`;

const Tabs = styled.div`
  display: flex;
  gap:50px;
  flex-wrap: wrap;
  padding: 5px 6px 0;
  z-index:1;
`;

const Tab = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 12px 0;
  font-weight: 600;
  font-style: italic;
  font-size: 15px;
  z-index:1;
  color: ${({ $active }) => ($active ? "#160085" : "#010101")};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#1e3e84" : "transparent")};

  &:hover {
    color: #133783;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;
const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e6edf6;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  color: #ffffff;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 1000;
  line-height: 1;
  margin-bottom: 6px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  opacity: 0.95;
`;

const Panel = styled.div`
  color:white;
  overflow: hidden;
  z-index: 1;
  box-shadow: 1px 1px 4px black;
  background: #fff;
  border-radius:8px;
`;

const PanelHeader = styled.div`
  padding: 16px 18px;
  display: flex;
  font-weight: 1000;
  letter-spacing:1px;
  font-size: 18px;
  gap: 13px;
  align-items:center;
  color: #111;
  font-style:italic;
  background: #eaeaeaaa;
  img{
    width: 36px;
  }

`;

const PanelBody = styled.div`

   margin-top: 3px;
  .attendance-summary{
    display:flex;
    flex-direction:column;
  }

  .days{
    display:flex;
    padding-top:33px;
    padding-right:20px;
    justify-content: end;
    font-style: italic;
    font-size:17px;
    color:rgb(255, 255, 255);
    font-weight:900;
  }

  .total-days{
    height:80px;
    background: linear-gradient(135deg, #5fa2ffa8 0%, #5c44abac 100%);
    position:relative;
    border-radius:12px;
    margin-bottom:1px;
  }

  .total-days img{
    position:absolute;
    top:45px;
    left:34px;
    height:35px;
    width:40px;
    opacity:0.9;
  }
  .present-days{
    height:80px;
    background: linear-gradient(135deg, #6cbafea7 0%, #00cdabb1 100%);
    position:relative;
    border-radius:12px;
    margin-bottom: 1px;
  }
  .present-days img{
    position:absolute;
    left: 25px;
    top:37px;
    height:50px;
    width:50px;
    
  }
  .absent-days{
    height:80px;
    background: linear-gradient(135deg, #fb93cabe 0%, #fa465eac 100%);
    position: relative;
    border-radius:12px;
    margin-bottom: 1px;

  }
  .absent-days img{
    position:absolute;
    top:37px;
    left:25px;
    height:50px;
    width:50px;
  }
  .total-percentage{
    height:80px;
    background: linear-gradient(135deg, #676baea9 0%, #6f85ffb5 100%);
    position:relative;
    border-radius:12px;
  }

  .total-percentage img{
    position:absolute;
    top:37px;
    left:30px;
    height:42px;
    width:48px;
    opacity:0.755;
    margin-bottom:1px;
  }

`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin:10px 25px;

  .label {
    font-size: 16px;
    color: #232323;
    font-weight: 600;
    text-transform: uppercase;
    font-style: "Insert" sans serif;
    letter-spacing: 0.6px;
  }

  .value {
    font-size: 20px;
    margin-left: 10px;
    color: #001850;
    font-weight: 100;
    letter-spacing: 1px;
    line-height: 20px;
  }
`;

const Input = styled.input`
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d7e3f3;
  background: #ffffff;
  font-weight: 400;
  font-size: 14px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #072564;
    box-shadow: 0 0 0 4px rgba(56, 109, 232, 0.12);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d7e3f3;
  background: #ffffff;
  font-weight: 400;
  font-size: 15px;
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #415ed2;
    box-shadow: 0 0 0 4px rgba(39, 81, 163, 0.12);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d7e3f3;
  background: #ffffff;
  font-weight: 800;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: #000000;
    box-shadow: 0 0 0 4px rgba(11, 18, 33, 0.12);
  }
`;

const Hint = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  font-size: 13px;
  color: #1d4ed8;
  font-weight: 900;
  background: #eff6ff;
  border: 1px solid #cfe0ff;
  border-radius: 12px;
`;

const RecordList = styled.div`
  max-height: 420px;
  overflow: auto;
  display: grid;
  gap: 10px;
  padding-right: 4px;

  /* nicer scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d7e3f3;
    border-radius: 999px;
  }
`;

const RecordItem = styled.div`
  padding: 14px 14px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e6edf6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  &:hover {
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
    border-color: #d7e3f3;
  }
`;

const RecordDate = styled.div`
  font-weight: 1000;
  color: #0f172a;
  font-size: 14px;
`;

const RecordStatus = styled.span`
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 1000;
  border: 1px solid;

  background: ${({ $status }) =>
    $status === "Approved"
      ? "#dcfce7"
      : $status === "Rejected"
      ? "#fee2e2"
      : "#fef3c7"};

  color: ${({ $status }) =>
    $status === "Approved"
      ? "#166534"
      : $status === "Rejected"
      ? "#991b1b"
      : "#92400e"};

  border-color: ${({ $status }) =>
    $status === "Approved"
      ? "#bbf7d0"
      : $status === "Rejected"
      ? "#fecaca"
      : "#fde68a"};
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content:center;
  height: 44px;
  margin: 15px 210px;
  background-color: #133783;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #1d4ed8;

  &:hover {
    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
    filter: brightness(0.98);
  }

  input[type="file"] {
    display: none;
  }
  
  img{
    width:23px;
    margin:0px 10px; 
  }
`;

// payroll list component moved to src/components/PayrollRecords.jsx

/* ===================== COMPONENT ===================== */

export default function MyProfile() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [activeTab, setActiveTab] = useState("About");
  const [editing, setEditing] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [leaveData, setLeaveData] = useState({ approved: 0, rejected: 0, pending: 0, records: [] });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const load = () => setAttendance(getRecords());
    load();
    const handler = () => load();
    window.addEventListener("attendance_updated", handler);
    return () => window.removeEventListener("attendance_updated", handler);
  }, []);

  // ✅ Load leave data
  useEffect(() => {
    const loadLeaves = () => {
      try {
        const leavePersisted = JSON.parse(localStorage.getItem("leave-storage") || "{}");
        const allLeaves = leavePersisted?.state?.leaves || [];
        
        // Filter leaves by current user using multiple criteria
        const userLeaves = allLeaves.filter(l => {
          // Match by employee name (case-insensitive)
          if (l.employee && user?.name && l.employee.toLowerCase() === user.name.toLowerCase()) {
            return true;
          }
          // Match by employee ID
          if (l.employeeId && (l.employeeId === user?.id || l.employeeId === user?.empId || l.employeeId === user?.employeeId)) {
            return true;
          }
          // Match by email
          if (l.email && user?.email && l.email.toLowerCase() === user.email.toLowerCase()) {
            return true;
          }
          return false;
        });

        const approved = userLeaves.filter(l => l.status === "Approved").length;
        const rejected = userLeaves.filter(l => l.status === "Rejected").length;
        const pending = userLeaves.filter(l => l.status === "Pending").length;

        console.log('Leave Data - Current User:', { id: user?.id, name: user?.name, email: user?.email });
        console.log('Leave Data - All Leaves:', allLeaves);
        console.log('Leave Data - Filtered User Leaves:', userLeaves);

        setLeaveData({ approved, rejected, pending, records: userLeaves });
      } catch (error) {
        console.error('Error loading leave data:', error);
        setLeaveData({ approved: 0, rejected: 0, pending: 0, records: [] });
      }
    };

    loadLeaves();
    window.addEventListener("storage", loadLeaves);
    window.addEventListener("leaves_updated", loadLeaves);

    return () => {
      window.removeEventListener("storage", loadLeaves);
      window.removeEventListener("leaves_updated", loadLeaves);
    };
  }, [user?.id, user?.empId, user?.employeeId, user?.name, user?.email]);

  // ✅ Load documents
  useEffect(() => {
    const loadDocs = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("employee_documents") || "[]");
        const userDocs = stored.filter(d =>
          d.employeeId === user?.empId ||
          d.employeeId === user?.employeeId ||
          d.employeeName === user?.name
        );
        setDocuments(userDocs);
      } catch {
        setDocuments([]);
      }
    };

    loadDocs();
    window.addEventListener("storage", loadDocs);
    window.addEventListener("documents_updated", loadDocs);

    return () => {
      window.removeEventListener("storage", loadDocs);
      window.removeEventListener("documents_updated", loadDocs);
    };
  }, [user?.empId, user?.employeeId, user?.name]);

  const attendanceSummary = useMemo(() => {
    const byDate = {};
    for (const rec of attendance) {
      if (!rec.time) continue;
      const d = new Date(rec.time);
      const key = d.toISOString().slice(0, 10);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(rec);
    }

    const rows = Object.keys(byDate)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => {
        const records = byDate[key].sort((a, b) => a.time.localeCompare(b.time));
        // compute check-in / check-out pairs and total worked ms for the day
        const checkIn = records.find((r) => r.type === "CHECK_IN") || null;
        const checkOut = records.find((r) => r.type === "CHECK_OUT") || null;
        let totalWorkedMs = 0;
        let openSince = null;
        for (const rec of records) {
          const t = new Date(rec.time);
          if (rec.type === "CHECK_IN") {
            if (!openSince) openSince = t;
          }
          if (rec.type === "CHECK_OUT") {
            if (openSince) {
              totalWorkedMs += Math.max(0, t - openSince);
              openSince = null;
            }
          }
        }
        const label = new Date(key).toLocaleDateString(undefined, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return {
          date: key,
          label,
          checkIn,
          checkOut,
          checkInLabel: checkIn ? new Date(checkIn.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : null,
          checkOutLabel: checkOut ? new Date(checkOut.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : null,
          selfie: checkIn?.selfieBase64 || null,
          workedMs: totalWorkedMs,
          workedLabel: (() => {
            const totalMinutes = Math.floor(totalWorkedMs / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
          })(),
        };
      });

    return rows;
  }, [attendance]);

  // ✅ NO HARDCODED DEFAULTS: user fills everything
  const initialForm = useMemo(
    () => ({
      username: user?.username || "",   // ✅ add this
      name: user?.name || "",
      empId: user?.empId || user?.employeeId || "",
      workEmail: user?.workEmail || "",
      email: user?.email || "",
      workPhone: user?.workPhone || "",
      phone: user?.phone || "",
      department: user?.department || "",
      jobTitle: user?.jobTitle || "",
      shift: user?.shift || "",
      workType: user?.workType || "",
      dob: user?.dob || "",
      gender: user?.gender || "",
      address: user?.address || "",
      profilePhoto: user?.profilePhoto || "",
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);

  // ✅ Sync form with latest user data when not editing
  useEffect(() => {
    if (!editing) {
      setForm(initialForm);
    }
  }, [initialForm, editing]);

  // if completely empty, open edit automatically
  useEffect(() => {
    const empty =
      !initialForm.name &&
      !initialForm.email &&
      !initialForm.phone &&
      !initialForm.department &&
      !initialForm.jobTitle;

    if (empty) setEditing(true);
  }, [initialForm]);

  const displayName = form.username || form.name || user?.email || "User";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.username.trim()) return "Username is required.";
    if (!form.name.trim()) return "Full Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email looks invalid.";
    if (!form.phone.trim()) return "Phone is required.";
    if (form.phone.trim().length < 8) return "Phone number looks too short.";

    return null;
  };


  const onSave = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    // ✅ Update auth store (will also save to localStorage)
    updateUser(form);

    // ✅ Exit edit mode - form will auto-refresh from updated user data
    setEditing(false);
  };

  const onCancel = () => {
    setForm(initialForm);
    setEditing(false);
  };

  // ✅ Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }


    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setForm((p) => ({ ...p, profilePhoto: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle document upload
  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        url: base64,
        employeeId: user?.empId || user?.employeeId,
        employeeName: user?.name,
        uploadedAt: new Date().toISOString()
      };

      const stored = JSON.parse(localStorage.getItem("employee_documents") || "[]");
      stored.push(newDoc);
      localStorage.setItem("employee_documents", JSON.stringify(stored));
      window.dispatchEvent(new Event("documents_updated"));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Handle document delete
  const handleDocumentDelete = (docId) => {
    if (!window.confirm("Delete this document?")) return;

    const stored = JSON.parse(localStorage.getItem("employee_documents") || "[]");
    const updated = stored.filter(d => d.id !== docId);
    localStorage.setItem("employee_documents", JSON.stringify(updated));
    window.dispatchEvent(new Event("documents_updated"));
  };

  // ✅ Get initials from name
  const getInitials = () => {
    const names = form.name?.split(" ") || [];
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  // ✅ No need for extra localStorage hydration - auth store handles it all


  const showVal = (v) => (v ? v : "-");

  return (
    <Page>
      <Shell>

        <ProfileCard>
        <img src={profile_background}/>
          {/* Top right edit button like screenshot */}
          <TopRow>
            {!editing ? (
              <IconAction onClick={() => setEditing(true)}>
                <Pencil size={16} /> Edit Profile
              </IconAction>
            ) : (
              <>
                <IconAction onClick={onSave}>
                  <Save size={16} /> Save Changes
                </IconAction>
                <IconAction $danger onClick={onCancel}>
                  <X size={16} /> Cancel
                </IconAction>
              </>
            )}
          </TopRow>

          <MainRow>
            <AvatarWrap>
              <AvatarFrame>
                {form.profilePhoto ? (
                  <Avatar src={form.profilePhoto} alt={form.name} />
                ) : (
                  <AvatarPlaceholder>{getInitials()}</AvatarPlaceholder>
                )}
              </AvatarFrame>

              {editing && (
                <AvatarUploadBtn>
                  📷Change Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </AvatarUploadBtn>
              )}
            </AvatarWrap>

            <NameBlock>
              <Name>{displayName}</Name>

              <PillRow>
                {/* left small icon pill (like screenshot) */}
                <MiniPill type="button" title="Employee badge">
                  <IdCard size={20} /> {showVal(form.empId)}
                </MiniPill>

                {/* role pill (employee) */}
                <RolePill>
                  <Building2 size={16} /> {role || "employee"}
                </RolePill>
              </PillRow>
            </NameBlock>

            {/* Right side contact details like screenshot */}
            <RightInfo>
              <InfoRow>
                <Mail size={20} />
                <span className="k">Work Email:</span>
                {editing ? (
                  <Input
                    name="workEmail"
                    value={form.workEmail}
                    onChange={onChange}
                    placeholder="Enter work email"
                  />
                ) : (
                  <span className="v">{showVal(form.workEmail)}</span>
                )}
              </InfoRow>

              <InfoRow>
                <Mail size={20} />
                <span className="k">Email:</span>
                {editing ? (
                  <Input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Enter email"
                  />
                ) : (
                  <span className="v">- {showVal(form.email)}</span>
                )}
              </InfoRow>

              <InfoRow>
                <Phone size={20} />
                <span className="k">Work Phone:</span>
                {editing ? (
                  <Input
                    name="workPhone"
                    value={form.workPhone}
                    onChange={onChange}
                    placeholder="Enter work phone"
                  />
                ) : (
                  <span className="v">{showVal(form.workPhone)}</span>
                )}
              </InfoRow>

              <InfoRow>
                <Phone size={20} />
                <span className="k">Phone:</span>
                {editing ? (
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Enter phone"
                  />
                ) : (
                  <span className="v">{showVal(form.phone)}</span>
                )}
              </InfoRow>
            </RightInfo>
          </MainRow>

          <Divider/>

          {/* Tabs row inside the card like screenshot */}
          <Tabs>
            {["About", "Work Type & Shift", "Attendance", "Leave", "Payroll", "Documents"].map(
              (t) => (
                <Tab key={t} $active={activeTab === t} onClick={() => setActiveTab(t)}>
                  {t}
                </Tab>
              )
            )}
          </Tabs>

          {editing && (
            <Hint>
              Editing mode ON — fill details and hit <b>Save</b>.
            </Hint>
          )}

          <div style={{ height: 18 }} />
        </ProfileCard>
        {activeTab === "About" && (
          <ContentGrid>
            <Panel className="">
              <PanelHeader><img className="personal_img" src={user_icon}/>Personal Information</PanelHeader>
              <Divider/>
              <PanelBody>
                <Field>
                  <div className="label">1.Username</div>
                  {editing ? (
                    <Input
                      name="username"
                      value={form.username}
                      onChange={onChange}
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="value">{showVal(form.username)}</div>
                  )}
                </Field>
                <Field>
                  <div className="label">2.Full Name</div>
                  {editing ? (
                    <Input name="name" value={form.name} onChange={onChange} placeholder="Enter full name" />
                  ) : (
                    <div className="value">{showVal(form.name)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">3.Employee ID</div>
                  {editing ? (
                    <Input name="empId" value={form.empId} onChange={onChange} placeholder="Enter employee ID" />
                  ) : (
                    <div className="value">{showVal(form.empId)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">4.Date of Birth</div>
                  {editing ? (
                    <Input name="dob" value={form.dob} onChange={onChange} placeholder="DD MMM (e.g., 05 Jan)" />
                  ) : (
                    <div className="value">{showVal(form.dob)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">5.Gender</div>
                  {editing ? (
                    <Select name="gender" value={form.gender} onChange={onChange}>
                      <option value="">Select</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </Select>
                  ) : (
                    <div className="value">{showVal(form.gender)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">6.Address</div>
                  {editing ? (
                    <TextArea name="address" value={form.address} onChange={onChange} placeholder="Enter address" />
                  ) : (
                    <div className="value">{showVal(form.address)}</div>
                  )}
                </Field>
              </PanelBody>
              </Panel>
              <Panel>
              <PanelHeader><img src={profile_icon}/>Work Information</PanelHeader>
              <Divider/>
              <PanelBody>
                <Field>
                  <div className="label">Department</div>
                  {editing ? (
                    <Input name="department" value={form.department} onChange={onChange} placeholder="Enter department" />
                  ) : (
                    <div className="value">{showVal(form.department)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Job Position</div>
                  {editing ? (
                    <Input name="jobTitle" value={form.jobTitle} onChange={onChange} placeholder="Enter job title" />
                  ) : (
                    <div className="value">{showVal(form.jobTitle)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Shift</div>
                  {editing ? (
                    <Input name="shift" value={form.shift} onChange={onChange} placeholder="Enter shift" />
                  ) : (
                    <div className="value">{showVal(form.shift)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Work Type</div>
                  {editing ? (
                    <Select name="workType" value={form.workType} onChange={onChange}>
                      <option value="">Select</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Intern">Intern</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  ) : (
                    <div className="value">{showVal(form.workType)}</div>
                  )}
                </Field>
              </PanelBody>

            </Panel>
          </ContentGrid>
        )}

        {activeTab === "Attendance" && (
          <ContentGrid>
          <Panel>
              <PanelHeader className="attendance"><img src={attendance1_icon}/>Attendance Summary</PanelHeader>
              <Divider/>
              <PanelBody>
              <div className="attendance-summary">
              <div className="total-days">
                <p className="days">
                <img src={employee_icon}/>{attendanceSummary.length} - Total Days</p>
              </div>
              <div className="present-days">
                <p className="days">
                <img src={present_icon}/>
                {0} - Present Days</p>
              </div>
              <div className="absent-days">
                <p className="days">
                <img src={remove_icon}/>{0} - Absent Days</p>
              </div>
              <div className="total-percentage">
                <p className="days">
                <img src={barGraph}/>{0} - Total present</p>
              </div>
              </div>
              </PanelBody>
            </Panel>
            <Panel>
              <PanelHeader><img src={attendance_icon}/>Daily Attendance</PanelHeader>
              <Divider/>
              <PanelBody>
                <AttendanceTableWrapper>
                  <table>
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>CHECK-IN</th>
                        <th>CHECK-OUT</th>
                        <th>HOURS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceSummary.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", padding: 18, color: "#6b7280" }}>
                            No attendance records yet.
                          </td>
                        </tr>
                      )}
                      {attendanceSummary.map((r) => (
                        <tr key={r.date}>
                          <td>{r.label}</td>
                          <td>
                            {r.checkIn ? (
                              <Badge $ok>{r.checkInLabel}</Badge>
                            ) : (
                              <span style={{ color: "#9ca3af", fontWeight: 700 }}>—</span>
                            )}
                          </td>
                          <td>
                            {r.checkOut ? (
                              <Badge>{r.checkOutLabel}</Badge>
                            ) : (
                              <span style={{ color: "#9ca3af", fontWeight: 700 }}>—</span>
                            )}
                          </td>
                          <td>
                            {r.workedLabel ? (
                              <Badge>{r.workedLabel}</Badge>
                            ) : (
                              <span style={{ color: "#9ca3af", fontWeight: 700 }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AttendanceTableWrapper>
              </PanelBody>
            </Panel>

            
          </ContentGrid>
        )}

        {activeTab === "Leave" && (
          <ContentGrid>
            <Panel>
              <PanelHeader><img src={absence}/>Leave Summary</PanelHeader>
              <Divider/>
              <PanelBody>
                <StatCard style={{ background: "linear-gradient(135deg, #667eeace 0%, #764ba2c3 100%)" }}>
                  <StatValue>{leaveData.approved}</StatValue>
                  <StatLabel>Approved Leaves</StatLabel>
                </StatCard>
                <StatCard style={{ background: "linear-gradient(135deg, #f193fbd2 0%, #f5576cd0 100%)" }}>
                  <StatValue>{leaveData.rejected}</StatValue>
                  <StatLabel>Rejected Leaves</StatLabel>
                </StatCard>
                <StatCard style={{ background: "linear-gradient(135deg, #4facfecd 0%, #00f1fed4 100%)" }}>
                  <StatValue>{leaveData.pending}</StatValue>
                  <StatLabel>Pending Leaves</StatLabel>
                </StatCard>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader><img src={leave_icon}/>Leave History</PanelHeader>
              <Divider/>
              <PanelBody>
                <RecordList>
                  {leaveData.records.length === 0 ? (
                    <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                      No leave requests found
                    </div>
                  ) : (
                    leaveData.records.slice().reverse().map((record, idx) => (
                      <RecordItem key={idx}>
                        <div>
                          <RecordDate>{record.type || "Leave"}</RecordDate>
                          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                            {record.from} - {record.to}
                          </div>
                          {record.reason && (
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                              {record.reason}
                            </div>
                          )}
                        </div>
                        <RecordStatus $status={record.status}>{record.status}</RecordStatus>
                      </RecordItem>
                    ))
                  )}
                </RecordList>
              </PanelBody>
            </Panel>
          </ContentGrid>
        )}

        {activeTab === "Documents" && (
          <ContentGrid>
            <Panel>
              <PanelHeader><img src={document_icon}/>My Documents</PanelHeader>
              <Divider/>
              <PanelBody>
                <UploadButton>
                <img src={upload_icon}/>
                  Upload Document
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                  />
                </UploadButton>
                <RecordList>
                  {documents.length === 0 ? (
                    <div style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                      No documents uploaded yet
                    </div>
                  ) : (
                    documents.map((doc, idx) => (
                      <RecordItem key={idx}>
                        <div>
                          <RecordDate>{doc.name || "Document"}</RecordDate>
                          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                            {doc.type || "File"} • Uploaded: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <a
                            href={doc.url || "#"}
                            download={doc.name}
                            style={{
                              padding: "6px 14px",
                              background: "#2563eb",
                              color: "white",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontSize: "12px",
                              fontWeight: "700"
                            }}
                          >
                            Download
                          </a>
                          <button
                            onClick={() => handleDocumentDelete(doc.id)}
                            style={{
                              padding: "6px 14px",
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "700"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </RecordItem>
                    ))
                  )}
                </RecordList>
              </PanelBody>
            </Panel>


          </ContentGrid>
        )}

        {activeTab === "Payroll" && (
          <ContentGrid>
            <Panel>
              <PanelHeader><img src={payroll_icon}/>Payroll Records</PanelHeader>
              <Divider/>
              <PanelBody>
                <PayrollRecords userId={user?.id} userEmail={user?.email} userName={user?.name} />
              </PanelBody>
            </Panel>
          </ContentGrid>
        )}

        {activeTab === "Work Type & Shift" && (
          <ContentGrid>
            <Panel>
              <PanelHeader><img className="work_img" src={work_icon}/>Work Type</PanelHeader>
              <Divider/>
              <PanelBody>
                <Field>
                  <div className="label">Employment Type</div>
                  {editing ? (
                    <Select
                      name="workType"
                      value={form.workType}
                      onChange={onChange}
                    >
                      <option value="">Select Work Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Intern">Intern</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  ) : (
                    <div className="value">{showVal(form.workType)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Department</div>
                  <div className="value">{showVal(form.department)}</div>
                </Field>

                <Field>
                  <div className="label">Job Position</div>
                  <div className="value">{showVal(form.jobTitle)}</div>
                </Field>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader><img src={shift_icon}/>Shift Details</PanelHeader>
              <Divider/>
              <PanelBody>
                <Field>
                  <div className="label">Shift Name</div>
                  {editing ? (
                    <Select
                      name="shift"
                      value={form.shift}
                      onChange={onChange}
                    >
                      <option value="">Select Shift</option>
                      <option value="Morning Shift">Morning Shift (9AM - 6PM)</option>
                      <option value="Evening Shift">Evening Shift (2PM - 11PM)</option>
                      <option value="Night Shift">Night Shift (10PM - 6AM)</option>
                      <option value="Flexible Shift">Flexible Shift</option>
                    </Select>
                  ) : (
                    <div className="value">{showVal(form.shift)}</div>
                  )}
                </Field>

                <StatCard style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", marginTop: "16px" }}>
                  <StatLabel style={{ marginBottom: "8px" }}>Current Work Schedule</StatLabel>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    {form.workType || "Not Set"} - {form.shift || "Not Set"}
                  </div>
                </StatCard>
              </PanelBody>
            </Panel>
          </ContentGrid>
        )}


      </Shell>
    </Page>
  );
}

/* ===================== ATTENDANCE HELPERS / STYLES ===================== */

const AttendanceTableWrapper = styled.div`
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    font-size: 14px;
    color: #000b23;
    padding: 12px 8px;
    border-bottom: 1px solid #c4c4c4;
    font-weight: 900;
  }

  td {
    padding: 12px 8px;
    border-bottom: 1px solid #cacaca;
    vertical-align: middle;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 8px 10px;
  border-radius: 8px;
  background: ${({ $ok }) => ($ok ? "#ecfdf5" : "#eef2ff")};
  color: ${({ $ok }) => ($ok ? "#11643a" : "#2563eb")};
  font-weight: 800;
  font-size: 13px;
  border: 1px solid ${({ $ok }) => ($ok ? "#bbf7d0" : "#dbeafe")};
`;

// removed Thumb (selfie thumbnail) - replaced by worked hours
