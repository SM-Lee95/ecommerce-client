<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-btn @click="save" text>저장</v-btn>
      </v-col>
    </v-row>
    <v-divider inset></v-divider>
    <v-row>
      <v-col v-html="preview"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "../util/http-commons.js";
export default {
  name: "CKEditor4",
  data() {
    return {
      editorData: "",
      editorConfig: {
        filebrowserUploadUrl: axios.defaults.baseURL + "prd/img/upload?",
        filebrowserImageUploadUrl: axios.defaults.baseURL + "prd/img/upload?",
        filebrowserUploadMethod: "form",
      },
      preview: "",
    };
  },
  computed: {
    ...mapGetters(["EditorHTML"]),
  },
  methods: {
    save() {
      this.$store.commit("setEditorHTML", this.editorData);
    },
  },
  mounted() {
    this.editorData = this.EditorHTML;
  },
  watch: {
    EditorHTML: function () {
      this.editorData = this.EditorHTML;
      this.preview = this.EditorHTML;
    },
  },
};
</script>