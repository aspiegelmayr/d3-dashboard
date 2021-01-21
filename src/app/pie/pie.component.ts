import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    d3.csv("/assets/countries.csv").then(data => this.drawChart(data));
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );
}

private createColors(data: any[]): void {
  this.colors = d3.scaleOrdinal()
  .domain(data.map(d => d.Number.toString()))
  .range(["#edfff2", "#d4fadf", "#b5f5c8", "#92fcb2", "#74f79c", "#56f586", "#32db65", "#13d64e", "#00b336", "#08852e", "#075c21"]);
}

private drawChart(data: any[]): void {
  this.createColors(data)
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Number));

  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(this.radius)
  )
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#121926")
  .style("stroke-width", "1px")

  // Add labels
  const labelLocation = d3.arc()
  .innerRadius(100)
  .outerRadius(this.radius);

  this.svg
  .selectAll('pieces')
  .data(pie(data))
  .enter()
  .append('text')
  .text((d: { data: { Country: any, Number:any; }; }) => d.data.Country + "(" + d.data.Number+ ")")
  .attr("transform", (d: d3.DefaultArcObject) => "translate(" + labelLocation.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 15);
}

}
