export const KAFKA_TOPICS = {
  ADMIN_UPDATE: "admin.update",
  ADMIN_ROLLBACK: "admin-service.rollback",
} as const;

export const KAFKA_GROUPS = {
  ADMIN_SERVICE: "admin-service-group",
} as const;
