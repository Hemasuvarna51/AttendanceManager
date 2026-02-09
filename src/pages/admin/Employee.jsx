import { useState } from "react";
import styled from "styled-components";

/* ===================== STYLED COMPONENTS ===================== */

const Card = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0;
`;

const AddButton = styled.button`
  padding: 10px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #1e4ed8;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  width: 560px;
  padding: 22px;
  border-radius: 12px;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  margin-top: 14px;

  h4 {
    grid-column: 1 / -1;
  }
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
`;

const SaveButton = styled.button`
  padding: 10px 16px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #15803d;
  }
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f3f4f6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const Status = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#166534" : "#991b1b")};
  background: ${(props) => (props.active ? "#dcfce7" : "#fee2e2")};
`;

const ActionBox = styled.div`
  display: flex;
  gap: 10px;
`;

const EditBtn = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1e40af;
  }
`;

const DeleteBtn = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;

/* ===================== COMPONENT ===================== */

export default function Employee() {
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "Ramya",
      email: "ramya@gmail.com",
      joined: "2024-01-10",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Suresh",
      email: "suresh@gmail.com",
      joined: "2023-11-02",
      status: "Inactive",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    joined: "",
    status: "Active",
  });

  /* ===================== CRUD LOGIC ===================== */

  const handleSubmit = () => {
    if (!formData.id || !formData.name || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    if (editingEmp) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmp.id ? formData : emp
        )
      );
    } else {
      setEmployees((prev) => [...prev, formData]);
    }

    resetForm();
  };

  const handleEdit = (emp) => {
    setEditingEmp(emp);
    setFormData(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEmp(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      joined: "",
      status: "Active",
    });
  };

  return (
    <Card>
      <Header>
        <Title>Employee List</Title>
        <AddButton onClick={() => setShowForm(true)}>
          + Add New Employee
        </AddButton>
      </Header>

      {showForm && (
        <Overlay onClick={resetForm}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h4>{editingEmp ? "Update Employee" : "Add Employee"}</h4>

            <Form>
              <Input
                placeholder="Employee ID"
                value={formData.id}
                disabled={!!editingEmp}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
              />

              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <Input
                type="date"
                value={formData.joined}
                onChange={(e) =>
                  setFormData({ ...formData, joined: e.target.value })
                }
              />

              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Select>

              <FormActions>
                <SaveButton onClick={handleSubmit}>
                  {editingEmp ? "Update" : "Create"}
                </SaveButton>
                <CancelButton onClick={resetForm}>Cancel</CancelButton>
              </FormActions>
            </Form>
          </Modal>
        </Overlay>
      )}

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Joining Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <Td>{emp.name}</Td>
              <Td>{emp.id}</Td>
              <Td>{emp.email}</Td>
              <Td>{emp.joined}</Td>
              <Td>
                <Status active={emp.status === "Active"}>
                  {emp.status}
                </Status>
              </Td>
              <Td>
                <ActionBox>
                  <EditBtn onClick={() => handleEdit(emp)}>Edit</EditBtn>
                  <DeleteBtn onClick={() => handleDelete(emp.id)}>
                    Delete
                  </DeleteBtn>
                </ActionBox>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
