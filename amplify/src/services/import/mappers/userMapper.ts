export function mapUser(item: any): any {
  const now = new Date().toISOString();
  
  return {
    ...item,
    settings: {},
    createdAt: now,
    updatedAt: now,
  };
}