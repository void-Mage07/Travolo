import { useState , useEffect, useRef } from "react";
import "./Art.css";

const shapes = ["triangle", "diamond", "circle"];
const pieces = Array.from({ length: 12 }, (_, id) => ({ id, shape: shapes[id % 3] }));
const slots = [
  ["triangle", 50, 16], ["diamond", 70, 23], ["circle", 82, 38], ["triangle", 84, 59],
  ["diamond", 70, 76], ["circle", 50, 83], ["triangle", 30, 76], ["diamond", 17, 59],
  ["circle", 18, 38], ["triangle", 30, 23], ["diamond", 50, 29], ["circle", 50, 71],
];

export default function Art({ onBack, onEarnXP }) {
  const [selected, setSelected] = useState(null);
  const [placements, setPlacements] = useState({});
  const [message, setMessage] = useState("Choose a mirror piece and place it on the same shaped outline.");
  const usedPieceIds = Object.values(placements);
  const placedCount = Object.keys(placements).length;
  const pick = (id) => { if (!usedPieceIds.includes(id)) { setSelected(id); setMessage(`Great! Now find the ${pieces[id].shape} outline.`); } };
  const tryPlace = (slotId, droppedId = selected) => {
    if (droppedId === null || droppedId === undefined || Number.isNaN(droppedId)) return setMessage("Pick up a mirror piece first!");
    if (placements[slotId] !== undefined) return;
    if (pieces[droppedId].shape !== slots[slotId][0]) return setMessage("Oops! That is a different shape. Look for its matching outline.");
    setPlacements((old) => ({ ...old, [slotId]: droppedId })); setSelected(null);
    setMessage(placedCount + 1 === 12 ? "You did it! Your Sheesh Mahal mirror art is sparkling!" : "Wonderful match! Keep going.");
  };
  const complete = placedCount === 12;
  const xpAwarded = useRef(false);

useEffect(() => {
  if (complete && !xpAwarded.current) {
    xpAwarded.current = true;
    onEarnXP?.(100);
  }
}, [complete, onEarnXP]);
  return <div className="art-page">
    <header className="art-header"><button onClick={onBack}>← &nbsp;Back to Fort</button><div><small>TRAVOLO • CREATIVE QUEST</small><h1>✦ Make Your Mirror Art</h1></div><b>⭐ &nbsp;+100 XP</b></header>
    <section className="art-intro"><span className="art-kid">👩‍🎨</span><div><h2>Let’s create a Sheesh Mahal masterpiece! 🪞</h2><p>Drag a mirror piece onto the matching shape around the artwork. Complete the circle to finish your art!</p></div></section>
    <main className="art-game">
      <aside className="piece-panel"><h3>🪞 Mirror Pieces</h3><p>Drag a piece to its matching mark</p><div className="pieces">{pieces.map((piece) => <button key={piece.id} className={`piece-button ${usedPieceIds.includes(piece.id) ? "used" : ""} ${selected === piece.id ? "picked" : ""}`} draggable={!usedPieceIds.includes(piece.id)} onClick={() => pick(piece.id)} onDragStart={(event) => { event.dataTransfer.setData("text/plain", String(piece.id)); pick(piece.id); }} aria-label={`${piece.shape} mirror piece`}><i className={`mirror-shape ${piece.shape}`} /></button>)}</div></aside>
      <section className="board-panel">
        <div className={`mirror-board ${complete ? "complete" : ""}`}>
          {slots.map(([shape, x, y], index) => {
            const pieceId = placements[index];
            return <button key={index} className={`mirror-slot ${shape} ${pieceId !== undefined ? "filled" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => tryPlace(index)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); tryPlace(index, Number(event.dataTransfer.getData("text/plain"))); }} aria-label={`${shape} target`}>
              {pieceId !== undefined ? <i className={`mirror-shape ${shape}`} /> : <span>?</span>}
            </button>;
          })}
          <div className="mandala"><i>✦</i></div>
        </div>
        <div className="art-message">💬 <span>{message}</span></div>
        <div className="progress"><b>Mirror Pieces</b><strong>{placedCount} / 12</strong><i><em style={{ width: `${placedCount / 12 * 100}%` }} /></i></div>
        {complete && <button className="finish" onClick={onBack}>🏆 &nbsp;Finish Artwork & Return to Fort</button>}
      </section>
      <aside className="quest"><h3>🎨 Sheesh Mahal Quest</h3><p>Create your own miniature mirror-inspired artwork.</p><div className="reward">🏆 <span>REWARD<br/><b>+100 XP</b></span></div><p className="tip">💡 <span>Tip: Look at the shapes around the circle carefully!</span></p></aside>
    </main>
  </div>;
}
