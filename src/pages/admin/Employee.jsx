import { useState } from "react";
import styled from "styled-components";
import { Mail, Phone, Pencil, Trash2, Upload } from "lucide-react";

/* ================= Styled Components ================= */

const PageContainer = styled.div`
  padding: 30px;
  background: #f4f6f9;
  min-height: 100vh;
`;

const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

const Title = styled.h2``;

const AddButton = styled.button`
  padding:10px 16px;
  border:none;
  background:#2563eb;
  color:white;
  border-radius:6px;
  cursor:pointer;
`;

const EmployeeGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:18px;
`;

const EmployeeCard = styled.div`
  background:white;
  border-radius:20px;
  padding:20px;
  box-shadow:0 4px 20px rgba(0,0,0,0.08);
  transition:0.3s;
  border:1px solid #f1f5f9;
  position:relative;

  &:hover{
    transform:translateY(-6px);
    box-shadow:0 12px 40px rgba(0,0,0,0.15);
  }
`;

const ProfileSection = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
`;

const ProfileImage = styled.img`
  width:90px;
  height:90px;
  border-radius:50%;
  object-fit:cover;
  border:4px solid #fce7f3;
  margin-bottom:10px;
`;

const UploadImage = styled.label`
  margin-top:10px;
  font-size:12px;
  color:#2563eb;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:5px;
`;

const HiddenInput = styled.input`
  display:none;
`;

const EmployeeName = styled.h4`
  margin:5px 0;
`;

const EmployeeRole = styled.p`
  font-size:14px;
  color:#6b7280;
`;

const InfoBox = styled.div`
  background:#f8fafc;
  padding:15px;
  border-radius:10px;
  margin-top:10px;
`;

const InfoGrid = styled.div`
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:10px;
`;

const Label = styled.p`
  font-size:11px;
  color:#9ca3af;
`;

const Value = styled.p`
  font-size:14px;
  font-weight:600;
`;

const ContactRow = styled.div`
  display:flex;
  align-items:center;
  gap:6px;
  font-size:14px;
  margin-bottom:6px;
`;

const CardFooter = styled.div`
  display:flex;
  justify-content:space-between;
  margin-top:12px;
`;

const StatusBadge = styled.span`
  padding:5px 10px;
  border-radius:20px;
  background:${props => props.status==="Active" ? "#d4edda" : "#f8d7da"};
`;

const ActionBox = styled.div`
  display:flex;
  gap:8px;
`;

const EditButton = styled.button`
  background:#ffeeba;
  border:none;
  padding:6px;
  border-radius:6px;
`;

const DeleteButton = styled.button`
  background:#f8d7da;
  border:none;
  padding:6px;
  border-radius:6px;
`;

const Controls = styled.div`
  display:flex;
  gap:10px;
  margin:20px 0;
`;

const SearchInput = styled.input`
  padding:10px;
  border-radius:6px;
  border:1px solid #ccc;
`;

const FilterSelect = styled.select`
  padding:10px;
  border-radius:6px;
  border:1px solid #ccc;
`;

const SummaryCards = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  gap:20px;
  margin:20px 0;
`;

const Card = styled.div`
  color: black;
  padding: 18px;
  border-left:5px solid ${(props) => props.color || "#ddd"};
  border-radius: 14px;
  transition: 0.3s;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 6px;

  
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);

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
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  }
`;
/* Modal */

const Overlay = styled.div`
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Modal = styled.div`
  background:white;
  padding:30px;
  width:420px;
  border-radius:10px;
`;

const ModalButtons = styled.div`
  display:flex;
  gap:10px;
  margin-top:20px;
`;

const CreateButton = styled.button`
  background:#28a745;
  color:white;
  border:none;
  padding:8px 14px;
  border-radius:6px;
`;

const CancelButton = styled.button`
  background:#dc3545;
  color:white;
  border:none;
  padding:8px 14px;
  border-radius:6px;
`;

/* ================= Component ================= */

