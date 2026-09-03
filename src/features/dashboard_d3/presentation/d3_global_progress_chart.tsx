/**
 * AGB CHANTIER - Graphique D3.js : Taux d'Avancement Global & par Chantier
 */

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ProjectProgressData } from "../domain/dashboard_d3_types";
import { Layers, Info } from "lucide-react";

interface D3GlobalProgressChartProps {
  data: ProjectProgressData[];
  onSelectProject?: (projectId: string) => void;
}

export const D3GlobalProgressChart: React.FC<D3GlobalProgressChartProps> = ({
  data,
  onSelectProject,
}) => {
  const donutSvgRef = useRef<SVGSVGElement | null>(null);
  const barsSvgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ProjectProgressData | null>(null);

  // Compute weighted or global average progress
  const averageProgress = data.length > 0
    ? Math.round(data.reduce((acc, p) => acc + p.progressPercentage, 0) / data.length)
    : 0;

  // 1. Draw D3 Donut / Gauge for Global Average
  useEffect(() => {
    if (!donutSvgRef.current) return;

    const svg = d3.select(donutSvgRef.current);
    svg.selectAll("*").remove();

    const width = 190;
    const height = 190;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.72;

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ value: number; color: string }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 6)
      .cornerRadius(4);

    const pieData = [
      { value: averageProgress, color: "#ea580c" }, // Orange AGB
      { value: 100 - averageProgress, color: "#e2e8f0" }, // Slate 200
    ];

    const pie = d3
      .pie<{ value: number; color: string }>()
      .value((d) => d.value)
      .sort(null)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    // Background track arc
    const backgroundArc = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 6)
      .startAngle(-0.75 * Math.PI)
      .endAngle(0.75 * Math.PI);

    g.append("path")
      .attr("d", backgroundArc as any)
      .attr("fill", "#f1f5f9")
      .attr("class", "dark:fill-slate-800");

    // Progress arc
    const progressAngle = -0.75 * Math.PI + (1.5 * Math.PI * averageProgress) / 100;
    const activeArc = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 6)
      .cornerRadius(5)
      .startAngle(-0.75 * Math.PI)
      .endAngle(progressAngle);

    g.append("path")
      .attr("d", activeArc as any)
      .attr("fill", "url(#progress-gradient)");

    // Define Gradient
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "progress-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#f97316");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#ea580c");

    // Center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .attr("class", "fill-slate-900 dark:fill-white font-black text-2xl font-mono")
      .text(`${averageProgress}%`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.6em")
      .attr("class", "fill-slate-500 dark:fill-slate-400 text-[10px] uppercase font-bold tracking-wider")
      .text("Avancement Global");
  }, [averageProgress]);

  // 2. Draw D3 Horizontal Bars for individual project progress
  useEffect(() => {
    if (!barsSvgRef.current || data.length === 0) return;

    const svg = d3.select(barsSvgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 65, bottom: 25, left: 160 };
    const containerWidth = barsSvgRef.current.parentElement?.clientWidth || 550;
    const width = Math.max(380, containerWidth) - margin.left - margin.right;
    const barHeight = 28;
    const height = data.length * (barHeight + 14) + margin.top + margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X Scale (0 to 100%)
    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);

    // Y Scale (Project Names)
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, data.length * (barHeight + 14)])
      .padding(0.28);

    // Background tracks
    g.selectAll(".bar-bg")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-bg fill-slate-100 dark:fill-slate-800/60")
      .attr("x", 0)
      .attr("y", (d) => y(d.name) || 0)
      .attr("width", width)
      .attr("height", y.bandwidth())
      .attr("rx", 6);

    // Target markers (Prévisionnel Gantt)
    g.selectAll(".bar-target")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-target fill-slate-300 dark:fill-slate-600")
      .attr("x", (d) => Math.max(0, x(d.targetProgressPercentage) - 2))
      .attr("y", (d) => (y(d.name) || 0) - 3)
      .attr("width", 3)
      .attr("height", y.bandwidth() + 6)
      .attr("rx", 1.5);

    // Active progress bars
    g.selectAll(".bar-fill")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-fill cursor-pointer transition-all duration-300")
      .attr("x", 0)
      .attr("y", (d) => y(d.name) || 0)
      .attr("width", (d) => Math.max(8, x(d.progressPercentage)))
      .attr("height", y.bandwidth())
      .attr("rx", 6)
      .attr("fill", (d) => {
        if (d.progressPercentage >= 80) return "#10b981"; // Emerald
        if (d.progressPercentage >= 50) return "#f97316"; // Orange
        return "#0284c7"; // Sky
      })
      .on("mouseenter", (_, d) => setHoveredProject(d))
      .on("mouseleave", () => setHoveredProject(null))
      .on("click", (_, d) => onSelectProject && onSelectProject(d.id));

    // Labels on left (Project Name)
    g.selectAll(".label-name")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label-name fill-slate-700 dark:fill-slate-200 text-xs font-bold cursor-pointer")
      .attr("x", -12)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2 + 4)
      .attr("text-anchor", "end")
      .text((d) => (d.name.length > 20 ? d.name.substring(0, 18) + "..." : d.name))
      .on("click", (_, d) => onSelectProject && onSelectProject(d.id));

    // Value Labels on right (% Progress)
    g.selectAll(".label-value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label-value fill-slate-900 dark:fill-white text-xs font-mono font-bold")
      .attr("x", (d) => x(d.progressPercentage) + 8)
      .attr("y", (d) => (y(d.name) || 0) + y.bandwidth() / 2 + 4)
      .text((d) => `${d.progressPercentage}%`);

    // X Axis Grid & labels
    const xAxis = d3
      .axisBottom(x)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    g.append("g")
      .attr("transform", `translate(0, ${data.length * (barHeight + 14) + 6})`)
      .attr("class", "text-[10px] text-slate-400 font-mono")
      .call(xAxis)
      .select(".domain")
      .remove();
  }, [data, onSelectProject]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Taux d'Avancement Global (D3.js)
            </h3>
            <p className="text-xs text-slate-500">
              Progression physique consolidée & comparaison avec l'objectif prévisionnel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> ≥ 80%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> 50-79%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 rounded bg-slate-400"></span> Cible Gantt
          </span>
        </div>
      </div>

      {/* Visual Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Donut Radial Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
          <svg ref={donutSvgRef} className="w-44 h-44 drop-shadow-xs" />
          <div className="text-center mt-2 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Moyenne Tous Chantiers
            </span>
            <p className="text-[10px] text-slate-400">
              {data.length} opérations actives suivies par les équipes BTP
            </p>
          </div>
        </div>

        {/* Right: Multi-project Horizontal Bars */}
        <div className="md:col-span-8 overflow-x-auto">
          <div className="min-w-[400px]">
            <svg ref={barsSvgRef} className="w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Hover Info Banner */}
      {hoveredProject && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-900/50 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">
                {hoveredProject.name} ({hoveredProject.code}) :
              </span>{" "}
              <span className="text-slate-600 dark:text-slate-300">
                Avancement réel : <b>{hoveredProject.progressPercentage}%</b> (Cible : {hoveredProject.targetProgressPercentage}%) • Chef de projet : {hoveredProject.siteManager}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-orange-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-orange-200">
            {hoveredProject.surfaceM2 ? `${hoveredProject.surfaceM2} m²` : "Site actif"}
          </span>
        </div>
      )}
    </div>
  );
};
