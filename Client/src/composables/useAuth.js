import { ref, computed } from 'vue';

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

    return {
        accessToken,
        user,
        isAuthenticated,
        setAuth,
        clearAuth,
    };
}
