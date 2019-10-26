
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then((result) => {
        heatMap(result);
    });

d3.select('body')
    .append('h1')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature')

d3.select('body')
    .append('h3')
    .attr('id', 'description')
    .text('Based on a temperature of 8.66')

function heatMap(dataset) {

    const width = 1000;
    const height = 500;
    const padding = 100;
    
    d3.select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)


}






