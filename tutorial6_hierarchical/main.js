/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = {
    top: 20,
    bottom: 50,
    left: 60,
    right: 40
  };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  data: null,
  hover: null,
  mousePosition: null,
};

/**
 * LOAD DATA
 * */
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  console.log(state.data);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3
  .select("#d3-container")
  .style("position", "relative");

  // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT

  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute")

  // CREATE CONTAINER ELEMENT
  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // COLOR SCALE
  const colorScale = d3.scaleOrdinal(d3.schemeSet3);

  // + CREATE YOUR ROOT HIERARCHY NODE
  const root = d3
    .hierarchy(state.data) // access children
    .sum(d => d.value) // sets value
    .sort((a, b) => b.value - a.value)

  // + CREATE YOUR LAYOUT GENERATOR

  const pack = d3
    .pack()
    .size([width, height])
    .padding(2);

  // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
  pack(root);

  // + CREATE YOUR GRAPHICAL ELEMENTS

  // Create a g for each leaf
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add rects + colorscale + tooltip
  
  leaf
    .append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => {
      const level1 = d.ancestors().find(d => d.depth == 1);
      return colorScale(level1.data.name)
    })
    .on("mouseover", d => {
      state.hover = {
        translate: [
          d3.mouse(svg.node())[0],
          d3.mouse(svg.node())[1],
        ],
        name: d.data.name,
        value: d.data.value,
        title: `${d
            .ancestors()
            .reverse()
            .map(d => d.data.name)
            .join(" > ")}`
      };
      draw();

    });

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // + UPDATE TOOLTIP
  if (state.hover) {
    tooltip
    // Set appearance of tooltip
      .html(
        `
        <div>Name: ${state.hover.name} </div>
        <div>Value: ${state.hover.value} </div>
        <div>Hierarchy Path: ${state.hover.title}</div>
        `
      )
      .transition(d3.easeQuadInOut())
      .duration(200)
      .style(
        "transform",
        `translate(
          ${state.hover.translate[0]}px,
          ${state.hover.translate[1]}px
        )`
      );

  }

}