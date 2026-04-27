import { useFetch } from '@vueuse/core';

const apiUrl = import.meta.env.VITE_API_URL;

export function useAuth() {
    async function setUser(userInfos) {
        localStorage.setItem('id', userInfos.id);
        localStorage.setItem('username', userInfos.username);
        localStorage.setItem('role', userInfos.role);
    }

    async function setToken(token) {
        localStorage.setItem('token', token);
    }

    function getUser() {
        const infos = {
            id: localStorage.getItem('id'),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role'),
        };
        return infos;
    }

    function getToken() {
        return localStorage.getItem('token');
    }

    async function clearAuth() {
        const { error } = await useFetch(apiUrl + '/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!error.value) {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
        } else {
            console.error(error);
        }
    }

    async function me() {
        const Authorization = getToken().length > 0 ? 'Bearer ' + getToken() : null;
        const { data, error } = await useFetch(apiUrl + '/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: Authorization,
            },
            credentials: 'include',
        }).json();
        if (!error.value) {
            setUser(data.value.user);
        } else {
            console.error(error);
        }
    }

    async function refresh() {
        const { data, error, statusCode } = await useFetch(apiUrl + '/user/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).json();
        if (!error.value) {
            setToken(data.value.accessToken);
        } else {
            console.error(error);
        }
    }

    return {
        useAuth,
        setUser,
        setToken,
        getToken,
        getUser,
        clearAuth,
        me,
        refresh,
    };
}
