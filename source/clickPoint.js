<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
  window.addEventListener("DOMContentLoaded", (e) => {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight,
    );

    const svg = d3.select("body")
      .append("svg")
      .attr("width", "100%")
      .attr("height", scrollHeight)
      .style("position", "absolute")
      .style("top", "0")
      .style("right", "0")
      .style("left", "0")
      .style("background-color", "rgba(0, 0, 0, 0.5)");

    svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", (d) => d[0] * document.body.scrollWidth / 100)
      .attr("cy", (d) => d[1] * document.body.scrollHeight / 100)
      .attr("r", 5)
      .style("fill", "red")
  });
