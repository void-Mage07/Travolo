import "./Badges.css";

const badgeDefinitions = [
  {
    id: "explorer",
    name: "Explorer",
    icon: "🧭",
    requirement: "Verify all locations",
  },
  {
    id: "musician",
    name: "Music Master",
    icon: "🥁",
    requirement: "Complete the musical instrument",
  },
  {
    id: "artist",
    name: "Heritage Artist",
    icon: "🎨",
    requirement: "Complete the art game",
  },
  {
    id: "quiz",
    name: "Quiz Master",
    icon: "🧠",
    requirement: "Complete the knowledge quiz",
  },
];

export default function Badges({
  onBack,
  completedLocations = false,
  completedInstrument = false,
  completedArt = false,
  completedQuiz = false,
}) {
  const completed = {
    explorer: completedLocations,
    musician: completedInstrument,
    artist: completedArt,
    quiz: completedQuiz,
  };

  const earnedBadges = badgeDefinitions.filter(
    (badge) => completed[badge.id]
  );

  const lockedBadges = badgeDefinitions.filter(
    (badge) => !completed[badge.id]
  );

  return (
    <div className="badges-app">
      <div className="badges-shell">

        {/* HEADER */}
        <header className="badges-top">
          <button
            className="badges-back"
            onClick={onBack}
            aria-label="Back to map"
          >
            ←
          </button>

          <h1 className="badges-title">🏅 Reward Case</h1>

          <span className="badges-count">
            {earnedBadges.length} / {badgeDefinitions.length} Earned
          </span>
        </header>

        <div className="badges-board">

          {/* EARNED BADGES */}
          <div className="badges-podium">
            <div className="podium-glow" aria-hidden="true" />

            {earnedBadges.length === 0 ? (
              <div className="badges-empty">
                <div className="empty-trophy">🏆</div>

                <h2>No Badges Yet!</h2>

                <p>
                  Complete quests around Amer Fort to unlock
                  shiny badges here.
                </p>

                <button className="badges-cta" onClick={onBack}>
                  Start Exploring →
                </button>
              </div>
            ) : (
              <div className="badges-grid">

                {earnedBadges.map((badge) => (
                  <div
                    className="badge-slot earned"
                    key={badge.id}
                  >
                    <div className="badge-medal">
                      {badge.icon}
                    </div>

                    <b>{badge.name}</b>

                    <span className="badge-status">
                      ✓ Unlocked
                    </span>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* LOCKED BADGES */}
          {lockedBadges.length > 0 && (
            <>
              <p className="locked-label">
                Badges to Unlock
              </p>

              <div className="badges-grid locked-grid">

                {lockedBadges.map((badge) => (
                  <div
                    className="badge-slot locked"
                    key={badge.id}
                  >
                    <div className="badge-medal">
                      🔒
                    </div>

                    <b>{badge.name}</b>

                    <span className="badge-requirement">
                      {badge.requirement}
                    </span>
                  </div>
                ))}

              </div>
            </>
          )}

          {/* ALL COMPLETE */}
          {earnedBadges.length === badgeDefinitions.length && (
            <div className="all-badges-complete">
              🎉 Congratulations! You unlocked every badge!
            </div>
          )}

        </div>
      </div>
    </div>
  );
}