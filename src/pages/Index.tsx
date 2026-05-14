import { useState, useRef, useEffect } from "react";

const BARS_COUNT = 36;

type Page = "welcome" | "track" | "invite";

const BAR_HEIGHTS = Array.from({ length: BARS_COUNT }, () =>
  Math.floor(10 + Math.random() * 75)
);

const Index = () => {
  const [page, setPage] = useState<Page>("welcome");
  const [musicStarted, setMusicStarted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  const audio1Ref = useRef<HTMLAudioElement>(null); // первый трек
  const audio2Ref = useRef<HTMLAudioElement>(null); // трек на второй странице

  useEffect(() => {
    const a = audio1Ref.current;
    if (!a) return;
    if (musicStarted && page === "welcome") {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [musicStarted, page]);

  useEffect(() => {
    const a = audio2Ref.current;
    if (!a) return;
    if (page === "track") {
      a.currentTime = 0;
      a.play().catch(() => {});
    } else {
      a.pause();
      a.currentTime = 0;
    }
  }, [page]);

  const handleStart = () => {
    setMusicStarted(true);
  };

  const goTo = (next: Page) => {
    if (transitioning) return;
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setPage(next);
      setVisible(true);
      setTransitioning(false);
    }, 550);
  };

  return (
    <div className="spira-root">
      <audio ref={audio1Ref} src="https://files.catbox.moe/g60wh0.mp3" loop />
      <audio ref={audio2Ref} src="https://files.catbox.moe/bivm2f.mp3" loop />

      {/* Background bars — всегда видны, оживают с музыкой */}
      <div className="bg-bars">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="bg-bar"
            style={{
              left: `${(i / BARS_COUNT) * 100}%`,
              animationDelay: `${(i * 0.11).toFixed(2)}s`,
              animationDuration: `${(1.1 + (i % 5) * 0.18).toFixed(2)}s`,
              animationPlayState: (musicStarted || page === "track") ? "running" : "paused",
              "--bar-max": `${h}vh`,
              opacity: (musicStarted || page === "track") ? 0.55 : 0.12,
            } as React.CSSProperties}
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
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* ——— СТРАНИЦА 1: приветствие ——— */}
        {page === "welcome" && (
          <div className="page-col">
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
              <button className="btn-main btn-pulse" onClick={() => goTo("track")}>
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

        {/* ——— СТРАНИЦА 2: трек ——— */}
        {page === "track" && (
          <div className="page-col">
            <p className="year-label">т р е к  г о д а</p>

            <div className="track-cover">
              <div className="track-vinyl">
                <div className="vinyl-inner" />
              </div>
            </div>

            <h2 className="track-title">Трек, что связывает нас с тобой</h2>

            <div className="now-playing" style={{ marginBottom: "1.6rem" }}>
              <div className="np-bars">
                <span /><span /><span /><span />
              </div>
              <span>сейчас играет</span>
            </div>

            <div className="track-desc-box">
              <p className="track-desc">
                Мы встретились на одной вечеринке, словили жёсткий метч —
                и я так рада, что мы можем разделить множество моментов вместе
                и быть одержимыми чем-то.
              </p>
            </div>

            <button
              className="btn-main"
              onClick={() => goTo("invite")}
            >
              далее →
            </button>
          </div>
        )}

        {/* ——— СТРАНИЦА 3: итоги/приглашение ——— */}
        {page === "invite" && (
          <div className="page-col">
            <p className="year-label">2 0 2 4  •  wrapped</p>
            <div className="stat-card">
              <span className="stat-num green">30</span>
              <span className="stat-label">лет — и впереди всё самое лучшее</span>
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
            <button className="btn-main" onClick={() => goTo("welcome")}>
              ← сначала
            </button>
          </div>
        )}
      </div>

      <style>{`
        :root {
          --green: #1DB954;
          --green-dark: #158a3e;
          --black: #080808;
          --card: #181818;
          --muted: #b3b3b3;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--black); }

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

        /* ——— BG BARS ——— */
        .bg-bars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .bg-bar {
          position: absolute;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to top, var(--green) 0%, rgba(29,185,84,0.15) 70%, transparent 100%);
          border-radius: 3px 3px 0 0;
          animation: bgBarPulse var(--dur, 1.4s) ease-in-out infinite alternate;
          transition: opacity 1.2s ease;
        }
        @keyframes bgBarPulse {
          0%   { height: 4vh; }
          100% { height: var(--bar-max, 40vh); }
        }

        /* ——— BLOBS ——— */
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          width: 450px; height: 450px;
          background: var(--green);
          top: -140px; left: -120px;
          opacity: 0.13;
          animation: blobMove1 9s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 320px; height: 320px;
          background: #6B21A8;
          bottom: -90px; right: -70px;
          opacity: 0.16;
          animation: blobMove2 11s ease-in-out infinite alternate;
        }
        @keyframes blobMove1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(50px,35px) scale(1.12); }
        }
        @keyframes blobMove2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-35px,-25px) scale(1.18); }
        }

        /* ——— LOGO ——— */
        .spira-logo {
          position: fixed;
          top: 26px; left: 32px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 900;
          font-size: 1.35rem;
          letter-spacing: -0.03em;
          z-index: 10;
          user-select: none;
        }
        .logo-spot { color: #fff; }
        .logo-ira  { color: var(--green); }

        /* ——— CONTENT ——— */
        .spira-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 5rem 1.5rem 2rem;
          max-width: 480px;
          width: 100%;
        }

        .page-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .year-label {
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          color: var(--muted);
          margin-bottom: 1.2rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .main-title {
          font-size: clamp(2.2rem, 8vw, 3.6rem);
          font-weight: 900;
          line-height: 1.06;
          color: #fff;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
          text-transform: lowercase;
        }

        .sub-title {
          font-family: 'Rubik', sans-serif;
          font-size: 1rem;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 2rem;
        }

        .divider {
          width: 40px; height: 2px;
          background: var(--green);
          border-radius: 2px;
          margin: 0 auto 1.8rem;
        }

        .for-vlad {
          font-size: 1.05rem;
          color: var(--muted);
          font-family: 'Rubik', sans-serif;
          margin-bottom: 2rem;
        }

        .green { color: var(--green); }
        .bold  { font-weight: 700; }

        /* ——— BUTTON ——— */
        .btn-main {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--green);
          color: #000;
          border: none;
          border-radius: 50px;
          padding: 0.95rem 2.2rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: transform 0.18s, background 0.18s, box-shadow 0.18s;
          margin-bottom: 1.4rem;
        }
        .btn-main:hover {
          background: #1ed760;
          transform: scale(1.05);
          box-shadow: 0 0 28px 6px rgba(29,185,84,0.35);
        }
        .btn-main:active { transform: scale(0.97); }
        .btn-icon { font-size: 1rem; }

        .btn-pulse {
          animation: btnPulse 2s ease-in-out infinite;
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29,185,84,0.5); }
          50%       { box-shadow: 0 0 0 16px rgba(29,185,84,0); }
        }

        /* ——— NOW PLAYING ——— */
        .now-playing {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: var(--muted);
          font-size: 0.78rem;
          font-family: 'Rubik', sans-serif;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
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
          animation: npBar 0.65s ease-in-out infinite alternate;
        }
        .np-bars span:nth-child(1) { height: 5px;  animation-delay: 0s; }
        .np-bars span:nth-child(2) { height: 14px; animation-delay: 0.14s; }
        .np-bars span:nth-child(3) { height: 9px;  animation-delay: 0.28s; }
        .np-bars span:nth-child(4) { height: 4px;  animation-delay: 0.42s; }
        @keyframes npBar {
          from { transform: scaleY(0.35); }
          to   { transform: scaleY(1); }
        }

        /* ——— TRACK PAGE ——— */
        .track-cover {
          width: 180px; height: 180px;
          margin: 0 auto 1.6rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .track-vinyl {
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle at 60% 40%, #2a2a2a 0%, #0d0d0d 100%);
          border: 3px solid rgba(29,185,84,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: vinylSpin 4s linear infinite;
          box-shadow: 0 0 40px rgba(29,185,84,0.2), inset 0 0 30px rgba(0,0,0,0.5);
        }
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .vinyl-inner {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, #1DB954 0%, #158a3e 60%, #0d0d0d 100%);
          border: 2px solid rgba(255,255,255,0.1);
        }

        .track-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
          line-height: 1.25;
        }

        .track-desc-box {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.3rem 1.5rem;
          margin-bottom: 1.8rem;
          width: 100%;
        }
        .track-desc {
          font-family: 'Rubik', sans-serif;
          font-size: 0.95rem;
          color: var(--muted);
          line-height: 1.65;
          font-weight: 300;
        }

        /* ——— INVITE PAGE ——— */
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--card);
          border-radius: 14px;
          padding: 1.2rem 2rem;
          margin-bottom: 0.7rem;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-num {
          font-size: 3.2rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }
        .stat-num.green { color: var(--green); }
        .stat-label {
          font-size: 0.82rem;
          color: var(--muted);
          font-family: 'Rubik', sans-serif;
          margin-top: 0.3rem;
          letter-spacing: 0.04em;
        }

        .invite-box {
          background: linear-gradient(135deg, var(--green-dark), #0a3d1f);
          border-radius: 14px;
          padding: 1.6rem 1.8rem;
          margin: 1rem 0 1.5rem;
          width: 100%;
        }
        .invite-text {
          color: #fff;
          font-size: 1.05rem;
          font-family: 'Rubik', sans-serif;
          line-height: 1.65;
        }
      `}</style>
    </div>
  );
};

export default Index;
