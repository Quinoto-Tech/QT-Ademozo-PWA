const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://d0638a438f78.ngrok-free.app';
const CERBERO_URL = import.meta.env.VITE_CERBERO_URL;

export class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}/api/v1${endpoint}`;
    
    console.log('Making API request to:', url);
    console.log('With token:', this.token ? 'Present' : 'Missing');
    console.log('Request options:', options);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log('Authorization header set');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Unauthorized response received');
          throw new Error('UNAUTHORIZED');
        }
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      // Get the raw response text first
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type header:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log('Parsed JSON response:', jsonResponse);
          return jsonResponse;
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          throw new Error('Invalid JSON response from server');
        }
      } else {
        console.log('Response is not JSON. Content-Type:', contentType);
        console.log('Response text:', responseText);
        
        // Try to parse as JSON anyway, in case the content-type header is wrong
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log('API JSON Response data:', jsonResponse);
          return jsonResponse;
        } catch (parseError) {
          console.error('Response is not JSON and cannot be parsed:', parseError);
          throw new Error(`Server returned non-JSON response: ${responseText}`);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication with Cerbero
  async validateTokenWithCerbero(adecashToken: string): Promise<{ token: string } | null> {
    if (!CERBERO_URL) {
      console.error('CERBERO_URL not configured');
      throw new Error('Cerbero URL not configured');
    }

    try {
      console.log('Validating token with Cerbero...');
      
      const response = await fetch(`${CERBERO_URL}/api/adecash/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: adecashToken }),
      });

      console.log('Cerbero response status:', response.status);
      
      if (!response.ok) {
        console.error('Cerbero validation failed:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('Cerbero validation response:', data);
      
      if (data.token) {
        return { token: data.token };
      }
      
      return null;
    } catch (error) {
      console.error('Error validating token with Cerbero:', error);
      return null;
    }
  }

  // Tables
  async callWaiter(tableId: string): Promise<{ number: number; calling: boolean }> {
    return this.request(`/tables/call/${tableId}/`, {
      method: 'POST',
    });
  }

  async cancelWaiterCall(tableId: string): Promise<void> {
    return this.request(`/api/v1/call-cancel/`, {
      method: 'POST',
    });
  }

  async getUnpaidOrders(tableId: string) {
    return this.request(`/tables/${tableId}/unpaid-orders/`);
  }

  // Menu Categories
  async getMenuCategories() {
    return this.request('/menu-categories/');
  }

  // Products
  async getProducts() {
    return this.request('/products/');
  }

  // Menus
  async getMenus() {
    return this.request('/menus/');
  }

  // Orders
  async getOrders() {
    return this.request('/orders/');
  }

  async createOrder(order: any): Promise<{order_number: string, order_take_away_code?: string}> {
    return this.request<{order_number: string, order_take_away_code?: string}>('/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Payments
  async createPayment(payment: { method: string; amount: string; payment_type?: 'credit' | 'mercado_pago' | 'cash' }) {
    return this.request('/payments/', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // Offers
  async getOffers() {
    return this.request('/offers/');
  }

  // Credit Line
  async updateCreditLine(curp: string, amount: number) {
    return this.request(`/users/${curp}/credit-line/`, {
      method: 'PATCH',
      body: JSON.stringify({ remaining_credit_line: amount }),
    });
  }
}

export const apiClient = new ApiClient();