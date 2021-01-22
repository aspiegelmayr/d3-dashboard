import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: [ './line.component.css' ]
})
export class LineComponent implements OnInit  {
  public title = 'Line Chart';

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line!: d3Shape.Line<[number, number]>;

  constructor () {
    // configure margins and width/height of the graph
    this.width = 700;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }
  public ngOnInit(): void {
    
    this.buildSvg();
    d3.csv("/assets/data.csv").then(data => this.drawLineAndPath(data));
  }
  
  private buildSvg() {
    this.svg = d3.select('figure#line')
    .append("svg")
    .attr("width", 600)
    .attr("height", 500)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  private addXandYAxis(data: any[]) {
    console.log(data)
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(data, (data) => data.ReviewNumber ));
    this.y.domain(d3Array.extent(data, (data) => data.Stars ));
    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));
  }

  private drawLineAndPath(data: any[]) {
    this.addXandYAxis(data);
    this.line = d3Shape.line()
        .x( (d: any) => this.x(d.ReviewNumber) )
        .y( (d: any) => this.y(d.Stars) );
    // Configuring line path
    this.svg.append('path')
        .datum(data)
        .attr('d', this.line)
        .attr("fill", "none")
        .attr("stroke", "#feb24c");
  }
}
//'#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'
