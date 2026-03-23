export const asyncWrapper = async <T>(promise: Promise<T>): Promise<T | null> => {
  return await promise;
};