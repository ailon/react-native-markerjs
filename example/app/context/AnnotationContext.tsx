import type { AnnotationState } from '@markerjs/react-native-markerjs';
import React, { createContext, useContext } from 'react';
import { testState } from '../../sample-data/sample-state';

type AnnotationContextType = {
  annotation: AnnotationState;
  handleAnnotationChange: (newAnnotation: AnnotationState) => void;
};

const AnnotationContext = createContext<AnnotationContextType | undefined>(
  undefined
);

export const useAnnotationContext = () => {
  const ctx = useContext(AnnotationContext);
  if (!ctx)
    throw new Error(
      'useAnnotationContext must be used within AnnotationProvider'
    );
  return ctx;
};

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [annotation, setAnnotation] =
    React.useState<AnnotationState>(testState);
  const handleAnnotationChange = (newAnnotation: AnnotationState) => {
    setAnnotation(newAnnotation);
  };

  return (
    <AnnotationContext.Provider value={{ annotation, handleAnnotationChange }}>
      {children}
    </AnnotationContext.Provider>
  );
};
