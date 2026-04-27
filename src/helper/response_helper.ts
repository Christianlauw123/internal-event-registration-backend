function baseResponse<T>(message: string | null, error: string[] | null, data: T) {
  return {
    message,
    error,
    data,
  };
}

export {
    baseResponse,
}