// Helper functions for database query
function withUpdatedAt<T>(data: T): T & { updatedAt: Date } {
  return {
    ...data,
    updatedAt: new Date(),
  };
}

function withDeletedAt<T>(data: T): T & { deletedAt: Date } {
  return {
    ...data,
    deletedAt: new Date(),
  };
}



export {
    withUpdatedAt,
    withDeletedAt
}