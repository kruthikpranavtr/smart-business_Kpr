import mongoose from 'mongoose';
import { diskStore } from '../config/db.js';
import { matchesTenant } from '../utils/tenantUtils.js';

export const HospitalityModel = {
  getRooms: async (orgId) => {
    const list = diskStore.readCollection('hotel_rooms', [
      { id: 'RM-101', roomNumber: '101', type: 'Deluxe Suite', floor: '1st Floor', capacity: 2, price: 4500, status: 'OCCUPIED', guestName: 'Vikramaditya Hegde', checkOut: '2026-09-24', amenities: ['King Bed', 'Balcony', 'High-Speed Wi-Fi', 'Mini Bar'], organizationId: 'SMR-CMP-0002' },
      { id: 'RM-102', roomNumber: '102', type: 'Deluxe Suite', floor: '1st Floor', capacity: 2, price: 4500, status: 'AVAILABLE', amenities: ['King Bed', 'Garden View', 'High-Speed Wi-Fi'], organizationId: 'SMR-CMP-0002' },
      { id: 'RM-103', roomNumber: '103', type: 'Standard Luxury', floor: '1st Floor', capacity: 2, price: 3200, status: 'CLEANING', amenities: ['Queen Bed', 'Smart TV', 'Work Desk'], organizationId: 'SMR-CMP-0002' },
      { id: 'RM-201', roomNumber: '201', type: 'Executive Villa', floor: '2nd Floor', capacity: 4, price: 8500, status: 'RESERVED', guestName: 'Sarah Jenkins', checkIn: '2026-09-23', amenities: ['Private Jacuzzi', 'Sunset View', 'Complimentary Breakfast'], organizationId: 'SMR-CMP-0002' },
      { id: 'RM-202', roomNumber: '202', type: 'Executive Villa', floor: '2nd Floor', capacity: 4, price: 8500, status: 'MAINTENANCE', maintenanceReason: 'AC Servicing in progress', organizationId: 'SMR-CMP-0002' },
      { id: 'RM-203', roomNumber: '203', type: 'Standard Luxury', floor: '2nd Floor', capacity: 2, price: 3200, status: 'AVAILABLE', amenities: ['Queen Bed', 'Pool View', 'Smart TV'], organizationId: 'SMR-CMP-0002' }
    ]);
    if (!orgId) return list;
    return list.filter(r => matchesTenant(r, orgId));
  },

  updateRoomStatus: async (roomId, status, orgId) => {
    const list = diskStore.readCollection('hotel_rooms', []);
    const idx = list.findIndex(r => r.id === roomId || r.roomNumber === roomId);
    if (idx === -1) return null;
    if (orgId && !matchesTenant(list[idx], orgId)) return null;

    list[idx].status = status;
    list[idx].updatedAt = new Date().toISOString();
    diskStore.writeCollection('hotel_rooms', list);
    return list[idx];
  },

  getReservations: async (orgId) => {
    const list = diskStore.readCollection('hotel_reservations', [
      { id: 'RESV-801', guestName: 'Vikramaditya Hegde', guestPhone: '+91 97312 33456', roomNumber: '101', roomType: 'Deluxe Suite', checkIn: '2026-09-21', checkOut: '2026-09-24', guests: 2, total: 13500, paid: 13500, status: 'CHECKED_IN', paymentStatus: 'Paid', organizationId: 'SMR-CMP-0002' },
      { id: 'RESV-802', guestName: 'Sarah Jenkins', guestPhone: '+91 98450 67890', roomNumber: '201', roomType: 'Executive Villa', checkIn: '2026-09-23', checkOut: '2026-09-26', guests: 3, total: 25500, paid: 10000, status: 'CONFIRMED', paymentStatus: 'Partial', organizationId: 'SMR-CMP-0002' },
      { id: 'RESV-803', guestName: 'Karan Mehta', guestPhone: '+91 98200 45678', roomNumber: '102', roomType: 'Deluxe Suite', checkIn: '2026-09-25', checkOut: '2026-09-28', guests: 2, total: 13500, paid: 0, status: 'CONFIRMED', paymentStatus: 'Pending', organizationId: 'SMR-CMP-0002' }
    ]);
    if (!orgId) return list;
    return list.filter(r => matchesTenant(r, orgId));
  },

  getGuests: async (orgId) => {
    const list = diskStore.readCollection('hotel_guests', [
      { id: 'GST-01', name: 'Vikramaditya Hegde', phone: '+91 97312 33456', email: 'vikram@nexacorp.demo', city: 'Bengaluru', idProof: 'Aadhaar Verified', totalStays: 4, currentRoom: '101', organizationId: 'SMR-CMP-0002' },
      { id: 'GST-02', name: 'Sarah Jenkins', phone: '+91 98450 67890', email: 'sarah.j@globex.demo', city: 'London, UK', idProof: 'Passport Verified', totalStays: 2, currentRoom: 'Reserved (201)', organizationId: 'SMR-CMP-0002' },
      { id: 'GST-03', name: 'Karan Mehta', phone: '+91 98200 45678', email: 'karan.m@zenith.demo', city: 'Mumbai', idProof: 'DL Verified', totalStays: 1, currentRoom: 'Upcoming (102)', organizationId: 'SMR-CMP-0002' }
    ]);
    if (!orgId) return list;
    return list.filter(g => matchesTenant(g, orgId));
  },

  getHousekeeping: async (orgId) => {
    const list = diskStore.readCollection('hotel_housekeeping', [
      { id: 'HK-01', roomNumber: '103', type: 'Standard Luxury', state: 'DIRTY', priority: 'High', assignedStaff: 'Priya Sharma (PRIYA-HOUSEKEEPING-001)', notes: 'Full turnover after 3-day stay', organizationId: 'SMR-CMP-0002' },
      { id: 'HK-02', roomNumber: '202', type: 'Executive Villa', state: 'MAINTENANCE', priority: 'Urgent', assignedStaff: 'Maintenance Team', notes: 'AC Compressor repair', organizationId: 'SMR-CMP-0002' },
      { id: 'HK-03', roomNumber: '102', type: 'Deluxe Suite', state: 'CLEAN', priority: 'Normal', assignedStaff: 'Priya Sharma', notes: 'Turnover completed, ready for inspection', organizationId: 'SMR-CMP-0002' }
    ]);
    if (!orgId) return list;
    return list.filter(h => matchesTenant(h, orgId));
  }
};
