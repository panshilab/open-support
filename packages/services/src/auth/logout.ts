import axios from '../axios';

export async function logout() {
  await axios.post<{ ok: boolean }>('/auth/logout');
}
