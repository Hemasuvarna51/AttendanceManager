import { useMeetingStore } from "../../store/meeting.store";
import { useAuthStore } from "../../store/auth.store";

export default function MyMeetings() {
  const { meetings } = useMeetingStore();
  const { user } = useAuthStore();

  const myMeetings = meetings.filter(
    (m) => m.employee === user?.name
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Upcoming Meetings</h2>

      {myMeetings.length === 0 && <p>No meetings assigned.</p>}

      {myMeetings.map((m, index) => (
        <div key={index} style={{ border: "1px solid #ddd", padding: "15px", marginTop: "10px" }}>
          <h4>{m.title}</h4>
          <p>Date: {m.date}</p>
          <p>Time: {m.time}</p>
          <p>Agenda: {m.agenda}</p>
          {m.link && (
            <a href={m.link} target="_blank" rel="noreferrer">
              🔗 Join Meeting
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
