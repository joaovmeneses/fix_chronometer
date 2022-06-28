<template>
	<b-container>
		<b-container fluid>
			<h1>Cargo</h1>
			<b-row>
				<b-col>
					<b-form-select
						v-model="cargoSelected"
						value-field="id"
						text-field="nome"
						:options="cargos"
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
		cargos: [],
		cargoSelected: null,
		concursoId: null,
		cicloId: null
	}),
	methods: {
		async getAllCargos() {
			const ciclo = store.getters['controller/getNovoCicloPorConcursoInsert']
			this.cicloId = await ciclo.cicloId
			this.concursoId = await ciclo.concursoId

			this.$http.get(`ciclos/0/concursos/${this.concursoId}/cargos`).then((response) => {
				this.cargos = response.data;
			});
		},
	},
	watch: {
		cargoSelected() {
			if (this.cargoSelected) {
				this.$emit("can-continue", { value: true });
				let concursoData = store.getters['controller/getNovoCicloPorConcursoInsert']
				store.commit('controller/SET_NOVO_CICLO_POR_CONCURSO_DATA', {
					...concursoData,
					cargoId: this.cargoSelected
				})
				console.log(store.getters['controller/getNovoCicloPorConcursoInsert'])
				this.$root.$emit('change-cargo-id')
			}
		},
	},
	created() {
		this.getAllCargos();
		this.$root.$on('change-concurso-id', () => {
			this.getAllCargos();
		})
	},
};
</script>

<style>
</style>