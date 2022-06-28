<template>
	<div>
		<b-container fluid>
			<h1>Ciclo por Concurso</h1>
			<br />
			<horizontal-stepper
				:top-buttons="false"
				locale="pt"
				:steps="cicloSteps"
				@completed-step="completeStep"
				@active-step="isStepActive"
				@stepper-finished="addNovoCicloPorConcurso"
			>
			</horizontal-stepper>
		</b-container>
	</div>
</template>

<script>
import { BRow, BCol, BButton, BFormInput, BContainer } from "bootstrap-vue";
import HorizontalStepper from "vue-stepper";
import NomeCiclo from "@/views/pages/ciclo/porConcurso/steps/NomeCiclo.vue";
import SelecionarConcurso from "@/views/pages/ciclo/porConcurso/steps/SelecionarConcurso.vue";
import SelecionarCargo from "@/views/pages/ciclo/porConcurso/steps/SelecionarCargo.vue";
import SelecionarAfinidade from "@/views/pages/ciclo/porConcurso/steps/SelecionarAfinidade.vue";
import SelecionarHoras from "@/views/pages/ciclo/porConcurso/steps/SelecionarHoras.vue";
import store from '@/store'
export default {
	components: {
		BRow,
		BCol,
		BButton,
		BFormInput,
		BContainer,
		HorizontalStepper
	},
	data: () => ({
		cicloSteps: [
			{
				icon: "navigate_next",
				name: "primeiro",
				title: "Concurso",
				subtitle: "Selecione o Concurso",
				component: SelecionarConcurso,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "segundo",
				title: "Cargo",
				subtitle: "Selecione o Cargo",
				component: SelecionarCargo,
				completed: false,
			},
			{
				icon: "school",
				name: "default",
				title: "Nome do Ciclo",
				subtitle: "Defina um nome para o seu novo ciclo",
				component: NomeCiclo,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "terceiro",
				title: "Afinidade",
				subtitle: "Selecione a Afinidade com as Disciplinas",
				component: SelecionarAfinidade,
				completed: false,
			}/*,
			{
				icon: "watch_later",
				name: "quarto",
				title: "Horas",
				subtitle: "Selecione a quantidade de Horas Por Ciclo",
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
		addNovoCicloPorConcurso() {
			let concursoData = store.getters['controller/getNovoCicloPorConcursoInsert']
			//ciclos/{ciclo_id}/concursos/{concurso_id}/cargos/{cargo_id}/mount
			const url = `ciclos/${concursoData.cicloId}/concursos/${concursoData.concursoId}/cargos/${concursoData.cargoId}/mount`;
			this.$http.post(url, concursoData).then( response => {
				//let id = response.data
				this.$router.push({ path: `/pages/ciclo/doZero/${concursoData.cicloId}` })
			})
		},
	},
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