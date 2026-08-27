import "./Badges.css";

// No badges earned yet — will populate as user completes quests
const earnedBadges = [];

const lockedPreview = [
  { id: "l1", name: "Explorer" },
  { id: "l2", name: "Historian" },
  { id: "l3", name: "Quiz Master" },
  { id: "l4", name: "Fort Champion" },
];

export default function Badges({ onBack }) {
  return (
    <div className="badges-app">
      <div className="badges-shell">
        <header className="badges-top">
          <button className="badges-back" onClick={onBack} aria-label="Back to map">
            ←
          </button>
          <h1 className="badges-title">🏅 Reward Case</h1>
          <span className="badges-count">{earnedBadges.length} Earned</span>
        </header>

        <div className="badges-board">
          <div className="badges-podium">
            <div className="podium-glow" aria-hidden="true" />
            {earnedBadges.length === 0 ? (
              <div className="badges-empty">
                <div className="empty-trophy">🏆</div>
                <h2>No Badges Yet!</h2>
                <p>
                  Complete quests around Amer Fort and ace the knowledge quiz
                  to unlock shiny badges here.
                </p>
                <button className="badges-cta" onClick={onBack}>
                  Start Exploring →
                </button>
              </div>
            ) : (
              <div className="badges-grid">
                {earnedBadges.map((b) => (
                  <div className="badge-slot earned" key={b.id}>
                    <div className="badge-medal">{b.icon}</div>
                    <b>{b.name}</b>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="locked-label">Badges to Unlock</p>
          <div className="badges-grid locked-grid">
            {lockedPreview.map((b) => (
              <div className="badge-slot locked" key={b.id}>
                <div className="badge-medal">🔒</div>
                <b>{b.name}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}