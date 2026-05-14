import { useState, useRef, useEffect } from "react";

const BARS_COUNT = 28;

const SpotifyBars = ({ active }: { active: boolean }) => (
  <div className="bars-container">
    {Array.from({ length: BARS_COUNT }).map((_, i) => (
      <div
        key={i}
        className="bar"
        style={{
          animationDelay: `${(i * 0.07).toFixed(2)}s`,
          animationPlayState: active ? "running" : "paused",
          height: `${20 + Math.random() * 60}%`,
        }}
      />
    ))}
  </div>
);

type Page = "welcome" | "invite";

const Index = () => {
  const [page, setPage] = useState<Page>("welcome");
  const [musicStarted, setMusicStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicStarted) {
      audio.play().catch(() => {});
    }
  }, [musicStarted]);

  const handleStart = () => {
    setMusicStarted(true);
  };

  const goToInvite = () => {
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setPage("invite");
      setVisible(true);
      setTransitioning(false);
    }, 600);
  };

  return (
    <div className="spira-root">
      <audio ref={audioRef} src="https://files.catbox.moe/g60wh0.mp3" loop />

      {/* Animated bars background */}
      <div className="bg-bars">
        {Array.from({ length: BARS_COUNT }).map((_, i) => (
          <div
            key={i}
            className="bg-bar"
            style={{
              left: `${(i / BARS_COUNT) * 100}%`,
              animationDelay: `${(i * 0.13).toFixed(2)}s`,
              animationPlayState: musicStarted ? "running" : "paused",
              opacity: musicStarted ? 1 : 0.18,
            }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Logo */}
      <div className="spira-logo">
        <span className="logo-spot">spot</span>
        <span className="logo-ira">IRA</span>
      </div>

      {/* Main content */}
      <div
        className="spira-content"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {page === "welcome" && (
          <div className="page-welcome">
            <p className="year-label">2 0 2 4</p>
            <h1 className="main-title">
              не просто<br />
              <span className="green">музыкальные</span><br />
              итоги
            </h1>
            <p className="sub-title">а приглашение отметить мои 30</p>

            <div className="divider" />

            <p className="for-vlad">
              привет, <span className="green bold">Влад</span> — это для тебя
            </p>

            {!musicStarted ? (
              <button className="btn-main" onClick={handleStart}>
                <span className="btn-icon">▶</span>
                нажми сюда
              </button>
            ) : (
              <button className="btn-main btn-pulse" onClick={goToInvite} disabled={transitioning}>
                <span className="btn-icon">🎉</span>
                смотреть итоги
              </button>
            )}

            {musicStarted && (
              <div className="now-playing">
                <div className="np-bars">
                  <span /><span /><span /><span />
                </div>
                <span>сейчас играет</span>
              </div>
            )}
          </div>
        )}

        {page === "invite" && (
          <div className="page-invite">
            <p className="year-label">2 0 2 4  •  wrapped</p>
            <div className="stat-card">
              <span className="stat-num green">30</span>
              <span className="stat-label">лет впереди</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">∞</span>
              <span className="stat-label">причин отметить</span>
            </div>
            <div className="stat-card">
              <span className="stat-num green">1</span>
              <span className="stat-label">незабываемый вечер</span>
            </div>
            <div className="invite-box">
              <p className="invite-text">
                Ты в топе моего плейлиста.<br />
                Приходи праздновать 🎂
              </p>
            </div>
            <button className="btn-main btn-pulse" onClick={() => { setVisible(false); setTimeout(() => { setPage("welcome"); setVisible(true); }, 600); }}>
              ← вернуться
            </button>
          </div>
        )}
      </div>

      <style>{`
        :root {
          --green: #1DB954;
          --green-dark: #158a3e;
          --black: #0a0a0a;
          --dark: #111111;
          --card: #181818;
          --text: #ffffff;
          --muted: #b3b3b3;
        }

        .spira-root {
          min-height: 100vh;
          background: var(--black);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Background bars */
        .bg-bars {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: flex-end;
          pointer-events: none;
          z-index: 0;
        }
        .bg-bar {
          position: absolute;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to top, var(--green) 0%, transparent 100%);
          border-radius: 2px 2px 0 0;
          animation: bgBarPulse 1.4s ease-in-out infinite alternate;
          transition: opacity 1s;
        }
        @keyframes bgBarPulse {
          0%   { height: 8vh; }
          50%  { height: 40vh; }
          100% { height: 15vh; }
        }

        /* Blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.18;
        }
        .blob-1 {
          width: 420px; height: 420px;
          background: var(--green);
          top: -120px; left: -100px;
          animation: blobMove1 8s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 300px; height: 300px;
          background: #4B0082;
          bottom: -80px; right: -60px;
          animation: blobMove2 10s ease-in-out infinite alternate;
        }
        @keyframes blobMove1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.1); }
        }
        @keyframes blobMove2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px,-20px) scale(1.15); }
        }

        /* Logo */
        .spira-logo {
          position: fixed;
          top: 28px; left: 36px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 1.4rem;
          letter-spacing: -0.03em;
          z-index: 10;
          user-select: none;
        }
        .logo-spot { color: #fff; }
        .logo-ira  { color: var(--green); }

        /* Content */
        .spira-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          max-width: 480px;
          width: 100%;
        }

        /* Welcome page */
        .page-welcome, .page-invite {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        .year-label {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          margin-bottom: 1.2rem;
          font-weight: 600;
        }

        .main-title {
          font-size: clamp(2.4rem, 8vw, 3.8rem);
          font-weight: 900;
          line-height: 1.05;
          color: #fff;
          margin: 0 0 1rem 0;
          letter-spacing: -0.03em;
          text-transform: lowercase;
        }

        .sub-title {
          font-family: 'Rubik', sans-serif;
          font-size: 1rem;
          color: var(--muted);
          font-weight: 300;
          margin: 0 0 2rem 0;
          letter-spacing: 0.01em;
        }

        .divider {
          width: 40px;
          height: 2px;
          background: var(--green);
          border-radius: 2px;
          margin: 0 auto 1.8rem auto;
        }

        .for-vlad {
          font-size: 1.05rem;
          color: var(--muted);
          font-family: 'Rubik', sans-serif;
          font-weight: 400;
          margin-bottom: 2rem;
        }

        .green { color: var(--green); }
        .bold  { font-weight: 700; }

        /* Button */
        .btn-main {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--green);
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 1rem 2.2rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: transform 0.18s, background 0.18s, box-shadow 0.18s;
          box-shadow: 0 0 0 0 rgba(29,185,84,0.4);
          margin-bottom: 1.5rem;
        }
        .btn-main:hover {
          background: #1ed760;
          transform: scale(1.04);
          box-shadow: 0 0 24px 4px rgba(29,185,84,0.35);
        }
        .btn-main:active { transform: scale(0.97); }
        .btn-icon { font-size: 1.1rem; }

        .btn-pulse {
          animation: btnPulse 2s ease-in-out infinite;
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29,185,84,0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(29,185,84,0); }
        }

        /* Now playing */
        .now-playing {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--muted);
          font-size: 0.8rem;
          font-family: 'Rubik', sans-serif;
          letter-spacing: 0.05em;
        }
        .np-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }
        .np-bars span {
          display: block;
          width: 3px;
          background: var(--green);
          border-radius: 2px;
          animation: npBar 0.7s ease-in-out infinite alternate;
        }
        .np-bars span:nth-child(1) { height: 6px;  animation-delay: 0s; }
        .np-bars span:nth-child(2) { height: 14px; animation-delay: 0.15s; }
        .np-bars span:nth-child(3) { height: 10px; animation-delay: 0.3s; }
        .np-bars span:nth-child(4) { height: 4px;  animation-delay: 0.45s; }
        @keyframes npBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }

        /* Invite page */
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--card);
          border-radius: 16px;
          padding: 1.4rem 2.5rem;
          margin-bottom: 0.8rem;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-num {
          font-size: 3.5rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }
        .stat-num.green { color: var(--green); }
        .stat-label {
          font-size: 0.85rem;
          color: var(--muted);
          font-family: 'Rubik', sans-serif;
          margin-top: 0.3rem;
          letter-spacing: 0.05em;
        }

        .invite-box {
          background: linear-gradient(135deg, var(--green-dark), #0a3d1f);
          border-radius: 16px;
          padding: 1.8rem 2rem;
          margin: 1rem 0 1.5rem;
          width: 100%;
        }
        .invite-text {
          color: #fff;
          font-size: 1.1rem;
          font-family: 'Rubik', sans-serif;
          font-weight: 400;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Index;
