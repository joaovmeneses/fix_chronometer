<template>
	<b-container>
		<b-container fluid>
			<h1>Área</h1>
			<b-row>
				<b-col>
					<b-form-select
						v-model="areaSelected"
						value-field="id"
						text-field="nome"
						:options="areas"
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
		areas: [],
		areaSelected: [],
		cicloId: null
	}),
	methods: {
		getAllAreas() {
			this.$http.get(`ciclos/${this.cicloId}/areas`).then((response) => {
				this.areas = response.data;
			});
		},
	},
	watch: {
		areaSelected() {
			if (this.areaSelected) {
				this.$emit("can-continue", { value: true });
				let concursoData = store.getters['controller/getNovoCicloPorAreaInsert']
				store.commit('controller/SET_NOVO_CICLO_POR_AREA_DATA', {
					...concursoData,
					areaId: this.areaSelected
				})
				console.log(store.getters['controller/getNovoCicloPorAreaInsert'])
				this.$root.$emit('change-area-id')
			}
		},
	},
	created() {
		let ciclo = store.getters['controller/getNovoCicloPorAreaInsert']
		this.cicloId = ciclo.cicloId
		this.getAllAreas();
	},
};
</script>

<style>
</style>