import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
export class ScatterComponent implements OnInit {
  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width = 700;
  private height = 500 - this.margin.top - this.margin.bottom;;
  private x: any;
  private y: any;
  private svg: any;
  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    d3.csv("/assets/data.csv").then(data => this.drawPlot(data));
  }

  private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
    .attr("width", 700)
    .attr("height", 500)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
}

private drawPlot(data: any[]): void {
  // Add X axis
  const x = d3.scaleLinear()
  .domain([1, 200])
  .range([ 0, 600 ]);
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  // Add Y axis
  const y = d3.scaleLinear()
  .domain([0, 10])
  .range([ this.height, 0]);
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Add dots
  const dots = this.svg.append('g');
  dots.selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", (d: { ReviewNumber: d3.NumberValue; }) => x(d.ReviewNumber))
  .attr("cy", (d: { Stars: d3.NumberValue; }) => y(d.Stars))
  .attr("r", 7)
  .style("opacity", .5)
  .style("fill", function(d: { Style: string },i: any){
    switch(d.Style){
      case "Bowl":
        return "#ffeda0"
        break;
      case "Tray":
        return "#feb24c"
        break;
      case "Pack":
        return "#fc4e2a"
        break;
        case "Cup":
        return "#bd0026"
        break;
        default:
          console.log(d.Style)
          return "#800026"
    }
});

//'#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
  // Add labels
  dots.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("x", (d: { ReviewNumber: d3.NumberValue; }) => x(d.ReviewNumber))
  .attr("y", (d: { Stars: d3.NumberValue; }) => y(d.Stars))
}


}
