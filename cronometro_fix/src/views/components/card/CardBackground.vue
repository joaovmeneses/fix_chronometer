<template>
  <b-card
    no-body
    class="text-center"
  >
    <div class="card-header">
      <!-- Title & SubTitle -->
      <b-row>
        <b-col><h2
          class="text-primary"
          align-h="center"
        >
          {{ titulo }}
        </h2></b-col>
      </b-row>
    </div>

    <b-card-body>
      <!-- Card Content -->
      <slot />
      <!-- Code Content -->
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard,
  BCardBody,
  BCol,
  BRow,
} from 'bootstrap-vue'

export default {
  name: 'CardBasico',
  components: {
    BCard,
    BCardBody,
    BCol,
    BRow,
  },
  props: {
    titulo: {
      type: String,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import '~@core/scss/base/bootstrap-extended/variables';
@import 'bootstrap/scss/variables';
@import '~@core/scss/base/components/variables-dark';

.card-code {
  pre[class*='language-'] {
    margin: 0;
    max-height: 350px;
    border-radius: 0.5rem;
  }

    /* width */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: #2d2d2d;
      border-radius: 100%;

      .dark-layout & {
        background-color: $theme-dark-body-bg !important;
      }
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      border-radius: 0.5rem;
      background: rgba(241,241,241,.4);
    }

    /* Handle on hover */
    // ::-webkit-scrollbar-thumb:hover {
    // }

    ::-webkit-scrollbar-corner {
      display: none;
    }
}

.code-toggler {
  border-bottom: 1px solid transparent;

  &[aria-expanded='false'] {
    border-bottom-color: $primary;
  }
}

// HTML
.card {
  .card-header .heading-elements {
    position: static;
    background: red;
  }
}
</style>