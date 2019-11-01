
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then((result) => {
        heatMap(result);
    });

d3.select('body')
    .append('h2')
    .attr('id', 'title')
    .text('Monthly Global Land-Surface Temperature');

d3.select('body')
    .append('h3')
    .attr('id', 'description')
    .text('Based on a temperature of 8.66');

function heatMap(dataset) {

    // const width = 1000;
    // const height = 500;
    const width = 1200;
    const height = 530;
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
        .call(g => g.selectAll('.tick text')
                    .style('font-size', '0.65rem'));

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis)
        .call(g => g.selectAll('.tick line')
                    .attr('transform', 'translate(0, -14)'))
        .call(g => g.selectAll('.tick text')
                    .style('font-size', '0.75rem')
                    .attr('x', '-14')
                    .attr('dy', '-11'));

    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('opacity', '0.85')
                    .style('border-radius', '5px')
                    .style('background-color', '#fff')
                    .style('padding', '0.6rem')
                    .style('visibility', 'hidden')
                    // .style('display', 'flex')

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
                    color = 'blue';
                    break;
                case (temp < 6):
                    color = 'lightBlue';
                    break;
                case (temp < 7):
                        color = 'lightGreen';
                        break;
                case (temp < 8):
                        color = 'green';
                        break;
                case (temp < 9):
                        color = 'peru';
                        break;
                case (temp < 10):
                        color = 'darkorange';
                        break;
                default: 
                    color = 'brown';
            }
            return color;
        })
        .attr('data-year', (d) => d['year'])
        .attr('data-month', (d) => d['month'] - 1)
        .attr('data-temp', (d) => bTemperature + d['variance'])
        // .attr('width', '0.3rem')
        // .attr('height', '1.85rem')
        .attr('width', '0.32rem')
        .attr('height', '2.1rem')
        .attr('x', (d) => xScale(d['year']))
        .attr('y', (d) => yScale(d['month']-2.08))
        .on('mouseover', (d) => {
            tooltip.style('visibility', 'visible')
            tooltip.attr('data-year', d['year'])
            tooltip.html( months[d['month']] + ' ' + d['year'] + '<br>' + 
                         (bTemperature + d['variance']).toFixed(1) + '<br>' + d['variance'].toFixed(1))
                    .style('left', padding + xScale(d['year']) - 20)
                    .style('top', padding + yScale(d['month']) - 70)
                    .style('text-align', 'center')

        })
        .on('mouseout', (d) => tooltip.style('visibility', 'hidden'))


        let colors = ['blue', 'green', 'orange', 'brown'];

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






