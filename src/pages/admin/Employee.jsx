import { useState } from "react";
import styled from "styled-components";
import { Pencil, Trash2 } from "lucide-react";
/* ================= Styled Components ================= */


const ActionBox = styled.div`
  display: flex;
  gap: 8px;
`;
const PageContainer = styled.div`
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  margin: 0;
`;

const AddButton = styled.button`
  background: #2f80ed;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1f6ed4;
  }
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 25px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  h3 {
    margin: 0;
    font-size: 22px;
  }

  p {
    margin: 5px 0 0;
    color: #777;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 250px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 15px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background: #f9fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  background: ${(props) =>
    props.status === "Active" ? "#d4edda" : "#f8d7da"};
  color: ${(props) =>
    props.status === "Active" ? "#155724" : "#721c24"};
`;

const ActionButton = styled.button`
  border: none;
  padding: 6px 10px;
  margin-right: 8px;
  border-radius: 6px;
  cursor: pointer;
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
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  width: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
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
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
`;

const EditButton = styled(ActionButton)`
  background: #ffeeba;
`;

const DeleteButton = styled(ActionButton)`
  background: #f8d7da;
`;



/* ================= Component ================= */

export default function EmployeeList() {
  const [employees, setEmployees] = useState([

  ]);

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    id: "",
    email: "",
    joiningDate: "",
    status: "Active"
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.id) return;
    
    if (editMode) {
      setEmployees(employees.map(emp => emp.id === newEmployee.id ? newEmployee : emp));
      
    }else {
      setEmployees([...employees, newEmployee]);
    }
    

    setNewEmployee({
      name: "",
      id: "",
      email: "",
      joiningDate: "",
      status: "Active"
    });
    
    setEditMode(false);
    setShowModal(false);
  };

  const handleEdit = (emp) => {
  setNewEmployee(emp);        // fill modal with employee data
  setEditMode(true);          // enable edit mode
  setShowModal(true);         // open modal
};
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === "All" || emp.status === filterStatus)
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "Active").length;
  const inactiveEmployees = employees.filter(emp => emp.status === "Inactive").length;

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <PageContainer>
      <Header>
        <Title>Employees</Title>
        <AddButton onClick={() => setShowModal(true)}>+ Add New Employee</AddButton>
      </Header>
      {showModal && (
        <Overlay>
          <Modal>
            <ModalTitle>Add Employee</ModalTitle>

            <Controls>
              <SearchInput
                placeholder="Employee ID"
                value={newEmployee.id}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, id: e.target.value })
                }
              />

              <SearchInput
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, name: e.target.value })
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
                type="date"
                value={newEmployee.joiningDate}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
                }
              />
            </Controls>

            <FilterSelect
              value={newEmployee.status}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </FilterSelect>

            <ModalButtons>
              <CreateButton onClick={() => {
                handleAddEmployee();
                setShowModal(false);
              }}>
                Create
              </CreateButton>

              <CancelButton onClick={() => setShowModal(false)}>
                Cancel
              </CancelButton>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
      <SummaryCards>
        <Card>
          <h3>{totalEmployees}</h3>
          <p>Total Employees</p>
        </Card>
        <Card>
          <h3>{activeEmployees}</h3>
          <p>Active Employees</p>
        </Card>
        <Card>
          <h3>{inactiveEmployees}</h3>
          <p>Inactive Employees</p>
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
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FilterSelect>
      </Controls>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Email</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.id}</td>
                <td>{emp.email}</td>
                <td>{emp.joiningDate}</td>
                <td>
                  <StatusBadge status={emp.status}>
                    {emp.status}
                  </StatusBadge>
                </td>
                <td>
                  <ActionBox>
                    <EditButton onClick={() => handleEdit(emp)}>
                      <Pencil size={14} />
                    </EditButton>
                    <DeleteButton onClick={() => handleDelete(emp.id)}>
                      <Trash2 size={14} />
                    </DeleteButton>
                  </ActionBox>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}