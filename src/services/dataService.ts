// frontend/src/services/dataService.ts
import api from './api';
import {
    Landmark,
    EventItem,
    GalleryItem,
    Article,
    Investment,
    ApiResponse
} from '../types';

// Landmark Services
export const landmarkService = {
    getAll: async (category?: string): Promise<ApiResponse<Landmark[]>> => {
        const response = await api.get('/landmarks', { params: { category } });
        return response.data;
    },
    getById: async (id: string): Promise<ApiResponse<Landmark>> => {
        const response = await api.get(`/landmarks/${id}`);
        return response.data;
    },
    getByCategory: async (category: string): Promise<ApiResponse<Landmark[]>> => {
        const response = await api.get(`/landmarks/category/${category}`);
        return response.data;
    },
};

// Event Services
export const eventService = {
    getAll: async (params?: { category?: string; month?: string }): Promise<ApiResponse<EventItem[]>> => {
        const response = await api.get('/events', { params });
        return response.data;
    },
    getUpcoming: async (): Promise<ApiResponse<EventItem[]>> => {
        const response = await api.get('/events/upcoming');
        return response.data;
    },
    getById: async (id: string): Promise<ApiResponse<EventItem>> => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },
    create: async (data: any): Promise<ApiResponse<EventItem>> => {
        const response = await api.post('/events', data);
        return response.data;
    },
    update: async (id: string, data: any): Promise<ApiResponse<EventItem>> => {
        const response = await api.put(`/events/${id}`, data);
        return response.data;
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },
};

// Gallery Services
export const galleryService = {
    getAll: async (category?: string): Promise<ApiResponse<GalleryItem[]>> => {
        const response = await api.get('/gallery', { params: { category } });
        return response.data;
    },
    create: async (data: any): Promise<ApiResponse<GalleryItem>> => {
        const response = await api.post('/gallery', data);
        return response.data;
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    },
};

// Article Services
export const articleService = {
    getAll: async (params?: { category?: string; search?: string; page?: number }): Promise<ApiResponse<Article[]>> => {
        const response = await api.get('/articles', { params });
        return response.data;
    },
    getById: async (id: string): Promise<ApiResponse<Article>> => {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    },
    getByCategory: async (category: string): Promise<ApiResponse<Article[]>> => {
        const response = await api.get(`/articles/category/${category}`);
        return response.data;
    },
    create: async (data: any): Promise<ApiResponse<Article>> => {
        const response = await api.post('/articles', data);
        return response.data;
    },
    update: async (id: string, data: any): Promise<ApiResponse<Article>> => {
        const response = await api.put(`/articles/${id}`, data);
        return response.data;
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },
};

// Investment Services
export const investmentService = {
    create: async (data: any): Promise<ApiResponse<Investment>> => {
        const response = await api.post('/investments', data);
        return response.data;
    },
    getAll: async (params?: { status?: string }): Promise<ApiResponse<Investment[]>> => {
        const response = await api.get('/investments', { params });
        return response.data;
    },
    getStats: async (): Promise<ApiResponse<any>> => {
        const response = await api.get('/investments/stats/dashboard');
        return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<ApiResponse<Investment>> => {
        const response = await api.patch(`/investments/${id}/status`, { status });
        return response.data;
    },
};