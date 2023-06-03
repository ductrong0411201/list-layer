<template>
  <div class="container">
    <v-card>
      <v-card-title>Layer Controls</v-card-title>
      <v-card-actions>
        <div class="btn-group">
          <v-btn @click="addLayer()">CREATE LAYER</v-btn>
          <v-btn @click="addGroupLayer">NEW GROUP</v-btn>
        </div>
      </v-card-actions>
      <v-layout class="list-layers align-content-start flex-wrap">
        <draggable
          v-model="list.list"
          :options="dragOptions"
          style="width: 100%"
        >
          <transition-group>
            <v-layout
              :style="layer.isGroup ? 'height: 120px' : 'height: 80px'"
              class="layer elevation-1"
              v-for="(layer, i) in list.list"
              :key="i"
              style="margin: 8px auto"
            >
              <v-layout v-if="layer.isLayer">
                <div class="drag-handle d-flex justify-center">
                  <v-icon small>mdi-arrow-up-down</v-icon>
                </div>
                <div class="contents flex-grow-1">
                  <h4 class="name">{{ layer.name }}</h4>
                  <div class="name">{{ layer.type }}</div>
                  <div class="name">{{ layer.source_layer }}</div>
                </div>
                <div class="control">
                  <v-btn icon small class="btn-control">
                    <v-icon>mdi-crosshairs-gps</v-icon>
                  </v-btn>
                  <v-btn icon small class="btn-control">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="removeLayer(i)">
                    <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </div>
              </v-layout>
              <v-layout v-if="layer.isGroup">
                <div
                  class="drag-handle d-flex justify-center"
                  style="background-color: blue"
                >
                  <v-icon small>mdi-arrow-up-down</v-icon>
                </div>
                <div class="contents flex-grow-1">
                  <h4 class="name">{{ layer.name }}</h4>
                  <draggable v-model="layer.layers" :options="dragOptions">
                    <transition-group
                      ><v-layout
                        class="layer-group elevation-1"
                        v-for="(item, index) in layer.layers"
                        :key="index"
                        style="margin: 8px 10px 8px 0"
                      >
                        <div class="drag-handle d-flex justify-center">
                          <v-icon x-small>mdi-arrow-up-down</v-icon>
                        </div>
                        <div class="contents flex-grow-1">
                          <h4 class="name">{{ item.name }}</h4>
                        </div>
                      </v-layout>
                    </transition-group></draggable
                  >
                </div>

                <div class="control">
                  <v-btn icon small class="btn-control" @click="addLayer(i)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    class="btn-control"
                    @click="changeNameGroup(i)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="removeLayer(i)">
                    <v-icon class="mr-2">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </div>
              </v-layout>
            </v-layout>
          </transition-group>
        </draggable>
      </v-layout>
    </v-card>
    <v-dialog v-model="renameGroup" width="50%">
      <v-card>
        <v-card-text>
          <v-text-field v-model="groupName" placeholder="Enter new name">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="confirmRename">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import draggable from "vuedraggable";
import LayerList from "@/store/layer-list";
import LayerGroup from "@/store/layer-group";
import Layer from "@/store/layer";
import axios from "axios";
export default {
  data: () => {
    return {
      showLayers: true,
      dragOptions: {
        handle: ".drag-handle",
      },
      renameGroup: false,
      groupName: "",
      index: null,
      add_layer_to_group: false,
      data: [],
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
  components: {
    draggable,
  },
  created() {
    this.list = new LayerList();
    this.getData();
  },
  methods: {
    async getData() {
      const res = await axios.get(
        "https://tiles.skymapglobal.vn/styles/basic/style.json"
      );
      this.data = res.data.layers;
    },
    addLayer(i) {
      if (i != undefined) {
        this.index = i;
        this.add_layer_to_group = true;
      }
      this.dialog = true;
    },
    confirmAdd() {
      if (this.add_layer_to_group) {
        this.list.list[this.index].addLayerToGroup(
          new Layer(this.formAddLayer)
        );
        this.add_layer_to_group = false;
      } else {
        this.list.addLayerToList(new Layer(this.formAddLayer));
      }
      this.dialog = false;
      this.index = null;
      this.formAddLayer = {
        name: "",
        type: "",
        source_layer: "",
        filter: [],
        paint: {
          fill_color: "",
        },
      };
      console.log(this.list);
    },
    addGroupLayer() {
      const layerGroup = new LayerGroup();
      this.list.addLayerGroupToList(layerGroup);
    },
    removeLayer(i) {
      this.list.remove(i);
    },
    changeNameGroup(i) {
      this.renameGroup = true;
      this.index = i;
    },
    confirmRename() {
      this.list.list[this.index].changeNameGroup(this.groupName);
      this.renameGroup = false;
      this.index = null;
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 60%;
  margin: auto;
  overflow: auto;
}
.btn-group {
  display: flex;
  justify-content: space-between;
  margin: 0 100px;
}
.layer {
  margin: 0 auto;
  width: 80%;
  border-radius: 5px;
  background-color: bisque;
}
.layer-group {
  margin: 0 auto;

  background-color: white;
}
</style>
