/**
 * AGB CHANTIER - Graphique D3.js : Consommation Budgétaire par Chantier
 * Comparatif Budget Marché Initial vs Dépenses Réelles Engagées (FCFA)
 */

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ProjectBudgetData } from "../domain/dashboard_d3_types";
import { Coins, AlertCircle, CheckCircle2 } from "lucide-react";

interface D3BudgetConsumptionChartProps {
  data: ProjectBudgetData[];
  onSelectProject?: (projectId: string) => void;
}

export const D3BudgetConsumptionChart: React.FC<D3BudgetConsumptionChartProps> = ({
  data,
  onSelectProject,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<ProjectBudgetData | null>(null);

  const formatMillions = (val: number) => {
    return (val / 1_000_000).toFixed(1) + " M";
  };

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(val) + " FCFA";
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 35, right: 30, bottom: 65, left: 75 };
    const width = 640 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // X0 Scale: Projects
    const x0 = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .rangeRound([0, width])
      .paddingInner(0.25);

    // X1 Scale: Sub-groups (Budget Alloué vs Dépenses Réelles)
    const keys = ["allocatedBudgetFCFA", "spentBudgetFCFA"];
    const x1 = d3
      .scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.08);

    // Y Scale: Montant FCFA
    const maxVal = d3.max(data, (d) => Math.max(d.allocatedBudgetFCFA, d.spentBudgetFCFA)) || 100_000_000;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .rangeRound([height, 0]);

    // Color Scale for the two bars
    const color = d3
      .scaleOrdinal<string>()
      .domain(keys)
      .range(["#64748b", "#ea580c"]); // Slate 500 (Budget) vs Orange (Dépensé)

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

    // Render Bars
    const projectGroup = g
      .selectAll(".project-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "project-group cursor-pointer")
      .attr("transform", (d) => `translate(${x0(d.name)},0)`)
      .on("mouseenter", (_, d) => setHoveredData(d))
      .on("mouseleave", () => setHoveredData(null))
      .on("click", (_, d) => onSelectProject && onSelectProject(d.id));

    // Draw Budget Alloué bar and Dépensé bar
    projectGroup
      .selectAll(".bar")
      .data((d) => [
        { key: "allocatedBudgetFCFA", value: d.allocatedBudgetFCFA, parent: d },
        { key: "spentBudgetFCFA", value: d.spentBudgetFCFA, parent: d },
      ])
      .enter()
      .append("rect")
      .attr("class", "bar transition-all duration-200")
      .attr("x", (d) => x1(d.key) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("rx", 4)
      .attr("fill", (d) => color(d.key));

    // Consumption Rate Badges above the spent bar
    projectGroup
      .append("text")
      .attr("x", (x1("spentBudgetFCFA") || 0) + x1.bandwidth() / 2)
      .attr("y", (d) => y(d.spentBudgetFCFA) - 8)
      .attr("text-anchor", "middle")
      .attr("class", (d) => {
        const rate = d.consumptionRate;
        if (rate > 90) return "fill-red-600 dark:fill-red-400 text-[10px] font-mono font-bold";
        if (rate > 75) return "fill-amber-600 dark:fill-amber-400 text-[10px] font-mono font-bold";
        return "fill-emerald-600 dark:fill-emerald-400 text-[10px] font-mono font-bold";
      })
      .text((d) => `${Math.round(d.consumptionRate)}%`);

    // X Axis
    g.append("g")
      .attr("class", "x-axis text-[10px] text-slate-600 dark:text-slate-400 font-bold")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-12)")
      .style("text-anchor", "end")
      .text((d) => {
        const str = String(d);
        return str.length > 15 ? str.substring(0, 13) + "..." : str;
      });

    // Y Axis (in Millions FCFA)
    g.append("g")
      .attr("class", "y-axis text-[10px] text-slate-400 font-mono")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${formatMillions(Number(d))} F`)
      )
      .select(".domain")
      .remove();

    // D3 Title / Unit Tag
    g.append("text")
      .attr("x", -10)
      .attr("y", -14)
      .attr("class", "text-[10px] font-bold fill-slate-400 font-mono")
      .text("Montant (Millions FCFA)");
  }, [data, onSelectProject]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Consommation Budgétaire (D3.js)
            </h3>
            <p className="text-xs text-slate-500">
              Engagements financiers réels vs budget alloué par marché
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded bg-slate-500"></span> Budget Alloué
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="w-3 h-3 rounded bg-orange-600"></span> Dépenses Engagées
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <svg ref={svgRef} className="w-full h-auto" />
        </div>
      </div>

      {/* Interactive Tooltip Card */}
      {hoveredData ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Chantier</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {hoveredData.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Budget Initial</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {formatFCFA(hoveredData.allocatedBudgetFCFA)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Consommé Réel</span>
            <span className="font-mono font-bold text-orange-600">
              {formatFCFA(hoveredData.spentBudgetFCFA)} ({Math.round(hoveredData.consumptionRate)}%)
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Solde Restant</span>
            <span
              className={`font-mono font-bold ${
                hoveredData.remainingBudgetFCFA >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {formatFCFA(hoveredData.remainingBudgetFCFA)}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2.5 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Survolez une barre pour inspecter le déboursé sec et la marge nette du chantier.</span>
          <span className="font-mono text-[10px]">Mise à jour en temps réel</span>
        </div>
      )}
    </div>
  );
};
