import { useState } from 'react'
import AboutModal from './components/About'
import AICoach from './components/AICoach'
import Camera from './components/Camera'
import FeedbackPanel from './components/FeedbackPanel'
import Header from './components/Header'
import PoseSidebar from './components/PoseSideBar'
import { POSES, type PoseDefinition } from './poses'
import type { PoseFeedback } from './poses/warrior2'
import { theme } from './theme'
import Logo from './components/Logo'

function App() {
  const [feedback, setFeedback] = useState<PoseFeedback | null>(null)
  const [selectedPose, setSelectedPose] = useState<PoseDefinition>(POSES[0])
  const [showAbout, setShowAbout] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)  // ← new

  return (
    <div style={{ minHeight: '100vh', background: 'theme.pageBg' }}>
      <Header onAboutClick={() => setShowAbout(true)} />

      {/* ── Start screen ── */}
      {!cameraActive && (
        <div style={styles.startScreen}>
          <div style={styles.startCard}>
            <span style={{ fontSize: '56px' }}><Logo size={40} /></span>
            <h1 style={styles.startTitle}>PoseIQ</h1>
            <p style={styles.startSubtitle}>
              Real-time AI yoga pose analysis.<br />
              Position yourself in front of your camera, then press start.
            </p>
            <div style={styles.startFeatures}>
              {[
                'Camera stays on your device — never uploaded',
                'AI detects 33 body points at 30fps',
                'Live coaching from Claude AI',
              ].map((f, i) => (
                <div key={i} style={styles.featureRow}>
                  <span style={{ color: theme.lavenderAccent, fontWeight: 600, marginRight: '8px' }}>→</span>
                  {f}
                </div>
              ))}

            </div>
            <button
              onClick={() => setCameraActive(true)}
              style={styles.startBtn}
            >
              Start Analysis →
            </button>
            <p style={styles.poseHint}>
              Try: Warrior II · Tree Pose · Mountain Pose
            </p>
          </div>
        </div>
      )}

      {/* ── Main analyzer ── */}
      {cameraActive && (
        <div id="analyzer" style={styles.grid}>

          {/* Left — pose selector */}
          <PoseSidebar
            poses={POSES}
            selected={selectedPose}
            onSelect={setSelectedPose}
          />

          {/* Center — camera + AI coach stacked */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            background: '#F5F0FF',
            minHeight: '100%',
            overflow: 'hidden',
          }}>
            <Camera
              onFeedback={setFeedback}
              selectedPose={selectedPose}
              onStop={() => {
                setCameraActive(false)
                setFeedback(null)
              }}
            />
            <AICoach
              feedback={feedback}
              poseName={selectedPose.name}
            />
          </div>

          {/* Right — feedback panel */}
          <FeedbackPanel feedback={feedback} />

        </div>
      )}

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr 260px',
    gap: '0',
    padding: '0',
    alignItems: 'start',
    minHeight: 'calc(100vh - 65px)',
  },
  startScreen: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  startCard: {
    background: 'theme.white',
    borderRadius: '20px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: `0.5px solid ${theme.lavenderBorder}`,
    boxShadow: `0 4px 24px rgba(127,119,221,0.08)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  startTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

  },
  startSubtitle: {
    fontSize: '15px',
    color: '#666',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

  },
  startFeatures: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: '8px 0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

  },
  featureRow: {
    fontSize: '13px',
    color: theme.textPrimary,
    background: theme.lavenderSurface,
    padding: '10px 14px',
    borderRadius: '8px',
    textAlign: 'left',
  },
  startBtn: {
    background: theme.lavenderAccent,
    color: theme.white,
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

  },
  poseHint: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: '12px',
    color: theme.lavenderMuted,
    margin: 0,
  }
}

export default App