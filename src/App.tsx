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

/**
 * App.tsx — Root component for PoseIQ
 *
 * Owns all top-level state and decides which layout to render.
 *
 * State owned here (not in children) because multiple components need it:
 *   - feedback     → Camera produces it, FeedbackPanel + AICoach consume it
 *   - selectedPose → PoseSidebar sets it, Camera + AICoach use it
 *   - cameraActive → controls start screen vs analyzer view
 *   - isMobile     → switches between DesktopLayout and MobileLayout
 *
 * Layout strategy:
 *   Desktop (≥768px) → 3-column CSS grid: sidebar | camera+coach | feedback
 *   Mobile  (<768px) → vertical flex stack: pose pills → camera → coach → feedback
 */

// ── Root component ────────────────────────────────────────────────────

function App() {
  const [feedback, setFeedback] = useState<PoseFeedback | null>(null)
  const [selectedPose, setSelectedPose] = useState<PoseDefinition>(POSES[0])
  const [showAbout, setShowAbout] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  /**
   * Listen for window resize and update isMobile.
   * Cleanup removes the listener on unmount to prevent memory leaks.
   * (React equivalent of Angular's ngOnDestroy)
   */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: theme.pageBg }}>
      <Header onAboutClick={() => setShowAbout(true)} />

      {/* ── Start screen — shown before camera is activated ── */}
      {!cameraActive && (
        <div style={styles.startScreen}>
          <div style={styles.startCard}>
            <Logo size={56} />
            <h1 style={styles.startTitle}>PoseIQ</h1>
            <p style={styles.startSubtitle}>
              Real-time AI yoga pose analysis.<br />
              Position yourself in front of your camera, then press start.
            </p>

            {/* Feature list — reassures privacy-conscious users */}
            <div style={styles.startFeatures}>
              {[
                'Camera stays on your device — never uploaded',
                'AI detects 33 body points at 30fps',
                'Live coaching from Claude AI',
              ].map((f, i) => (
                <div key={i} style={styles.featureRow}>
                  <span style={{ color: theme.roseAccent, fontWeight: 600, marginRight: '8px' }}>→</span>
                  {f}
                </div>
              ))}
            </div>

            {/* Activating camera here (not on load) gives the user control
                and avoids surprising them with a permission prompt */}
            <button onClick={() => setCameraActive(true)} style={styles.startBtn}>
              Start Analysis →
            </button>
            <p style={styles.poseHint}>
              Try: Warrior II · Tree Pose · Mountain Pose
            </p>
          </div>
        </div>
      )}

      {/* ── Analyzer — shown after camera is activated ── */}
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

      {/* ── About modal — rendered at root so it overlays everything ── */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  )
}

// ── Shared layout props ───────────────────────────────────────────────

/**
 * Props passed down to both layout components.
 * Defined once here to avoid duplication and keep both layouts in sync.
 */
interface LayoutProps {
  feedback: PoseFeedback | null
  setFeedback: (f: PoseFeedback | null) => void
  selectedPose: PoseDefinition
  setSelectedPose: (p: PoseDefinition) => void
  setCameraActive: (v: boolean) => void
}

// ── Desktop layout ────────────────────────────────────────────────────

/**
 * DesktopLayout — 3-column CSS grid for screens ≥768px.
 *
 * Column 1 (180px fixed):  PoseSidebar — pose selector
 * Column 2 (1fr flexible): Camera feed stacked above AICoach
 * Column 3 (260px fixed):  FeedbackPanel — score ring + corrections
 *
 * overflow: hidden on the grid prevents the layout from causing
 * a page-level scrollbar — the camera fills the remaining viewport height.
 */
function DesktopLayout({
  feedback,
  setFeedback,
  selectedPose,
  setSelectedPose,
  setCameraActive,
}: LayoutProps) {
  return (
    <div
      id="analyzer"
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr 260px',
        gap: '0',
        height: 'calc(100vh - 56px)',  // 56px = header height
        overflow: 'hidden',
      }}
    >
      {/* Left column — pose picker */}
      <PoseSidebar
        poses={POSES}
        selected={selectedPose}
        onSelect={setSelectedPose}
      />

      {/* Center column — camera + AI coach stacked vertically */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        background: theme.pageBg,
        height: '100%',
      }}>
        {/* flex: 1 makes the camera grow to fill remaining height
            after AICoach takes its natural height at the bottom */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Camera
            onFeedback={setFeedback}
            selectedPose={selectedPose}
            onStop={() => { setCameraActive(false); setFeedback(null) }}
          />
        </div>
        <AICoach feedback={feedback} poseName={selectedPose.name} />
      </div>

      {/* Right column — live score + feedback items */}
      <FeedbackPanel feedback={feedback} poseName={selectedPose.name} />
    </div>
  )
}

// ── Mobile layout ─────────────────────────────────────────────────────

