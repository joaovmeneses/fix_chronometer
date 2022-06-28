<template>
	<b-container>
		<b-container fluid>
			<h1>Disciplinas</h1>
			<b-row>
				<b-col>
					<b-form-select
						multiple
						v-model="disciplinaSelected"
						value-field="id"
						text-field="nome"
						:options="disciplinas"
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
		concursoExists: false,
		disciplinas: [],
		disciplinaSelected: [],
	}),
	methods: {
		getAllConcursos() {
			this.$http.get("disciplinas").then((response) => {
				this.disciplinas = response.data;
			});
		},
	},
	watch: {
		disciplinaSelected() {
			if (this.disciplinaSelected) {
				this.$emit("can-continue", { value: true });

				let concursoData = store.getters['controller/getNovoConcursoInsert']

				// Formatar disciplinas por causa do multiselect
				let disciplinasFormat = this.disciplinaSelected.map( disciplina => {
					return { disciplina_id: disciplina }
				})
				store.commit('controller/SET_NOVO_CONCURSO_DATA', {
					...concursoData,
					disciplinas: disciplinasFormat
				})
				console.log(store.getters['controller/getNovoConcursoInsert'])
			}
		},
	},
	created() {
		this.getAllConcursos();
	},
};
</script>

<style>
</style>