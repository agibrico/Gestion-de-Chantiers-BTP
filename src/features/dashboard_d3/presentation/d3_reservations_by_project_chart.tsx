/**
 * AGB CHANTIER - Graphique D3.js : Nombre de Réserves par Chantier
 * Répartition par criticité : Bloquantes (OPR), Majeures, Mineures & Levées
 */

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ProjectReservationsData } from "../domain/dashboard_d3_types";
import { AlertTriangle, FileCheck, CheckCircle2 } from "lucide-react";

interface D3ReservationsByProjectChartProps {
  data: ProjectReservationsData[];
  onSelectProject?: (projectId: string) => void;
}

export const D3ReservationsByProjectChart: React.FC<D3ReservationsByProjectChartProps> = ({
  data,
  onSelectProject,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<ProjectReservationsData | null>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 65, left: 55 };
    const width = 640 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Categories to stack
    const subgroups = ["criticalCount", "majorCount", "minorCount", "resolvedCount"];
    const subgroupLabels: Record<string, string> = {
      criticalCount: "Bloquantes",
      majorCount: "Majeures",
      minorCount: "Mineures",
      resolvedCount: "Levées",
    };

    // Color Palette
    const color = d3
      .scaleOrdinal<string>()
      .domain(subgroups)
      .range(["#ef4444", "#f97316", "#38bdf8", "#10b981"]); // Rouge (Bloquante), Orange (Majeure), Ciel (Mineure), Vert (Levée)

    // X Scale: Projects
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.32);

    // Stack the data
    const stackedData = d3.stack<ProjectReservationsData>().keys(subgroups)(data);

    // Y Scale: Total count
    const maxVal = d3.max(data, (d) => d.criticalCount + d.majorCount + d.minorCount + d.resolvedCount) || 10;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal + 4])
      .range([height, 0]);

    // Horizontal Grid Lines
    g.append("g")
      .attr("class", "grid opacity-15 stroke-slate-400 dark:stroke-slate-600")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .select(".domain")
      .remove();

    // Render Stacked Bars
    g.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("class", "cursor-pointer transition-all duration-200 hover:opacity-90")
      .attr("x", (d) => x(d.data.name) || 0)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => Math.max(0, y(d[0]) - y(d[1])))
      .attr("width", x.bandwidth())
      .attr("rx", 2)
      .on("mouseenter", (_, d) => setHoveredData(d.data))
      .on("mouseleave", () => setHoveredData(null))
      .on("click", (_, d) => onSelectProject && onSelectProject(d.data.id));

    // Add total count on top of each bar
    g.selectAll(".total-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "total-label fill-slate-800 dark:fill-white text-[11px] font-mono font-black")
      .attr("x", (d) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => {
        const total = d.criticalCount + d.majorCount + d.minorCount + d.resolvedCount;
        return y(total) - 6;
      })
      .attr("text-anchor", "middle")
      .text((d) => d.criticalCount + d.majorCount + d.minorCount + d.resolvedCount);

    // X Axis
    g.append("g")
      .attr("class", "x-axis text-[10px] text-slate-600 dark:text-slate-400 font-bold")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-12)")
      .style("text-anchor", "end")
      .text((d) => {
        const str = String(d);
        return str.length > 15 ? str.substring(0, 13) + "..." : str;
      });

    // Y Axis (Count of reservations)
    g.append("g")
      .attr("class", "y-axis text-[10px] text-slate-400 font-mono")
      .call(d3.axisLeft(y).ticks(5))
      .select(".domain")
      .remove();

    // D3 Title Tag
    g.append("text")
      .attr("x", -10)
      .attr("y", -14)
      .attr("class", "text-[10px] font-bold fill-slate-400 font-mono")
      .text("Nombre de Réserves");
  }, [data, onSelectProject]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Réserves OPR par Chantier (D3.js)
            </h3>
            <p className="text-xs text-slate-500">
              État contradictoire des non-conformités et levées avant réception
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Bloquantes
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Majeures
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Mineures
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Levées
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <svg ref={svgRef} className="w-full h-auto" />
        </div>
      </div>

      {/* Hover Card */}
      {hoveredData ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Chantier</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {hoveredData.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-red-500 uppercase font-bold block">Bloquantes</span>
            <span className="font-mono font-bold text-red-600">
              {hoveredData.criticalCount} réserves
            </span>
          </div>
          <div>
            <span className="text-[10px] text-orange-500 uppercase font-bold block">Majeures</span>
            <span className="font-mono font-bold text-orange-600">
              {hoveredData.majorCount} réserves
            </span>
          </div>
          <div>
            <span className="text-[10px] text-sky-500 uppercase font-bold block">Mineures</span>
            <span className="font-mono font-bold text-sky-600">
              {hoveredData.minorCount} réserves
            </span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-500 uppercase font-bold block">Levées (Quitus)</span>
            <span className="font-mono font-bold text-emerald-600">
              {hoveredData.resolvedCount} réserves
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Survolez une pile pour afficher le décompte exact par degré de gravité.</span>
          <span className="font-mono text-[10px]">Traçabilité OPR</span>
        </div>
      )}
    </div>
  );
};
