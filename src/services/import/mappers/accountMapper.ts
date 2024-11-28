export function mapAccount(item: any, userId: string): any {
  const now = new Date().toISOString();
  
  return {
    ...item,
    userId,
    balance: 0,
    noSales: 0,
    noItems: 0,
    lastActivityAt: now,
    createdAt: now,
    updatedAt: now,
  };
}