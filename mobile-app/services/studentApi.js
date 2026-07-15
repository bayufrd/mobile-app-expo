import { API_BASE_URL } from '../constants/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || 'Permintaan gagal');
    error.details = payload?.details || null;
    throw error;
  }

  return payload;
}

export function getStudents(search = '') {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/students${query}`);
}

export function createStudent(body) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateStudent(id, body) {
  return request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteStudent(id) {
  return request(`/students/${id}`, {
    method: 'DELETE',
  });
}
