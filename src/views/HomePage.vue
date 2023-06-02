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

      <v-layout class="list-layers align-content-start flex-wrap">
        <draggable
          v-model="layers"
          :options="dragOptions"
        >
          <transition-group>
            <v-layout
              class="layer elevation-1"
              v-for="(layer, i) in list.list"
              :key="i"
            >
              <div class="drag-handle d-flex justify-center">
                <v-icon x-small>mdi-arrow-up-down</v-icon>
              </div>
              <div class="contents flex-grow-1">
                <div class="name">{{ layer.name }}</div>
              </div>
              <div class="control">
                <v-btn
                  v-if="layer.view"
                  icon
                  x-small
                  class="btn-control"
                  @click="removeLayerFromMap(layer, i)"
                >
                  <v-icon small>mdi-eye</v-icon>
                </v-btn>
                <!-- <v-tooltip bottom v-else>
                <template v-slot:activator="{ attrs, on }"> -->
                <v-btn
                  v-else
                  icon
                  x-small
                  class="btn-control"
                  @click="addLayerToMap(layer, i)"
                >
                  <v-icon small>mdi-eye-off</v-icon>
                </v-btn>
                <!-- </template>
                <span>hide layer</span>
              </v-tooltip> -->
                <v-btn icon x-small class="btn-control">
                  <v-icon small>mdi-crosshairs-gps</v-icon>
                </v-btn>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon x-small v-bind="attrs" v-on="on">
                      <v-icon small class="btn-control"
                        >mdi-dots-vertical</v-icon
                      >
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item class="btn btn-list-item">
                      <v-list-item-title @click="saveLayer(layer)">
                        <v-icon small class="mr-2">mdi-download-outline</v-icon>
                        <span style="font-size: 14px">Save aoi</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item class="btn btn-list-item">
                      <v-list-item-title @click="removeLayer(i)">
                        <v-icon small class="mr-2"
                          >mdi-trash-can-outline</v-icon
                        >
                        <span style="font-size: 14px">Delete</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-layout>
          </transition-group>
        </draggable>
      </v-layout>
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
import draggable from "vuedraggable";
import LayerList from "@/store/layer-list";
import LayerGroup from "@/store/layer-group";
import Layer from "@/store/layer";
export default {
  data: () => {
    return {
      showLayers: true,
      layers: [{ name: "111", view: false }, { name: "222", view: false }],
      dragOptions: {
        handle: '.drag-handle'
      },
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

<style lang="scss" scoped>
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
.layers {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  height: 100vh;
  width: 300px;
  z-index: 3;
  .header {
    background-color: rgb(91, 119, 143);
  }
  .tools {
    height: 40px;
    .btn-control {
      margin: 4px;
    }
  }
  .list-layers {
    .layer {
      margin: 10px;
      width: 280px;
      height: 50px;
      background-color: aqua;
      .drag-handle {
        width: 10px;
        background-color: aquamarine;
        &:hover {
          cursor: n-resize;
        }
      }
      .contents {
        margin-left: 4px;
        .name {
          font-size: 14px;
        }
      }
      .control {
        .btn-control {
          margin: 2px;
        }
      }
    }
  }
}
.btn-list-item {
  &:hover {
    background-color: #e7e7e7 !important;
  }
  min-height: 30px;
}
</style>

