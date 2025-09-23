import { API_BASE_URL } from './api';

export const testApiConnection = async (): Promise<{ success: boolean; message: string; url: string }> => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    
    // Try the API endpoint that actually exists
    const response = await fetch(`${API_BASE_URL}/api/index`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // If that fails, try a simple GET to see if server responds
    if (!response.ok) {
      const healthResponse = await fetch(`${API_BASE_URL}/api/faults`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (healthResponse.ok) {
        return {
          success: true,
          message: 'API connection successful',
          url: API_BASE_URL
        };
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return {
      success: true,
      message: 'API connection successful',
      url: API_BASE_URL
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      url: API_BASE_URL
    };
  }
};