import { useEffect, useState } from "react";
import styled from "styled-components";
import { Mail, Phone, Pencil, Trash2, Upload } from "lucide-react";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* ================= Styled Components ================= */

const PageContainer = styled.div`
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2``;

const AddButton = styled.button`
  padding: 10px 16px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  cursor: pointer;
`;

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
`;

const EmployeeCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
  border: 1px solid #f1f5f9;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fce7f3;
  margin-bottom: 10px;
`;

const UploadImage = styled.label`
  margin-top: 10px;
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const EmployeeName = styled.h4`
  margin: 5px 0;
`;

const EmployeeRole = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const InfoBox = styled.div`
  background: #f8fafc;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
`;

const Label = styled.p`
  font-size: 11px;
  color: #9ca3af;
`;

const Value = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin-bottom: 6px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  background: ${(props) =>
    props.status === "Active" ? "#d4edda" : "#f8d7da"};
`;

const ActionBox = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled.button`
  background: #ffeeba;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: #f8d7da;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  min-width: 140px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const Card = styled.div`
  color: black;
  padding: 18px;
  border-left: 5px solid ${(props) => props.color || "#ddd"};
  border-radius: 14px;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

  h3 {
    font-size: 26px;
    margin: 0;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  width: 500px;
  max-width: 95%;
  border-radius: 10px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const CreateButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #6b7280;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
`;

/* ================= Component ================= */

const emptyEmployee = {
  name: "",
  id: "",
  role: "",
  email: "",
  phone: "",
  joiningDate: "",
  status: "Active",
  image: "",
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState(emptyEmployee);
  const [isEditing, setIsEditing] = useState(false);
  const [editDocId, setEditDocId] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const employeesCollectionRef = collection(db, "employees");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(employeesCollectionRef);

      const employeeList = snapshot.docs.map((docItem) => ({
        docId: docItem.id,
        ...docItem.data(),
      }));

      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setNewEmployee((prev) => ({
      ...prev,
      image: previewUrl,
    }));
  };

  const uploadEmployeeImage = async (file, employeeId) => {
    if (!file) return newEmployee.image || "";

    const fileName = `${Date.now()}-${file.name}`;
    const imageRef = ref(storage, `employees/${employeeId}/${fileName}`);

    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  };

  const resetForm = () => {
    if (selectedImageFile && newEmployee.image?.startsWith("blob:")) {
      URL.revokeObjectURL(newEmployee.image);
    }
    setNewEmployee(emptyEmployee);
    setIsEditing(false);
    setEditDocId(null);
    setSelectedImageFile(null);
    setShowModal(false);
  };

  const handleAddEmployee = async () => {
    if (
      !newEmployee.name.trim() ||
      !newEmployee.id.trim() ||
      !newEmployee.email.trim()
    ) {
      alert("Please fill Employee ID, Name, and Email");
      return;
    }

    try {
      const alreadyExists = employees.some(
        (emp) =>
          emp.id === newEmployee.id &&
          (!isEditing || emp.docId !== editDocId)
      );

      if (alreadyExists) {
        alert("Employee ID already exists");
        return;
      }

      let imageUrl = newEmployee.image || "";

      if (selectedImageFile) {
        imageUrl = await uploadEmployeeImage(selectedImageFile, newEmployee.id);
      }

      const employeePayload = {
        id: newEmployee.id.trim(),
        name: newEmployee.name.trim(),
        role: (newEmployee.role || "employee").trim(),
        email: newEmployee.email.trim().toLowerCase(),
        phone: newEmployee.phone.trim(),
        joiningDate: newEmployee.joiningDate,
        status: newEmployee.status,
        image: imageUrl,
        uid: isEditing ? (employees.find((e) => e.docId === editDocId)?.uid || "") : "",
        authProvider: isEditing
          ? (employees.find((e) => e.docId === editDocId)?.authProvider || "")
          : "",
      };

      if (isEditing && editDocId) {
        const employeeDocRef = doc(db, "employees", editDocId);
        await updateDoc(employeeDocRef, employeePayload);
      } else {
        await addDoc(employeesCollectionRef, {
          ...employeePayload,
          createdAt: new Date().toISOString(),
        });
      }

      await fetchEmployees();
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee");
    }
  };

  const handleDelete = async (docId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "employees", docId));
      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  const handleEdit = (employee) => {
    setNewEmployee({
      name: employee.name || "",
      id: employee.id || "",
      role: employee.role || "",
      email: employee.email || "",
      phone: employee.phone || "",
      joiningDate: employee.joiningDate || "",
      status: employee.status || "Active",
      image: employee.image || "",
    });

    setIsEditing(true);
    setEditDocId(employee.docId);
    setSelectedImageFile(null);
    setShowModal(true);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus === "All" || emp.status === filterStatus)
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive"
  ).length;

  return (
    <PageContainer>
      <Header>
        <Title>Employees</Title>
        <AddButton
          onClick={() => {
            setNewEmployee(emptyEmployee);
            setIsEditing(false);
            setEditDocId(null);
            setSelectedImageFile(null);
            setShowModal(true);
          }}
        >
          + Add Employee
        </AddButton>
      </Header>

      {showModal && (
        <Overlay>
          <Modal>
            <h3>{isEditing ? "Edit Employee" : "Add Employee"}</h3>

            <ProfileSection>
              <ProfileImage
                src={
                  newEmployee.image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
              />

              <UploadImage>
                <Upload size={14} /> Upload Photo
                <HiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </UploadImage>
            </ProfileSection>

            <Controls>
              <SearchInput
                placeholder="Employee ID"
                value={newEmployee.id}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, id: e.target.value })
                }
                disabled={isEditing}
              />

              <SearchInput
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
                }
              />

              <SearchInput
                placeholder="Role"
                value={newEmployee.role}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, role: e.target.value })
                }
              />
            </Controls>

            <Controls>
              <SearchInput
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />

              <SearchInput
                placeholder="Phone"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
              />
            </Controls>

            <Controls>
              <SearchInput
                type="date"
                value={newEmployee.joiningDate}
                onChange={(e) =>
                  setNewEmployee({
                    ...newEmployee,
                    joiningDate: e.target.value,
                  })
                }
              />

              <FilterSelect
                value={newEmployee.status}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </FilterSelect>
            </Controls>

            <ModalButtons>
              <CreateButton onClick={handleAddEmployee}>
                {isEditing ? "Update" : "Create"}
              </CreateButton>

              <CancelButton onClick={resetForm}>Cancel</CancelButton>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}

      <SummaryCards>
        <Card color="#0777f0ff">
          <h3>👥 {totalEmployees}</h3>
          <p>Total Employees</p>
        </Card>

        <Card color="#049924c5">
          <h3>🟢 {activeEmployees}</h3>
          <p>Active</p>
        </Card>

        <Card color="#cc4836">
          <h3>🔴 {inactiveEmployees}</h3>
          <p>Inactive</p>
        </Card>
      </SummaryCards>

      <Controls>
        <SearchInput
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <EmptyState>Loading employees...</EmptyState>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState>No employees found.</EmptyState>
      ) : (
        <EmployeeGrid>
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.docId}>
              <ProfileSection>
                <ProfileImage
                  src={
                    emp.image ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={emp.name}
                />

                <EmployeeName>{emp.name}</EmployeeName>

                <EmployeeRole>Role</EmployeeRole>
                <Value>{emp.role || "Not assigned"}</Value>
              </ProfileSection>

              <InfoBox>
                <InfoGrid>
                  <div>
                    <Label>ID</Label>
                    <Value>{emp.id}</Value>
                  </div>

                  <div>
                    <Label>Joined</Label>
                    <Value>{emp.joiningDate || "-"}</Value>
                  </div>
                </InfoGrid>

                <ContactRow>
                  <Mail size={14} /> {emp.email || "-"}
                </ContactRow>

                <ContactRow>
                  <Phone size={14} /> {emp.phone || "-"}
                </ContactRow>
              </InfoBox>

              <CardFooter>
                <StatusBadge status={emp.status}>{emp.status}</StatusBadge>

                <ActionBox>
                  <EditButton onClick={() => handleEdit(emp)}>
                    <Pencil size={14} />
                  </EditButton>

                  <DeleteButton onClick={() => handleDelete(emp.docId)}>
                    <Trash2 size={14} />
                  </DeleteButton>
                </ActionBox>
              </CardFooter>
            </EmployeeCard>
          ))}
        </EmployeeGrid>
      )}
    </PageContainer>
  );
}