export default function EmployeeList(){

const [employees,setEmployees]=useState([
{
name:"Ramya",
id:"E222",
email:"sunkariramya6@gmail.com",
joiningDate:"2026-03-02",
status:"Active",
image:""
}
]);

const [showModal,setShowModal]=useState(false);

const [newEmployee,setNewEmployee]=useState({
name:"",
id:"",
email:"",
joiningDate:"",
status:"Active",
image:""
});

const handleImageUpload=(e)=>{
const file=e.target.files[0];

if(file){
const reader=new FileReader();

reader.onloadend=()=>{
setNewEmployee({...newEmployee,image:reader.result});
};

reader.readAsDataURL(file);
}
};

const handleAddEmployee=()=>{
if(!newEmployee.name || !newEmployee.id) return;

setEmployees([...employees,newEmployee]);

setNewEmployee({
name:"",
id:"",
email:"",
joiningDate:"",
status:"Active",
image:""
});

setShowModal(false);
};

const handleDelete=(id)=>{
setEmployees(employees.filter(emp=>emp.id!==id));
};

const [search,setSearch]=useState("");
const [filterStatus,setFilterStatus]=useState("All");

const filteredEmployees=employees.filter(emp =>
emp.name.toLowerCase().includes(search.toLowerCase()) &&
(filterStatus==="All" || emp.status===filterStatus)
);

const totalEmployees=employees.length;
const activeEmployees=employees.filter(e=>e.status==="Active").length;
const inactiveEmployees=employees.filter(e=>e.status==="Inactive").length;

return(

<PageContainer>

<Header>
<Title>Employees</Title>
<AddButton onClick={()=>setShowModal(true)}>+ Add Employee</AddButton>
</Header>

{showModal && (

<Overlay>

<Modal>

<h3>Add Employee</h3>

<ProfileSection>

<ProfileImage
src={newEmployee.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
/>

<UploadImage>
<Upload size={14}/> Upload Photo
<HiddenInput type="file" onChange={handleImageUpload}/>
</UploadImage>

</ProfileSection>

<Controls>
<SearchInput placeholder="ID"
value={newEmployee.id}
onChange={e=>setNewEmployee({...newEmployee,id:e.target.value})}
/>

<SearchInput placeholder="Name"
value={newEmployee.name}
onChange={e=>setNewEmployee({...newEmployee,name:e.target.value})}
/>

<SearchInput placeholder="Role"
value={newEmployee.role}
onChange={e=>setNewEmployee({...newEmployee,role:e.target.value})}
/>
</Controls>

<Controls>

<SearchInput placeholder="Email"
value={newEmployee.email}
onChange={e=>setNewEmployee({...newEmployee,email:e.target.value})}
/>

<SearchInput type="date"
value={newEmployee.joiningDate}
onChange={e=>setNewEmployee({...newEmployee,joiningDate:e.target.value})}
/>

</Controls>

<FilterSelect
value={newEmployee.status}
onChange={e=>setNewEmployee({...newEmployee,status:e.target.value})}
>
<option>Active</option>
<option>Inactive</option>
</FilterSelect>

<ModalButtons>

<CreateButton onClick={handleAddEmployee}>
Create
</CreateButton>

<CancelButton onClick={()=>setShowModal(false)}>
Cancel
</CancelButton>

</ModalButtons>

</Modal>

</Overlay>

)}

<SummaryCards>

<Card  color="#0777f0ff">
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
onChange={(e)=>setSearch(e.target.value)}
/>

<FilterSelect
value={filterStatus}
onChange={(e)=>setFilterStatus(e.target.value)}
>
<option>All</option>
<option>Active</option>
<option>Inactive</option>
</FilterSelect>

</Controls>

<EmployeeGrid>

{filteredEmployees.map(emp=>(

<EmployeeCard key={emp.id}>

<ProfileSection>

<ProfileImage
src={emp.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
/>

<EmployeeName>{emp.name}</EmployeeName>

<EmployeeRole>Role</EmployeeRole>
<value>{emp.role || "Not assigned"}</value>

</ProfileSection>

<InfoBox>

<InfoGrid>

<div>
<Label>ID</Label>
<Value>{emp.id}</Value>
</div>

<div>
<Label>Joined</Label>
<Value>{emp.joiningDate}</Value>
</div>

</InfoGrid>

<ContactRow>
<Mail size={14}/> {emp.email}
</ContactRow>

<ContactRow>
<Phone size={14}/> +91 9876543210
</ContactRow>

</InfoBox>

<CardFooter>

<StatusBadge status={emp.status}>
{emp.status}
</StatusBadge>

<ActionBox>
<EditButton onClick={()=>handleEdit(emp.id)}>
  <Pencil size={14}/>
</EditButton>
<DeleteButton onClick={()=>handleDelete(emp.id)}>
<Trash2 size={14}/>
</DeleteButton>

</ActionBox>

</CardFooter>

</EmployeeCard>

))}

</EmployeeGrid>

</PageContainer>

);

}