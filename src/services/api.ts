// src/services/api.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000,
    withCredentials: true,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        console.error('🚨 Request Interceptor Error:', error.message);
        return Promise.reject(error);
    }
);

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            console.error('❌ API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
                method: error.config?.method,
            });

            if (error.response.status === 401) {
                console.warn('🔒 Unauthorized - Redirecting to login');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// ===============================
// AUTH SERVICES
// ===============================
export const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data));
            }
            return response.data;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    getToken: () => localStorage.getItem('token'),
    changePassword: async (data: { currentPassword: string; newPassword: string }) => {
        try {
            const response = await api.post('/auth/change-password', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error changing password:', error);
            throw error;
        }
    },
};

// ===============================
// USER SERVICES (SuperAdmin Only)
// ===============================
export const userService = {
    /**
     * Get all users (Super Admin only)
     * GET /api/auth/users
     */
    getAll: async (params?: { role?: string; search?: string }) => {
        try {
            const response = await api.get('/auth/users', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            throw error;
        }
    },

    /**
     * Get users by role (Super Admin only)
     * GET /api/auth/users/role/:role
     */
    getByRole: async (role: string) => {
        try {
            const response = await api.get(`/auth/users/role/${role}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching users by role:', error);
            throw error;
        }
    },

    /**
     * Create new user (Super Admin only)
     * POST /api/auth/register
     */
    create: async (userData: {
        name: string;
        email: string;
        password?: string;
        role?: string;
        department?: string;
    }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            throw error;
        }
    },

    /**
     * Update user (Super Admin only)
     * PUT /api/auth/users/:id
     */
    update: async (id: string, userData: {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
        department?: string;
        isActive?: boolean;
    }) => {
        try {
            const response = await api.put(`/auth/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            throw error;
        }
    },

    /**
     * Delete user (Super Admin only)
     * DELETE /api/auth/users/:id
     */
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/auth/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            throw error;
        }
    },

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    getProfile: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            throw error;
        }
    },

    /**
     * Regenerate password for a user (Super Admin only)
     * POST /api/auth/users/:id/regenerate-password
     */
    regeneratePassword: async (userId: string) => {
        try {
            const response = await api.post(`/auth/users/${userId}/regenerate-password`);
            return response.data;
        } catch (error) {
            console.error('❌ Error regenerating password:', error);
            throw error;
        }
    },

    /**
     * Get dashboard statistics (Super Admin only)
     * GET /api/auth/dashboard/stats
     */
    getDashboardStats: async () => {
        try {
            const response = await api.get('/auth/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching dashboard stats:', error);
            throw error;
        }
    },
};

// ===============================
// POST SERVICES
// ===============================
export const postService = {
    getAll: async (params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        isPublished?: boolean;
    }) => {
        try {
            const response = await api.get('/posts', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching posts:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid post ID');
            }
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching post:', error);
            throw error;
        }
    },

    getByCategory: async (category: string) => {
        try {
            if (!category) {
                return { success: true, data: [] };
            }
            const response = await api.get(`/posts/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching posts by category:', error);
            return { success: false, data: [], message: 'Failed to fetch posts' };
        }
    },

    create: async (data: any) => {
        try {
            if (!data.title || !data.content || !data.author) {
                throw new Error('Title, content, and author are required');
            }
            const response = await api.post('/posts', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating post:', error);
            throw error;
        }
    },

    createWithImage: async (data: any, imageFile?: File) => {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const response = await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error creating post with image:', error);
            throw error;
        }
    },

    update: async (id: string, data: any) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid post ID for update');
            }
            const response = await api.put(`/posts/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating post:', error);
            throw error;
        }
    },

    updateWithImage: async (id: string, data: any, imageFile?: File) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid post ID for update');
            }
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const response = await api.put(`/posts/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error updating post with image:', error);
            throw error;
        }
    },

    togglePublish: async (id: string) => {
        try {
            if (!id) throw new Error('Post ID is required');
            const response = await api.patch(`/posts/${id}/toggle-publish`);
            return response.data;
        } catch (error) {
            console.error('❌ Error toggling post publish:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid post ID for deletion');
            }
            const response = await api.delete(`/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting post:', error);
            throw error;
        }
    },
};

