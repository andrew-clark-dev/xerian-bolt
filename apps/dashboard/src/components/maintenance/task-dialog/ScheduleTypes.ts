export interface ScheduleType {
    value: 'now' | 'daily' | 'weekly' | 'monthly';
    label: string;
}

export const scheduleTypes: ScheduleType[] = [
    { value: 'now', label: 'Run Now' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];