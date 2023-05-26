class Layer {
  constructor(
    form = {
      name: "aeroway_fill",
      type: "fill",
      source_layer: "aeroway",
      filter: [],
      paint: {
        fill_color: "hsl(230, 29%, 89%)",
      },
    }
  ) {
    this.name = form.name;
    this.type = form.type;
    this.filter = form.filter;
    this.layout = form.layout;
    this.paint = form.paint;
    this.source_Layer = form.source_Layer;
    this.isLayer = true
  }
}

module.exports = Layer;
