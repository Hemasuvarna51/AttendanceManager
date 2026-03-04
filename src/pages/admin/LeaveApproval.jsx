import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Page from "../../layout/Page";
import { useLeaveStore } from "../../store/leave.store";
import {
  Bell,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";


/* ===================== LAYOUT ===================== */



const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
`;

const H1 = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
`;

const RightTopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBtn = styled.button`
  height: 38px;
  width: 38px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const GhostBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #fafafa;
  }
`;

const PrimaryBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 0;
  background: #0f172a;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.92;
  }
`;

/* ===================== CARD SHELL ===================== */

const Card = styled.div`
  background: #fff;
  border: 1px solid #e9ebf2;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
`;

const CardBody = styled.div`
  padding: 14px;
`;

/* ===================== TABS + CONTROLS ===================== */

const TabsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;

  flex-wrap: wrap;

  @media (max-width: 768px) {
  gap: 10px;
  }
`;

const Tabs = styled.div`
  display: inline-flex;
  padding: 6px;
  background: #f3f4f6;
  border-radius: 14px;
  border: 1px solid #e6e8ef;
`;

const Tab = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;

  background: ${(p) => (p.active ? "#ffffff" : "transparent")};
  color: ${(p) => (p.active ? "#0f172a" : "#64748b")};
  box-shadow: ${(p) => (p.active ? "0 8px 18px rgba(15,23,42,0.08)" : "none")};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
    gap: 8px;
  }
`;



const SearchBox = styled.div`
  height: 38px;
  flex: 1;                 /* ✅ takes remaining space */
  min-width: 220px;        /* ✅ doesn't get too tiny on desktop */

  border-radius: 14px;
  border: 1px solid #e6e8ef;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;          /* ✅ allow shrink */
    flex: 1 1 100%;        /* ✅ full row */
  }
`;

const SearchInput = styled.input`
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 13px;
  color: #0f172a;

  &::placeholder {
    color: #94a3b8;
    font-weight: 600;
  }
`;

const SmallBtn = styled.button`
  height: 38px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid #e6e8ef;
  background: #fff;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover { background: #fafafa; }

  @media (max-width: 768px) {
    flex: 1;               /* ✅ Filter + Sort share width */
    justify-content: center;
  }
`;

/* ===================== KPI CARDS ===================== */

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Kpi = styled(Card)`
  padding: 14px;
`;

const KpiTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const KpiIcon = styled.div`
  height: 34px;
  width: 34px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px solid #e6e8ef;
  display: grid;
  place-items: center;
`;

const KpiValue = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
`;

const KpiDelta = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: ${(p) => (p.positive ? "#16a34a" : "#ef4444")};
`;

const KpiLabel = styled.div`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
`;

/* ===================== TABLE ===================== */

const TableCard = styled(Card)`
  overflow: hidden;
`;

const TableHead = styled.div`
  padding: 10px 14px;
  border-bottom: 1px solid #eef2f7;
  background: #fff;
`;

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;

  @media (min-width: 900px) {
    overflow-x: hidden; /* ✅ no scroll on desktop */
  }
`;

const T = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 980px;
`;

const TH = styled.th`
  text-align: left;
  padding: 12px 12px;
  font-size: 12px;
  color: #64748b;
  font-weight: 900;
  background: #fbfbfd;
  border-bottom: 1px solid #eef2f7;
  white-space: nowrap;
`;

const TR = styled.tr`
  &:hover td {
    background: #fafafa;
  }
`;

const TD = styled.td`
  padding: 12px 12px;
  border-bottom: 1px solid #eef2f7;
  font-size: 13px;
  color: #0f172a;
  background: #fff;
  vertical-align: middle;
`;

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  height: 28px;
  width: 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7d2fe, #a7f3d0);
  border: 1px solid #e6e8ef;
`;

const NameMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.div`
  font-weight: 900;
  color: #0f172a;
  line-height: 1.1;
`;

const Sub = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

const Period = styled.div`
  font-weight: 900;
`;

