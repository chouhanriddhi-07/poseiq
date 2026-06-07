import type { PoseDefinition } from '../poses'
import { theme } from '../theme'

interface Props {
    poses: PoseDefinition[]
    selected: PoseDefinition
    onSelect: (pose: PoseDefinition) => void
}

const difficultyColor: Record<string, { bg: string; text: string; dot: string }> = {
    Beginner: { bg: '#E1F5EE', text: 'theme.lavenderDark', dot: 'theme.lavenderAccent' },
    Intermediate: { bg: '#FAEEDA', text: '#854F0B', dot: '#EF9F27' },
}

export default function PoseSidebar({ poses, selected, onSelect }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 12px', background: '#ffffff', borderRight: '0.5px solid #DDD8FA', minHeight: '100%', }}>
            <div style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '.07em',
                textTransform: 'uppercase', color: theme.lavenderMuted, marginBottom: '4px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                            background: isActive ? theme.lavenderBg : theme.white,
                            border: `0.5px solid ${isActive ? theme.lavenderBorder : '#e0e0e0'}`,
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
                        <div style={{ fontSize: '20px', width: '28px', textAlign: 'center', flexShrink: 0 }}>
                            {pose.emoji}
                        </div>

                        {/* Name + difficulty */}
                        <div>
                            <div style={{
                                fontSize: '13px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontWeight: 500,
                                color: isActive ? theme.lavenderDeep : theme.textPrimary
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