// ===============================
// EVENT SERVICES
// ===============================
export const eventService = {
    getAll: async (params?: { category?: string; month?: string }) => {
        try {
            const response = await api.get('/events', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching events:', error);
            throw error;
        }
    },
    getUpcoming: async () => {
        try {
            const response = await api.get('/events/upcoming');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching upcoming events:', error);
            throw error;
        }
    },
    getById: async (id: string) => {
        try {
            if (!id) throw new Error('Event ID is required');
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching event:', error);
            throw error;
        }
    },
    create: async (data: any) => {
        try {
            const response = await api.post('/events', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating event:', error);
            throw error;
        }
    },
    update: async (id: string, data: any) => {
        try {
            if (!id) throw new Error('Event ID is required for update');
            const response = await api.put(`/events/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating event:', error);
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            if (!id) throw new Error('Event ID is required for deletion');
            const response = await api.delete(`/events/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting event:', error);
            throw error;
        }
    },
};

// ===============================
// GALLERY SERVICES
// ===============================
// src/services/api.ts - Complete galleryService

export const galleryService = {
    getAll: async (params?: { category?: string }) => {
        try {
            const response = await api.get('/gallery', { params });

            // Fix URLs
            if (response.data && response.data.data) {
                response.data.data = response.data.data.map((item: any) => {
                    let url = item.url || '';
                    if (url.includes(':\\') || url.includes(':/')) {
                        const parts = url.split(/[\\\/]/);
                        url = parts[parts.length - 1];
                    }
                    if (!url.startsWith('/uploads') && !url.startsWith('http')) {
                        url = `/uploads/${url}`;
                    }
                    return {
                        ...item,
                        url: url
                    };
                });
            }

            return response.data;
        } catch (error) {
            console.error('❌ Error fetching gallery:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        try {
            if (!id) throw new Error('Gallery ID is required');
            const response = await api.get(`/gallery/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching gallery item:', error);
            throw error;
        }
    },

    create: async (data: any) => {
        try {
            const response = await api.post('/gallery', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating gallery item:', error);
            throw error;
        }
    },

    createWithImage: async (formData: FormData) => {
        try {
            // ✅ The key must be 'image' - matches multer's upload.single('image')
            const response = await api.post('/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error creating gallery item with image:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            if (!id) throw new Error('Gallery item ID is required for deletion');
            const response = await api.delete(`/gallery/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting gallery item:', error);
            throw error;
        }
    },

    update: async (id: string, data: any) => {
        try {
            if (!id) throw new Error('Gallery item ID is required for update');
            const response = await api.put(`/gallery/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating gallery item:', error);
            throw error;
        }
    },

    toggleFeatured: async (id: string) => {
        try {
            if (!id) throw new Error('Gallery ID is required');
            const response = await api.patch(`/gallery/${id}/toggle-featured`);
            return response.data;
        } catch (error) {
            console.error('❌ Error toggling gallery featured:', error);
            throw error;
        }
    },
};
// ===============================
// INVESTMENT SERVICES
// ===============================
export const investmentService = {
    getAll: async (params?: { status?: string }) => {
        try {
            const response = await api.get('/investments', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching investments:', error);
            throw error;
        }
    },
    getById: async (id: string) => {
        try {
            if (!id) throw new Error('Investment ID is required');
            const response = await api.get(`/investments/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching investment:', error);
            throw error;
        }
    },
    create: async (data: any) => {
        try {
            const response = await api.post('/investments', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating investment:', error);
            throw error;
        }
    },
    updateStatus: async (id: string, status: string) => {
        try {
            if (!id) throw new Error('Investment ID is required');
            const response = await api.patch(`/investments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('❌ Error updating investment status:', error);
            throw error;
        }
    },
    getStats: async () => {
        try {
            const response = await api.get('/investments/stats/dashboard');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching investment stats:', error);
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            if (!id) throw new Error('Investment ID is required for deletion');
            const response = await api.delete(`/investments/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting investment:', error);
            throw error;
        }
    },
};

// ===============================
// LANDMARK SERVICES
// ===============================
export const landmarkService = {
    getAll: async (category?: string) => {
        try {
            const response = await api.get('/landmarks', { params: { category } });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching landmarks:', error);
            throw error;
        }
    },
    getById: async (id: string) => {
        try {
            if (!id) throw new Error('Landmark ID is required');
            const response = await api.get(`/landmarks/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching landmark:', error);
            throw error;
        }
    },
    getByCategory: async (category: string) => {
        try {
            const response = await api.get(`/landmarks/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching landmarks by category:', error);
            throw error;
        }
    },
};

// ===============================
// ARTICLE SERVICES (Legacy compatibility)
// ===============================
export const articleService = {
    getAll: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
        try {
            const response = await api.get('/articles', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching articles:', error);
            throw error;
        }
    },
    getById: async (id: string) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid article ID');
            }
            const response = await api.get(`/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching article:', error);
            throw error;
        }
    },
    getByCategory: async (category: string) => {
        try {
            if (!category) {
                return { success: true, data: [] };
            }
            const response = await api.get(`/articles/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching articles by category:', error);
            return { success: false, data: [], message: 'Failed to fetch articles' };
        }
    },
    create: async (data: any) => {
        try {
            if (!data.title || !data.content || !data.author) {
                throw new Error('Title, content, and author are required');
            }
            const response = await api.post('/articles', data);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating article:', error);
            throw error;
        }
    },
    createWithImage: async (data: any, imageFile?: File) => {
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const response = await api.post('/articles', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error creating article with image:', error);
            throw error;
        }
    },
    update: async (id: string, data: any) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid article ID for update');
            }
            const response = await api.put(`/articles/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating article:', error);
            throw error;
        }
    },
    updateWithImage: async (id: string, data: any, imageFile?: File) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid article ID for update');
            }
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const response = await api.put(`/articles/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error updating article with image:', error);
            throw error;
        }
    },
    delete: async (id: string) => {
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('Invalid article ID for deletion');
            }
            const response = await api.delete(`/articles/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error deleting article:', error);
            throw error;
        }
    },
};

export default api;

// ===============================
// TYPES
// ===============================
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    count?: number;
    total?: number;
    pages?: number;
    currentPage?: number;
}