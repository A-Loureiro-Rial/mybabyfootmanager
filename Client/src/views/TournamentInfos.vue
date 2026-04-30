<script setup>
import { useRoute } from 'vue-router';
import { unregisterTeam, teams } from '@/composables/useTeam';
import { formatDateFR } from '@/composables/useDate';
import { tournaments, registrations, getRegistrations } from '@/composables/useTournament';
import {
    matches,
    getMatches,
    createMatches,
    setScore,
    deleteMatch,
    classement,
    getClassement,
} from '@/composables/useMatch';
import { onMounted, ref } from 'vue';
import { role } from '@/composables/useAuth';
import { useMessage } from 'naive-ui';

const message = useMessage();

const tournamentId = useRoute().params?.id;
const tournament = tournaments.value.find((tournament) => tournament.id == tournamentId);
// loads registrations, matches and classement for current tournament
onMounted(async () => {
    await getRegistrations(tournamentId);
    await getMatches(tournamentId);
    await getClassement();
});

// search in teams (array) for the name of a team given its id
function findTeamName(id) {
    return teams.value.find((team) => team.id == id).name;
}

// checks if team (id) is a number, then unregister the team
function handleUnregister(team) {
    if (!parseInt(team) > 0) {
        message.error('Erreur lors de la désinscription');
    }
    unregisterTeam(team, tournamentId)
        ? message.success('Désinscription réussie')
        : message.error('Erreur lors de la désinscription');
}

// checks if match(id) is a number and deletes the match
function handleDeleteMatch(match) {
    if (!parseInt(match) > 0) {
        message.error('Erreur lors de la suppression du match');
    }
    deleteMatch(match)
        ? message.success('Match supprimé')
        : message.error('Erreur lors de la suppression du match');
}

function handleGenerateMatches() {
    createMatches(tournamentId)
        ? message.success('Matchs générés')
        : message.error('Erreur lors de la génération des matchs');
}

const scoreForm = ref(null);
const scoreFormValue = ref({
    scoreA: 0,
    scoreB: 0,
});
const scoreFormRules = {
    scoreA: {
        required: true,
        message: 'Entrer un score',
        trigger: 'blur',
    },
    scoreB: {
        required: true,
        message: 'Entrer un score',
        trigger: 'blur',
    },
};

function validateScore() {
    scoreForm.value?.validate(async (errors) => {
        if (!errors) {
            const score =
                scoreFormValue.value.scoreA.toString() +
                '/' +
                scoreFormValue.value.scoreB.toString();
            setScore(selectedMatch.value.id, score)
                ? message.success('Score enregistré')
                : message.error("Erreur lors de l'enregistrement du score");
        } else {
            console.error(errors);
            message.error("Erreur lors de l'enregistrement du score");
        }
        scoreModal.value = false;
    });
}

const selectedMatch = ref(null);
const scoreModal = ref(false);
function openScoreModal(match) {
    selectedMatch.value = match;
    scoreModal.value = true;
}
</script>

<template>
    <div>
        <n-space vertical>
            <!--infos sur le tournoi-->
            <n-card bordered :title="tournament.name" size="large">
                <template #header-extra>
                    {{ formatDateFR(tournament.date) }}
                </template>
                <p>
                    {{ tournament.description }}
                </p>
                <template v-if="role == 'admin'" #footer>
                    <n-button v-if="registrations.length > 1" @click="handleGenerateMatches()">{{
                        matches.length == 0 ? 'Générer les matchs' : 'Générer de nouveau les matchs'
                    }}</n-button>
                    <n-button v-else disabled>Générer les matchs</n-button>
                </template>
            </n-card>
            <!--Équipes inscrites-->
            <n-list bordered>
                <n-collapse>
                    <n-collapse-item title="Équipes inscrites" :style="{ padding: '1%' }">
                        <n-list-item v-for="team in registrations" :key="team.id">
                            <n-thing :title="team.name" :description="team.description"> </n-thing>
                            <template v-if="role == 'admin'" #suffix>
                                <n-popconfirm
                                    v-if="role === 'admin'"
                                    negative-text="Annuler"
                                    positive-text="Désinscrire"
                                    @positive-click="handleUnregister(team.id)"
                                >
                                    <template #trigger>
                                        <n-button ghost type="error" size="small"
                                            >Désinscrire</n-button
                                        >
                                    </template>
                                    Voulez vous vraiment désinscrire cette équipe ?
                                </n-popconfirm>
                            </template>
                        </n-list-item>
                    </n-collapse-item>
                </n-collapse>
            </n-list>
            <!--Liste des matchs-->
            <n-list bordered>
                <n-collapse>
                    <n-collapse-item title="Liste des matchs" :style="{ padding: '1%' }">
                        <n-list-item v-for="match in matches" :key="match.id">
                            <n-thing
                                :title="
                                    findTeamName(match.team_a) + '⚡' + findTeamName(match.team_b)
                                "
                                :description="match.score != null ? 'score : ' + match.score : ''"
                            >
                                <span v-if="match.winner != null"
                                    >Gagnant : {{ findTeamName(match.winner) }}</span
                                >
                            </n-thing>
                            <template v-if="role == 'admin'" #suffix>
                                <n-space vertical align="center">
                                    <n-button @click="openScoreModal(match)" size="small"
                                        >Gérer le score</n-button
                                    >
                                    <n-popconfirm
                                        v-if="role === 'admin'"
                                        negative-text="Annuler"
                                        positive-text="Supprimer"
                                        @positive-click="handleDeleteMatch(match.id)"
                                    >
                                        <template #trigger>
                                            <n-button ghost type="error" size="small"
                                                >Supprimer</n-button
                                            >
                                        </template>
                                        Voulez vous vraiment supprimer ce match ?
                                    </n-popconfirm>
                                </n-space>
                            </template>
                        </n-list-item>
                    </n-collapse-item>
                </n-collapse>
            </n-list>
            <!--classement-->
            <n-list bordered>
                <n-collapse>
                    <n-collapse-item title="Classement" :style="{ padding: '1%' }">
                        <n-list-item v-for="team in classement" :key="team.id">
                            <n-thing
                                :title="findTeamName(team.id)"
                                :description="'Score : ' + team.score"
                            ></n-thing>
                        </n-list-item>
                    </n-collapse-item>
                </n-collapse>
            </n-list>
        </n-space>
        <n-modal v-model:show="scoreModal">
            <n-card
                style="width: 600px"
                title="Score"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
            >
                <n-form inline ref="scoreForm" :model="scoreFormValue" :rules="scoreFormRules">
                    <n-space style="width: 100%">
                        <div>
                            <span
                                >{{ findTeamName(selectedMatch.team_a) }}
                                <span :style="{ color: '#d2716c' }">*</span></span
                            >
                            <n-input-number
                                :default-value="0"
                                :min="-99"
                                :max="99"
                                v-model:value="scoreFormValue.scoreA"
                                clearable
                            />
                        </div>
                        <div>
                            <span
                                >{{ findTeamName(selectedMatch.team_b) }}
                                <span :style="{ color: '#d2716c' }">*</span></span
                            >
                            <n-input-number
                                :default-value="0"
                                :min="-99"
                                :max="99"
                                v-model:value="scoreFormValue.scoreB"
                                clearable
                            />
                        </div>
                    </n-space>
                </n-form>
                <template #footer>
                    <n-button @click="validateScore" size="small">Enregistrer le score</n-button>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>
