import "./Quest.css";

const quests = [
  {
    id: "amer-fort",
    name: "Amer Fort, Jaipur",
    icon: "🏰",
    description:
      "Explore every corner of the majestic Amer Fort and uncover its royal secrets, one palace at a time.",
    reward: "500 XP • Explorer Badge",
  },
];

export default function Quest({ onBack }) {
  return (
    <div className="quest-app">
      <div className="quest-shell">
        <header className="quest-top">
          <button className="quest-back" onClick={onBack} aria-label="Back to map">
            ← Back to Map
          </button>
          <h1 className="quest-title">📜 Your Quests</h1>
          <span className="quest-count">{quests.length} Active</span>
        </header>

        <div className="quest-list">
          {quests.map((q) => (
            <div className="quest-card" key={q.id}>
              <div className="quest-icon">{q.icon}</div>

              <div className="quest-info">
                <div className="quest-name-row">
                  <h2>{q.name}</h2>
                  <button className="quest-goto-btn" onClick={onBack}>
                    Go to Fort →
                  </button>
                </div>

                <p className="quest-desc">{q.description}</p>

                <div className="quest-meta">
                  <span className="quest-status">🔥 In Progress</span>
                  <span className="quest-reward">🎁 {q.reward}</span>
                </div>

                <div className="quest-progress">
                  <i>
                    <em style={{ width: "35%" }} />
                  </i>
                  <small>3 / 8 places discovered</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}