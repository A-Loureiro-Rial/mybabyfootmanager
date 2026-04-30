import { ref } from 'vue';
import { useApiFetch } from '@/composables/useApiFetch';

const matches = ref([]);
const classement = ref([]);
async function getMatches(tournament) {
    const { data, error } = await useApiFetch('/match/list/' + tournament, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        matches.value = data.value.data;
        return true;
    } else {
        console.error(error);
        return false;
    }
}

async function createMatches(tournament) {
    const { data, error } = await useApiFetch('/match/create', {
        method: 'POST',
        body: JSON.stringify({
            id: tournament,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        matches.value = data.value.data;
        await getClassement();
        return true;
    } else {
        console.error(error);
        return false;
    }
}

async function setScore(match, score) {
    const { data, error } = await useApiFetch('/match/score', {
        method: 'PUT',
        body: JSON.stringify({
            id: match,
            score: score,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        const item = matches.value.find((search) => search.id === data.value.data.id);
        if (item) {
            item.score = data.value.data.score;
            item.winner = data.value.data.winner;
            await getClassement();
            return true;
        } else {
            return false;
        }
    } else {
        console.error(error);
        return false;
    }
}

async function deleteMatch(match) {
    const { data, error } = await useApiFetch('/match/delete', {
        method: 'DELETE',
        body: JSON.stringify({
            id: match,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        matches.value = matches.value.filter((search) => search.id != match);
        await getClassement();
        return true;
    } else {
        console.error(error);
        return false;
    }
}

async function getClassement() {
    const list = new Set([]);
    matches.value.forEach((match) => {
        if (!list.has(match.team_a)) {
            list.add(match.team_a);
        }
        if (!list.has(match.team_b)) {
            list.add(match.team_b);
        }
    });
    let array = [];
    list.forEach((id) => {
        array.push({ id: id, score: 0 });
    });
    matches.value.forEach((match) => {
        if (match.winner != null) {
            array = array.flatMap((row) =>
                row.id == match.winner ? { id: row.id, score: row.score + 3 } : row,
            );
        } else if (match.score != null) {
            array = array.flatMap((row) =>
                row.id == match.team_a ? { id: row.id, score: row.score + 1 } : row,
            );
            array = array.flatMap((row) =>
                row.id == match.team_b ? { id: row.id, score: row.score + 1 } : row,
            );
        }
    });
    classement.value = array.sort((a, b) => b.score - a.score);
}

export { matches, getMatches, createMatches, setScore, deleteMatch, classement, getClassement };
