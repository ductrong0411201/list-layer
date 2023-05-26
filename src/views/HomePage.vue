<template>
  <div class="container">
    <v-card style="overflow-y: scroll">
      <v-card-title>Layer Controls</v-card-title>
      <v-card-actions>
        <div class="btn-group">
          <v-btn @click="addLayer">CREATE LAYER</v-btn>
          <v-btn @click="addGroupLayer">NEW GROUP</v-btn>
        </div>
      </v-card-actions>

      <v-card v-for="(item, i) in list.list" :key="i">
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-text>{{ item }}</v-card-text>
      </v-card>
    </v-card>
    <v-dialog v-model="dialog" width="50%">
      <v-card>
        <v-card-title>Add Layer</v-card-title>
        <v-card-text>
          <v-text-field v-model="formAddLayer.name" label="Name"></v-text-field>
          <v-select
            v-model="formAddLayer.type"
            :items="type"
            label="Type"
          ></v-select>
          <v-select
            v-model="formAddLayer.source_layer"
            :items="source_layer"
            label="Source Layer"
          ></v-select>
          <v-text-field
            v-model="formAddLayer.paint.fill_color"
            label="Color"
          ></v-text-field
        ></v-card-text>
        <v-card-actions>
          <v-btn @click="confirmAdd">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import LayerList from "@/store/layer-list";
import LayerGroup from "@/store/layer-group";
import Layer from "@/store/layer";
export default {
  data: () => {
    return {
      dialog: false,
      list: undefined,
      type: ["fill", "line", "symbol"],
      source_layer: ["landcover", "water", "waterway", "park"],
      formAddLayer: {
        name: "",
        type: "",
        source_layer: "",
        filter: [],
        paint: {
          fill_color: "",
        },
      },
    };
  },
  created() {
    this.list = new LayerList();
  },
  methods: {
    addLayer() {
      this.dialog = true;
    },
    confirmAdd() {
      const layer = new Layer(this.formAddLayer);
      this.list.addLayerToList(layer);
      this.dialog = false;
      this.formAddLayer = {
        name: "",
        type: "",
        source_layer: "",
        filter: [],
        paint: {
          fill_color: "",
        },
      };
    },
    addGroupLayer() {
      let form = {
        name: "New Group",
      };
      const layerGroup = new LayerGroup(form);
      this.list.addLayerGroupToList(layerGroup);
    },
  },
};
</script>

<style scoped>
.container {
  width: 60%;
  margin: auto;
  /* overflow-y: scroll; */
}
.btn-group {
  display: flex;
  justify-content: space-between;

  margin: 0 100px;
}
</style>
