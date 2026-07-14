// ETOOL Frontend API Client

export const API_BASE = '/api';

export const API = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/signup`,
    LOGOUT: `${API_BASE}/auth/logout`,
    CHECK: `${API_BASE}/auth/check`,
    VERIFY_2FA: `${API_BASE}/auth/verify-2fa`
  },
  USER: {
    PROFILE: `${API_BASE}/user/profile`,
    CATEGORY_SETUP: `${API_BASE}/user/category-setup`,
    VERIFY_CATEGORY: `${API_BASE}/verify-category-setup`,
    ENABLE_2FA: `${API_BASE}/user/2fa/enable`,
    CONFIRM_2FA: `${API_BASE}/user/2fa/confirm`,
    DISABLE_2FA: `${API_BASE}/user/2fa/disable`
  },
  OCR: {
    PROCESS: `${API_BASE}/ocr/process`,
    PROCESSED: `${API_BASE}/ocr/processed`,
    DETAIL: (id) => `${API_BASE}/ocr/processed/${id}`,
    LINK_CRM: (id) => `${API_BASE}/ocr/processed/${id}/link-crm`
  },
  CRM: {
    CONTACTS: `${API_BASE}/crm/contacts`,
    DETAIL: (id) => `${API_BASE}/crm/contacts/${id}`
  },
  PAYPAL: {
    CREATE_ORDER: `${API_BASE}/paypal/create-order`,
    EXECUTE: `${API_BASE}/paypal/execute-payment`
  },
  DASHBOARD: {
    STATS: `${API_BASE}/dashboard/stats`
  },
  HEALTH: `${API_BASE}/health`
};

export async function apiFetch(url, options = {}) {
  const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase());
  const config = {
    credentials: 'include', // Important to send/receive cookies
    headers: {
      ...(isBodyMethod ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(url, config);
  
  let body = null;
  try {
    body = await response.json();
  } catch (e) {
    // Response might not be JSON
  }

  if (!response.ok) {
    const errorMsg = (body && (body.detail || body.error || body.message)) || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }

  return body;
}

export const authApi = {
  login: (email, password) => 
    apiFetch(API.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  verify2fa: (email, code) =>
    apiFetch(API.AUTH.VERIFY_2FA, {
      method: 'POST',
      body: JSON.stringify({ email, code })
    }),
  signup: (firstName, lastName, email, password) =>
    apiFetch(API.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password })
    }),
  logout: () => 
    apiFetch(API.AUTH.LOGOUT, { method: 'POST' }),
  checkAuth: () => 
    apiFetch(API.AUTH.CHECK)
};

export const userApi = {
  getProfile: () => apiFetch(API.USER.PROFILE),
  saveCategorySetup: (data) => 
    apiFetch(API.USER.CATEGORY_SETUP, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  verifyCategorySetup: () => apiFetch(API.USER.VERIFY_CATEGORY),
  enable2fa: () => apiFetch(API.USER.ENABLE_2FA, { method: 'POST' }),
  confirm2fa: (code) => 
    apiFetch(API.USER.CONFIRM_2FA, {
      method: 'POST',
      body: JSON.stringify({ code })
    }),
  disable2fa: () => apiFetch(API.USER.DISABLE_2FA, { method: 'POST' })
};

export const ocrApi = {
  process: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiFetch(API.OCR.PROCESS, {
      method: 'POST',
      // Let browser set the content type with boundaries
      headers: {}, 
      body: formData
    });
  },
  getProcessed: () => apiFetch(API.OCR.PROCESSED),
  deleteProcessed: (id) => apiFetch(API.OCR.DETAIL(id), { method: 'DELETE' }),
  linkCrm: (id) => apiFetch(API.OCR.LINK_CRM(id), { method: 'POST' })
};

export const crmApi = {
  getContacts: () => apiFetch(API.CRM.CONTACTS),
  createContact: (contactData) => 
    apiFetch(API.CRM.CONTACTS, {
      method: 'POST',
      body: JSON.stringify(contactData)
    }),
  updateContact: (id, contactData) => 
    apiFetch(API.CRM.DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(contactData)
    }),
  deleteContact: (id) => 
    apiFetch(API.CRM.DETAIL(id), {
      method: 'DELETE'
    })
};

export const paypalApi = {
  createOrder: (planName) => 
    apiFetch(API.PAYPAL.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify({ planName })
    }),
  executePayment: (orderID, planName) => 
    apiFetch(API.PAYPAL.EXECUTE, {
      method: 'POST',
      body: JSON.stringify({ orderID, planName })
    })
};

export const dashboardApi = {
  getStats: () => apiFetch(API.DASHBOARD.STATS)
};
