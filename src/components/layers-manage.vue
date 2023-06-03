<template>
  <div>
    <v-layout
      v-if="showLayers"
      class="fill-height layers d-flex flex-column"
      style="background-color: bisque"
    >
      <v-container class="header d-flex justify-space-between">
        <div class="btn" @click="hideLayersManage">
          <svg
            data-v-037cf726=""
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              data-v-037cf726=""
              r="10"
              transform="matrix(-1 0 0 1 10 10)"
              fill="white"
            ></circle>
            <path
              data-v-037cf726=""
              d="M11.6667 14.1673L7.5 10.0007L11.6667 5.83398"
              stroke="#5B778F"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
        <span class="ml-2 white--text">Layers Control</span>
        <v-spacer></v-spacer>
      </v-container>
      <div class="tools d-flex align-center">
        <v-btn x-small class="ml-2" color="primary" @click="addLayer"
          >Create layer</v-btn
        >
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              x-small
              v-bind="attrs"
              v-on="on"
              class="btn-control"
              @click="removeAllLayers"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
          <span>remove all layers</span>
        </v-tooltip>
      </div>
      <v-divider></v-divider>
      <v-layout class="list-layers align-content-start flex-wrap">
        <draggable
          v-model="layers"
          :options="dragOptions"
          @update="handleDragUpdate"
        >
          <transition-group>
            <v-layout
              class="layer elevation-1"
              v-for="(layer, i) in layers"
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
    </v-layout>
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
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
  data() {
    return {
      showLayers: true,
      layers: undefined,
      dragOptions: {
        handle: ".drag-handle",
      },
      dialog: false,
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
  computed: {
    ...mapGetters("workspace", ["workspaceId"]),
  },
  created() {
    this.layers = new LayerList();
  },
  components: {
    draggable,
  },
  methods: {
    ...mapActions("aoi", ["viewLayer", "saveLayerToAoi", "fetchAois"]),
    hideLayersManage() {
      this.showLayers = false;
    },
    show() {
      this.showLayers = true;
    },
    removeAllLayers() {
      this.layers = [];
    },
    handleDragUpdate(e) {
      console.log("update drag", e);
    },
    addLayer() {
      this.dialog = true;
    },
    confirmAdd() {
      const layer = new Layer(this.formAddLayer);
      this.layers.addLayerToList(layer);
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
      this.layers.addLayerGroupToList(layerGroup);
    },
    addLayerToMap(layer, index) {
      this.layers[index].view = true;
      this.viewLayer(layer);
    },
    removeLayerFromMap(layer, index) {
      this.layers[index].view = false;
    },
    async saveLayer(layer) {
      const data = {
        name_aoi: layer.name,
        workspaceId: this.workspaceId,
        features: layer.features,
      };
      await this.saveLayerToAoi(data);
      await this.fetchAois({ workspaceId: this.workspaceId });
    },
    removeLayer(i) {
      this.layers.splice(i, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
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
