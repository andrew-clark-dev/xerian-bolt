import { UserRole } from '../../../amplify/data/resource';

interface RoleCheckboxesProps {
    selectedRoles: UserRole[];
    onChange: (roles: UserRole[]) => void;
}

const AVAILABLE_ROLES: UserRole[] = ['Admin', 'Manager', 'Employee', 'Service'];

export function RoleCheckboxes({ selectedRoles, onChange }: RoleCheckboxesProps) {
    const handleRoleToggle = (role: UserRole) => {
        const newRoles = selectedRoles.includes(role)
            ? selectedRoles.filter(r => r !== role)
            : [...selectedRoles, role];
        onChange(newRoles);
    };

    return (
        <div className="flex flex-wrap gap-4">
            {AVAILABLE_ROLES.map(role => (
                <label key={role} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{role}</span>
                </label>
            ))}
        </div>
    );
}