export function mapItem(item: any, userId: string): any {
  const now = new Date().toISOString();
  
  return {
    ...item,
    userId,
    quantity: item.quantity || 1,
    createdAt: now,
    updatedAt: now,
  };
}