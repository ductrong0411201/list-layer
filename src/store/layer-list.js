class LayerList {
  list = [];
  getList() {
    return this.list;
  }
  addLayerToList(layer) {
    this.list.push(layer);
  }
  addLayerGroupToList(group) {
    this.list.push(group);
  }
  remove(i) {
    this.list.splice(i, 1);
  }
}

module.exports = LayerList;
