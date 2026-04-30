import { ref } from 'vue';
import { useApiFetch } from '@/composables/useApiFetch';

const tournaments = ref([]);
const registrations = ref([]);

async function getTournaments() {
    const { data, error } = await useApiFetch('/tournament/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        tournaments.value = data.value.data;
    } else {
        console.error(error);
    }
}

async function getRegistrations(id) {
    const { data, error } = await useApiFetch('/tournament/registrations/' + id, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        registrations.value = data.value.data;
    } else {
        console.error(error);
    }
}

async function addTournament(name, description, date) {
    const { data, error } = await useApiFetch('/tournament/create', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            description: description,
            date: date,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        tournaments.value = tournaments.value.concat(data.value.data);
        return true;
    } else {
        console.error(error);
        return false;
    }
}

export { registrations, getRegistrations, tournaments, getTournaments, addTournament };
