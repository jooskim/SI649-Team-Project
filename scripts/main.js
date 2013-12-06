/**
 * Created by jooskim on 12/5/13.
 */
require.config({
    paths: {
        'jquery': 'jquery/jquery',
        'D3': 'd3/d3.v3',
        'queue': 'd3/queue.v1.min',
        'moment': 'momentjs/moment.min',
        'bootstrap': 'bootstrap/bootstrap',
        'topojson': 'd3/topojson'
    },
    shim: {
        'D3': {
            exports: 'd3'
        },
        'queue': {
            exports: 'queue'
        },
        'moment': 'moment',
        'topojson': 'topojson',
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

define(['jquery', 'D3', 'queue', 'moment','topojson'], function($, d3, queue, moment){
    var svg = d3.select('.map').append('svg').style({'width': '100%', 'height': 500, 'position': 'relative'});
    $(document).ready(function(){
        d3.json("world_map.json", function(error, world){
            var projection = d3.geo.mercator()
                .scale($(window).width()/7.647058824)
                .translate([$(window).width()/2, $(window).height()/2]);

            var path = d3.geo.path()
                .projection(projection);

            // draw the world map
            svg.append('g').attr('id','mapGroup');
            svg.select('#mapGroup').selectAll('path')
                .data(topojson.feature(world, world.objects.world).features)
                .enter()
                .append('path')
                .attr("d", d3.geo.path().projection(d3.geo.mercator().scale($(window).width()/7.647058824).translate([$(window).width()/2, 300])))
                .attr('class', function(d){ return d.properties.name })
                .attr('id', function(d){ return d.id })
                .style({'fill': 'rgba(30,30,30,0.5)', 'stroke-width': 1, 'stroke': '#ffffff'});

            // test 1
            $('path').hover(function(){
                d3.select(this).style({'fill': 'rgba(20,0,230,0.8)'});
            },function(){
                d3.select(this).style({'fill': 'rgba(30,30,30,0.5)'});
            });

            // country names
            svg.append('g').attr('id','countryNames');
            d3.select('#countryNames').selectAll('text')
                .data(topojson.feature(world,world.objects.subunits).features)
                .enter()
                .append('text')
                .attr('class', function(d){ console.log(d);return 'subunit-label-'+ d.id; })
                .attr('transform', function(d){ return "translate("+path.centroid(d)+")";})
                .style('display','none')
                .attr('dy', ".35em")
                .text(function(d){ return d.properties.name; });

            d3.select('#mapGroup').selectAll('path').on('click', function(d,i){
                var id = $(this).attr('id');
//                d3.select('#countryNames').select('.subunit-label-'+id).style('display','block');
//                console.log(path.centroid(d));
                console.log(d.properties.name);
            });


            // resize the map as the browser is resized
            $(window).resize(function(){
                var projection = d3.geo.mercator()
                    .scale($(window).width()/7.647058824)
                    .translate([$(window).width()/2, $(window).height()/2]);

                var path = d3.geo.path()
                    .projection(projection);

                $('svg').attr({'width': $('body').width()});

                svg.selectAll('path')
                    .attr('d', d3.geo.path().projection(d3.geo.mercator().scale($(window).width()/7.647058824).translate([$(window).width()/2, 300])));
                d3.select('#countryNames').selectAll('text')
                    .attr('transform', function(d){ return "translate("+path.centroid(d)+")";});
            });
        });


    });


});