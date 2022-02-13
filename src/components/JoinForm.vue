<template>
  <v-container class="grey lighten-5">
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
      >
        <form @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="Name"
            rules="required|max:20"
          >
            <v-text-field
              v-model="name"
              :counter="10"
              :error-messages="errors"
              label="Name"
              required
            ></v-text-field>
          </validation-provider><validation-provider
            v-slot="{ errors }"
            name="Id"
            rules="required|max:20"
          >
            <v-text-field
              v-model="Id"
              :counter="10"
              :error-messages="errors"
              label="Id"
              required
            ></v-text-field>
          </validation-provider><validation-provider
            v-slot="{ errors }"
            name="Password"
            rules="required|max:20|min:8"
          >
            <v-text-field
              v-model="Password"
              :counter="10"
              :error-messages="errors"
              label="Password"
              :type="'password'"
              v-validate="{ is: Confirm }"
              required
            ></v-text-field>
          </validation-provider><validation-provider
            v-slot="{ errors }"
            name="Confirm"
            rules="required|max:20|min:8"
          >
            <v-text-field
              v-model="Confirm"
              :counter="10"
              :error-messages="errors"
              label="Confirm"
              :type="'password'"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Phone"
            :rules="{
          required: true,
          digits: 11,
          regex: '^(71|72|74|76|81|82|84|85|86|87|88|89)\\d{5}$'
        }"
          >
            <v-text-field
              v-model="Phone"
              :counter="11"
              :error-messages="errors"
              label="Phone Number"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="email"
            rules="required|email"
          >
            <v-text-field
              v-model="email"
              :error-messages="errors"
              label="E-mail"
              required
            ></v-text-field>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="select"
            rules="required"
          >
            <v-select
              v-model="select"
              :items="items"
              :error-messages="errors"
              label="Select"
              data-vv-name="select"
              required
            ></v-select>
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            rules="required"
            name="checkbox"
          >
            <v-checkbox
              v-model="checkbox"
              :error-messages="errors"
              value="1"
              label="Option"
              type="checkbox"
              required
            ></v-checkbox>
          </validation-provider>

          <v-btn
            class="mr-4"
            type="submit"
            :disabled="invalid"
          >
            submit
          </v-btn>
          <v-btn @click="clear">
            clear
          </v-btn>
        </form>
      </validation-observer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    name: '',
    phoneNumber: '',
    email: '',
    select: null,
    items: [
      'Item 1',
      'Item 2',
      'Item 3',
      'Item 4',
    ],
    Confirm: null,
    checkbox: null,
    Password: null,
  }),

  methods: {
    submit () {
      this.$refs.observer.validate()
    },
    clear () {
      this.name = ''
      this.phoneNumber = ''
      this.email = ''
      this.select = null
      this.checkbox = null
      this.$refs.observer.reset()
    },
  },
}
</script>

<style scoped>

</style>