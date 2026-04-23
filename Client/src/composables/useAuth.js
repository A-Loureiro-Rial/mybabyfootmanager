import { ref, computed } from 'vue';
import { useFetch } from '@vueuse/core';
const apiUrl = import.meta.env.VITE_API_URL;

const accessToken = ref(null);
const user = ref(null);

export function useAuth() {
    const isAuthenticated = computed(() => !!accessToken.value);

    function setAuth(token, userData) {
        accessToken.value = token;
        user.value = userData;
    }

    function clearAuth() {
        accessToken.value = null;
        user.value = null;
    }

    async function refresh() {
        const { data, error } = await useFetch(apiUrl + '/user/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).json();
        if (!error.value) {
            setAuth(data.value.accessToken, {
                id: user.id,
                username: user.username,
                role: user.role,
            });
        } else {
            console.log(error);
        }
    }

    return {
        accessToken,
        user,
        isAuthenticated,
        setAuth,
        clearAuth,
        refresh,
    };
}
