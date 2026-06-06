import { useState } from 'react'
import AboutModal from './components/About'
import Camera from './components/Camera'
import FeedbackPanel from './components/FeedbackPanel'
import Header from './components/Header'
import PoseSidebar from './components/PoseSideBar'
import { POSES, type PoseDefinition } from './poses'
import type { PoseFeedback } from './poses/warrior2'
import AICoach from './components/AICoach'

function App() {
  const [feedback, setFeedback] = useState<PoseFeedback | null>(null)
  const [selectedPose, setSelectedPose] = useState<PoseDefinition>(POSES[0])
  const [showAbout, setShowAbout] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      <Header onAboutClick={() => setShowAbout(true)} />

      <div id="analyzer" style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 260px',
        gap: '16px',
        padding: '16px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
        <PoseSidebar poses={POSES} selected={selectedPose} onSelect={setSelectedPose} />
        <Camera onFeedback={setFeedback} selectedPose={selectedPose} />
        <AICoach
          feedback={feedback}
          poseName={selectedPose.name}
        />
        <FeedbackPanel feedback={feedback} />
      </div>

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </div>
  )
}

export default App