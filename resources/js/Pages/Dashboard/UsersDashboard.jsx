import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UsersDashboard({auth}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                <div className="text-base font-medium group-[.mode--light]:text-white">
                    You're logged in!
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
