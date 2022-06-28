<template>
	<div>
		<b-container fluid>
			<h1>Ciclo por Área</h1>
			<br />
			<horizontal-stepper
				:top-buttons="false"
				locale="pt"
				:steps="cicloSteps"
				@completed-step="completeStep"
				@active-step="isStepActive"
				@stepper-finished="addNovoClicloPorArea"
			>
			</horizontal-stepper>
		</b-container>
	</div>
</template>

<script>
import { BRow, BCol, BButton, BFormInput, BContainer } from "bootstrap-vue";
import HorizontalStepper from "vue-stepper";
import SelecionarArea from "@/views/pages/ciclo/porArea/steps/SelecionarArea.vue";
import SelecionarAfinidade from "@/views/pages/ciclo/porArea/steps/SelecionarAfinidade.vue";
import SelecionarHoras from "@/views/pages/ciclo/porArea/steps/SelecionarHoras.vue"
import NomeCiclo from "@/views/pages/ciclo/porArea/steps/NomeCiclo.vue"
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
				icon: "school",
				name: "default",
				title: "Nome do Ciclo",
				subtitle: "Defina um nome para o seu novo ciclo",
				component: NomeCiclo,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "primeiro",
				title: "Área",
				subtitle: "Selecione a Área",
				component: SelecionarArea,
				completed: false,
			},
			{
				icon: "navigate_next",
				name: "segundo",
				title: "Afinidade",
				subtitle: "Selecione a Afinidade com as Disciplinas",
				component: SelecionarAfinidade,
				completed: false,
			},
			{
				icon: "watch_later",
				name: "terceiro",
				title: "Horas",
				subtitle: "Selecione a quantidade de Horas Por Ciclo",
				component: SelecionarHoras,
				completed: false,
			},
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
		addNovoClicloPorArea(payload) {
			let concursoData = store.getters['controller/getNovoCicloPorAreaInsert']
			this.$http.post(`ciclos/${concursoData.cicloId}/areas/${concursoData.areaId}/mount`, concursoData).then( response => {
				let id = response.data
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