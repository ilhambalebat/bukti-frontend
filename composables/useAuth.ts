export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_type: 'free' | 'pro';
  status: 'active' | 'expired';
  expires_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface UserMeResponse {
  success: boolean;
  user: User;
  subscription: Subscription | null;
  is_pro: boolean;
}

export const useAuth = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase as string;

  // Gunakan useCookie untuk penyimpanan token aman (SSR & Client friendly)
  const token = useCookie<string | null>('bukti_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  const user = useState<User | null>('auth_user', () => null);
  const subscription = useState<Subscription | null>('auth_subscription', () => null);
  const isPro = useState<boolean>('auth_is_pro', () => false);
  const isLoading = useState<boolean>('auth_loading', () => false);
  const authError = useState<string | null>('auth_error', () => null);

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  // Ambil profil pengguna saat ini & status subscription
  const fetchMe = async (): Promise<boolean> => {
    if (!token.value) {
      user.value = null;
      subscription.value = null;
      isPro.value = false;
      return false;
    }

    try {
      isLoading.value = true;
      authError.value = null;

      const res = await $fetch<UserMeResponse>(`${apiBase}/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      if (res.success) {
        user.value = res.user;
        subscription.value = res.subscription;
        isPro.value = res.is_pro;
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Gagal mengambil data user /me:', err);
      // Jika token expired / invalid, reset sesi
      token.value = null;
      user.value = null;
      subscription.value = null;
      isPro.value = false;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      authError.value = null;

      const res = await $fetch<AuthResponse>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
      });

      if (res.success && res.token) {
        token.value = res.token;
        user.value = res.user;
        await fetchMe();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.data?.error || err.message || 'Gagal masuk ke akun.';
      authError.value = msg;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Registrasi
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      authError.value = null;

      const res = await $fetch<AuthResponse>(`${apiBase}/auth/register`, {
        method: 'POST',
        body: { email, password },
      });

      if (res.success && res.token) {
        token.value = res.token;
        user.value = res.user;
        await fetchMe();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.data?.error || err.message || 'Gagal mendaftar akun baru.';
      authError.value = msg;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = () => {
    token.value = null;
    user.value = null;
    subscription.value = null;
    isPro.value = false;
    authError.value = null;
    navigateTo('/');
  };

  return {
    token,
    user,
    subscription,
    isPro,
    isLoading,
    authError,
    isLoggedIn,
    login,
    register,
    fetchMe,
    logout,
  };
};
