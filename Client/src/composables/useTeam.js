import { ref } from 'vue';
import { useApiFetch } from '@/composables/useApiFetch';
import { registrations } from '@/composables/useTournament';

const teams = ref([]);

async function getTeams() {
    const { data, error } = await useApiFetch('/team/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        teams.value = data.value.data;
    } else {
        console.error(error);
    }
}

async function addTeam(name, description) {
    const { data, error } = await useApiFetch('/team/create', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            description: description,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        teams.value = teams.value.concat(data.value.data);
        return true;
    } else {
        console.error(error);
        return false;
    }
}

async function registerTeams(teams, tournament) {
    const { data, error } = await useApiFetch('/team/register', {
        method: 'POST',
        body: JSON.stringify({
            teams: teams,
            tournament: tournament,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        return true;
    } else {
        console.error(error);
        return false;
    }
}

async function unregisterTeam(team, tournament) {
    const { data, error } = await useApiFetch('/team/unregister', {
        method: 'DELETE',
        body: JSON.stringify({
            team: team,
            tournament: tournament,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        registrations.value = registrations.value.filter((search) => search.id != team);
        return true;
    } else {
        console.error(error);
        return false;
    }
}

export { teams, getTeams, addTeam, registerTeams, unregisterTeam };
