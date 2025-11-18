import React, { useState, useEffect } from 'react';
import { SetView, User, Role } from '../../types';
import { MOCK_USERS } from '../../data/users';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ChevronLeftIcon } from '../../components/icons';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

interface AdminUserManagementProps {
  setView: SetView;
}

const UserFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  user: User | null;
}> = ({ isOpen, onClose, onSave, user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [gradeLevel, setGradeLevel] = useState<number>(9);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setGradeLevel(user.gradeLevel || 9);
      } else {
        setName('');
        setEmail('');
        setRole(Role.STUDENT);
        setGradeLevel(9);
      }
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    onSave({ name, email, role, gradeLevel });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Full Name</label>
          <input id="user-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label htmlFor="user-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email</label>
          <input id="user-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" />
        </div>
        <div>
          <label htmlFor="user-role" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Role</label>
          <select id="user-role" value={role} onChange={e => setRole(e.target.value as Role)} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500">
            <option value={Role.STUDENT}>Student</option>
            <option value={Role.TEACHER}>Teacher</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
        </div>
        {role === Role.STUDENT && (
          <div>
            <label htmlFor="user-grade" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Grade Level</label>
            <input id="user-grade" type="number" value={gradeLevel || ''} onChange={e => setGradeLevel(parseInt(e.target.value, 10))} className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md bg-transparent focus:ring-primary-500 focus:border-primary-500" />
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save User</Button>
        </div>
      </form>
    </Modal>
  );
};


const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ setView }) => {
  const [updater, setUpdater] = useState(0);
  const [filter, setFilter] = useState<Role | 'all'>('all');
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const forceUpdate = () => setUpdater(u => u + 1);

  const filteredUsers = filter === 'all' ? MOCK_USERS : MOCK_USERS.filter(u => u.role === filter);

  const handleOpenDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setConfirmModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    const userIndex = MOCK_USERS.findIndex(u => u.id === userToDelete.id);
    if (userIndex !== -1) {
      MOCK_USERS.splice(userIndex, 1);
    }
    
    setConfirmModalOpen(false);
    setUserToDelete(null);
    forceUpdate();
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsUserFormModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsUserFormModalOpen(true);
  };

  const handleSaveUser = (data: { name: string, email: string, role: Role, gradeLevel?: number }) => {
    const isEditing = !!editingUser;

    if (MOCK_USERS.some(u => u.email === data.email && u.id !== editingUser?.id)) {
        alert('User with this email already exists.');
        return;
    }

    if (isEditing) {
        const userIndex = MOCK_USERS.findIndex(u => u.id === editingUser.id);
        if (userIndex !== -1) {
            const updatedUser = { ...MOCK_USERS[userIndex], ...data };
            if (data.role !== Role.STUDENT) {
                delete updatedUser.gradeLevel;
                delete updatedUser.courseIds;
            } else {
                updatedUser.gradeLevel = data.gradeLevel || 9;
                if (!updatedUser.courseIds) updatedUser.courseIds = [];
            }
            MOCK_USERS[userIndex] = updatedUser;
        }
    } else {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: `https://picsum.photos/seed/${data.name.split(' ')[0]}/200`,
            schoolId: `${data.role.charAt(0).toUpperCase()}-${String(Date.now()).slice(-5)}`,
            contact: `555-${String(Math.random()).slice(2,5)}-${String(Math.random()).slice(2,6)}`,
            gradeLevel: data.role === Role.STUDENT ? (data.gradeLevel || 9) : undefined,
            courseIds: data.role === Role.STUDENT ? [] : undefined,
        };
        MOCK_USERS.push(newUser);
    }
    
    forceUpdate();
    setIsUserFormModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: Role) => {
    if (role === Role.ADMIN) return 'red';
    if (role === Role.TEACHER) return 'yellow';
    return 'primary';
  };

  return (
    <div className="space-y-6">
        <button onClick={() => setView({type: 'dashboard'})} className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
            <ChevronLeftIcon className="h-4 w-4 mr-1"/>
            Back to Dashboard
        </button>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleOpenAddModal}>Add New User</Button>
      </div>

      <div className="flex space-x-2">
        <Button variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === Role.STUDENT ? 'primary' : 'secondary'} onClick={() => setFilter(Role.STUDENT)}>Students</Button>
        <Button variant={filter === Role.TEACHER ? 'primary' : 'secondary'} onClick={() => setFilter(Role.TEACHER)}>Teachers</Button>
        <Button variant={filter === Role.ADMIN ? 'primary' : 'secondary'} onClick={() => setFilter(Role.ADMIN)}>Admins</Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary-50 dark:bg-secondary-800">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">School ID</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Class/Grade</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-secondary-200 dark:border-secondary-700">
                <td className="p-4">
                  <div className="flex items-center">
                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                    <span className="ml-3 font-medium whitespace-nowrap">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-secondary-600 dark:text-secondary-400">{user.email}</td>
                <td className="p-4 text-secondary-600 dark:text-secondary-400">{user.contact || 'N/A'}</td>
                <td className="p-4 text-secondary-600 dark:text-secondary-400">{user.schoolId}</td>
                <td className="p-4">
                  <Badge color={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                </td>
                <td className="p-4 text-secondary-600 dark:text-secondary-400 text-center">
                    {user.role === Role.STUDENT ? user.gradeLevel || 'N/A' : 'N/A'}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleOpenEditModal(user)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleOpenDeleteConfirm(user)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <UserFormModal
        isOpen={isUserFormModalOpen}
        onClose={() => setIsUserFormModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default AdminUserManagement;
