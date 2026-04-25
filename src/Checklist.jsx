import { useState } from "react";

const sections = [
  {
    id: "urgent",
    emoji: "🔴",
    label: "DO TODAY",
    color: "#ff4444",
    bg: "#fff0f0",
    items: [
      { id: "photos", text: "Passport photos ✅ Already done!", locked: true },
      { id: "apply", text: "Submit passport application at gov.uk/get-a-passport-urgently" },
      { id: "appt", text: "Book 1-Day Premium passport appointment (£239.50 each)" },
      { id: "eurostar", text: "Book Eurostar return — London St Pancras → Marne-la-Vallée Chessy via Lille" },
    ],
  },
  {
    id: "points",
    emoji: "✨",
    label: "UNLOCK YOUR SAVINGS",
    color: "#f59e0b",
    bg: "#fffbeb",
    items: [
      { id: "link", text: "Link BA Executive Club account to Nectar at ba.com" },
      { id: "convert", text: "Convert 14,800 Avios → ~23,680 Nectar points (250 Avios = 400 Nectar)" },
      { id: "redeem", text: "Redeem ~25,000 Nectar points on Eurostar booking (~£120 off)" },
    ],
  },
  {
    id: "hotel",
    emoji: "🏨",
    label: "SORT THE BED",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    items: [
      { id: "hotel-search", text: "Search Campanile Chessy or B&B Hotel Marne-la-Vallée for May 13–15" },
      { id: "hotel-book", text: "Book hotel (target: £70–90/night, ~£140–180 for 2 nights)" },
    ],
  },
  {
    id: "park",
    emoji: "🎡",
    label: "THE MAGIC ITSELF",
    color: "#10b981",
    bg: "#f0fdf4",
    items: [
      { id: "tickets", text: "Buy 2-day 2-park tickets on disneylandparis.com (register your dates!)" },
      { id: "app", text: "Download the Disneyland Paris app" },
      { id: "dinner", text: "Consider booking a character dining reservation for an evening with the friends & little one" },
    ],
  },
  {
    id: "ready",
    emoji: "🧳",
    label: "NEARLY THERE",
    color: "#3b82f6",
    bg: "#eff6ff",
    items: [
      { id: "passport-check", text: "New passports arrived — check names and details are correct" },
      { id: "api", text: "Complete Advance Passenger Information (API) on Eurostar account" },
      { id: "euros", text: "Get some euros (park accepts cards but good to have cash)" },
      { id: "train-time", text: "Aim for the earliest viable Eurostar on May 13 — arrive by midday to maximise the day" },
    ],
  },
];

const totalItems = sections.flatMap(s => s.items).length;

export default function Checklist() {
  const [checked, setChecked] = useState(() => {
    const init = {};
    sections.forEach(s => s.items.forEach(i => { if (i.locked) init[i.id] = true; }));
    return init;
  });

  const toggle = (id, locked) => {
    if (locked) return;
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / totalItems) * 100);

  const getMessage = () => {
    if (pct === 0) return "Let's make this happen 🚀";
    if (pct < 25) return "Good start — keep the momentum going!";
    if (pct < 50) return "You're on your way to Disneyland Paris 🎢";
    if (pct < 75) return "More than halfway there — nearly time to pack!";
    if (pct < 100) return "Almost ready — the magic is waiting ✨";
    return "You're going to Disneyland Paris! 🎉🏰";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      fontFamily: "'Georgia', serif",
      padding: "2rem 1rem",
      color: "#fff",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.25rem" }}>🏰</div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
          fontWeight: "bold",
          letterSpacing: "-0.02em",
          margin: "0 0 0.25rem",
          background: "linear-gradient(90deg, #ffd700, #ffb347, #ffd700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Disneyland Paris
        </h1>
        <p style={{ color: "#a8b4d0", margin: "0 0 1.5rem", fontSize: "0.95rem", letterSpacing: "0.1em" }}>
          MAY 13–15 · LONDON → MARNE-LA-VALLÉE
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.8rem", color: "#a8b4d0", marginBottom: "0.4rem",
          }}>
            <span>{getMessage()}</span>
            <span style={{ color: "#ffd700", fontWeight: "bold" }}>{doneCount}/{totalItems}</span>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 999,
            height: 10,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #ffd700, #ff9500)",
              borderRadius: 999,
              transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: pct > 0 ? "0 0 12px rgba(255,215,0,0.6)" : "none",
            }} />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {sections.map(section => {
          const sectionDone = section.items.filter(i => checked[i.id]).length;
          const allDone = sectionDone === section.items.length;
          return (
            <div key={section.id} style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: 16,
              border: `1px solid ${allDone ? section.color + "66" : "rgba(255,255,255,0.08)"}`,
              overflow: "hidden",
              transition: "border-color 0.3s",
            }}>
              {/* Section header */}
              <div style={{
                padding: "0.75rem 1rem",
                background: allDone ? `${section.color}22` : "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background 0.3s",
              }}>
                <span style={{ fontSize: "1.1rem" }}>{section.emoji}</span>
                <span style={{
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.15em",
                  color: allDone ? section.color : "#a8b4d0",
                  fontWeight: "bold",
                  transition: "color 0.3s",
                }}>
                  {section.label}
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontSize: "0.75rem",
                  color: allDone ? section.color : "#a8b4d0",
                }}>
                  {sectionDone}/{section.items.length}
                  {allDone && " ✓"}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: "0.5rem 0" }}>
                {section.items.map(item => {
                  const done = !!checked[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggle(item.id, item.locked)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        padding: "0.6rem 1rem",
                        cursor: item.locked ? "default" : "pointer",
                        transition: "background 0.15s",
                        borderRadius: 8,
                        margin: "0 0.25rem",
                      }}
                      onMouseEnter={e => { if (!item.locked) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: done ? "none" : `2px solid ${section.color}88`,
                        background: done ? section.color : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                        transition: "all 0.2s",
                        boxShadow: done ? `0 0 8px ${section.color}66` : "none",
                      }}>
                        {done && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>

                      {/* Text */}
                      <span style={{
                        fontSize: "0.9rem",
                        color: done ? "#a8b4d0" : "#e8eaf0",
                        textDecoration: done && !item.locked ? "line-through" : "none",
                        lineHeight: 1.4,
                        transition: "all 0.2s",
                      }}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <p style={{
          textAlign: "center",
          color: "#5a6480",
          fontSize: "0.75rem",
          marginTop: "0.5rem",
          letterSpacing: "0.05em",
        }}>
          18 days to go · Passports first, everything else follows
        </p>
      </div>
    </div>
  );
}
