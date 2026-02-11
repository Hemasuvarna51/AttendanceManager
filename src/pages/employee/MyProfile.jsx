import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";
import { Mail, Phone, Building2, IdCard, Pencil, Save, X } from "lucide-react";

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 18px;
`;

const Shell = styled.div`
  display: grid;
  gap: 16px;
`;

const ProfileCard = styled.div`
  background: ${({ $editing }) => ($editing ? "#f8fafc" : "#fff")};
  border: 1px solid #eef2f7;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  transition: 0.2s ease;
`;

const TopRow = styled.div`
  position: sticky;
  top: 12px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-bottom: 10px;
`;

const IconAction = styled.button`
  height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid #eef2f7;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: ${({ $danger }) => ($danger ? "#b42318" : "#111827")};

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fff5f5" : "#f8fafc")};
  }

  svg {
    opacity: 0.8;
  }
`;

const MainRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 360px;
  gap: 18px;
  align-items: center;

  @media (max-width: 980px) {
    grid-template-columns: 120px 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarWrap = styled.div`
  display: grid;
  place-items: center;
`;

const Avatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 18px;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  border: 1px solid #e5e7eb;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  font-weight: 700;
  font-size: 12px;
`;

const RightInfo = styled.div`
  display: grid;
  gap: 10px;
  justify-items: start;

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 18px 92px 1fr;
  align-items: center;
  gap: 10px;

  .k {
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
  }
  .v {
    font-weight: 700;
    font-size: 14px;
    color: #111827;
  }
  svg {
    opacity: 0.75;
  }

  input {
    width: 100%;
  }
`;

const Tabs = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  border-top: 1px solid #eef2f7;
  padding-top: 12px;
`;

const Tab = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 10px 4px;
  font-weight: 800;
  color: ${({ $active }) => ($active ? "#2563eb" : "#111827")};
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2563eb" : "transparent")};

  &:hover {
    color: #2563eb;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  font-weight: 900;
  color: #111827;
`;

const PanelBody = styled.div`
  padding: 14px 16px;
  display: grid;
  gap: 12px;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;

  .label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 700;
  }

  .value {
    font-size: 14px;
    color: #111827;
    font-weight: 800;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #dbe3f0;
  background: #fff;
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  color: #111827;
  outline: none;

  &:focus {
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  color: #111827;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: #93c5fd;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const Hint = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
`;

/* ===================== COMPONENT ===================== */

export default function MyProfile() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [activeTab, setActiveTab] = useState("About");
  const [editing, setEditing] = useState(false);

  // ✅ NO HARDCODED DEFAULTS: user fills everything
  const initialForm = useMemo(
    () => ({
      name: user?.name || user?.username || "",
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
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);

  // refresh form if user changes and not editing
  useEffect(() => {
    if (!editing) setForm(initialForm);
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

  const displayName = form.name || user?.name || user?.username || "User";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
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
      console.warn(err);
      return;
    }

    updateUser(form);

    try {
      localStorage.setItem("profile_user_patch", JSON.stringify(form));
    } catch {}

    setEditing(false);
  };

  const onCancel = () => {
    setForm(initialForm);
    setEditing(false);
  };

  // hydrate from local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("profile_user_patch");
      if (!raw) return;
      const patch = JSON.parse(raw);
      setForm((p) => ({ ...p, ...patch }));
      if (updateUser) updateUser(patch);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showVal = (v) => (v ? v : "-");

  return (
    <Page>
      <Shell>
        <ProfileCard $editing={editing}>
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
              <Avatar />
            </AvatarWrap>

            <NameBlock>
              <Name>{displayName}</Name>
              <Meta>
                <Chip>
                  <IdCard size={16} /> {showVal(form.empId)}
                </Chip>
                <Chip>
                  <Building2 size={16} /> {role || "employee"}
                </Chip>
              </Meta>
            </NameBlock>

            {/* ✅ Right side becomes editable too */}
            <RightInfo>
              <InfoRow>
                <Mail size={16} />
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
                <Mail size={16} />
                <span className="k">Email:</span>
                {editing ? (
                  <Input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="Enter email"
                  />
                ) : (
                  <span className="v">{showVal(form.email)}</span>
                )}
              </InfoRow>

              <InfoRow>
                <Phone size={16} />
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
                <Phone size={16} />
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

          <Tabs>
            {["About", "Work Type & Shift", "Attendance", "Leave", "Payroll", "Documents"].map((t) => (
              <Tab key={t} $active={activeTab === t} onClick={() => setActiveTab(t)}>
                {t}
              </Tab>
            ))}
          </Tabs>

          {editing && (
            <Hint>
              Editing mode ON — fill details and hit <b>Save</b>.
            </Hint>
          )}
        </ProfileCard>

        {activeTab === "About" && (
          <ContentGrid>
            <Panel>
              <PanelHeader>Personal Information</PanelHeader>
              <PanelBody>
                <Field>
                  <div className="label">Full Name</div>
                  {editing ? (
                    <Input name="name" value={form.name} onChange={onChange} placeholder="Enter full name" />
                  ) : (
                    <div className="value">{showVal(form.name)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Employee ID</div>
                  {editing ? (
                    <Input name="empId" value={form.empId} onChange={onChange} placeholder="Enter employee ID" />
                  ) : (
                    <div className="value">{showVal(form.empId)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Date of Birth</div>
                  {editing ? (
                    <Input name="dob" value={form.dob} onChange={onChange} placeholder="DD MMM (e.g., 05 Jan)" />
                  ) : (
                    <div className="value">{showVal(form.dob)}</div>
                  )}
                </Field>

                <Field>
                  <div className="label">Gender</div>
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
                  <div className="label">Address</div>
                  {editing ? (
                    <TextArea name="address" value={form.address} onChange={onChange} placeholder="Enter address" />
                  ) : (
                    <div className="value">{showVal(form.address)}</div>
                  )}
                </Field>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader>Work Information</PanelHeader>
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

        {activeTab !== "About" && (
          <ProfileCard>
            <div style={{ color: "#6b7280", fontWeight: 800 }}>
              {activeTab} section coming next.
            </div>
          </ProfileCard>
        )}
      </Shell>
    </Page>
  );
}
