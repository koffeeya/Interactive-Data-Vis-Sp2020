/* CONSTANTS & GLOBALS
variables we will access or change in the rest of the code */

// Constants
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = {
    top: 20,
    bottom: 50,
    left: 60,
    right: 40
  };

// Globals
let svg;
let xScale;
let yScale;


/* APPLICATION STATE
variable to store current state of data */
let state = {
  data: []
}


/* LOAD DATA 
load data and run the init() function */
d3.csv("../data/studentLoans.csv", d3.autotype, d => ({
  year: d.year,
  age: d.age_group,
  amount: +d.amount_owed,
  percent: d.percent_of_total,
})).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
});


/* INITIALIZING FUNCTION 
runs one time to set up scales, axes, and UI */
function init() {

  // Scales


  // Axes


  // UI element setup


  // SVG setup


  // Draw
}

/* DRAW FUNCTION
called every time the data/state is updated */
function draw() {

  // Filters

  // SVG: Enter, update, and exit
  // enter


  // update


  // exit

}