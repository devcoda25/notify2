// /src/Component/dailer/Softphone/ShimmerGlitch.jsx

export default function ShimmerGlitch({ active }) {
  if (!active) return null;
  return (
    <div
      className="call-state-change"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,            // <- hard limit to avoid covering content
        zIndex: 1,
        pointerEvents: 'none' // <- never block clicks
      }}
    />
  );
}
