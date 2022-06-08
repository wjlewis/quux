import React from 'react';

export function useDims<T extends Element>(ref: React.RefObject<T>): Dims {
  const [dims, setDims] = React.useState({ width: 0, height: 0 });

  const updateDims = React.useCallback(() => {
    if (!ref.current) {
      return;
    }

    const { width, height } = ref.current.getBoundingClientRect();
    setDims({ width, height });
  }, [ref]);

  React.useLayoutEffect(() => {
    updateDims();

    const handleResize = updateDims;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDims]);

  return dims;
}

export interface Dims {
  width: number;
  height: number;
}
