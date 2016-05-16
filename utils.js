/*global define*/
Utils = {};

Utils.getBaseUrl = function () {
    var cp = this.getUrlParam('cp', true);
    return this.getUrlParam('xdm_e', true) + ( cp ? cp : '') + '/atlassian-connect';
};

Utils.getUrlParam = function (param, escape) {
    try {
        var regex = new RegExp(param + '=([^&]+)'),
            data = regex.exec(window.location.search)[1];
        // decode URI with plus sign fix.
        return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    } catch (e) {
        return undefined;
    }
};

/* Useless, but quite fun :-) */
function generateFunkyStuff() {
    var mouse = [480, 250],
    count = 0;

    var svg = d3.select("div").append("svg").attr("width", "100%").attr("height", 500);

    var g = svg.selectAll("g").data(d3.range(25)).enter().append("g")
    .attr("transform", "translate(" + mouse + ")");

    g.append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("x", -12.5)
    .attr("y", -12.5)
    .attr("width", 25)
    .attr("height", 25)
    .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })
    .style("fill", d3.scale.category20c());

    g.datum(function(d) {
        return {center: [0, 0], angle: 0};
    });

    svg.on("mousemove", function() {
         mouse = d3.mouse(this);
    });

    d3.timer(function() {
       count++;
       g.attr("transform", function(d, i) {
          d.center[0] += (mouse[0] - d.center[0]) / (i + 5);
          d.center[1] += (mouse[1] - d.center[1]) / (i + 5);
          d.angle += Math.sin((count + i) / 10) * 7;
          return "translate(" + d.center + ")rotate(" + d.angle + ")";
       });
    });
}
