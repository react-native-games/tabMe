import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { cache } from '../utils';

const useGetPoints = (
  setPoints: Dispatch<SetStateAction<number>>,
  start: boolean,
) => {
  const getPoints = async () => {
    const p = await cache.get('points');
    if (p) setPoints(p);
  };
  useEffect(() => {
    getPoints();
  }, [start]);
};

export default useGetPoints;
