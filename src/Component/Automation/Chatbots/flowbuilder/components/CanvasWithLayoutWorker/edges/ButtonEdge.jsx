import React from 'react';
import { getBezierPath, useReactFlow } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useFlowStore } from '../../../store/flow.js';

// Note: The wrapper style relies on the global style in reactflow/dist/style.css 
// for the hover effect: .react-flow__edge:hover .edgebutton-wrapper { opacity: 1; }
const foreignObjectSize = 24;

const wrapperStyle = {
  opacity: 0,
  transition: 'opacity 0.2s',
  pointerEvents: 'none',
};

const buttonStyle = {
  width: `${foreignObjectSize}px`,
  height: `${foreignObjectSize}px`,
  background: '#ef4444', // theme.palette.error.main
  color: 'white',
  border: '1px solid #fff',
  cursor: 'pointer',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
};

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const { setEdges } = useReactFlow();
  const { deleteEdge } = useFlowStore.getState();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt) => {
    evt.stopPropagation();
    deleteEdge(id);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        style={wrapperStyle}
        className="edgebutton-wrapper" // Keep a class for the global CSS hover selector
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button style={buttonStyle} onClick={onEdgeClick}>
          <Trash2 size={12} />
        </button>
      </foreignObject>
    </>
  );
}