const PeriodSub = styled.div`
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid #e6e8ef;

  color: ${(p) =>
    p.$v === "Approved"
      ? "#166534"
      : p.$v === "Rejected"
        ? "#991b1b"
        : "#92400e"};

  background: ${(p) =>
    p.$v === "Approved"
      ? "#dcfce7"
      : p.$v === "Rejected"
        ? "#fee2e2"
        : "#fef3c7"};
`;

const RowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ChipBtn = styled.button`
  height: 30px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid #e6e8ef;
  background: #fff;
  cursor: pointer;
  font-weight: 900;
  font-size: 12px;

  &:hover {
    background: #fafafa;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const KebabBtn = styled(IconBtn)`
  height: 30px;
  width: 30px;
  border-radius: 10px;
`;

const FooterBar = styled.div`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
`;

const LeftFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
`;

const Select = styled.select`
  height: 34px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #fff;
  padding: 0 10px;
  font-weight: 800;
  color: #0f172a;
  outline: none;
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PageBtn = styled.button`
  height: 34px;
  width: 36px;
  border-radius: 12px;
  border: 1px solid #e6e8ef;
  background: #fff;
  cursor: pointer;
  font-weight: 900;

  &:hover {
    background: #fafafa;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Hint = styled.div`
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
`;

/* ===================== HELPERS ===================== */

const daysBetweenInclusive = (from, to) => {
  if (!from || !to) return 0;
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

const prettyDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

/* ===================== COMPONENT ===================== */

export default function AdminLeaveRequests() {
  const { leaves, updateLeaveStatus } = useLeaveStore();

  // live refresh if you are syncing via localStorage custom events
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const onChange = () => setRefreshKey((k) => k + 1);
    window.addEventListener("storage", onChange);
    window.addEventListener("leaves_updated", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("leaves_updated", onChange);
    };
  }, []);

  // tabs like the screenshot
  const [tab, setTab] = useState("Requested"); // Requested | Balances | Calendar

  // controls
  const [q, setQ] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const list = useMemo(() => {
    const arr = Array.isArray(leaves) ? leaves : [];
    const term = q.trim().toLowerCase();

    // Requested tab = show all requests (default). Other tabs are just UI for now.
    if (tab !== "Requested") return [];

    if (!term) return arr;

    return arr.filter((l) => {
      const blob = [
        l.employee,
        l.name,
        l.userId,
        l.type,
        l.reason,
        l.status,
        l.from,
        l.to,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [leaves, q, tab, refreshKey]);

  const stats = useMemo(() => {
    const total = list.length;
    const approved = list.filter((x) => (x.status || "Pending") === "Approved").length;
    const rejected = list.filter((x) => (x.status || "Pending") === "Rejected").length;
    const pending = list.filter((x) => (x.status || "Pending") === "Pending").length;
    return { total, approved, rejected, pending };
  }, [list]);

  const totalPages = Math.max(1, Math.ceil(list.length / rowsPerPage));
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return list.slice(start, start + rowsPerPage);
  }, [list, page, rowsPerPage]);

  const statusIcon = (s) => {
    if (s === "Approved") return <CheckCircle2 size={16} />;
    if (s === "Rejected") return <XCircle size={16} />;
    return <Clock3 size={16} />;
    // Pending
  };

  const exportCsv = () => {
    // quick CSV export (no libs)
    const header = ["Employee", "From", "To", "Type", "Reason", "Status"];
    const rows = list.map((l) => [
      l.employee || l.name || l.userId || "",
      l.from || "",
      l.to || "",
      l.type || "",
      (l.reason || "").replaceAll("\n", " "),
      l.status || "Pending",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave_requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [selected, setSelected] = useState([]);

  const isSelected = (id) => selected.includes(id);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearSelected = () => setSelected([]);

  // ✅ Only select current page rows (better UX)
  const toggleSelectAllPage = () => {
    const ids = pageRows.map((x) => x.id);
    const allSelected = ids.every((id) => selected.includes(id));
    setSelected((prev) => {
      if (allSelected) return prev.filter((id) => !ids.includes(id));
      const merged = new Set([...prev, ...ids]);
      return Array.from(merged);
    });
  };

  const selectedCountOnPage = pageRows.filter((r) => selected.includes(r.id)).length;
  const allPageSelected = pageRows.length > 0 && selectedCountOnPage === pageRows.length;
  const somePageSelected = selectedCountOnPage > 0 && !allPageSelected;

  // ✅ Bulk actions
  const bulkUpdate = (status) => {
    selected.forEach((id) => updateLeaveStatus(id, status));
    clearSelected();
  };

  useEffect(() => {
    setSelected([]);
  }, [tab, q, page]);



  return (
    <Page>
      <TopBar>
        <H1>Time off</H1>

        <RightTopActions>
          <IconBtn title="Messages">
            {/* placeholder icon to match screenshot */}
            <Bell size={18} />
          </IconBtn>

          <GhostBtn onClick={exportCsv}>
            <Download size={16} />
            Export CSV
          </GhostBtn>

          <PrimaryBtn onClick={() => alert("Hook this to your Add Leave modal/page")}>
            <Plus size={16} />
            Add new
          </PrimaryBtn>
        </RightTopActions>
      </TopBar>
      {selected.length > 0 && (
        <div style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          border: "1px solid #e6e8ef",
          borderRadius: 14,
          background: "#fff",
        }}>
          <div style={{ fontWeight: 900, color: "#0f172a" }}>
            {selected.length} selected
          </div>

          <button
            onClick={() => bulkUpdate("Approved")}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid #e6e8ef",
              background: "#dcfce7",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Approve selected
          </button>

          <button
            onClick={() => bulkUpdate("Rejected")}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid #e6e8ef",
              background: "#fee2e2",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Reject selected
          </button>

          <button
            onClick={clearSelected}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid #e6e8ef",
              background: "#fff",
              fontWeight: 900,
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            Clear
          </button>
        </div>
      )}

      <Card>
        <CardBody>
          <TabsRow>
            <Tabs>
              <Tab active={tab === "Requested"} onClick={() => setTab("Requested")}>
                Requested
              </Tab>
              <Tab active={tab === "Balances"} onClick={() => setTab("Balances")}>
                Balances
              </Tab>
              <Tab active={tab === "Calendar"} onClick={() => setTab("Calendar")}>
                Calendar
              </Tab>
            </Tabs>

            <Controls>
              <SearchBox>
                <Search size={16} color="#94a3b8" />
                <SearchInput
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search..."
                />
              </SearchBox>

              <SmallBtn onClick={() => alert("Hook filter dropdown")}>
                <SlidersHorizontal size={16} />
                Filter
              </SmallBtn>

              <SmallBtn onClick={() => alert("Hook sort dropdown")}>
                <ArrowUpDown size={16} />
                Sort
              </SmallBtn>
            </Controls>
          </TabsRow>

          <KpiGrid>
            <Kpi>
              <KpiTop>
                <KpiIcon>
                  <Clock3 size={16} />
                </KpiIcon>
                <KpiDelta positive>+28</KpiDelta>
              </KpiTop>
              <KpiValue>{stats.total}</KpiValue>
              <KpiLabel>Total time off</KpiLabel>
            </Kpi>

            <Kpi>
              <KpiTop>
                <KpiIcon>
                  <CheckCircle2 size={16} />
                </KpiIcon>
                <KpiDelta> -12</KpiDelta>
              </KpiTop>
              <KpiValue>{stats.approved}</KpiValue>
              <KpiLabel>Approval time off</KpiLabel>
            </Kpi>

            <Kpi>
              <KpiTop>
                <KpiIcon>
                  <XCircle size={16} />
                </KpiIcon>
                <KpiDelta positive>+29</KpiDelta>
              </KpiTop>
              <KpiValue>{stats.rejected}</KpiValue>
              <KpiLabel>Rejected time off</KpiLabel>
            </Kpi>

            <Kpi>
              <KpiTop>
                <KpiIcon>
                  <Clock3 size={16} />
                </KpiIcon>
                <KpiDelta> -31</KpiDelta>
              </KpiTop>
              <KpiValue>{stats.pending}</KpiValue>
              <KpiLabel>Pending time off</KpiLabel>
            </Kpi>
          </KpiGrid>

          <TableCard>
            <TableHead />
            <TableWrap>
              <T>
                <thead>
                  <tr>
                    <TH style={{ width: 44 }}>
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = somePageSelected; // ✅ shows partial selection
                        }}
                        onChange={toggleSelectAllPage}
                      />
                    </TH>
                    <TH>Employee name</TH>
                    <TH>Period time off</TH>
                    <TH>Request type</TH>
                    <TH>Reason</TH>
                    <TH>Status</TH>
                    <TH style={{ width: 110, textAlign: "right" }}> </TH>
                  </tr>
                </thead>

                <tbody>
                  {tab !== "Requested" ? (
                    <TR>
                      <TD colSpan={7}>
                        <Hint>
                          {tab} view UI is ready — connect your data when you build that module.
                        </Hint>
                      </TD>
                    </TR>
                  ) : pageRows.length === 0 ? (
                    <TR>
                      <TD colSpan={7}>
                        <Hint>No leave requests found.</Hint>
                      </TD>
                    </TR>
                  ) : (
                    pageRows.map((leave) => {
                      const s = leave.status || "Pending";
                      const days = daysBetweenInclusive(leave.from, leave.to);
                      const isPending = s === "Pending";

                      return (
                        <TR key={leave.id}>
                          <TD>
                            <input
                              type="checkbox"
                              checked={isSelected(leave.id)}
                              onChange={() => toggleSelect(leave.id)}
                            />
                          </TD>

                          <TD>
                            <NameCell>
                              <Avatar />
                              <NameMeta>
                                <Name>{leave.employee || leave.name || leave.userId || "Unknown"}</Name>
                                <Sub>{leave.team || "—"}</Sub>
                              </NameMeta>
                            </NameCell>
                          </TD>

                          <TD>
                            <Period>
                              {prettyDate(leave.from)} → {prettyDate(leave.to)}
                            </Period>
                            <PeriodSub>{days} day{days > 1 ? "s" : ""}</PeriodSub>
                          </TD>

                          <TD>{leave.type || "—"}</TD>

                          <TD style={{ color: "#334155", fontWeight: 700 }}>
                            {leave.reason || "—"}
                          </TD>

                          <TD>
                            <StatusPill $v={s}>
                              {statusIcon(s)}
                              {s}
                            </StatusPill>
                          </TD>

                          <TD>
                            <RowActions>
                              <ChipBtn
                                disabled={!isPending}
                                onClick={() => updateLeaveStatus(leave.id, "Approved")}
                                title="Approve"
                              >
                                Approve
                              </ChipBtn>
                              <ChipBtn
                                disabled={!isPending}
                                onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                                title="Reject"
                              >
                                Reject
                              </ChipBtn>
                              <KebabBtn title="More">
                                <MoreVertical size={16} />
                              </KebabBtn>
                            </RowActions>
                          </TD>
                        </TR>
                      );
                    })
                  )}
                </tbody>
              </T>
            </TableWrap>

            <FooterBar>
              <LeftFooter>
                <Select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} records
                    </option>
                  ))}
                </Select>
              </LeftFooter>

              <Pager>
                <PageBtn disabled={page === 1} onClick={() => setPage(1)}>
                  {"«"}
                </PageBtn>
                <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  {"‹"}
                </PageBtn>

                <Hint>
                  Page <b style={{ color: "#0f172a" }}>{page}</b> / {totalPages}
                </Hint>

                <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  {"›"}
                </PageBtn>
                <PageBtn disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                  {"»"}
                </PageBtn>
              </Pager>

              <Hint>
                {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, list.length)} of{" "}
                {list.length}
              </Hint>
            </FooterBar>
          </TableCard>
        </CardBody>
      </Card>
    </Page>
  );
}