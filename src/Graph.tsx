import React from 'react';
import { useDims, Dims } from './hooks';

const Graph: React.FC = () => {
  const ref = React.useRef(null);
  const dims = useDims(ref);

  const bb = {
    minX: -3,
    maxX: 1,
    minY: -2,
    maxY: 1,
  };

  const viewInfo = computeViewInfo(dims, bb);
  const transformInfo = computeTransformInfo(bb, viewInfo);

  return (
    <div className="graph">
      <svg ref={ref} viewBox={viewInfo.viewBox}>
        <rect
          x="0"
          y="0"
          width={viewInfo.sideX}
          height={viewInfo.sideY}
          fill="#00f4"
        />

        <g transform={transformInfo.transform}>
          <line
            x1={-transformInfo.dX - viewInfo.offsetX}
            x2={transformInfo.dX + viewInfo.offsetX}
            y1="0"
            y2="0"
            stroke="#444"
            strokeWidth="2"
          />
          <line
            x1="0"
            x2="0"
            y1={-transformInfo.dY - viewInfo.offsetY}
            y2={transformInfo.dY + viewInfo.offsetY}
            stroke="#444"
            strokeWidth="2"
          />
          <circle cx="0" cy="0" r="6" fill="red" />
          <circle
            cx={viewInfo.sideX - transformInfo.dX}
            cy="0"
            r="6"
            fill="red"
          />
          <circle
            cx="0"
            cy={viewInfo.sideY - transformInfo.dY}
            r="6"
            fill="red"
          />

          <circle
            cx={viewInfo.sideX - transformInfo.dX + viewInfo.offsetX}
            cy="0"
            r="6"
            fill="red"
          />
          <circle
            cx="0"
            cy={viewInfo.sideY - transformInfo.dY + viewInfo.offsetY}
            r="6"
            fill="red"
          />
        </g>
      </svg>
    </div>
  );
};

function computeViewInfo(dims: Dims, bb: BoundingBox): ViewInfo {
  const { width, height } = dims;

  if (width === 0 || height === 0) {
    return { viewBox: `0 0 1 1`, sideX: 1, sideY: 1, offsetX: 0, offsetY: 0 };
  }

  const { minX, maxX, minY, maxY } = bb;
  const totalX = maxX - minX;
  const totalY = maxY - minY;

  const aspectRatio = totalX / totalY;

  if (width / height < aspectRatio) {
    const h = width / aspectRatio;
    const offsetY = (height - h) / 2;
    return {
      viewBox: `0 ${-(h - width) / (2 * h)} ${width} ${h}`,
      sideX: width,
      sideY: h,
      offsetX: 0,
      offsetY,
    };
  } else {
    const w = height * aspectRatio;
    const offsetX = (width - w) / 2;
    return {
      viewBox: `${-(w - height) / (2 * w)} 0 ${w} ${height}`,
      sideX: w,
      sideY: height,
      offsetX,
      offsetY: 0,
    };
  }
}

interface ViewInfo {
  viewBox: string;
  sideX: number;
  sideY: number;
  offsetX: number;
  offsetY: number;
}

function computeTransformInfo(
  bb: BoundingBox,
  viewInfo: ViewInfo
): TransformInfo {
  const { minX, maxX, minY, maxY } = bb;
  const { sideX, sideY } = viewInfo;

  const totalX = maxX - minX;
  const totalY = maxY - minY;
  const dX = (sideX * (totalX - maxX)) / totalX;
  const dY = (sideY * (totalY + minY)) / totalY;
  const transform = `matrix(1, 0, 0, -1, ${dX}, ${dY})`;

  function toPlotSpace({ x, y }: Pos): Pos {
    return new Pos((sideX * x) / totalX, (sideY * y) / totalY);
  }

  return { transform, dX, dY: sideY - dY, toPlotSpace };
}

interface BoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface TransformInfo {
  transform: string;
  dX: number;
  dY: number;
  toPlotSpace: (pos: Pos) => Pos;
}

class Pos {
  constructor(public x: number, public y: number) {}
}

export default Graph;
