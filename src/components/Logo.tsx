// Copy this as a reusable component: src/components/Logo.tsx
export default function Logo({ size = 40 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 90 90"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Lavender background */}
            <rect width="90" height="90" rx="20" fill="#EDE9FD" />

            {/* Head */}
            <circle cx="45" cy="14" r="7" fill="#534AB7" />

            {/* Spine */}
            <line x1="45" y1="21" x2="45" y2="48"
                stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />

            {/* Arms — wide open, Warrior II */}
            <line x1="14" y1="34" x2="76" y2="34"
                stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />

            {/* Back leg — straight */}
            <line x1="45" y1="48" x2="28" y2="68"
                stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />

            {/* Front leg — bent at knee */}
            <line x1="45" y1="48" x2="64" y2="60"
                stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />
            <line x1="64" y1="60" x2="72" y2="76"
                stroke="#7F77DD" strokeWidth="3" strokeLinecap="round" />

            {/* Landmark dots — light at extremities */}
            <circle cx="14" cy="34" r="4.5" fill="#AFA9EC" />
            <circle cx="76" cy="34" r="4.5" fill="#AFA9EC" />
            <circle cx="28" cy="68" r="4.5" fill="#AFA9EC" />
            <circle cx="72" cy="76" r="4.5" fill="#AFA9EC" />

            {/* Landmark dot — dark at bent knee (the active joint) */}
            <circle cx="64" cy="60" r="4.5" fill="#534AB7" />
        </svg>
    )
}