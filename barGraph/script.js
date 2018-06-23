import * as d3 from 'https://unpkg.com/d3?module'
let w = 300,
    h = 100,
    padding = 2,
    data = [5,10,15,20]

let svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

svg.select