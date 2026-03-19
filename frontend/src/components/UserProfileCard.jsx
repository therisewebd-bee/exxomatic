import { useAuth } from '../context/AuthContext';

export default function UserProfileCard() {
    const { user } = useAuth();

    const name = user?.name || 'Fleet User';
    const role = user?.role || 'Customer';
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="px-4 py-3 border-t border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                </div>
            </div>
        </div>
    );
}
