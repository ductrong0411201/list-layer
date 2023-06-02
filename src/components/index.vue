<template>
  <div class="corner top-left">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          min-width="20px"
          width="60px"
          height="60px"
          class="ma-1"
          small
          v-bind="attrs"
          v-on="on"
          @click="showLayers"
        >
          <div class="d-flex flex-column">
            <v-icon class="mb-1" color="primary">mdi-layers</v-icon>
            <span class="primary--text text-btn">Layers</span>
          </div>
        </v-btn>
      </template>
      <span><span>Layers</span></span>
    </v-tooltip>
    <LayersManage ref="layersManage" @openFeature="showFeature"/>
    <DialogAddLayer ref="dialog" @addLayer="addLayer"/>
    <div class="draw-area d-flex" v-if="feature">
      <div class="feature">
        <v-tooltip bottom v-for="(draw, i) in btnDraw" :key="i">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              min-width="20px"
              width="48px"
              height="48px"
              class="ma-1"
              small
              v-bind="attrs"
              v-on="on"
              @click="chooseDraw(i)"
              :class="{ active: draw.active }"
            >
              <div class="d-flex flex-column">
                <v-icon class="mb-1" :color="draw.active ? 'white' : 'primary'">{{ draw.icon }}</v-icon>
              </div>
            </v-btn>
          </template>
          <span><span>{{ draw.name }}</span></span>
        </v-tooltip>
      </div>
      <div class="draw" v-if="addFeature">
        <v-menu offset-x>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  min-width="20px"
                  width="48px"
                  height="48px"
                  class="ma-1"
                  small
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <div class="d-flex flex-column">
                    <v-icon class="mb-1" color="primary">mdi-selection-drag</v-icon>
                  </div>
                </v-btn>
              </template>
              <span><span>Draw tool</span></span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in listDraw" :key="i" link>
              <v-list-item-title class="d-flex align-center" @click="drawControl(item.name)">
                <v-icon>{{ item.icon }}</v-icon>
                <span>Draw {{ item.name }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import LayersManage from './layers-manage.vue'
import DialogAddLayer from './dialog-addlayer.vue'

export default {
  name: "top-left-view",
  data() {
    return {
      dialog: true,
      feature: false,
      addFeature: true,
      btnDraw: [
        {name: "Add feature", icon: "mdi-shape-polygon-plus", active: true},
        {name: "Save", icon: "mdi-content-save", active: false},
        {name: "Close", icon: "mdi-close", active: false},
      ]
    }
  },
  computed: {
    ...mapGetters('map', ['listDraw']),
    ...mapGetters('aoi', ['features']),
  },
  components: {
    LayersManage,
    DialogAddLayer
  },
  methods: {
    ...mapActions('aoi', ['addDrawAoi', 'drawControl', 'saveDrawAoi', 'removeDrawControl']),
    showLayers() {
      this.$refs.layersManage.show()
    },
    showFeature() {
      if (!this.feature) {
        this.feature = true
        this.btnDraw[0].active = true
        this.btnDraw[2].active = false
      }
    },
    chooseDraw(i) {
      const _this = this
      this.btnDraw.forEach((btn, index) => {
        if (index === i) {
          _this.btnDraw[index].active = true
        } else {
          _this.btnDraw[index].active = false
        }
      })
      switch(i) {
        case 0:
          this.addFeature = true
          break
        case 1:
          this.saveAoi()
          this.addFeature = false
          break
        case 2:
          this.closeFeature()
      }
    },

    closeFeature() {
      this.feature = false
      this.removeDrawControl()
    },
    async saveAoi() {
      if (this.features.length > 0) {
        this.$refs.dialog.open()
      } else {
        this.$snackbar.showError('Draw')
      }
    },
    addLayer(layer) {
      this.$refs.layersManage.addLayer(layer)
      this.closeFeature()
    }
  }
}
</script>
<style scoped lang="scss">
.corner {
  position: absolute;
  padding: 4px;
  &.top-left {
    top: 0;
    left: 0;
    .draw-area {
      position: absolute;
      top: 0;
      left: 300px;
      .active {
        background-color: #1a73e8;
        .btn {
          color: white;
        }
      }
    }
  }
}
</style>