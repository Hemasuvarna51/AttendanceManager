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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  width: 260px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 8px;
  width: 260px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
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
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Status = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.active ? "#166534" : "#991b1b")};
  background: ${(props) => (props.active ? "#dcfce7" : "#fee2e2")};
`;

const Action = styled.td`
  font-size: 18px;
  cursor: pointer;

  span {
    margin-right: 10px;
  }
`;

/* ===================== COMPONENT ===================== */

export default function Employee() {
  const [employees, setEmployees] = useState([
    {
      id: "E227",
      name: "Aisha Nabi",
      email: "aisha@gmail.com",
      joined: "2023-05-06",
      status: "Active",
    },
    {
      id: "E226",
      name: "Thomas Goodman",
      email: "thomas@gmail.com",
      joined: "2023-01-01",
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

    const exists = employees.some(
      (emp) => emp.id === formData.id && emp.id !== editingEmp?.id
    );

    if (exists) {
      alert("Employee ID already exists");
      return;
    }

    if (editingEmp) {
      // UPDATE
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmp.id
            ? { ...formData, avatar: emp.avatar }
            : emp
        )
      );
    } else {
      // CREATE
      setEmployees((prev) => [
        ...prev,
        {
          ...formData,
        
        },
      ]);
    }

    resetForm();
  };

  const handleEdit = (emp) => {
    setEditingEmp(emp);
    setFormData(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
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

  /* ===================== UI ===================== */

  return (
    <Card>
      <Header>
        <Title>Employee List</Title>
        <AddButton onClick={() => setShowForm(true)}>
          + Add New Employee
        </AddButton>
      </Header>

      {showForm && (
        <Form>
          <h4>{editingEmp ? "Update Employee" : "Add Employee"}</h4>

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
              <Td>
                <NameCell>
                  <Avatar src={emp.avatar} />
                  {emp.name}
                </NameCell>
              </Td>
              <Td>{emp.id}</Td>
              <Td>{emp.email}</Td>
              <Td>{emp.joined}</Td>
              <Td>
                <Status active={emp.status === "Active"}>
                  {emp.status}
                </Status>
              </Td>
              <Action>
                <span onClick={() => handleEdit(emp)}>✏️</span>
                <span onClick={() => handleDelete(emp.id)}>🗑️</span>
              </Action>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
