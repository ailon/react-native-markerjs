import type { AnnotationState } from '../core/AnnotationState';
import React, { createContext, useContext } from 'react';

export type AnnotationContextType = {
  annotation: AnnotationState | null;
  setAnnotation: (newAnnotation: AnnotationState | null) => void;
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
    // React.useState<AnnotationState>(testState);
    React.useState<AnnotationState | null>(null);
  const handleAnnotationChange = (newAnnotation: AnnotationState | null) => {
    setAnnotation(newAnnotation);
  };

  return (
    <AnnotationContext.Provider
      value={{ annotation, setAnnotation: handleAnnotationChange }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};
