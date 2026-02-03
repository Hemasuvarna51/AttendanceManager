import React, { useState } from "react";
import styled from "styled-components";

const STATUS = ["Pending", "In Progress", "Completed"];

const Hero = styled.div`
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }

  button {
    padding: 10px 16px;
    background-color: #256aeb;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  width: 520px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0 0 16px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;

  input,
  select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d5dd;
    border-radius: 8px;
    outline: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding-left: 10px;
  padding-right: 10px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #344054;
  }
`;

const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;

  button {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: #fff;
    background: #256aeb;
  }

  .cancel {
    background: #f61010;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  td button {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    color: white;
    background: #ef4444;
  }

  td .editBtn {
    background: #f59e0b;
    margin-right: 8px;
  }

  td select {
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
`;

const initialTasks = [];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Low",
    dueDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "Low",
      dueDate: "",
    });
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setEditingId(task.id);
    setOpen(true);
  };

  const saveTask = () => {
    if (!form.title || !form.assignedTo) return alert("Fill required fields");

    if (editingId) {
      // ✅ UPDATE existing task
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
      );
    } else {
      // ✅ CREATE new task
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), ...form, status: "Pending" },
      ]);
    }

    setOpen(false);
    resetForm();
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateStatus = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <Hero>
      <HeaderRow>
        <h2>Admin – Task Manager</h2>
        <button onClick={openCreate}>Add New Task</button>
      </HeaderRow>

      {open && (
        <Overlay
          onClick={() => {
            setOpen(false);
            resetForm();
          }}
        >
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Task" : "Create Task"}</h3>

            <FormGrid>
              <Field>
                <label>Task Title *</label>
                <input
                  name="title"
                  placeholder="Enter task title"
                  value={form.title}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <label>Assigned To *</label>
                <input
                  name="assignedTo"
                  placeholder="Employee name"
                  value={form.assignedTo}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </Field>

              <Field>
                <label>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </Field>

              <Field style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <input
                  name="description"
                  placeholder="Write description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Field>

              <ButtonRow>
                <button onClick={saveTask}>
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  className="cancel"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </ButtonRow>
            </FormGrid>
          </Modal>
        </Overlay>
      )}

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.assignedTo}</td>
              <td>{task.priority}</td>

              {/* ✅ Status Dropdown */}
              <td>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value)}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>

              <td>{task.dueDate}</td>

              {/* ✅ Edit + Delete */}
              <td>
                <button className="editBtn" onClick={() => openEdit(task)}>
                  Edit
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Hero>
  );
}
