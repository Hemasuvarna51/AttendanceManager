import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Edit2, Trash2, Plus, ChevronDown } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

/* ================== HELPERS ================== */

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/* ================== STYLES ================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Main = styled.main`
  flex: 1;
  margin-left: 24px;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const AddButton = styled.button`
  background: #77809f;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 14px;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5f677f;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.active ? "#77809f" : "#e5e7eb")};
  background: ${(props) => (props.active ? "#77809f" : "#f9fafb")};
  color: ${(props) => (props.active ? "#ffffff" : "#374151")};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #77809f;
  }
`;

const ProjectsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case "Running":
        return "#d1fae5";
      case "Ended":
        return "#fee2e2";
      case "Pending":
        return "#fef3c7";
      default:
        return "#f3f4f6";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "Running":
        return "#065f46";
      case "Ended":
        return "#7f1d1d";
      case "Pending":
        return "#78350f";
      default:
        return "#374151";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }

  &.delete:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;

  p {
    margin: 12px 0;
  }
`;

const Modal = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #77809f;
    box-shadow: 0 0 0 3px rgba(119, 128, 159, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #77809f;
    box-shadow: 0 0 0 3px rgba(119, 128, 159, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: #77809f;
    color: #ffffff;

    &:hover {
      background: #5f677f;
    }
  }

  &.secondary {
    background: #e5e7eb;
    color: #374151;

    &:hover {
      background: #d1d5db;
    }
  }
`;

/* ================== COMPONENT ================== */

export default function Projects() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => safeParse("projects", []));
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", status: "Running" });

  /* ---------- Load projects ---------- */
  useEffect(() => {
    const loadProjects = () => {
      setProjects(safeParse("projects", []));
    };

    loadProjects();
    window.addEventListener("projects_updated", loadProjects);
    window.addEventListener("storage", loadProjects);

    return () => {
      window.removeEventListener("projects_updated", loadProjects);
      window.removeEventListener("storage", loadProjects);
    };
  }, []);

  /* ---------- Filter projects ---------- */
  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  /* ---------- Handlers ---------- */

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: "", status: "Running" });
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({ name: project.name, status: project.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }

    if (editingId) {
      // Update existing
      const updated = projects.map((p) =>
        p.id === editingId
          ? { ...p, name: formData.name, status: formData.status }
          : p
      );
      saveJSON("projects", updated);
    } else {
      // Create new
      const newProject = {
        id: crypto?.randomUUID?.() || String(Date.now()),
        name: formData.name,
        status: formData.status,
        createdAt: new Date().toISOString(),
      };
      const updated = [...projects, newProject];
      saveJSON("projects", updated);
    }

    window.dispatchEvent(new Event("projects_updated"));
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter((p) => p.id !== id);
      saveJSON("projects", updated);
      window.dispatchEvent(new Event("projects_updated"));
    }
  };

  return (
    <Page>
      <Main>
        <Header>
          <Title>Projects</Title>
          <AddButton onClick={handleAddNew}>
            <Plus size={16} /> Add Project
          </AddButton>
        </Header>

        <FilterContainer>
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All ({projects.length})
          </FilterButton>
          <FilterButton
            active={filter === "Running"}
            onClick={() => setFilter("Running")}
          >
            Running ({projects.filter((p) => p.status === "Running").length})
          </FilterButton>
          <FilterButton
            active={filter === "Pending"}
            onClick={() => setFilter("Pending")}
          >
            Pending ({projects.filter((p) => p.status === "Pending").length})
          </FilterButton>
          <FilterButton
            active={filter === "Ended"}
            onClick={() => setFilter("Ended")}
          >
            Ended ({projects.filter((p) => p.status === "Ended").length})
          </FilterButton>
        </FilterContainer>

        {filteredProjects.length === 0 ? (
          <EmptyState>
            <p>No projects found</p>
            <AddButton onClick={handleAddNew} style={{ marginTop: "16px" }}>
              <Plus size={16} /> Create First Project
            </AddButton>
          </EmptyState>
        ) : (
          <ProjectsTable>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>
                    <StatusBadge status={project.status}>
                      {project.status}
                    </StatusBadge>
                  </td>
                  <td>
                    {project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <ActionButtons>
                      <IconButton onClick={() => handleEdit(project)}>
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        className="delete"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </ProjectsTable>
        )}

        {/* Modal for Add/Edit */}
        <Modal show={showModal}>
          <ModalContent>
            <ModalHeader>
              {editingId ? "Edit Project" : "Add New Project"}
            </ModalHeader>

            <FormGroup>
              <Label>Project Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Running">Running</option>
                <option value="Pending">Pending</option>
                <option value="Ended">Ended</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <Button
                className="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button className="primary" onClick={handleSave}>
                {editingId ? "Update" : "Create"}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      </Main>
    </Page>
  );
}
