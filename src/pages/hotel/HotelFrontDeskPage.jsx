// Hotel Front Desk & Reception Console for SMARTORA
// Real-time guest check-in, check-out, room key assignment, and reservation folio

import React, { useState, useMemo } from 'react';
import {
  ConciergeBell,
  Users,
  Calendar,
  Key,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Search,
  BedDouble,
  DollarSign,
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function HotelFrontDeskPage({ onNavigate }) {
  const {
    reservations = [],
    rooms = [],
    guests = [],
    addReservation,
    updateReservationStatus,
    updateRoomStatus,
    currentOrganization
  } = useData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('arrivals');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);

  // Reservation form
  const [resvForm, setResvForm] = useState({
    guestName: '',
    guestPhone: '',
    roomNumber: '102',
    roomType: 'Deluxe Suite',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    guests: 2,
    total: 9000,
    paid: 0
  });

  // Filtered reservations
  const arrivals = useMemo(() => {
    return reservations.filter(r => r.status === 'CONFIRMED');
  }, [reservations]);

  const inHouse = useMemo(() => {
    return reservations.filter(r => r.status === 'CHECKED_IN');
  }, [reservations]);

  const checkedOut = useMemo(() => {
    return reservations.filter(r => r.status === 'CHECKED_OUT');
  }, [reservations]);

  const handleCheckIn = (resv) => {
    updateReservationStatus(resv.id, 'CHECKED_IN');
    updateRoomStatus(resv.roomNumber, 'OCCUPIED', { guestName: resv.guestName, checkOut: resv.checkOut });
    addToast('Guest Checked In', `${resv.guestName} successfully checked into Room ${resv.roomNumber}.`, 'success');
  };

  const handleCheckOut = (resv) => {
    updateReservationStatus(resv.id, 'CHECKED_OUT');
    updateRoomStatus(resv.roomNumber, 'CLEANING', { guestName: null, checkOut: null });
    addToast('Guest Checked Out', `${resv.guestName} checked out of Room ${resv.roomNumber}. Turnover assigned to Housekeeping.`, 'info');
  };

  const handleCreateReservation = (e) => {
    e.preventDefault();
    if (!resvForm.guestName.trim()) return;

    addReservation(resvForm);
    setIsNewReservationModalOpen(false);
    setResvForm({
      guestName: '',
      guestPhone: '',
      roomNumber: '102',
      roomType: 'Deluxe Suite',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      guests: 2,
      total: 9000,
      paid: 0
    });
    addToast('Reservation Created', `Confirmed reservation for ${resvForm.guestName} in Room ${resvForm.roomNumber}.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-800 text-white shadow-xl shadow-sky-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              Front Office Operations
            </span>
            <span className="text-xs text-blue-100">
              • {currentOrganization?.name || 'Grand Mirage Resort'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Front Desk & Guest Arrival Console
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1">
            Seamless guest arrival check-in, key card issuance, and folio settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsNewReservationModalOpen(true)}
            className="bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Reservation / Walk-in
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate && onNavigate('rooms')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
          >
            Room Matrix
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Expected Arrivals"
          value={arrivals.length}
          change="Today's Manifest"
          isPositive={true}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="In-House Guests"
          value={inHouse.length}
          change="Checked In"
          isPositive={true}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Turnovers Completed"
          value={checkedOut.length}
          change="Departures"
          isPositive={true}
          icon={CheckCircle2}
          color="cyan"
        />
        <StatCard
          title="Total Registered Guests"
          value={guests.length}
          change="Profile Records"
          isPositive={true}
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'arrivals'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Pending Check-ins ({arrivals.length})
          </button>
          <button
            onClick={() => setActiveTab('inhouse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inhouse'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            In-House Guests ({inHouse.length})
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guests'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Guest Directory ({guests.length})
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guest, phone, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Tab: Arrivals */}
      {activeTab === 'arrivals' && (
        <div className="space-y-3">
          {arrivals.map(resv => (
            <div
              key={resv.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0 font-mono font-black text-sm">
                  #{resv.roomNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {resv.guestName}
                    </h3>
                    <Badge variant="purple">Confirmed Arrival</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {resv.roomType} • {resv.guests} Guests • {resv.checkIn} to {resv.checkOut}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    Phone: {resv.guestPhone} | Folio: ₹{resv.total?.toLocaleString()} ({resv.paymentStatus})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  size="sm"
                  onClick={() => handleCheckIn(resv)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  <Key className="w-3.5 h-3.5 mr-1.5" />
                  Issue Key & Check-In
                </Button>
              </div>
            </div>
          ))}

          {arrivals.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No pending arrivals scheduled for today.
            </div>
          )}
        </div>
      )}

      {/* Tab: In-House Guests */}
      {activeTab === 'inhouse' && (
        <div className="space-y-3">
          {inHouse.map(resv => (
            <div
              key={resv.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0 font-mono font-black text-sm">
                  #{resv.roomNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {resv.guestName}
                    </h3>
                    <Badge variant="success">In-House</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {resv.roomType} • Check-out Due: <span className="font-bold text-slate-700 dark:text-slate-300">{resv.checkOut}</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    Phone: {resv.guestPhone} | Total Bill: ₹{resv.total?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCheckOut(resv)}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  Process Check-Out
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Guest Directory */}
      {activeTab === 'guests' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Guest Name</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Origin City</th>
                  <th className="px-5 py-3">Statutory ID Proof</th>
                  <th className="px-5 py-3">Total Stays</th>
                  <th className="px-5 py-3">Current Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {guests.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {g.name}
                    </td>
                    <td className="px-5 py-3.5">
                      {g.phone} <span className="block text-[10px] text-slate-400">{g.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {g.city}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                        {g.idProof}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-blue-600 dark:text-blue-400">
                      {g.totalStays} Stays
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {g.currentRoom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Reservation */}
      <Modal
        isOpen={isNewReservationModalOpen}
        onClose={() => setIsNewReservationModalOpen(false)}
        title="New Guest Reservation / Walk-in"
      >
        <form onSubmit={handleCreateReservation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Guest Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikramaditya Hegde"
              value={resvForm.guestName}
              onChange={(e) => setResvForm({ ...resvForm, guestName: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98000 00000"
                value={resvForm.guestPhone}
                onChange={(e) => setResvForm({ ...resvForm, guestPhone: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Room</label>
              <select
                value={resvForm.roomNumber}
                onChange={(e) => setResvForm({ ...resvForm, roomNumber: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.roomNumber}>
                    #{r.roomNumber} - {r.type} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Check-in Date</label>
              <input
                type="date"
                required
                value={resvForm.checkIn}
                onChange={(e) => setResvForm({ ...resvForm, checkIn: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Check-out Date</label>
              <input
                type="date"
                required
                value={resvForm.checkOut}
                onChange={(e) => setResvForm({ ...resvForm, checkOut: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Guests Count</label>
              <input
                type="number"
                min="1"
                max="6"
                value={resvForm.guests}
                onChange={(e) => setResvForm({ ...resvForm, guests: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Tariff (₹)</label>
              <input
                type="number"
                value={resvForm.total}
                onChange={(e) => setResvForm({ ...resvForm, total: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNewReservationModalOpen(false)}>Cancel</Button>
            <Button size="sm" type="submit">Confirm Reservation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
