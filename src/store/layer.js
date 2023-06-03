class Layer {
  constructor(
    form = {
      name: null,
      type: null,
      source_layer: null,
      metadata: null,
      minzoom: undefined,
      maxzoom: undefined,
      layout: null,
      filter: null,
      paint: null,
    }
  ) {
    this.name = form.name;
    this.type = form.type;
    this.filter = form.filter;
    this.layout = form.layout;
    this.paint = form.paint;
    this.metadata = form.metadata;
    this.minzoom = form.minzoom;
    this.maxzoom = form.maxzoom;
    this.source_layer = form.source_layer;
    this.isLayer = true;
  }
}

module.exports = Layer;
