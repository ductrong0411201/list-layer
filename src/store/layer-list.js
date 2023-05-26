class LayerList {
  list = [];
  constructor(layers, groups) {
    this.layers = layers;
    this.groups = groups;
  }
  getList() {
    return this.list;
  }
  addLayerToList(layer) {
    this.list.push(layer);
  }
  addLayerGroupToList(group) {
    this.list.push(group);
  }
}

module.exports = LayerList;
