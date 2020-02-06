// Load in the CSV file
d3.csv("../data/darknet_markets.csv").then(data => {
    // console log the data
    console.log("data", data);

    // select the 'table' container in the HTML file
    const table = d3.select("#d3-table");

    // create a header row in the table
    const thead = table.append("thead");

    // modify the header row to add a title
    thead
        .append("tr")
        .append("th")
        .attr("colspan", 9)
        .text("Darknet Marketplaces");

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(d => d);

    const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");

    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        .attr("class", d => d.toString(d) == "TRUE" ? 'true' : 
                            d.toString(d) == "FALSE" ? 'false' : null)
        .text(d => d);

});