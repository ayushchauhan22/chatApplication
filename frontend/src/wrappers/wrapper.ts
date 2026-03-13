export const asyncWrapper = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    console.error("Async Error:", error);
    throw error;
  }
};
