import { API_BASE_URL } from './api';

export const testApiConnection = async (): Promise<{ success: boolean; message: string; url: string }> => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      message: data.message || 'API connection successful',
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