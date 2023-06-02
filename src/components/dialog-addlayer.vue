<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="490"
    >
      <v-card>
        <div class="header d-flex align-center">
          <span>New Layer</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="contents">
          <v-text-field label="Layer Name" outlined v-model="layer_name" dense :rules="[isRequired ? rules.required : true]"></v-text-field>
          <!-- <v-autocomplete
            class="pb-2"
            hide-details
            clearable
            dense
            small
            v-model="chooseSource"
            :items="sources"
            outlined
            item-text="name"
            item-value="id"
            label="Source"
          ></v-autocomplete>
          <v-select v-if="chooseSource === 1" outlined dense append-icon="mdi-vector-square" label="AOI" v-model="selectedAOI" :items="aois" item-text="name"/> -->
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="createLayer"
          >
            Create layer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || "Name is required",
      },
      isRequired: {
        type: Boolean,
        default: false,
      },
      dialog: false,
      layer_name: "",
      sources: [
        {name: "AOI Layer", id: 1}
      ],
      chooseSource: 1,
      aois: [1, 2, 3],
      selectedAOI: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3'
      ]
    }
  },
  computed: {
    ...mapGetters('aoi', ['features'])
  },
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    selectDropdown() {
      // Open the select dropdown
      this.$refs.selectDropdown.isActive = true;
    },
    createLayer() {
      if (this.layer_name === "") {
        this.$snackbar.showError("Name layer is required")
      } else {
        const layer = {
          name: this.layer_name,
          features: this.features,
          view: false
        }
        this.$emit('addLayer', layer)
        this.dialog = false
      }
    }
  }
}
</script>
<style scoped>
.header {
  height: 50px;
  padding-left: 10px;
  background-color: antiquewhite;
}
.contents {
  padding: 10px;
}
</style>