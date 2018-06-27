import * as d3 from 'https://unpkg.com/d3?module'
let w = 500,
    h = 300;

let path = d3
    .geo
    .path();
let svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

d3.json('us.json', json => {
    svg
        .selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#f1f3f3')
});