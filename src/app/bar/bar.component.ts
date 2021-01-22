import { Component, Input, OnInit } from '@angular/core';
import * as d3 from "d3";
import * as d3Tip from "d3-tip"

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
  
})
export class BarComponent implements OnInit {
  @Input() country: string | undefined;

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  private tooltip: any
  

  constructor() { }

  ngOnInit(): void {
    console.log(this.country)
    this.createSvg();
    if(this.country == "japan"){
        d3.csv("/assets/japan.csv").then(data => this.drawBars(data));
      } 
      else if(this.country == "usa"){
        d3.csv("/assets/usa.csv").then(data => this.drawBars(data));
      }
      
      else {
        d3.csv("/assets/data.csv").then(data => this.drawBars(data));
      }
    
  }

  private createSvg(): void {
    const tip = Object.defineProperty(d3, 'tip', {
      value: d3Tip
    });;
    this.svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
}

private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Framework))
  .padding(0.2);
  
  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 10])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: { Framework: string; }) => x(d.Framework))
  .attr("y", (d: { Stars: d3.NumberValue; }) => y(d.Stars))
  .attr("width", x.bandwidth())
  .attr("height", (d: { Stars: d3.NumberValue; }) => this.height - y(d.Stars))
  .attr("fill", "#fc4e2a")
  .append('title')
  .text((d: { Framework: any; Stars: any; }) => `Sales were ${d.Framework} in ${d.Stars}`)
}


}
