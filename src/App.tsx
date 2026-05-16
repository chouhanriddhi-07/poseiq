import { useState } from 'react'
import Camera from './components/Camera'
import FeedbackPanel from './components/FeedbackPanel'
import PoseSidebar from './components/PoseSidebar'
import { POSES, type PoseDefinition } from './poses'
import type { PoseFeedback } from './poses/warrior2'

function App() {
  const [feedback, setFeedback] = useState<PoseFeedback | null>(null)
  const [selectedPose, setSelectedPose] = useState<PoseDefinition>(POSES[0])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '200px 1fr 260px',
      gap: '16px',
      padding: '16px',
      minHeight: '100vh',
      background: '#f0f4f8'
    }}>
      <PoseSidebar
        poses={POSES}
        selected={selectedPose}
        onSelect={setSelectedPose}
      />
      <Camera
        onFeedback={setFeedback}
        selectedPose={selectedPose}
      />
      <FeedbackPanel feedback={feedback} />
    </div>
  )
}

export default App