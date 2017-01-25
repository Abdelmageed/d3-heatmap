import * as d3 from 'd3'
import tip from 'd3-tip'
import * as chrom from 'd3-scale-chromatic'

const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
const chart = () => {
    d3.json(dataUrl, (data) => {
        drawHeatMap(data)
    })
}

const drawHeatMap = (data) => {
    
    let baseTemp = data.baseTemperature,
        points = data.monthlyVariance
    //x
    console.log (chrom.interpolateRdBu)
    let x = d3.scaleSequential()
        .interpolator(ineterpolateBuRd)
        .domain(d3.extent(points,(d=>d.variance + baseTemp)))
    
//        console.log(d3.extent(points,(d=>d.variance + baseTemp)));
    d3.select('body').append('svg')
        .attr('width', 960)
        .attr('height', 600)
        .append('rect')
        .attr('width', 50)
        .attr('height', 50)
        .attr('fill', x(2))

//    console.log(x(12));
}

const ineterpolateBuRd = t => {
    let white = {
        r:255,
        g:255,
        b:255
    },
        crimson = {
            r: 220,
            g: 20,
            b: 60
        },
        darkslateblue = {
            r: 72,
            g: 61,
            b: 139
        },
        col
    if (t <= 0.5) {
        col = lerpColor(darkslateblue, white, t*2)
    } else {
        col = lerpColor(white, crimson, (t-0.5)*2)
    }
//    let col = lerpColor(lerpColor(darkslateblue, white, t), lerpColor(white, crimson, t), t)
   
    return `rgb(${parseInt(col.r)}, ${parseInt(col.g)}, ${parseInt(col.b)})`
}
const lerpColor = (c1, c2, t) => {
//     console.log(c1,c2,t)
     return{
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t)}
   
}
const lerp = (v0, v1, t) => {
//    console.log((1 - t) * v0 + t * v1)
    return (1 - t) * v0 + t * v1
}
export default chart