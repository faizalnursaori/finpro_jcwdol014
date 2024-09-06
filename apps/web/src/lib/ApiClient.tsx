const API_BASE_URL = 'http://localhost:8000/api';

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    // Log the error details for debugging
    console.error('API Error:', response.status, data);
    throw new Error(data.message || 'An error occurred');
  }
  return data;
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  return handleResponse(response);
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}