/**
 * MobileLayout — vertical flex stack for screens <768px.
 *
 * Stack order (top to bottom):
 *   1. Horizontal scrolling pose pill selector
 *   2. Camera feed (full width)
 *   3. AICoach streaming text
 *   4. Feedback panel — compact horizontal score + correction list
 *
 * The pose selector uses overflowX: auto with scrollbarWidth: none
 * to create a swipeable pill row without a visible scrollbar.
 */
function MobileLayout({
  feedback,
  setFeedback,
  selectedPose,
  setSelectedPose,
  setCameraActive,
}: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '12px',
      background: theme.pageBg,
      minHeight: 'calc(100vh - 56px)',
    }}>

      {/* ── Pose selector — horizontal scrolling pill row ── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',  // Firefox
        // Chrome/Safari scrollbar hidden via index.css .pose-scroll class
      }}>
        {POSES.map(pose => {
          const isActive = selectedPose.id === pose.id
          return (
            <div
              key={pose.id}
              onClick={() => setSelectedPose(pose)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '99px',
                border: `0.5px solid ${isActive ? theme.lavenderAccent : theme.lavenderBorder}`,
                background: isActive ? theme.lavenderBg : theme.white,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,  // prevents pills from squishing
              }}
            >
              <span style={{ fontSize: '16px' }}>{pose.emoji}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: isActive ? theme.lavenderDark : theme.textPrimary,
              }}>
                {pose.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Camera — full width on mobile ── */}
      <Camera
        onFeedback={setFeedback}
        selectedPose={selectedPose}
        onStop={() => { setCameraActive(false); setFeedback(null) }}
      />

      {/* ── AI Coach — full width streaming coaching text ── */}
      <AICoach feedback={feedback} poseName={selectedPose.name} />

      {/* ── Feedback panel — compact mobile version ── */}
      {/*
        On mobile the full FeedbackPanel component is too tall.
        Instead we render an inline compact version: score ring
        sits left of the status label, corrections list below.
      */}
      <div style={{
        background: theme.white,
        borderRadius: '12px',
        border: `0.5px solid ${theme.lavenderBorder}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {feedback ? (
          <>
            {/* Score row — ring left, label + pose name right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg width="72" height="72" viewBox="0 0 120 120">
                {/* Background track */}
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={theme.lavenderBorder}
                  strokeWidth="10"
                />
                {/* Score arc — length = (score/100) * circumference (314) */}
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={
                    feedback.score >= 75 ? theme.lavenderAccent :
                    feedback.score >= 50 ? '#EF9F27' : '#E24B4A'
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(feedback.score / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="55" textAnchor="middle"
                  style={{ fontSize: '26px', fontWeight: 700, fill: theme.lavenderAccent }}>
                  {feedback.score}
                </text>
                <text x="60" y="72" textAnchor="middle"
                  style={{ fontSize: '11px', fill: theme.lavenderMuted }}>
                  / 100
                </text>
              </svg>

              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: feedback.score >= 75 ? theme.lavenderAccent : theme.roseAccent,
                }}>
                  {feedback.score >= 75 ? '✅ Good form!' :
                   feedback.score >= 50 ? '⚠️ Getting there' : '❌ Needs work'}
                </div>
                <div style={{ fontSize: '12px', color: theme.lavenderMuted, marginTop: '4px' }}>
                  {selectedPose.name}
                </div>
              </div>
            </div>

            {/* Correction items — rose border = needs fixing, lavender = passing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {feedback.feedback.map((msg, i) => (
                <div key={i} style={{
                  fontSize: '13px',
                  color: theme.textPrimary,
                  background: feedback.isCorrect ? theme.lavenderSurface : '#FDF0F5',
                  borderLeft: `3px solid ${feedback.isCorrect ? theme.lavenderAccent : theme.roseAccent}`,
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
          /* Empty state — shown before any pose is detected */
          <div style={{
            textAlign: 'center',
            color: theme.lavenderMuted,
            padding: '8px 0',
            fontSize: '13px',
          }}>
            🧘 Get into a pose to start analysis
          </div>
        )}
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────

/**
 * Styles object for the start screen only.
 * Layout-specific styles for DesktopLayout and MobileLayout
 * are defined inline since they're unique to each layout.
 */
const styles: Record<string, React.CSSProperties> = {
  startScreen: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  startCard: {
    background: theme.white,
    borderRadius: '20px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    border: `0.5px solid ${theme.lavenderBorder}`,
    boxShadow: '0 4px 24px rgba(127,119,221,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  startTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: theme.lavenderDeep,
    margin: 0,
  },
  startSubtitle: {
    fontSize: '15px',
    color: theme.textMuted,
    lineHeight: 1.7,
    margin: 0,
  },
  startFeatures: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: '8px 0',
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
    background: `linear-gradient(135deg, ${theme.lavenderAccent} 0%, ${theme.roseAccent} 100%)`,
    color: theme.white,
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  poseHint: {
    fontSize: '12px',
    color: theme.roseAccent,
    margin: 0,
  },
}

export default App
