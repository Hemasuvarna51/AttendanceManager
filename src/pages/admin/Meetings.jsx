import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

/* ===================== STORAGE HELPERS ===================== */

const MEETINGS_KEY = "meetings";

const safeRead = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const saveMeetings = (items) => {
  localStorage.setItem(MEETINGS_KEY, JSON.stringify(items));
  // ✅ same-tab listeners (employee dashboard etc.)
  window.dispatchEvent(new Event("meetings_updated"));
};

const uid = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
  }
};

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 18px 40px;
  min-height: calc(100vh - 60px);
`;

const Surface = styled.div`
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 18px 46px rgba(2, 6, 23, 0.06);
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  p {
    margin: 6px 0 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 800;
  }
`;

const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.05);
`;

const CardTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 950;
  color: #0f172a;
`;

const Form = styled.div`
  display: grid;
  gap: 12px;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;

  label {
    font-size: 12px;
    color: #64748b;
    font-weight: 900;
  }

  input,
  select,
  textarea {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    outline: none;
    font-weight: 700;
    color: #0f172a;
    background: #fff;
  }

  textarea {
    min-height: 84px;
    resize: vertical;
    font-weight: 650;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const Btn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fecaca" : "#e2e8f0")};
  background: ${({ $primary, $danger }) =>
    $primary ? "#2563eb" : $danger ? "#fff5f5" : "#fff"};
  color: ${({ $primary, $danger }) =>
    $primary ? "#fff" : $danger ? "#b91c1c" : "#0f172a"};
  font-weight: 950;
  cursor: pointer;

  &:hover {
    filter: brightness(0.97);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.04);
`;

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const ItemTitle = styled.div`
  font-weight: 950;
  color: #0f172a;
  font-size: 14px;
`;

const Meta = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  display: grid;
  gap: 4px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 950;
`;

const Link = styled.a`
  display: inline-flex;
  gap: 6px;
  margin-top: 8px;
  color: #2563eb;
  font-weight: 950;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Empty = styled.div`
  border: 1px dashed #e2e8f0;
  background: #fbfdff;
  border-radius: 16px;
  padding: 14px;
  color: #64748b;
  font-weight: 900;
  font-size: 13px;
`;

/* ===================== COMPONENT ===================== */

export default function Meetings() {
  // ✅ Replace this employee list with your actual employee list from backend/store
  // For now it's just sample names (must match employee user.name in auth store)
  const EMPLOYEES = ["Hema", "Employee", "Ravi", "Sowjanya"];

  const [meetings, setMeetings] = useState(() => safeRead(MEETINGS_KEY, []));

  // form state
  const [employee, setEmployee] = useState(EMPLOYEES[0] || "");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState(""); // hh:mm
  const [agenda, setAgenda] = useState("");
  const [link, setLink] = useState("");

  // keep in sync if other tab updates
  useEffect(() => {
    const load = () => setMeetings(safeRead(MEETINGS_KEY, []));
    window.addEventListener("storage", load);
    window.addEventListener("meetings_updated", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("meetings_updated", load);
    };
  }, []);

  const canCreate = useMemo(() => {
    return Boolean(employee && title.trim() && date && time && agenda.trim());
  }, [employee, title, date, time, agenda]);

  const sorted = useMemo(() => {
    // sort by date+time desc (newest first)
    return meetings
      .slice()
      .sort((a, b) => {
        const ad = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
        const bd = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
        return bd - ad;
      });
  }, [meetings]);

  const createMeeting = () => {
    if (!canCreate) return;

    const newMeeting = {
      id: uid(),
      employee, // ⚠️ best practice: employeeId
      title: title.trim(),
      date,
      time,
      agenda: agenda.trim(),
      link: link.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [newMeeting, ...meetings];
    setMeetings(next);
    saveMeetings(next);

    // reset form
    setTitle("");
    setDate("");
    setTime("");
    setAgenda("");
    setLink("");
  };

  const deleteMeeting = (id) => {
    const next = meetings.filter((m) => m.id !== id);
    setMeetings(next);
    saveMeetings(next);
  };

  const clearAllMeetings = () => {
    setMeetings([]);
    saveMeetings([]);
  };

  return (
    <Page>
      <Surface>
        <TitleRow>
          <div>
            <h2>Meetings</h2>
            <p>Create meetings in Admin and they will reflect to Employee instantly.</p>
          </div>

          <BtnRow>
            <Btn $danger onClick={clearAllMeetings} disabled={meetings.length === 0}>
              Clear All
            </Btn>
          </BtnRow>
        </TitleRow>

        <Grid>
          {/* LEFT: Create */}
          <Card>
            <CardTitle>Create Meeting</CardTitle>

            <Form>
              <Field>
                <label>Assign To Employee</label>
                <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
                  {EMPLOYEES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field>
                <label>Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Weekly Sync"
                />
              </Field>

              <Row>
                <Field>
                  <label>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field>
                  <label>Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </Field>
              </Row>

              <Field>
                <label>Agenda</label>
                <textarea
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  placeholder="What’s the meeting about?"
                />
              </Field>

              <Field>
                <label>Meeting Link (optional)</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                />
              </Field>

              <BtnRow>
                <Btn $primary onClick={createMeeting} disabled={!canCreate}>
                  Create
                </Btn>
                <Btn
                  onClick={() => {
                    setTitle("");
                    setDate("");
                    setTime("");
                    setAgenda("");
                    setLink("");
                  }}
                >
                  Reset
                </Btn>
              </BtnRow>
            </Form>
          </Card>

          {/* RIGHT: List */}
          <Card>
            <CardTitle>Scheduled Meetings</CardTitle>

            {sorted.length === 0 ? (
              <Empty>No meetings created yet.</Empty>
            ) : (
              <List>
                {sorted.map((m) => (
                  <Item key={m.id}>
                    <ItemTop>
                      <div>
                        <ItemTitle>{m.title}</ItemTitle>
                        <Meta>
                          <div>
                            <Tag>👤 {m.employee}</Tag>
                          </div>
                          <div>📅 {m.date} • ⏰ {m.time}</div>
                          <div>📝 {m.agenda}</div>
                        </Meta>

                        {m.link ? (
                          <Link href={m.link} target="_blank" rel="noreferrer">
                            🔗 Join Meeting
                          </Link>
                        ) : null}
                      </div>

                      <Btn $danger onClick={() => deleteMeeting(m.id)}>
                        Delete
                      </Btn>
                    </ItemTop>
                  </Item>
                ))}
              </List>
            )}
          </Card>
        </Grid>
      </Surface>
    </Page>
  );
}
