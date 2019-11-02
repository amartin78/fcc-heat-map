
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

    const width = 1200;
    const height = 530;
    const padding = 80;

    const bTemperature = dataset['baseTemperature'];
    const mVariance = dataset['monthlyVariance'];

    const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
       10: 'October',
       11: 'November',
       12: 'December'
    };
    
    const svg = d3.select('body')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

    const xScale = d3.scaleLinear()
                        .domain([d3.min(mVariance, (d) => d['year']), 
                                 d3.max(mVariance, (d) => d['year']) + 2])
                        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
                        .domain([d3.max(mVariance, (d) => d['month']), 
                                 d3.min(mVariance, (d) => d['month']) - 1])
                        .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale)
                    .ticks(27)
                    .tickSizeOuter(0)
                    .tickFormat((d) => {
                        return d;
                    });

    const yAxis = d3.axisLeft(yScale)
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
                    .attr('transform', 'translate(0, -18)'))
        .call(g => g.selectAll('.tick text')
                    .style('font-size', '0.75rem')
                    .attr('x', '-14')
                    .attr('dy', '-15'));

    d3.selectAll('g.tick')
      .filter(function(d) {
          console.log(d)
          return (d === 0)
      }).remove()

    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('opacity', '0.85')
                    .style('border-radius', '5px')
                    .style('background-color', 'white')
                    .style('padding', '0.6rem')
                    .style('visibility', 'hidden')

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
                case (temp < 7.5):
                        color = 'green';
                        break;
                case (temp < 8):
                        color = 'yellow';
                        break;
                case (temp < 8.5):
                        color = 'orange';
                        break;
                case (temp < 9):
                        color = 'darkorange';
                        break;
                case (temp < 10):
                        color = 'chocolate';
                        break;
                default: 
                    color = 'brown';
            }
            return color;
        })
        .attr('data-year', (d) => d['year'])
        .attr('data-month', (d) => d['month'] - 1)
        .attr('data-temp', (d) => bTemperature + d['variance'])
        .attr('width', '0.32rem')
        .attr('height', '1.93rem')
        .attr('x', (d) => xScale(d['year'] + 0.2))
        .attr('y', (d) => yScale(d['month'] - 1))
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


        let colors = [['cadetBlue', '3.5'], ['blue', '4'], ['green', '4.5'], ['orange', '5'], 
                      ['brown', '5.5']];

        let legend = svg.append('g')
            .attr('id', 'legend')
        
        legend.selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => 200 + i * 42)
            .attr('y', 486)
            .attr('width', '2.5rem')
            .attr('height', '1rem')
            .attr('fill', d => d[0])

        legend.selectAll('text')
            .data(colors)
            .enter()
            .append('text')
            .attr('id', 'legend')
            .attr('x', ( d, i) => 200 + i * 46 )
            .attr('y', 516)
            .style('font-size', '0.8rem')
            .text(d => d[1])

    
}






