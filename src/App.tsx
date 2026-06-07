import { useEffect, useState } from 'react'
import AboutModal from './components/About'
import AICoach from './components/AICoach'
import Camera from './components/Camera'
import FeedbackPanel from './components/FeedbackPanel'
import Header from './components/Header'
import Logo from './components/Logo'
import PoseSidebar from './components/PoseSideBar'
import { POSES, type PoseDefinition } from './poses'
import type { PoseFeedback } from './poses/warrior2'
import { theme } from './theme'

function App() {
  const [feedback, setFeedback] = useState<PoseFeedback | null>(null)
  const [selectedPose, setSelectedPose] = useState<PoseDefinition>(POSES[0])
  const [showAbout, setShowAbout] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)


  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

      {cameraActive && (
        isMobile
          ? <MobileLayout
            feedback={feedback}
            setFeedback={setFeedback}
            selectedPose={selectedPose}
            setSelectedPose={setSelectedPose}
            setCameraActive={setCameraActive}
          />
          : <DesktopLayout
            feedback={feedback}
            setFeedback={setFeedback}
            selectedPose={selectedPose}
            setSelectedPose={setSelectedPose}
            setCameraActive={setCameraActive}
          />
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

// ── Props shared by both layouts ──────────────────────────────────────
interface LayoutProps {
  feedback: PoseFeedback | null
  setFeedback: (f: PoseFeedback | null) => void
  selectedPose: PoseDefinition
  setSelectedPose: (p: PoseDefinition) => void
  setCameraActive: (v: boolean) => void
}

// ── Desktop — existing 3-column grid ──────────────────────────────────
function DesktopLayout({ feedback, setFeedback, selectedPose, setSelectedPose, setCameraActive }: LayoutProps) {
  return (
    <div id="analyzer" style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr 260px',
      gap: '0',
      height: 'calc(100vh - 56px)',
      overflow: 'hidden',
    }}>
      <PoseSidebar poses={POSES} selected={selectedPose} onSelect={setSelectedPose} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#F5F0FF', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Camera
            onFeedback={setFeedback}
            selectedPose={selectedPose}
            onStop={() => { setCameraActive(false); setFeedback(null) }}
          />
        </div>
        <AICoach feedback={feedback} poseName={selectedPose.name} />
      </div>
      <FeedbackPanel feedback={feedback} />
    </div>
  )
}

// ── Mobile — vertical stack ────────────────────────────────────────────
function MobileLayout({ feedback, setFeedback, selectedPose, setSelectedPose, setCameraActive }: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '12px',
      background: '#F5F0FF',
      minHeight: 'calc(100vh - 56px)',
    }}>

      {/* Horizontal scrolling pose selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',   // hide scrollbar on Firefox
      }}>
        {POSES.map(pose => (
          <div
            key={pose.id}
            onClick={() => setSelectedPose(pose)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '99px',
              border: `0.5px solid ${selectedPose.id === pose.id ? '#7F77DD' : '#DDD8FA'}`,
              background: selectedPose.id === pose.id ? '#EDE9FD' : '#ffffff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '16px' }}>{pose.emoji}</span>
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              color: selectedPose.id === pose.id ? '#534AB7' : '#26215C',
            }}>
              {pose.name}
            </span>
          </div>
        ))}
      </div>

      {/* Camera — full width */}
      <Camera
        onFeedback={setFeedback}
        selectedPose={selectedPose}
        onStop={() => { setCameraActive(false); setFeedback(null) }}
      />

      {/* AI Coach — full width at bottom */}
      <AICoach feedback={feedback} poseName={selectedPose.name} />

      {/* Feedback panel — horizontal score + checks */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '0.5px solid #DDD8FA',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {feedback ? (
          <>
            {/* Score row — horizontal on mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg width="72" height="72" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#DDD8FA" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={feedback.score >= 75 ? '#7F77DD' : feedback.score >= 50 ? '#EF9F27' : '#E24B4A'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(feedback.score / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="55" textAnchor="middle" style={{ fontSize: '26px', fontWeight: 700, fill: '#7F77DD' }}>
                  {feedback.score}
                </text>
                <text x="60" y="72" textAnchor="middle" style={{ fontSize: '11px', fill: '#AFA9EC' }}>
                  / 100
                </text>
              </svg>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: feedback.score >= 75 ? '#7F77DD' : '#D4537E' }}>
                  {feedback.score >= 75 ? '✅ Good form!' : feedback.score >= 50 ? '⚠️ Getting there' : '❌ Needs work'}
                </div>
                <div style={{ fontSize: '12px', color: '#AFA9EC', marginTop: '4px' }}>
                  {selectedPose.name}
                </div>
              </div>
            </div>

            {/* Feedback items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {feedback.feedback.map((msg, i) => (
                <div key={i} style={{
                  fontSize: '13px',
                  color: '#26215C',
                  background: feedback.isCorrect ? '#EDE9FD' : '#FDF0F5',
                  borderLeft: `3px solid ${feedback.isCorrect ? '#7F77DD' : '#D4537E'}`,
                  padding: '8px 10px',
                  borderRadius: '6px',
                  lineHeight: 1.5,
                }}>
                  {feedback.isCorrect ? '✅' : '⚠️'} {msg}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#AFA9EC', padding: '8px 0', fontSize: '13px' }}>
            <Logo size={28} /> Get into a pose to start analysis
          </div>
        )}
      </div>



    </div>
  )
}

// ── Styles for start screen ────────────────────────────────────────────
const startStyles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: 'calc(100vh - 56px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px 32px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: '0.5px solid #DDD8FA',
    boxShadow: '0 4px 24px rgba(127,119,221,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#26215C',
    margin: 0,
  },
  subtitle: {
    fontSize: '15px',
    color: '#8B87B8',
    lineHeight: 1.7,
    margin: 0,
  },
  features: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  featureRow: {
    fontSize: '13px',
    color: '#534AB7',
    background: '#F5F3FF',
    padding: '10px 14px',
    borderRadius: '8px',
    textAlign: 'left',
  },
  btn: {
    background: '#7F77DD',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  hint: {
    fontSize: '12px',
    color: '#AFA9EC',
    margin: 0,
  },
}


export default App


