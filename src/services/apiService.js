// Centralized Backend API Service for SMARTORA
// Connects frontend to Express + MongoDB backend with permanent persistence

const API_BASE = '/api';

const TOKEN_KEY = 'smartora_auth_token';

export const apiService = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  setToken: (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Error saving auth token:', e);
    }
  },

  clearToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Error clearing auth token:', e);
    }
  },

  getAuthHeaders: () => {
    const token = apiService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  /**
   * Universal Login using User ID + Password
   */
  login: async (userId, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        apiService.setToken(data.token);
      }
      return data;
    } catch (err) {
      console.warn('[API Service] Backend login failed, falling back:', err.message);
      return { success: false, message: 'Could not connect to authentication server.' };
    }
  },

  /**
   * Restore Session & Get Current Profile
   */
  getMe: async () => {
    const token = apiService.getToken();
    if (!token) return { success: false };

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: apiService.getAuthHeaders()
      });
      return await response.json();
    } catch (err) {
      console.warn('[API Service] Failed to restore session from server:', err.message);
      return { success: false };
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: apiService.getAuthHeaders()
      });
    } catch (e) {
      // Ignore network error on logout
    } finally {
      apiService.clearToken();
    }
  },

  /**
   * Update Profile Details permanently to MongoDB
   */
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(profileData)
      });
      return await response.json();
    } catch (err) {
      console.error('[API Service] Failed to save profile to database:', err);
      return { success: false, message: 'Network error saving profile to server.' };
    }
  },

  /**
   * Upload and Persist Profile Photo
   */
  uploadProfilePhoto: async (fileOrBase64, fileName = 'profile.jpg') => {
    try {
      if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:image/')) {
        // Send base64 JSON payload
        const response = await fetch(`${API_BASE}/profile/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...apiService.getAuthHeaders()
          },
          body: JSON.stringify({ photoData: fileOrBase64, fileName })
        });
        return await response.json();
      } else if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
        // Send multipart form-data
        const formData = new FormData();
        formData.append('photo', fileOrBase64, fileName || fileOrBase64.name);

        const response = await fetch(`${API_BASE}/profile/photo`, {
          method: 'POST',
          headers: apiService.getAuthHeaders(),
          body: formData
        });
        return await response.json();
      }
      return { success: false, message: 'Invalid image format provided.' };
    } catch (err) {
      console.error('[API Service] Failed to upload photo to server:', err);
      return { success: false, message: 'Network error uploading profile photo.' };
    }
  },

  /**
   * Change Password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Error changing password.' };
    }
  },

  /**
   * Update Company Profile
   */
  updateCompany: async (companyId, companyData) => {
    try {
      const response = await fetch(`${API_BASE}/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(companyData)
      });
      return await response.json();
    } catch (err) {
      return { success: false, message: 'Failed to update company profile.' };
    }
  },

  // --- EMPLOYEE & WORKFORCE MANAGEMENT ---
  getEmployees: async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        headers: apiService.getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, employees: [] };
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(employeeData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: e.message || 'Error communicating with employee API.' };
    }
  },

  updateEmployee: async (employeeId, data) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- ACADEMIC / COLLEGE API ---
  getAcademicCourses: async () => {
    try {
      const res = await fetch(`${API_BASE}/academic/courses`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, courses: [] }; }
  },

  getAcademicSubjects: async () => {
    try {
      const res = await fetch(`${API_BASE}/academic/subjects`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, subjects: [] }; }
  },

  getAcademicExams: async () => {
    try {
      const res = await fetch(`${API_BASE}/academic/exams`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, exams: [] }; }
  },

  getAcademicResults: async (studentId = null) => {
    try {
      const url = studentId ? `${API_BASE}/academic/results?studentId=${studentId}` : `${API_BASE}/academic/results`;
      const res = await fetch(url, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, results: [] }; }
  },

  getAcademicStudents: async () => {
    try {
      const res = await fetch(`${API_BASE}/academic/students`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, students: [] }; }
  },

  enrollStudent: async (studentData) => {
    try {
      const res = await fetch(`${API_BASE}/academic/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(studentData)
      });
      return await res.json();
    } catch (e) { return { success: false, message: e.message }; }
  },

  getAcademicNotices: async () => {
    try {
      const res = await fetch(`${API_BASE}/academic/notices`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, notices: [] }; }
  },

  // --- HOSPITALITY / HOTEL API ---
  getHotelRooms: async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitality/rooms`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, rooms: [] }; }
  },

  updateHotelRoomStatus: async (roomId, status) => {
    try {
      const res = await fetch(`${API_BASE}/hospitality/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) { return { success: false }; }
  },

  getHotelReservations: async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitality/reservations`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, reservations: [] }; }
  },

  getHotelGuests: async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitality/guests`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, guests: [] }; }
  },

  getHotelHousekeeping: async () => {
    try {
      const res = await fetch(`${API_BASE}/hospitality/housekeeping`, { headers: apiService.getAuthHeaders() });
      return await res.json();
    } catch (e) { return { success: false, housekeeping: [] }; }
  },

  // --- EMPLOYEE MANAGEMENT & DELETION ---
  deleteEmployee: async (employeeId, permanent = false) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${encodeURIComponent(employeeId)}?permanent=${permanent}`, {
        method: 'DELETE',
        headers: apiService.getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Could not connect to server to delete account.' };
    }
  },

  updateEmployeeStatus: async (employeeId, status) => {
    try {
      const res = await fetch(`${API_BASE}/employees/${encodeURIComponent(employeeId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Could not connect to server to update status.' };
    }
  },

  // --- FINANCE TRANSACTIONS & P&L ---
  getTransactions: async (params = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/finance/transactions?${qs}`, {
        headers: apiService.getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, transactions: [] };
    }
  },

  createTransaction: async (txnData) => {
    try {
      const res = await fetch(`${API_BASE}/finance/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify(txnData)
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to record transaction on server.' };
    }
  },

  updateTransactionStatus: async (transactionId, status, notes = '') => {
    try {
      const res = await fetch(`${API_BASE}/finance/transactions/${encodeURIComponent(transactionId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiService.getAuthHeaders()
        },
        body: JSON.stringify({ status, notes })
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Failed to update transaction status.' };
    }
  },

  getFinanceSummary: async (params = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/finance/summary?${qs}`, {
        headers: apiService.getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, summary: null };
    }
  },

  getFinanceCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/finance/categories`, {
        headers: apiService.getAuthHeaders()
      });
      return await res.json();
    } catch (e) {
      return { success: false, categories: { income: [], expense: [] } };
    }
  }
};

