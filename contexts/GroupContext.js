import { createContext, useState, useContext } from 'react';
import axios from '@/lib/axios';

const GroupContext = createContext();

export const useGroups = () => {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error('useGroups must be used within GroupProvider');
    }
    return context;
};

export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [adminGroups, setAdminGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all groups
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/groups');
            setGroups(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching groups:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's groups
    const fetchMyGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/groups/my-groups');
            setMyGroups(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching my groups:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch admin groups
    const fetchAdminGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/groups/my-admin-groups');
            setAdminGroups(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching admin groups:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Create group
    const createGroup = async (data) => {
        try {
            const response = await axios.post('/api/groups', data);
            await fetchMyGroups();
            return response.data;
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    };

    // Get single group
    const getGroup = async (id) => {
        try {
            const response = await axios.get(`/api/groups/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching group:', error);
            throw error;
        }
    };

    // Update group
    const updateGroup = async (id, data) => {
        try {
            const response = await axios.put(`/api/groups/${id}`, data);
            await fetchMyGroups();
            return response.data;
        } catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    };

    // Delete group
    const deleteGroup = async (id) => {
        try {
            await axios.delete(`/api/groups/${id}`);
            await fetchMyGroups();
        } catch (error) {
            console.error('Error deleting group:', error);
            throw error;
        }
    };

    // Get members
    const getMembers = async (groupId) => {
        try {
            const response = await axios.get(`/api/groups/${groupId}/members`);
            return response.data;
        } catch (error) {
            console.error('Error fetching members:', error);
            throw error;
        }
    };

    // Add member
    const addMember = async (groupId, userId, role = 'member') => {
        try {
            const response = await axios.post(`/api/groups/${groupId}/members`, {
                user_id: userId,
                role,
            });
            return response.data;
        } catch (error) {
            console.error('Error adding member:', error);
            throw error;
        }
    };

    // Remove member
    const removeMember = async (groupId, userId) => {
        try {
            await axios.delete(`/api/groups/${groupId}/members/${userId}`);
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    };

    // Promote to admin
    const promoteToAdmin = async (groupId, userId) => {
        try {
            await axios.post(`/api/groups/${groupId}/members/${userId}/promote`);
        } catch (error) {
            console.error('Error promoting member:', error);
            throw error;
        }
    };

    // Demote to member
    const demoteToMember = async (groupId, userId) => {
        try {
            await axios.post(`/api/groups/${groupId}/members/${userId}/demote`);
        } catch (error) {
            console.error('Error demoting member:', error);
            throw error;
        }
    };

    // Leave group
    const leaveGroup = async (groupId) => {
        try {
            await axios.post(`/api/groups/${groupId}/leave`);
            await fetchMyGroups();
        } catch (error) {
            console.error('Error leaving group:', error);
            throw error;
        }
    };

    // Send invitation
    const sendInvitation = async (groupId, email) => {
        try {
            const response = await axios.post(`/api/groups/${groupId}/invitations`, {
                email,
            });
            return response.data;
        } catch (error) {
            console.error('Error sending invitation:', error);
            throw error;
        }
    };

    const value = {
        groups,
        myGroups,
        adminGroups,
        loading,
        fetchGroups,
        fetchMyGroups,
        fetchAdminGroups,
        createGroup,
        getGroup,
        updateGroup,
        deleteGroup,
        getMembers,
        addMember,
        removeMember,
        promoteToAdmin,
        demoteToMember,
        leaveGroup,
        sendInvitation,
    };

    return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};