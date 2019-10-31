
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then((result) => {
        heatMap(result);
    });

d3.select('body')
    .append('h1')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature');

d3.select('body')
    .append('h3')
    .attr('id', 'description')
    .text('Based on a temperature of 8.66');

function heatMap(dataset) {

    const width = 1000;
    const height = 500;
    const padding = 100;

    const bTemperature = dataset['baseTemperature'];
    const mVariance = dataset['monthlyVariance'];

    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
       10: 'November',
       11: 'December'
    };
    
    const svg = d3.select('body')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

    const xScale = d3.scaleLinear()
                        .domain([ d3.min(mVariance, (d) => d['year']), d3.max(mVariance, (d) => d['year']) + 2 ])
                        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
                        .domain([ d3.max(mVariance, (d) => d['month']-1), d3.min(mVariance, (d) => d['month'] - 1) ])
                        .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale)
                    .ticks(27)
                    .tickSizeOuter(0)
                    .tickFormat((d) => {
                        return d;
                    });

    const yAxis = d3.axisLeft(yScale)
                    .ticks(12)
                    .tickSizeOuter(0)
                    .tickFormat((d) => {
                        return months[d];
                    });

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(xAxis)

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis)
        .call(g => g.selectAll('.tick line')
                    .attr('transform', 'translate(0, -14)'))
        .call(g => g.selectAll('.tick text')
                    .attr('dy', '-11'));

    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    // .attr('width', '1rem')
                    // .attr('height', '3rem')
                    .style('visibility', 'hidden')
                    // .text('tooltip info...')

    svg.selectAll('rect')
        .data(mVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .style('position', 'relative')
        .attr('fill', (d) => {

            let temp = bTemperature + d['variance'];
            switch(true) {
                case (temp < 3):
                    color = 'white';
                    break;
                case (temp < 6):
                    color = 'blue';
                    break;
                case (temp < 9):
                    color = 'green';
                    break;
                default: 
                    color = 'orange';
            }
            return color;
        })
        .attr('data-year', (d) => d['year'])
        .attr('data-month', (d) => d['month'] - 1)
        .attr('data-temp', (d) => bTemperature + d['variance'])
        .attr('width', '0.3rem')
        .attr('height', '1.85rem')
        .attr('x', (d) => xScale(d['year']))
        .attr('y', (d) => yScale(d['month']-2.08))
        .on('mouseover', (d) => {
            // d3.select(this).attr('fill', 'pink')
            tooltip.style('visibility', 'visible')
            tooltip.attr('data-year', d['year'])
            tooltip.html(d['year'] + ' ' + d['variance'] )
                    .style('left', padding + xScale(d['year']))
                    .style('top', padding + yScale(d['month']))
            
                    console.log(this)

        })
        .on('mouseout', (d, i) => {
            tooltip.style('visibility', 'hidden')
        })

        let colors = ['white', 'blue', 'green', 'orange'];


        let label = svg.append('g')
            .attr('id', 'legend')

        label.selectAll('text')
            .data(colors)
            .enter()
            .append('text')
            .attr('id', 'legend')
            .attr('x', ( d, i) => 170 + i * 40 )
            .attr('y', 494)
            .text((d) => d)
        
        label.selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => 200 + i * 20)
            .attr('y', 460)
            .attr('width', '1rem')
            .attr('height', '1rem')
            .attr('fill', (d) => d)

     
            

    
}






