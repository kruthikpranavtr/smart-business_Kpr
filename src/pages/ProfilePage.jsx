// Complete User Profile & Account Security Dossier for SMARTORA
// Real-time synchronization with localStorage backend, RBAC field protection, and password management

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Save,
  Camera,
  CheckCircle2,
  Lock,
  MapPin,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Check,
  Upload,
  HardDrive,
  Trash2,
  Image as ImageIcon,
  Loader2,
  FolderOpen
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../data/mockData';
import { apiService } from '../services/apiService';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
];

export default function ProfilePage() {
  const { currentUser, updateProfile, changePassword } = useAuth();
  const { currentOrganization, logAuditEvent } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarTab, setAvatarTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    userId: '',
    organization: '',
    department: '',
    role: '',
    joinedDate: '',
    status: 'Active'
  });

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Sync state with authenticated user on mount or user change
  useEffect(() => {
    if (currentUser) {
      const isOwner = currentUser.role === ROLES.PLATFORM_OWNER;
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '+91 98000 00000',
        address: currentUser.address || 'Bengaluru, Karnataka, India',
        avatar: currentUser.avatar || AVATAR_PRESETS[0],
        userId: currentUser.userId || currentUser.id || currentUser.staffId || (isOwner ? 'kruthikpranavtr' : 'USR-001'),
        organization: isOwner ? 'SMARTORA Platform (Global HQ)' : (currentUser.organization || currentOrganization?.name || 'SMARTORA Enterprise'),
        department: isOwner ? 'SMARTORA Global HQ' : (currentUser.department || 'Operations'),
        role: currentUser.role || ROLES.COMPANY_ADMIN,
        joinedDate: currentUser.joinedDate || currentUser.joiningDate || '2022-01-01',
        status: currentUser.status || 'Active'
      });
    }
  }, [currentUser, currentOrganization]);

  const isPlatformOwner = currentUser?.role === ROLES.PLATFORM_OWNER;
  const isCompanyAdmin = currentUser?.role === ROLES.COMPANY_ADMIN;

  // Handle Profile Details Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Validation Error', 'Full legal name is required.', 'danger');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      avatar: formData.avatar
    };

    // If admin/owner, allow updating email as well
    if (isPlatformOwner || isCompanyAdmin) {
      payload.email = formData.email.trim();
    }

    const updatedUser = await updateProfile(payload, currentUser?.role);

    logAuditEvent({
      action: 'PROFILE_UPDATED',
      module: 'Identity & Access',
      details: `User ${currentUser?.name} updated their personal profile dossier`,
      status: 'Success'
    });

    addToast('Profile Dossier Updated', 'Your identity details have been persisted permanently.', 'success');
    setIsEditing(false);
  };

  // Handle Avatar Selection
  const handleSelectAvatar = async (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    await updateProfile({ avatar: url }, currentUser?.role);
    setIsAvatarPickerOpen(false);
    addToast('Photo Updated', 'Profile portrait updated and persisted.', 'success');
  };

  // Automatic Client-Side Image Optimizer for Local Storage
  const processAndOptimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file selected'));
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Selected file must be an image (PNG, JPG, JPEG, WebP, GIF).'));
      }
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('Image file must be under 10MB.'));
      }

      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file from device.'));
      reader.onload = (e) => {
        const img = new window.Image();
        img.onerror = () => reject(new Error('Invalid image file format.'));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 360; // Clean 360x360 square avatar for retina screens
            let width = img.width;
            let height = img.height;

            // Square center crop calculation
            const minDim = Math.min(width, height);
            const startX = (width - minDim) / 2;
            const startY = (height - minDim) / 2;

            canvas.width = MAX_SIZE;
            canvas.height = MAX_SIZE;

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
            resolve({ dataUrl, originalSize: file.size, fileName: file.name });
          } catch (err) {
            resolve({ dataUrl: e.target.result, originalSize: file.size, fileName: file.name });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle Upload from Device / Computer Storage
  const handleDevicePhotoUpload = async (file) => {
    if (!file) return;
    setUploadError('');
    setIsUploading(true);
    try {
      const { dataUrl, fileName } = await processAndOptimizeImage(file);
      
      // Upload permanently to Express backend and MongoDB
      let finalAvatarUrl = dataUrl;
      try {
        const uploadRes = await apiService.uploadProfilePhoto(dataUrl, fileName);
        if (uploadRes.success && uploadRes.photo?.url) {
          finalAvatarUrl = uploadRes.photo.url;
        }
      } catch (uploadErr) {
        console.warn('Backend photo upload fallback to optimized data URL:', uploadErr);
      }

      await handleSelectAvatar(finalAvatarUrl);

      logAuditEvent({
        action: 'PROFILE_PHOTO_UPLOADED',
        module: 'Identity & Access',
        details: `User ${currentUser?.name} uploaded a new profile portrait from device (${fileName})`,
        status: 'Success'
      });
      addToast('Portrait Persisted', 'Profile photo uploaded and persisted permanently.', 'success');
    } catch (err) {
      setUploadError(err.message || 'Failed to process image');
      addToast('Upload Failed', err.message || 'Could not process image', 'danger');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleDevicePhotoUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDevicePhotoUpload(file);
  };

  const handleRemoveCustomAvatar = () => {
    const defaultAvatar = AVATAR_PRESETS[0];
    handleSelectAvatar(defaultAvatar);
    addToast('Photo Reset', 'Profile picture reset to default avatar.', 'info');
  };

  // Handle Password Change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 5) {
      setPasswordError('New password must be at least 5 characters long.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = changePassword(currentUser?.id, passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordSuccess('Your password has been changed successfully. It has been securely hashed.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        addToast('Password Changed', 'Your security credentials have been updated.', 'success');

        logAuditEvent({
          action: 'PASSWORD_CHANGED',
          module: 'Security & Auth',
          details: `User ${currentUser?.name} successfully updated account password`,
          status: 'Success'
        });
      } else {
        setPasswordError(res.message || 'Failed to update password.');
        addToast('Authentication Failed', res.message || 'Current password incorrect', 'danger');
      }
    } catch (err) {
      setPasswordError('An unexpected error occurred while hashing password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            User Account & Profile Dossier
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal identity credentials, contact details, and account security
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Profile Dossier
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Security & Password
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs font-mono bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30 font-semibold flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-sky-200" />
              {currentUser?.role || 'VERIFIED USER'}
            </span>
            <Badge variant={formData.status === 'Active' ? 'success' : 'danger'}>
              {formData.status}
            </Badge>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 pb-6 relative">
          {/* Hidden File Input for Device Local Storage Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg bg-slate-100 dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                  className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-transform active:scale-95"
                  title="Change portrait photo or upload from device"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {formData.name}
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAvatarPickerOpen(true);
                      setAvatarTab('upload');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 transition-colors shadow-2xs"
                    title="Upload new photo from your computer or device"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formData.role} • {formData.department}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    User ID: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.userId}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Org: <span className="font-medium text-slate-700 dark:text-slate-300">{formData.organization}</span>
                  </span>
                </div>
              </div>
            </div>

            {activeTab === 'profile' && (
              <Button
                variant={isEditing ? 'secondary' : 'gradient'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            )}
          </div>

          {/* Avatar Drawer (Upload from Device / Gallery Presets / Web URL) */}
          {isAvatarPickerOpen && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Update Profile Portrait
                  </span>
                </div>
                <button
                  onClick={() => setIsAvatarPickerOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              {/* Subtabs Header */}
              <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl mb-4 w-fit">
                <button
                  type="button"
                  onClick={() => setAvatarTab('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    avatarTab === 'upload'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTab('presets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    avatarTab === 'presets'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Presets Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTab('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    avatarTab === 'url'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Web URL
                </button>
              </div>

              {/* TAB 1: UPLOAD FROM DEVICE / LOCAL STORAGE */}
              {avatarTab === 'upload' && (
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-900/30 ring-4 ring-blue-500/20'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center py-3">
                        <Loader2 className="w-7 h-7 text-blue-600 animate-spin mb-2" />
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          Optimizing & Saving Photo...
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Storing photo in local browser storage
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 shadow-inner">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Click to browse image from computer or drag & drop here
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          PNG, JPG, JPEG, WebP, GIF (Max 10MB) • Auto-scaled & optimized for fast local storage
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700">
                          <Upload className="w-3.5 h-3.5" />
                          Browse Files on Computer
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Photo Status & Reset Option */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {formData.avatar.startsWith('data:')
                        ? 'Custom photo from device is active'
                        : 'Standard preset avatar is active'}
                    </span>
                    {formData.avatar.startsWith('data:') && (
                      <button
                        type="button"
                        onClick={handleRemoveCustomAvatar}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Reset to Default Avatar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRESET GALLERY */}
              {avatarTab === 'presets' && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                    Select from curated high-resolution portraits:
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {AVATAR_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAvatar(url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-transform hover:scale-105 ${
                          formData.avatar === url ? 'border-blue-600 ring-2 ring-blue-500/40' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        {formData.avatar === url && (
                          <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOM WEB URL */}
              {avatarTab === 'url' && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Paste any external direct image URL:
                  </p>
                  <form onSubmit={handleApplyCustomAvatar} className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... custom photo URL"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <Button type="submit" variant="outline" size="sm" className="text-xs shrink-0">
                      Apply URL
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PROFILE DOSSIER */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 disabled:opacity-80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Official Email</span>
                    {!isPlatformOwner && !isCompanyAdmin && (
                      <span className="text-[10px] text-slate-400 lowercase font-normal">(managed by admin)</span>
                    )}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled={!isEditing || (!isPlatformOwner && !isCompanyAdmin)}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 disabled:opacity-80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 disabled:opacity-80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Office / Residential Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Work Location / Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 disabled:opacity-80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* RBAC Protected Metadata - Strictly Read-Only for Normal Users */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  Authorization Tier & Tenant Assignment (Immutable by User)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Permanent User ID */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Permanent User ID
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={formData.userId}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono font-bold border border-blue-200 dark:border-blue-900/50 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Assigned Role */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Assigned Role
                    </label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={formData.role}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={formData.department}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Tenant Organization
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={formData.organization}
                        className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Joined Date & Account Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Account Registration Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      disabled
                      value={formData.joinedDate}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Account Lifecycle Status
                  </label>
                  <div className="py-2 px-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Active Multi-Tenant Session
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              {isEditing && (
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" size="sm" icon={Save}>
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORD CHANGE */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Cryptographic Password Security
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      SMARTORA hashes all permanent passwords using salted cryptographic digests (SHA-256). Passwords are never stored in plaintext.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Feedback Alerts */}
              {passwordError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      placeholder="Enter your existing password (demo: admin)"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      placeholder="Minimum 5 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Hashing & Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
