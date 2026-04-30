import { useApiFetch } from './useApiFetch';
import { ref } from 'vue';
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true' ? true : false);
const id = ref(localStorage.getItem('id'));
const username = ref(localStorage.getItem('username'));
const role = ref(localStorage.getItem('role'));

function useAuth() {
    async function setUser(userInfos) {
        localStorage.setItem('id', userInfos.id);
        localStorage.setItem('username', userInfos.username);
        localStorage.setItem('role', userInfos.role);
        localStorage.setItem('isAuthenticated', 'true');
        id.value = userInfos.id;
        username.value = userInfos.username;
        role.value = userInfos.role;
        isAuthenticated.value = true;
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
        const { error } = await useApiFetch('/user/logout', {
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
            localStorage.setItem('isAuthenticated', false);
        } else {
            console.error(error);
        }
        isAuthenticated.value = false;
        id.value = null;
        username.value = null;
        role.value = null;
    }

    async function me() {
        const Authorization = getToken().length > 0 ? 'Bearer ' + getToken() : null;
        const { data, error } = await useApiFetch('/user/me', {
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
        const { data, error, statusCode } = await useApiFetch('/user/refresh', {
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

    async function updateUser(oldPassword, newUsername, newPassword) {
        const { data, error } = await useApiFetch('/user/update', {
            method: 'PUT',
            body: JSON.stringify({
                old_password: oldPassword,
                new_username: newUsername,
                new_password: newPassword,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }).json();
        if (!error.value) {
            username.value = data.value.user.username;

            return true;
        } else {
            return false;
        }
    }

    return {
        updateUser,
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

export { useAuth, isAuthenticated, id, username, role };
