<template>
	<b-container fluid>
		<h1>Novo Concurso</h1>
		<br />
		<horizontal-stepper
			:top-buttons="false"
			locale="pt"
			:steps="cicloSteps"
			@completed-step="completeStep"
			@active-step="isStepActive"
			@stepper-finished="addNovoCliclo"
		>
		</horizontal-stepper>
	</b-container>
</template>

<script>
import { BRow, BCol, BButton, BFormInput, BContainer } from "bootstrap-vue";
import HorizontalStepper from "vue-stepper";
import CriarConcurso from "@/views/pages/ciclo/concurso/steps/CriarConcurso.vue";
import SelecionarDisciplina from "@/views/pages/ciclo/concurso/steps/SelecionarDisciplina.vue";
import InserirQuestoes from "@/views/pages/ciclo/concurso/steps/InserirQuestoes.vue";
import SelecionarHoras from "@/views/pages/ciclo/concurso/steps/SelecionarHoras.vue";
import SelecionarAfinidade from "@/views/pages/ciclo/concurso/steps/SelecionarAfinidade.vue"
import store from '@/store'
export default {
	components: { BRow, BCol, BButton, BFormInput, BContainer, HorizontalStepper },
    data: () => ({
		dataInsert: null,
        cicloSteps: [
			{
				icon: "school",
				name: "primeiro",
				title: "Concurso",
				subtitle: "Qual concurso deseja criar?",
				component: CriarConcurso,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "segundo",
				title: "Disciplinas",
				subtitle: "Selecione as disciplinas.",
				component: SelecionarDisciplina,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "terceiro",
				title: "Questões",
				subtitle: "Qual a quantidade de questões por disciplina?",
				component: InserirQuestoes,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "terceiro",
				title: "Afinidade",
				subtitle: "Selecione a Afinidade com as Disciplinas",
				component: SelecionarAfinidade,
				completed: false,
			},
			/*{
				icon: "watch_later",
				name: "quinto",
				title: "Horas",
				subtitle: "Selecione a quantidade de horas por ciclo.",
				component: SelecionarHoras,
				completed: false,
			},*/
		],
    }),
    methods: {
		completeStep(payload) {
			this.cicloSteps.forEach((step) => {
				if (step.name === payload.name) {
					step.completed = true;
				}
			});
		},
		isStepActive(payload) {
			this.cicloSteps.forEach((step) => {
				if (step.name === payload) {
					if (step.completed === true) {
						step.completed = false;
					}
				}
			});
		},
		addNovoCliclo() {
			let concursoData = store.getters['controller/getNovoConcursoInsert']
			// Inserir aqui a rota de novo Concurso.
			this.$http.post(`ciclos/${concursoData.cicloId}/concursos/mount`, concursoData).then( response => {
				let id = response.data
				this.$router.push({ path: `/pages/ciclo/doZero/${concursoData.cicloId}` })
			})
		},
	}
};
</script>

<style>
.stepper-button,
.material-icons {
	background-color: #7367f0 !important;
	color: #fff;
}

.deactivated > .material-icons {
	background-color: #cccccc !important;
}

.previous span {
	color: #fff;
}
</style>