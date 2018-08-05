const donutChart = () => {
    let width,
        height,
        margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        cornerRadius, // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.2%');

    const chart = selection => {
        selection.each(data => {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md

            // creates a new pie generator
            const pie = d3.pie()
                .value(d => floatFormat(d[variable]))
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            const radius = Math.min(width, height) / 2;
            const arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // this arc is used for aligning the text labels
            const outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            // ===========================================================================================

            // append the svg object to the selection
            const svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${width/2}, ${height / 2})`);
            // ===========================================================================================

            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');
            // ===========================================================================================

            // add and colour the donut slices
            const path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
                .enter().append('path')
                .attr('fill', d => colour(d.data[category]))
                .attr('d', arc);
            // ===========================================================================================
            // calculates the angle for the middle of a slice
            const midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;
            // add text labels
            const label = svg.select('.labelName').selectAll('text')
                .data(pie)
                .enter().append('text')
                .attr('dy', '.35em')
                // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                .html(d => `${d.data[category]} <tspan> ${percentFormat(d.data[variable])} </tspan>`)
                .attr('transform', d => {

                    // effectively computes the centre of the slice.
                    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                    const pos = outerArc.centroid(d);

                    // changes the point to be on left or right depending on where label is.
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                // if slice centre is on the left, anchor text to start, otherwise anchor to end
                .style('text-anchor', d => (midAngle(d)) < Math.PI ? 'start' : 'end');
            // ===========================================================================================

            // add lines connecting labels to slice. A polyline creates straight lines connecting several points
            const polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie)
                .enter().append('polyline')
                .attr('points', d => {

                    // see label transform function for explanations of these three lines.
                    const pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });
            // ===========================================================================================

            // #region mouse event / tooltip functions

            // function that creates and adds the tool tip to a selected element
            const toolTip = selection => {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', data => {

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55) // radius of tooltip circle
                        .style('fill', colour(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                });

                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', () => d3.selectAll('.toolCircle').remove());
            }
            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);

            // function to create the HTML string for the tool tip. Loops through each key in data object
            // and returns the html string key: value
            const toolTipHTML = data => {

                let tip = '',
                    i = 0;

                for (const key in data.data) {

                    // if value is a number, format it as a percentage
                    const value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += `<tspan x="0">${key}: ${value}</tspan>`;
                    else tip += `<tspan x="0" dy="1.2em">${key}: ${value}</tspan>`;
                    i++;
                }

                return tip;
            }
            // #endregion

        });
    }
    // #region get; set;
    // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
    chart.width = value => {
        !value ? width : width = value;
        return chart;
    };

    chart.height = value => {
        !value ? height : height = value;
        return chart;
    };

    chart.margin = value => {
        !value ? margin : margin = value;
        return chart;
    };

    chart.radius = value => {
        !value ? radius : radius = value;
        return chart;
    };

    chart.padAngle = value => {
        !value ? padAngle : padAngle = value;
        return chart;
    };

    chart.cornerRadius = value => {
        !value ? cornerRadius : cornerRadius = value;
        return chart;
    };

    chart.colour = value => {
        !value ? colour : colour = value;
        return chart;
    };

    chart.variable = value => {
        !value ? variable : variable = value;
        return chart;
    };

    chart.category = value => {
        !value ? category : category = value;
        return chart;
    };
    // #endregion

    return chart;
}