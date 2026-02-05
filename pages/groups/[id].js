import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/contexts/GroupContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

export default function GroupDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const { getGroup, getMembers, removeMember, promoteToAdmin, demoteToMember, leaveGroup, deleteGroup } = useGroups();

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);

    useEffect(() => {
        if (id) {
            loadGroup();
            loadMembers();
        }
    }, [id]);

    const loadGroup = async () => {
        try {
            const data = await getGroup(id);
            setGroup(data);
        } catch (error) {
            console.error('Error loading group:', error);
            router.push('/groups');
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const data = await getMembers(id);
            setMembers(data);
        } catch (error) {
            console.error('Error loading members:', error);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm('Are you sure you want to remove this member?')) return;

        try {
            await removeMember(id, userId);
            await loadMembers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to remove member');
        }
    };

    const handlePromote = async (userId) => {
        try {
            await promoteToAdmin(id, userId);
            await loadMembers();
            await loadGroup();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to promote member');
        }
    };

    const handleDemote = async (userId) => {
        try {
            await demoteToMember(id, userId);
            await loadMembers();
            await loadGroup();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to demote member');
        }
    };

    const handleLeaveGroup = async () => {
        if (!confirm('Are you sure you want to leave this group?')) return;

        try {
            await leaveGroup(id);
            router.push('/groups');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to leave group');
        }
    };

    const handleDeleteGroup = async () => {
        if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;

        try {
            await deleteGroup(id);
            router.push('/groups');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete group');
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (!group) {
        return null;
    }

    const isAdmin = group.is_admin;
    const isCreator = group.created_by === user?.id;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                                    {isAdmin && (
                                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      Admin
                    </span>
                                    )}
                                    <span className={`text-sm px-3 py-1 rounded-full ${
                                        group.is_private
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                    {group.is_private ? 'Private' : 'Public'}
                  </span>
                                </div>
                                <p className="text-gray-600">{group.description}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    <span>{group.member_count} members</span>
                                    <span className="mx-2">•</span>
                                    <span>Created by {group.creator?.name}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Link
                                    href="/groups"
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                                >
                                    Back to Groups
                                </Link>
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={() => setShowAddMemberModal(true)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                        >
                                            Add Member
                                        </button>
                                        <button
                                            onClick={() => setShowInviteModal(true)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                        >
                                            Invite
                                        </button>
                                    </>
                                )}
                                {!isCreator && (
                                    <button
                                        onClick={handleLeaveGroup}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                    >
                                        Leave Group
                                    </button>
                                )}
                                {isCreator && (
                                    <button
                                        onClick={handleDeleteGroup}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                    >
                                        Delete Group
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Members ({members.length})</h2>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {member.name}
                                                {member.id === group.created_by && (
                                                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Creator
                          </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${
                        member.pivot.role === 'admin'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.pivot.role}
                    </span>

                                        {isAdmin && member.id !== user?.id && member.id !== group.created_by && (
                                            <div className="flex space-x-2">
                                                {member.pivot.role === 'member' ? (
                                                    <button
                                                        onClick={() => handlePromote(member.id)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                                                    >
                                                        Make Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDemote(member.id)}
                                                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
                                                    >
                                                        Remove Admin
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showInviteModal && (
                    <InviteModal
                        groupId={id}
                        onClose={() => setShowInviteModal(false)}
                    />
                )}

                {showAddMemberModal && (
                    <AddMemberModal
                        groupId={id}
                        onClose={() => {
                            setShowAddMemberModal(false);
                            loadMembers();
                        }}
                        existingMembers={members}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

// Invite Modal Component
function InviteModal({ groupId, onClose }) {
    const { sendInvitation } = useGroups();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendInvitation(groupId, email);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Invite Member</h3>

                {success ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                        Invitation sent successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Invitation'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Add Member Modal Component
function AddMemberModal({ groupId, onClose, existingMembers }) {
    const { addMember } = useGroups();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock user search - Replace with actual API call
    useEffect(() => {
        // In real implementation, fetch users from API
        const mockUsers = [
            { id: 2, name: 'John Doe', email: 'john@example.com' },
            { id: 3, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 4, name: 'Bob Johnson', email: 'bob@example.com' },
        ];

        // Filter out existing members
        const existingMemberIds = existingMembers.map(m => m.id);
        const availableUsers = mockUsers.filter(u => !existingMemberIds.includes(u.id));
        setUsers(availableUsers);
    }, [existingMembers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await addMember(groupId, selectedUser, role);
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Add Member</h3>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search User
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select User
                        </label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Choose a user</option>
                            {filteredUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={loading || !selectedUser}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}