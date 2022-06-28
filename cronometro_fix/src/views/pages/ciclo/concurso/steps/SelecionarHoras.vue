<template>
	<b-container>
		<b-container fluid>
			<h1>Horas</h1>
			<b-row>
				<b-col>
					<b-form-select
						v-model="horaSelected"
						value-field="horas"
						text-field="nome"
						:options="horas"
					></b-form-select>
				</b-col>
			</b-row>
		</b-container>
	</b-container>
</template>

<script>
import {
	BRow,
	BCol,
	BButton,
	BFormInput,
	BContainer,
	BFormCheckbox,
	BFormSelect,
} from "bootstrap-vue";
import store from '@/store'
export default {
	components: {
		BRow,
		BCol,
		BButton,
		BFormInput,
		BContainer,
		BFormCheckbox,
		BFormSelect,
	},
	data: () => ({
		horas: [
			{horas: 24, nome: '24 horas'},
			{horas: 36, nome: '36 horas'},
		],
		horaSelected: null,
	}),
	watch: {
		horaSelected() {
			if (this.horaSelected) {
				this.$emit("can-continue", { value: true });
				let concursoData = store.getters['controller/getNovoConcursoInsert']
				store.commit('controller/SET_NOVO_CONCURSO_DATA', {
					...concursoData,
					horas_ciclo: this.horaSelected
				})
				console.log(JSON.stringify(store.getters['controller/getNovoConcursoInsert']))
			}
		},
	}
};
</script>

<style>
</style>