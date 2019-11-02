
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
    const padding = 60;
    const pLeft = 120;
    const pBottom = 100;

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
                        .range([pLeft, width - padding]);

    const yScale = d3.scaleLinear()
                        .domain([d3.max(mVariance, (d) => d['month']), 
                                 d3.min(mVariance, (d) => d['month']) - 1])
                        .range([height - pBottom, padding]);

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
        .attr('transform', 'translate(0,' + (height - pBottom) + ')')
        .call(xAxis)
        .call(g => g.selectAll('.tick text')
                    .style('font-size', '0.65rem'));

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + pLeft + ', 0)')
        .call(yAxis)
        .call(g => g.selectAll('.tick line')
                    .attr('transform', 'translate(0, -18)'))
        .call(g => g.selectAll('.tick text')
                    .style('font-size', '0.7rem')
                    .attr('x', '-14')
                    .attr('dy', '-15'));

    d3.selectAll('g.tick')
      .filter(function(d) {
          return (d === 0)
      }).remove()

    
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('position', 'absolute')
                    .style('z-index', '10')
                    .style('opacity', '0.8')
                    .style('border-radius', '5px')
                    .style('background-color', 'beige')
                    .style('padding', '0.6rem')
                    .style('visibility', 'hidden')

    svg.selectAll('rect')
        .data(mVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', (d) => {

            let temp = bTemperature + d['variance'];

            switch(true) {
                case (temp < 4):
                    color = 'hsl(220, 100%, 50%)';
                    break;
                case (temp < 5):
                        color = 'hsl(200, 100%, 50%)';
                        break;
                case (temp < 6):
                        color = 'hsl(180, 100%, 50%)';
                        break;
                case (temp < 7):
                        color = 'hsl(100, 90%, 40%)';
                        break;
                case (temp < 8):
                        color = 'hsl(90, 80%, 60%)';
                        break;
                case (temp < 9):
                        color = 'hsl(55, 100%, 80%)';
                        break;
                case (temp < 10):
                        color = 'hsl(50, 100%, 60%)';
                        break;
                default: 
                    color = 'hsl(45, 100%, 50%)';
            }
            return color;
        })
        .attr('data-year', (d) => d['year'])
        .attr('data-month', (d) => d['month'] - 1)
        .attr('data-temp', (d) => bTemperature + d['variance'])
        .attr('width', '0.32rem')
        .attr('height', '1.95rem')
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


        let colors = ['hsl(220, 100%, 50%)', 'hsl(200, 100%, 50%)', 'hsl(180, 100%, 50%)',
                      'hsl(100, 90%, 40%)',  'hsl(100, 90%, 40%)',  'hsl(55, 100%, 80%)',
                      'hsl(50, 100%, 60%)',  'hsl(45, 100%, 50%)'];

        let labels = ['0 to 4', '4 to 5', '5 to 6', '6 to 7', '7 to 8', '8 to 9', '9 to 10', '10+']

        let legend = svg.append('g')
            .attr('id', 'legend')
        
        legend.selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('x', (d, i) => 424 + i * 44)
            .attr('y', 480)
            .attr('width', '2.6rem')
            .attr('height', '1rem')
            .attr('fill', d => d)

        legend.selectAll('text')
            .data(labels)
            .enter()
            .append('text')
            .attr('x', ( d, i) => { return ( d == '10+' ? 436 : 430 ) + i * 44 } )
            .attr('y', 510)
            .style('font-size', '0.8rem')
            .text(d => d)

}







