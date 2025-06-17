let currentId = 0;

export const generateMarkerId = (): string => {
  currentId++;
  return `marker-${currentId}`;
};
