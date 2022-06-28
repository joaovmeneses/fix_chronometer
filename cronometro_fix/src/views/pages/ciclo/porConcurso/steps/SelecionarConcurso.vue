<template>
	<b-container>
		<b-container fluid>
			<h1>Concurso</h1>
			<b-row>
				<b-col>
					<b-form-select
						label="Concurso"
						v-model="concursoSelected"
						value-field="id"
						text-field="nome"
						:options="concursos"
					></b-form-select>
				</b-col>
			</b-row>
		</b-container>
		<br />
		<b-container>
			<b-row>
				<b-col>
					<b-form-checkbox id="checkbox-1" v-model="concursoExists">
						Não tem o concurso que você quer?
					</b-form-checkbox>
				</b-col>
			</b-row>
		</b-container>
		<br />
		<b-container>
			<b-row>
				<b-col>
					<b-button
						to="/pages/ciclo/concurso/inserir"
						variant="primary"
						v-show="concursoExists"
						>Adicionar Concurso</b-button
					>
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
		concursoExists: false,
		concursos: [],
		concursoSelected: null,
		cicloId: null
	}),
	methods: {
		getAllConcursos() {
			this.$http.get(`ciclos/0/concursos`).then((response) => {
				this.concursos = response.data;
			});
		},
	},
	watch: {
		concursoSelected() {
			if (this.concursoSelected) {
				this.$emit("can-continue", { value: true });
				let concursoData = store.getters['controller/getNovoCicloPorConcursoInsert']
				store.commit('controller/SET_NOVO_CICLO_POR_CONCURSO_DATA', {
					...concursoData,
					concursoId: this.concursoSelected,
					nome: this.concursoNome,
					cicloId: this.cicloId
				})
				console.log(store.getters['controller/getNovoCicloPorConcursoInsert'])
				this.$root.$emit('change-concurso-id')
			}
		},
	},
	created() {
		let ciclo = store.getters['controller/getNovoCicloPorConcursoInsert']
		this.cicloId = ciclo.cicloId
		this.getAllConcursos();
	},
};
</script>

<style>
</style>