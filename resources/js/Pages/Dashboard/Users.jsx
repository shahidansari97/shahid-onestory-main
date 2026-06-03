import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import {Button} from "@/Components/Dashboard/Form.jsx";
import Pagination from "@/Components/Dashboard/Pagination.jsx";

export default function Users({ auth }) {
    const { currentUsers, totalUsers, currentPage, lastPage } = usePage().props;

    const deleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await axios.post(route('admin.users.delete', { id: userId }));

                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const updateUserStatus = async (userId, newStatus) => {
        try {
            const response = await axios.post(route('admin.users.update-status', { id: userId }), {
                active_status: newStatus
            });

            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User List</h2>}
        >
            <div className="flex flex-col box box--stacked">
                <div className="overflow-auto xl:overflow-visible">
                    <table className="w-full text-left border-b border-slate-200/60">
                        <thead>
                        <tr className={'border-b'}>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">Avatar</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">Name</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">Email</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">Status</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">User Type</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500">Joined Date</td>
                            <td className="px-5  py-4 font-medium border-t bg-slate-50 text-slate-500 text-center">Action</td>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-5 py-3 text-center">No users found.</td>
                            </tr>
                        ) : (
                            currentUsers.map((user, index) => (
                                <tr key={user.id} className=" border-b">
                                    <td className="px-5  py-4"> <img src={user.avatar}  className="w-16 h-16 object-cover rounded"/></td>
                                    <td className="px-5  py-4">{user.username}</td>
                                    <td className="px-5  py-4">{user.email}</td>
                                    <td className="px-5  py-4">
                                        <select 
                                            value={user.active_status ? '1' : '0'}
                                            onChange={(e) => updateUserStatus(user.id, parseInt(e.target.value))}
                                            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </td>
                                    <td className="px-5  py-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                            user.is_creator 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.is_creator ? 'Creator' : 'User'}
                                        </span>
                                    </td>
                                    <td className="px-5  py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-5  py-4 flex justify-center">
                                        <Button
                                            onClick={() => deleteUser(user.id)}
                                            variant={'danger'}
                                         >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={(page) => {
                        router.get(route('admin.users.index', { page }), {}, {
                            preserveScroll: true,
                        });
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
