import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";
import { Mail, Phone, Building2, IdCard, Pencil, Save, X } from "lucide-react";

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Shell = styled.div`
  display: grid;
  gap: 20px;
`;

const ProfileCard = styled.div`
  background: ${({ $editing }) => ($editing ? "#f0f4f9" : "#ffffff")};
  border: 1px solid #d1d8e0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
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
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid ${({ $danger }) => ($danger ? "#ef4444" : "#2563eb")};
  background: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13px;
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#2563eb")};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fee2e2" : "#dbeafe")};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    opacity: 0.9;
  }
`;

const MainRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 360px;
  gap: 24px;
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

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid #bfdbfe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
`;

const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border: 2px solid #bfdbfe;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
  display: grid;
  place-items: center;
  font-size: 48px;
  font-weight: 700;
  color: #0854a0;
`;

const AvatarUploadBtn = styled.label`
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #93c5fd;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #bfdbfe;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  input[type="file"] {
    display: none;
  }
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  letter-spacing: -0.3px;
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
  padding: 8px 12px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.3px;
`;

const RightInfo = styled.div`
  display: grid;
  gap: 16px;
  align-items: start;

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
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
  }
  .v {
    font-weight: 600;
    font-size: 14px;
    color: #1e293b;
  }
  svg {
    opacity: 0.75;
  }

  input {
    width: 100%;
  }
`;

const Tabs = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
`;

const Tab = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 10px 0;
  font-weight: 700;
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#2563eb" : "#64748b")};
  border-bottom: 3px solid ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #2563eb;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #d1d8e0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06);
  }
`;

const PanelHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  letter-spacing: 0.2px;
`;

const PanelBody = styled.div`
  padding: 18px;
  display: grid;
  gap: 16px;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;

  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 14px;
    color: #1e293b;
    font-weight: 600;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.2);
    background: #f8fafc;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.2);
  }

  &:hover {
    border-color: #94a3b8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.2);
    background: #f8fafc;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Hint = styled.div`
  margin-top: 16px;
  padding: 12px 14px;
  font-size: 12px;
  color: #0854a0;
  font-weight: 700;
  background: #dbeafe;
  border-left: 3px solid #2563eb;
  border-radius: 6px;
  letter-spacing: 0.2px;
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
              {form.profilePhoto ? (
                <Avatar src={form.profilePhoto} alt={form.name} />
              ) : (
                <AvatarPlaceholder>{getInitials()}</AvatarPlaceholder>
              )}
              {editing && (
                <AvatarUploadBtn>
                  📷 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </AvatarUploadBtn>
              )}
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
