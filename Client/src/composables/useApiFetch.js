import { createFetch } from '@vueuse/core';
import { useAuth } from '@/composables/useAuth';
const apiUrl = import.meta.env.VITE_API_URL;
const auth = useAuth();

const useApiFetch = createFetch({
    baseUrl: apiUrl,
    options: {
        async beforeFetch({ options }) {
            const token = await auth.getToken();
            options.headers.Authorization = token ? `Bearer ${token}` : '';
            return { options };
        },
        onFetchResponse({ response }) {
            if (response.status == 401) {
                auth.refresh();
            }
        },
    },
    fetchOptions: {
        mode: 'cors',
    },
});

export { useApiFetch };
