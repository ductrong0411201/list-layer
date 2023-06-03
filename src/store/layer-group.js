class LayerGroup {
  constructor(form = { name: "New Group", layers: [] }) {
    this.name = form.name;
    this.layers = form.layers;
    this.isGroup = true
  }
  changeNameGroup(name_group) {
    this.name = name_group;
  }
  addLayerToGroup(layer) {
    this.layers.push(layer);
  }
  removeLayer(index) {
    this.layers.splice(index, 1);
  }
}

module.exports = LayerGroup;
