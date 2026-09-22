// Hotel Rooms & Suites Management Matrix for SMARTORA
// Property room availability, floor grid, rates, and turnover status

import React, { useState, useMemo } from 'react';
import {
  BedDouble,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Plus,
  Search,
  Filter,
  DollarSign,
  Users,
  Wrench,
  ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function HotelRoomsPage({ onNavigate }) {
  const {
    rooms = [],
    updateRoomStatus,
    addRoom,
    currentOrganization
  } = useData();
  const { addToast } = useToast();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // New Room Form
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: 'Deluxe Suite',
    floor: '1st Floor',
    capacity: 2,
    price: 4500,
    status: 'AVAILABLE',
    amenities: ['King Bed', 'High-Speed Wi-Fi', 'Smart TV']
  });

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      const matchSearch = r.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guestName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [rooms, searchQuery, filterStatus]);

  // Status counts
  const availableCount = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedCount = rooms.filter(r => r.status === 'OCCUPIED').length;
  const cleaningCount = rooms.filter(r => r.status === 'CLEANING').length;
  const maintenanceCount = rooms.filter(r => r.status === 'MAINTENANCE').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedCount / rooms.length) * 100) : 0;

  const handleStatusChange = (roomId, newStatus) => {
    updateRoomStatus(roomId, newStatus);
    addToast('Room Status Updated', `Room ${roomId} updated to ${newStatus}.`, 'success');
  };

  const handleAddRoomSubmit = (e) => {
    e.preventDefault();
    if (!roomForm.roomNumber) return;
    addRoom(roomForm);
    setIsAddRoomModalOpen(false);
    setRoomForm({
      roomNumber: '',
      type: 'Deluxe Suite',
      floor: '1st Floor',
      capacity: 2,
      price: 4500,
      status: 'AVAILABLE',
      amenities: ['King Bed', 'High-Speed Wi-Fi', 'Smart TV']
    });
    addToast('Room Added', `Added Room ${roomForm.roomNumber} to property matrix.`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">Available</Badge>;
      case 'OCCUPIED':
        return <Badge variant="info">Occupied</Badge>;
      case 'CLEANING':
        return <Badge variant="warning">Cleaning</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="danger">Maintenance</Badge>;
      case 'RESERVED':
        return <Badge variant="purple">Reserved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'border-emerald-500/30 hover:border-emerald-500';
      case 'OCCUPIED':
        return 'border-blue-500/30 hover:border-blue-500';
      case 'CLEANING':
        return 'border-amber-500/30 hover:border-amber-500';
      case 'MAINTENANCE':
        return 'border-rose-500/30 hover:border-rose-500';
      case 'RESERVED':
        return 'border-purple-500/30 hover:border-purple-500';
      default:
        return 'border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-800 text-white shadow-xl shadow-sky-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Resort & Hospitality Matrix
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name || 'Grand Mirage Resort'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rooms & Suites Inventory
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Real-time occupancy tracking, housekeeping turnaround, and guest check-in allocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddRoomModalOpen(true)}
            className="bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Room / Suite
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate && onNavigate('front-desk')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Front Desk Console
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Keys"
          value={rooms.length}
          change={`${occupancyRate}% Occupied`}
          isPositive={true}
          icon={BedDouble}
          color="blue"
        />
        <StatCard
          title="Available for Check-in"
          value={availableCount}
          change="Clean & Ready"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Currently Occupied"
          value={occupiedCount}
          change="In-House Guests"
          isPositive={true}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Turnover / Cleaning"
          value={cleaningCount}
          change={cleaningCount > 0 ? "Housekeeping Alert" : "All Clean"}
          isPositive={cleaningCount === 0}
          icon={Clock}
          color={cleaningCount > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Keys ({rooms.length})
          </button>
          <button
            onClick={() => setFilterStatus('AVAILABLE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'AVAILABLE'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            onClick={() => setFilterStatus('OCCUPIED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'OCCUPIED'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Occupied ({occupiedCount})
          </button>
          <button
            onClick={() => setFilterStatus('CLEANING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'CLEANING'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Cleaning ({cleaningCount})
          </button>
          <button
            onClick={() => setFilterStatus('MAINTENANCE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'MAINTENANCE'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Maintenance ({maintenanceCount})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search room no, guest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Room Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${getStatusBorder(room.status)}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                    #{room.roomNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {room.floor}
                  </span>
                </div>
                {getStatusBadge(room.status)}
              </div>

              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {room.type}
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                ₹{room.price?.toLocaleString()} / night
              </p>

              {/* Occupant or Notice */}
              {room.status === 'OCCUPIED' && room.guestName && (
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest In-House</span>
                  <span className="font-bold text-slate-900 dark:text-white">{room.guestName}</span>
                  {room.checkOut && (
                    <span className="text-slate-500 block text-[11px] mt-0.5">Check-out: {room.checkOut}</span>
                  )}
                </div>
              )}

              {room.status === 'RESERVED' && room.guestName && (
                <div className="mt-3 p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-xs">
                  <span className="text-purple-400 block text-[10px] uppercase font-bold">Upcoming Arrival</span>
                  <span className="font-bold text-slate-900 dark:text-white">{room.guestName}</span>
                  {room.checkIn && (
                    <span className="text-slate-500 block text-[11px] mt-0.5">Check-in: {room.checkIn}</span>
                  )}
                </div>
              )}

              {room.status === 'CLEANING' && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Housekeeping turnover in progress</span>
                </div>
              )}

              {room.status === 'MAINTENANCE' && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-xs flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-rose-800 dark:text-rose-300 font-medium">{room.maintenanceReason || 'Under engineering service'}</span>
                </div>
              )}

              {/* Amenities tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(room.amenities || []).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Status Toggle Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Set status:</span>
              <div className="flex items-center gap-1">
                {room.status !== 'AVAILABLE' && (
                  <button
                    onClick={() => handleStatusChange(room.roomNumber, 'AVAILABLE')}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                    title="Mark Clean & Available"
                  >
                    Available
                  </button>
                )}
                {room.status !== 'CLEANING' && room.status !== 'MAINTENANCE' && (
                  <button
                    onClick={() => handleStatusChange(room.roomNumber, 'CLEANING')}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200"
                    title="Send Housekeeping"
                  >
                    Clean
                  </button>
                )}
                {room.status !== 'MAINTENANCE' && (
                  <button
                    onClick={() => handleStatusChange(room.roomNumber, 'MAINTENANCE')}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                    title="Mark Maintenance"
                  >
                    Maint
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Room */}
      <Modal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        title="Add Property Room / Suite"
      >
        <form onSubmit={handleAddRoomSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Room Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 301"
                value={roomForm.roomNumber}
                onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Floor</label>
              <select
                value={roomForm.floor}
                onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="Penthouse Level">Penthouse Level</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Suite Category</label>
              <select
                value={roomForm.type}
                onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Standard Luxury">Standard Luxury</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Villa">Executive Villa</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nightly Tariff (₹)</label>
              <input
                type="number"
                value={roomForm.price}
                onChange={(e) => setRoomForm({ ...roomForm, price: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddRoomModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Create Key</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
