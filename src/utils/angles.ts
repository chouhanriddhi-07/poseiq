export function calculateAngle(
    a: { x: number; y: number },
    b: { x: number; y: number }, // the joint (middle point)
    c: { x: number; y: number }
): number {
    // Get vectors from joint b to points a and c
    const vectorBA = { x: a.x - b.x, y: a.y - b.y }
    const vectorBC = { x: c.x - b.x, y: c.y - b.y }

    // Dot product
    const dot = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y

    // Magnitudes
    const magBA = Math.sqrt(vectorBA.x ** 2 + vectorBA.y ** 2)
    const magBC = Math.sqrt(vectorBC.x ** 2 + vectorBC.y ** 2)

    // Angle in degrees
    const angle = Math.acos(dot / (magBA * magBC)) * (180 / Math.PI)
    return Math.round(angle)
}