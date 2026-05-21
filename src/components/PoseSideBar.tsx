import type { PoseDefinition } from '../poses'

interface Props {
    poses: PoseDefinition[]
    selected: PoseDefinition
    onSelect: (pose: PoseDefinition) => void
}

const difficultyColor: Record<string, { bg: string; text: string; dot: string }> = {
    Beginner: { bg: '#E1F5EE', text: '#085041', dot: '#1D9E75' },
    Intermediate: { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
}

export default function PoseSidebar({ poses, selected, onSelect }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
                textTransform: 'uppercase', color: '#888', marginBottom: '4px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}>
                Poses
            </div>

            {poses.map(pose => {
                const isActive = pose.id === selected.id
                const diff = difficultyColor[pose.difficulty]

                return (
                    <div
                        key={pose.id}
                        onClick={() => onSelect(pose)}
                        style={{
                            background: isActive ? '#E1F5EE' : '#ffffff',
                            border: `0.5px solid ${isActive ? '#1D9E75' : '#e0e0e0'}`,
                            borderRadius: '8px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all .15s'
                        }}
                    >
                        {/* Emoji icon */}
                        <div style={{
                            width: '36px', height: '36px',
                            borderRadius: '8px',
                            background: isActive ? '#9FE1CB' : '#f5f5f5',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '20px',
                            flexShrink: 0,
                        }}>
                            {pose.emoji}
                        </div>

                        {/* Name + difficulty */}
                        <div>
                            <div style={{
                                fontSize: '13px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: 500,
                                color: isActive ? '#085041' : '#1a1a2e'
                            }}>
                                {pose.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{
                                    width: '6px', height: '6px',
                                    borderRadius: '50%', background: diff.dot,
                                    display: 'inline-block'
                                }} />
                                <span style={{ fontSize: '11px', color: diff.text, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}>
                                    {pose.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}