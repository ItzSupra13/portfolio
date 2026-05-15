"use client";
import { useState, useMemo } from "react";

const INDIA_HOLIDAYS_2026 = [
  { date: "2026-01-14", name: "Makar Sankranti" },
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-02", name: "Maha Shivaratri" },
  { date: "2026-03-20", name: "Holi" },
  { date: "2026-03-30", name: "Ram Navami" },
  { date: "2026-04-02", name: "Good Friday" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti" },
  { date: "2026-05-27", name: "Bakrid (tentative)" },
  { date: "2026-05-28", name: "Eid ul-Adha (tentative)" },
  { date: "2026-06-26", name: "Muharram/Ashura (tentative)" },
  { date: "2026-07-16", name: "Rath Yatra" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-08-26", name: "Onam" },
  { date: "2026-08-28", name: "Raksha Bandhan" },
  { date: "2026-09-04", name: "Janmashtami" },
  { date: "2026-09-14", name: "Ganesh Chaturthi" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-11", name: "Sharad Navratri (Day 1)" },
  { date: "2026-10-17", name: "Durga Puja Festivities" },
  { date: "2026-10-18", name: "Maha Saptami" },
  { date: "2026-10-19", name: "Maha Ashtami" },
  { date: "2026-10-20", name: "Dussehra" },
  { date: "2026-10-26", name: "Valmiki Jayanti" },
  { date: "2026-10-29", name: "Karva Chauth" },
  { date: "2026-11-08", name: "Diwali" },
  { date: "2026-11-09", name: "Govardhan Puja" },
  { date: "2026-11-11", name: "Bhai Duj" },
  { date: "2026-11-15", name: "Chhat Puja" },
  { date: "2026-11-24", name: "Guru Tegh Bahadur Martyrdom Day" },
  { date: "2026-12-23", name: "Hazrat Ali's Birthday" },
  { date: "2026-12-24", name: "Christmas Eve" },
  { date: "2026-12-25", name: "Christmas" },
];

const WORK_DAYS_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_MAP = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function dateStr(d) {
  return d.toISOString().split("T")[0];
}
function fmt(d) {
  const dd = new Date(d + "T00:00:00");
  return `${dd.getDate()} ${MONTH_NAMES[dd.getMonth()]}`;
}
function fmtFull(d) {
  const dd = new Date(d + "T00:00:00");
  return `${dd.getDate()} ${MONTH_NAMES[dd.getMonth()]} ${DAY_NAMES[dd.getDay()]}`;
}

export default function LeaveOptimizer() {
  const [step, setStep] = useState(0); // 0=input, 1=results
  const [startDate, setStartDate] = useState("2026-05-16");
  const [endDate, setEndDate] = useState("2026-12-31");
  const [workDays, setWorkDays] = useState(["Mon","Tue","Wed","Thu","Fri"]);
  const [maxLeave, setMaxLeave] = useState(6);
  const [calcMode, setCalcMode] = useState("all");
  const [holidays, setHolidays] = useState(
    INDIA_HOLIDAYS_2026.map((h) => ({ ...h, enabled: true }))
  );
  const [filterMin, setFilterMin] = useState(1);
  const [filterMax, setFilterMax] = useState(30);
  const [sortBy, setSortBy] = useState("efficiency"); // efficiency | leave | holiday
  const [showHolidays, setShowHolidays] = useState(false);
  const [computing, setComputing] = useState(false);
  const [results, setResults] = useState(null);

  const toggleHoliday = (i) =>
    setHolidays((h) => h.map((x, j) => (j === i ? { ...x, enabled: !x.enabled } : x)));

  const toggleWorkDay = (d) =>
    setWorkDays((wd) =>
      wd.includes(d) ? wd.filter((x) => x !== d) : [...wd, d]
    );

  const activeHolidays = useMemo(
    () => new Set(holidays.filter((h) => h.enabled).map((h) => h.date)),
    [holidays]
  );

  const workDayNums = useMemo(() => new Set(workDays.map((d) => DAY_MAP[d])), [workDays]);

  function isOff(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return !workDayNums.has(d.getDay()) || activeHolidays.has(dateStr);
  }
  function isLeaveDay(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return workDayNums.has(d.getDay()) && !activeHolidays.has(dateStr);
  }

  function getAllDates(start, end) {
    const dates = [];
    let cur = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");
    while (cur <= last) {
      dates.push(dateStr(cur));
      cur = addDays(cur, 1);
    }
    return dates;
  }

  function computeSuggestions() {
    setComputing(true);
    setTimeout(() => {
      const allDates = getAllDates(startDate, endDate);
      const suggestions = [];

      // For each possible window start, expand to find optimal blocks
      for (let i = 0; i < allDates.length; i++) {
        // Try windows from 2 days to 30 days
        for (let len = 2; len <= 30; len++) {
          if (i + len > allDates.length) break;
          const window = allDates.slice(i, i + len);
          const leaveDays = window.filter(isLeaveDay);
          const offDays = window.filter(isOff);

          if (leaveDays.length === 0) continue;

          // Mode filtering
          if (calcMode === "all" && leaveDays.length > maxLeave) continue;
          if (calcMode === "exact" && leaveDays.length !== maxLeave) continue;
          if (calcMode === "block") {
            // Must be contiguous leave days within a contiguous holiday
            if (leaveDays.length !== maxLeave) continue;
            // Check all leave days are contiguous
            let contiguous = true;
            for (let k = 1; k < leaveDays.length; k++) {
              const prev = new Date(leaveDays[k - 1] + "T00:00:00");
              const cur2 = new Date(leaveDays[k] + "T00:00:00");
              const diff = (cur2 - prev) / 86400000;
              if (diff > 3) { contiguous = false; break; }
            }
            if (!contiguous) continue;
          }

          // Must start or end touching an off day
          const firstOff = isOff(window[0]);
          const lastOff = isOff(window[window.length - 1]);
          if (!firstOff && !lastOff && offDays.length === 0) continue;

          // efficiency = total days / leave days used
          const efficiency = (window.length / leaveDays.length);

          suggestions.push({
            start: window[0],
            end: window[window.length - 1],
            totalDays: window.length,
            leaveDays: leaveDays.length,
            offDays: offDays.length,
            efficiency: parseFloat(efficiency.toFixed(2)),
          });
        }
      }

      // Deduplicate by start+leave combination, keep best
      const seen = new Map();
      for (const s of suggestions) {
        const key = `${s.start}-${s.leaveDays}`;
        if (!seen.has(key) || seen.get(key).totalDays < s.totalDays) {
          seen.set(key, s);
        }
      }

      let final = Array.from(seen.values());

      // Sort
      final.sort((a, b) => {
        if (sortBy === "efficiency") return b.efficiency - a.efficiency || b.totalDays - a.totalDays;
        if (sortBy === "leave") return a.leaveDays - b.leaveDays;
        return b.totalDays - a.totalDays;
      });

      setResults(final);
      setComputing(false);
      setStep(1);
    }, 200);
  }

  const filtered = useMemo(() => {
    if (!results) return [];
    return results
      .filter((r) => r.totalDays >= filterMin && r.totalDays <= filterMax)
      .sort((a, b) => {
        if (sortBy === "efficiency") return b.efficiency - a.efficiency || b.totalDays - a.totalDays;
        if (sortBy === "leave") return a.leaveDays - b.leaveDays;
        return b.totalDays - a.totalDays;
      })
      .slice(0, 60);
  }, [results, filterMin, filterMax, sortBy]);

  // ── Styles ──────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: "100vh",
      background: "#0e0e11",
      color: "#fff",
      fontFamily: "'IBM Plex Mono', 'Fira Mono', monospace",
    },
    wrap: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "4rem 1.5rem 6rem",
    },
    back: {
      fontSize: 13,
      color: "rgba(255,255,255,0.35)",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 40,
      letterSpacing: "0.05em",
      transition: "color 0.2s",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    },
    meta: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 12,
      color: "rgba(255,255,255,0.35)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 20,
    },
    h1: {
      fontSize: "clamp(2rem, 5vw, 3.2rem)",
      fontWeight: 600,
      letterSpacing: "-0.03em",
      lineHeight: 1.1,
      marginBottom: 12,
      fontFamily: "'IBM Plex Serif', Georgia, serif",
    },
    subtitle: {
      fontSize: 15,
      color: "rgba(255,255,255,0.4)",
      lineHeight: 1.6,
      marginBottom: 48,
      maxWidth: 520,
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
    },
    section: {
      marginBottom: 36,
    },
    label: {
      fontSize: 11,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.3)",
      marginBottom: 10,
      display: "block",
    },
    input: {
      background: "rgba(255,255,255,0.04)",
      border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 6,
      color: "#fff",
      padding: "10px 14px",
      fontSize: 13,
      fontFamily: "'IBM Plex Mono', monospace",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      colorScheme: "dark",
    },
    select: {
      background: "rgba(255,255,255,0.04)",
      border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 6,
      color: "#fff",
      padding: "10px 14px",
      fontSize: 13,
      fontFamily: "'IBM Plex Mono', monospace",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      colorScheme: "dark",
      appearance: "none",
    },
    dayBtn: (active) => ({
      padding: "8px 14px",
      fontSize: 12,
      letterSpacing: "0.06em",
      fontFamily: "'IBM Plex Mono', monospace",
      border: active ? "0.5px solid rgba(255,255,255,0.4)" : "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 4,
      background: active ? "rgba(255,255,255,0.07)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.3)",
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    divider: {
      borderTop: "0.5px solid rgba(255,255,255,0.07)",
      margin: "32px 0",
    },
    btn: {
      padding: "13px 28px",
      fontSize: 12,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: "'IBM Plex Mono', monospace",
      border: "0.5px solid rgba(255,255,255,0.25)",
      borderRadius: 6,
      background: "transparent",
      color: "#fff",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    btnPrimary: {
      padding: "13px 28px",
      fontSize: 12,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily: "'IBM Plex Mono', monospace",
      border: "none",
      borderRadius: 6,
      background: "#fff",
      color: "#0e0e11",
      cursor: "pointer",
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition: "opacity 0.2s",
    },
    card: {
      background: "rgba(255,255,255,0.03)",
      border: "0.5px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "18px 20px",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      fontFamily: "'IBM Plex Mono', monospace",
    },
    cardTop: {
      background: "rgba(255,255,255,0.06)",
      border: "0.5px solid rgba(255,255,255,0.14)",
    },
    pill: (color) => ({
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      letterSpacing: "0.06em",
      fontFamily: "'IBM Plex Mono', monospace",
      background: color === "green" ? "rgba(50,200,100,0.1)" : "rgba(255,255,255,0.06)",
      color: color === "green" ? "rgba(80,220,130,0.9)" : "rgba(255,255,255,0.4)",
      border: color === "green" ? "0.5px solid rgba(80,220,130,0.2)" : "0.5px solid rgba(255,255,255,0.1)",
    }),
    stat: {
      textAlign: "center",
    },
    statNum: {
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: "-0.03em",
      display: "block",
    },
    statLabel: {
      fontSize: 10,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.3)",
      marginTop: 2,
    },
    holidayRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 0",
      borderBottom: "0.5px solid rgba(255,255,255,0.05)",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 12,
    },
    toggle: (on) => ({
      width: 32,
      height: 18,
      borderRadius: 9,
      background: on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.1)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      flexShrink: 0,
      transition: "background 0.2s",
    }),
    toggleKnob: (on) => ({
      position: "absolute",
      top: 3,
      left: on ? 17 : 3,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: on ? "#0e0e11" : "rgba(255,255,255,0.4)",
      transition: "left 0.2s",
    }),
  };

  const modeLabels = {
    all: "Calculate all possible leave days",
    exact: "Calculate the full number of leave days",
    block: "Calculate leave days as a block",
  };

  return (
    <main style={s.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Serif:wght@600&family=IBM+Plex+Sans&display=swap"
        rel="stylesheet"
      />

      <div style={s.wrap}>
        {/* Back */}
        <a href="/" style={s.back}>↩︎ BACK</a>

        {/* Meta row */}
        <div style={s.meta}>
          <span>Leave Optimizer</span>
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>Tool</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>v1.0</span>
          </span>
        </div>

        {/* Title */}
        <h1 style={s.h1}>
          {step === 0 ? "Plan smarter.\nLeave less." : "Your leave plan."}
        </h1>
        <p style={s.subtitle}>
          {step === 0
            ? "Optimize your paid leave days around weekends and public holidays. Get the longest breaks for the fewest days off."
            : `We found ${results?.length ?? 0} combinations. Here are the best ones.`}
        </p>

        {/* ── INPUT STEP ── */}
        {step === 0 && (
          <>
            {/* Date range */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              <div>
                <label style={s.label}>From</label>
                <input
                  type="date"
                  style={s.input}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label style={s.label}>To</label>
                <input
                  type="date"
                  style={s.input}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Work days */}
            <div style={s.section}>
              <label style={s.label}>Which days do you work?</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {WORK_DAYS_OPTIONS.map((d) => (
                  <button
                    key={d}
                    style={s.dayBtn(workDays.includes(d))}
                    onClick={() => toggleWorkDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Max leave */}
            <div style={s.section}>
              <label style={s.label}>
                Max leave days at once —{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{maxLeave} days</span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={maxLeave}
                onChange={(e) => setMaxLeave(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#fff", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>
                <span>1</span><span>20</span>
              </div>
            </div>

            {/* Calculation mode */}
            <div style={s.section}>
              <label style={s.label}>Calculation mode</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(modeLabels).map(([val, label]) => (
                  <button
                    key={val}
                    style={{
                      ...s.dayBtn(calcMode === val),
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: 12,
                      lineHeight: 1.4,
                      borderRadius: 6,
                    }}
                    onClick={() => setCalcMode(val)}
                  >
                    <span style={{ marginRight: 10, opacity: calcMode === val ? 1 : 0.3 }}>
                      {calcMode === val ? "●" : "○"}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={s.divider} />

            {/* Holidays toggle */}
            <div style={s.section}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <label style={{ ...s.label, margin: 0 }}>
                  Public holidays —{" "}
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>
                    {holidays.filter((h) => h.enabled).length} active
                  </span>
                </label>
                <button
                  style={{ ...s.back, margin: 0, fontSize: 11 }}
                  onClick={() => setShowHolidays(!showHolidays)}
                >
                  {showHolidays ? "Collapse ↑" : "Customize →"}
                </button>
              </div>

              {showHolidays && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    maxHeight: 320,
                    overflowY: "auto",
                  }}
                >
                  {holidays.map((h, i) => (
                    <div key={h.date} style={s.holidayRow}>
                      <button
                        style={s.toggle(h.enabled)}
                        onClick={() => toggleHoliday(i)}
                        aria-label={`Toggle ${h.name}`}
                      >
                        <span style={s.toggleKnob(h.enabled)} />
                      </button>
                      <span style={{ color: "rgba(255,255,255,0.3)", minWidth: 80 }}>
                        {fmt(h.date)}
                      </span>
                      <span style={{ color: h.enabled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>
                        {h.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 40 }}>
              <button
                style={s.btnPrimary}
                onClick={computeSuggestions}
                disabled={computing}
              >
                {computing ? "Computing..." : "Get suggestions →"}
              </button>
            </div>
          </>
        )}

        {/* ── RESULTS STEP ── */}
        {step === 1 && results && (
          <>
            {/* Summary stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 40,
              }}
            >
              {[
                { num: results.length, label: "combinations" },
                { num: maxLeave, label: "max leave days" },
                { num: holidays.filter((h) => h.enabled).length, label: "holidays" },
              ].map((x) => (
                <div
                  key={x.label}
                  style={{
                    ...s.stat,
                    background: "#0e0e11",
                    padding: "20px 12px",
                  }}
                >
                  <span style={s.statNum}>{x.num}</span>
                  <span style={s.statLabel}>{x.label}</span>
                </div>
              ))}
            </div>

            {/* Query details */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                padding: "16px 20px",
                marginBottom: 36,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 8, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Query details
              </div>
              {[
                ["Date range", `${fmtFull(startDate)} → ${fmtFull(endDate)}`],
                ["Working days", workDays.join(", ")],
                ["Calculation mode", modeLabels[calcMode]],
                ["Max leave", `${maxLeave} days`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{k}</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", textAlign: "right", maxWidth: 340 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 12,
                alignItems: "end",
                marginBottom: 24,
              }}
            >
              <div>
                <label style={s.label}>Min total days</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={filterMin}
                  onChange={(e) => setFilterMin(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#fff" }}
                />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{filterMin}</div>
              </div>
              <div>
                <label style={s.label}>Max total days</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={filterMax}
                  onChange={(e) => setFilterMax(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#fff" }}
                />
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{filterMax}</div>
              </div>
              <div>
                <label style={s.label}>Sort</label>
                <div style={{ position: "relative" }}>
                  <select
                    style={s.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="efficiency">Best ratio</option>
                    <option value="leave">Fewest leave</option>
                    <option value="holiday">Most days off</option>
                  </select>
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none", fontSize: 10 }}>▼</span>
                </div>
              </div>
            </div>

            <div style={s.divider} />

            {/* Result count */}
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
              Showing {filtered.length} suggestions
            </div>

            {/* Cards */}
            {filtered.length === 0 && (
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, padding: "32px 0" }}>
                No suggestions match these filters. Try adjusting the range or mode.
              </div>
            )}

            {filtered.map((r, i) => (
              <div
                key={`${r.start}-${r.end}-${i}`}
                style={{
                  ...s.card,
                  ...(i < 3 ? s.cardTop : {}),
                }}
              >
                {/* Left: dates */}
                <div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                    {fmtFull(r.start)}
                    <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 8px" }}>→</span>
                    {fmtFull(r.end)}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    <span style={s.pill("green")}>{r.leaveDays} leave</span>
                    <span style={s.pill("gray")}>{r.totalDays} total days</span>
                    <span style={s.pill("gray")}>{r.offDays} off days</span>
                  </div>
                </div>

                {/* Right: ratio */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.04em", color: i < 3 ? "#fff" : "rgba(255,255,255,0.6)" }}>
                    {r.efficiency.toFixed(1)}×
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                    ratio
                  </div>
                </div>
              </div>
            ))}

            <div style={s.divider} />

            {/* Back to input */}
            <button
              style={s.btn}
              onClick={() => { setStep(0); setResults(null); }}
            >
              ↩ Recalculate
            </button>
          </>
        )}
      </div>
    </main>
  );
}