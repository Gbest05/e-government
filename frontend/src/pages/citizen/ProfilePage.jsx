import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService, uploadFile, getFileUrl } from '../../services/api';
import { User, Mail, Phone, MapPin, Lock, CheckCircle2, AlertCircle, Save, KeyRound, Camera, Trash2, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    community_area: user?.community_area || 'Isara-Remo'
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErr, setProfileErr] = useState(null);
  const [passMsg, setPassMsg] = useState(null);
  const [passErr, setPassErr] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const communities = [
    'Isara-Remo',
    'Ode-Remo',
    'Ipara-Remo',
    'Akaka-Remo',
    'Ilara-Remo',
    'Orile-Oko'
  ];

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileErr('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploadingAvatar(true);
    setProfileErr(null);
    setProfileMsg(null);

    try {
      const uploaded = await uploadFile(file, 'avatars');
      if (uploaded?.url) {
        const res = await authService.updateProfile({ profile_image: uploaded.url });
        updateUser(res.data.user);
        setProfileMsg('Profile picture updated successfully!');
      }
    } catch (err) {
      setProfileErr(err.response?.data?.error || 'Failed to upload profile picture.');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    setProfileErr(null);
    setProfileMsg(null);

    try {
      const res = await authService.updateProfile({ profile_image: '' });
      updateUser(res.data.user);
      setProfileMsg('Profile picture removed.');
    } catch (err) {
      setProfileErr(err.response?.data?.error || 'Failed to remove profile picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    setSavingProfile(true);

    try {
      const res = await authService.updateProfile(profileForm);
      updateUser(res.data.user);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileErr(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    setPassErr(null);

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPassErr('New passwords do not match.');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setPassErr('Password must be at least 6 characters.');
      return;
    }

    setSavingPass(true);
    try {
      await authService.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPassMsg('Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPassErr(err.response?.data?.error || 'Password update failed. Verify current password.');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-civic-700 tracking-wider uppercase">Account Management</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          My Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal information, profile photo, local area residential ward, and password credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary Card with Avatar Uploader */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4 h-fit">
          <div className="relative w-24 h-24 mx-auto">
            {user?.profile_image ? (
              <img
                src={getFileUrl(user.profile_image)}
                alt={user?.full_name}
                className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-civic-600"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-civic-800 text-white font-black text-3xl flex items-center justify-center shadow-md border-2 border-civic-600">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            )}

            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 bg-civic-800 hover:bg-civic-900 text-white rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              title="Upload Profile Picture"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-xs font-bold text-civic-800 hover:text-civic-900 hover:underline inline-block"
            >
              {uploadingAvatar ? 'Uploading Picture...' : 'Change Profile Photo'}
            </button>

            {user?.profile_image && (
              <div>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.full_name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-civic-100 text-civic-800 border border-civic-200">
              {user?.role} ACCOUNT
            </span>
          </div>
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1 text-left">
            <div>
              <span className="text-slate-400 block text-[10px]">Registered Community:</span>
              <strong className="text-slate-800">{user?.community_area || 'Not set'}</strong>
            </div>
            {user?.department_name && (
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px]">Department:</span>
                <strong className="text-slate-800">{user?.department_name}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-civic-700" />
              <span>Personal Information</span>
            </h3>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileMsg}</span>
              </div>
            )}

            {profileErr && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileErr}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remo North Community</label>
                <select
                  value={profileForm.community_area}
                  onChange={(e) => setProfileForm({ ...profileForm, community_area: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 text-slate-800"
                >
                  {communities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2 bg-civic-800 hover:bg-civic-900 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-4 h-4 text-civic-700" />
              <span>Change Security Password</span>
            </h3>

            {passMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passMsg}</span>
              </div>
            )}

            {passErr && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passErr}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password * (min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-civic-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingPass}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{savingPass ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
