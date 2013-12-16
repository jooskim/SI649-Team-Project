/**
 * Created by jooskim on 12/5/13.
 */
require.config({
    paths: {
        'jquery': 'jquery/jquery',
        'D3': 'd3/d3.v3',
        'queue': 'd3/queue.v1.min',
        'moment': 'momentjs/moment.min',
        'bootstrap': 'bootstrap/js/bootstrap',
        'topojson': 'd3/topojson',
        'transform': 'jquery.transform/jquery.transform2d',
        'jqueryeasing': 'jquery/jquery.easing.1.3',
        'colorbrewer': 'colorbrewer'
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
        },
        'transform': {
            deps: ['jquery']
        },
        'jqueryeasing': {
            deps: ['jquery']
        },
        'colorbrewer': 'colorbrewer'
    }
});

define(['jquery', 'D3', 'queue', 'moment','topojson','transform','jqueryeasing','bootstrap','colorbrewer'], function($, d3, queue, moment){
    function debouncer(func, timeout) {
        var timeoutID , timeout = timeout || 200;
        return function () {
            var scope = this , args = arguments;
            clearTimeout( timeoutID );
            timeoutID = setTimeout( function () {
                func.apply( scope , Array.prototype.slice.call( args ) );
            } , timeout );
        }
    }

    function countryParser(input){
        var dict = {"BD": "Bangladesh", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "BE": "Belgium", "BL": "Saint-Barth\u00e9lemy", "BM": "Bermuda", "BN": "Brunei Darussalam", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "Timor-Leste", "RE": "R\u00e9union", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau ", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar ", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "WF": "Wallis and Futuna Islands ", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and Mcdonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestine, State of", "PW": "Palau", "PT": "Portugal", "KN": "Saint Kitts and Nevis", "AF": "Afghanistan", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon ", "ZM": "Zambia", "EH": "Western Sahara ", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": " Saint-Martin (French part)", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia, Republic of", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man ", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "AW": "Aruba", "SH": "Saint Helena", "SJ": "Svalbard and Jan Mayen Islands ", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands (Malvinas) ", "FM": "Micronesia, Federated States of", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue ", "CK": "Cook Islands ", "CI": "C\u00f4te d'Ivoire", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos (Keeling) Islands", "CA": "Canada", "CG": "Congo", "CF": "Central African Republic", "CD": "Congo, Democrat", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "PY": "Paraguay", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "SV": "El Salvador", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands ", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Lao PDR", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands ", "LY": "Libya", "VA": "Holy See", "VC": "Saint Vincent and Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "VG": "British Virgin Islands", "AI": "Anguilla", "VI": "Virgin Islands, US", "IS": "Iceland", "IR": "Iran, Islamic Republic of", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AN": "Netherlands Antilles", "AQ": "Antarctica  \t  \t  \t", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "IO": "British Indian Ocean Territory", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};
        if(input in dict){
            return dict[input];
        }else{
            return "NOT_A_COUNTRY";
        }
    }

    function filterCountries(haystack, needles){
        var results = [];
        for(var needle in needles){
            var name = needles[needle];
            for (var item in haystack){
                if(haystack[item].id == name){
                    results.push(haystack[item]);
                }else{
                    continue;
                }
            }
        }
        return results;
    }

    // COLOR FUNCTION
    var colorIntensityFunc = d3.scale.quantize().domain([0, 1000]).range(colorbrewer.Blues[6]);
    var colorIntensityFuncLegend = d3.scale.quantize().domain([0, 1341]).range(colorbrewer.Blues[6]);
    function compColorFunc(array, value){
        var numbers = [];
        for(var i in array){
            if('count' in array[i]){
                numbers.push(array[i].count);
            }else if('amount' in array[i]){
                numbers.push(array[i].amount);
            }
        }
        var func = d3.scale.quantize().domain([0, d3.max(numbers)]).range(colorbrewer.GnBu[5]);

        return func(value);
    }

    // COMPARISON PANEL: HEIGHT FUNCTION
    function compHeightFunc(array, value){
        var numbers = [];
        for(var i in array){
            if('count' in array[i]){
                numbers.push(array[i].count);
            }else if('amount' in array[i]){
                numbers.push(array[i].amount);
            }
        }
        var func = d3.scale.linear().domain([1,d3.max(numbers)]).range([3,25]);

        return func(value);
    }

    function redrawMap(){
        var projection = d3.geo.mercator()
            .scale($(window).width()/7.647058824)
            .translate([$(window).width()/2, 350]);

        var path = d3.geo.path()
            .projection(projection);

        svg.selectAll('path')
            .attr('d', d3.geo.path().projection(d3.geo.mercator().scale($(window).width()/7.647058824).translate([$(window).width()/2, 350])));

        d3.select('#countryNames').selectAll('rect')
            .attr('x', function(d){ return path.centroid(d)[0];})//.attr('transform', function(d){ return "translate("+path.centroid(d)+")";})
            .attr('y', function(d){ return path.centroid(d)[1];});
    }

    function updateCountries(filteredObjs){
        var countryNamesGroup = d3.select('#countryNames').attr('id','countryNames');
        var projection = d3.geo.mercator()
            .scale($(window).width()/7.647058824)
            .translate([$(window).width()/2, 350]);

        var path = d3.geo.path()
            .projection(projection);

        // UPDATE THE MARKERS
        countryNamesGroup.selectAll('path,text').remove();
        countryNamesGroup.selectAll('path')
            .data(filteredObjs)
            .enter()
            .append('path')
            .attr('class', function(d){ return 'subunit-label-'+ d.id; })
            .attr('d', function(d){ return 'M ' + path.centroid(d)[0] + ' ' + parseInt(path.centroid(d)[1]+10) + ' l 3 17 l 90 0 l 0 20 l -186 0 l 0 -20 l 90 0 l 3 -17';})
            .style({'fill':'rgba(255,255,255,0.7)', 'stroke': '#999', 'stroke-width': 1, 'display': 'none'})//.style('display','none')

        d3.select('#countryNames').selectAll('text')
            .data(filteredObjs)
            .enter()
            .append('text')
            .attr('class', function(d){ return 'country-tooltip-'+ d.id; })
            .attr('x', function(d){ return path.centroid(d)[0];})//.attr('transform', function(d){ return "translate("+path.centroid(d)+")";})
            .attr('y', function(d){ return path.centroid(d)[1]+41;})
            .attr('text-anchor', 'middle')
            .text(function(d){ return d.teams+' projects funded in '+ d.properties.name;})
            .style({'fill': '#333333', 'stroke': '#333333', 'stroke-width': 0, 'cursor': 'pointer', 'display': 'none', 'font-size': '11px'})//.style('display','none')

        d3.select('#mapGroup').selectAll('path').on('click', function(d,i){
            if(d.teams){
                var filteredTeams = {"id":[], "name": [], "loans": []};

                function filterFunc(countryFilter){
                    // FILTER BY COUNTRY
                    filteredTeams = {"id":[], "name": [], "loans": []};
                    var counterTeam = 0;
                    $(teams100.loans).each(function(i){
                        var loans = this.data;

                        var temp = [];
                        $(loans).each(function(){
                            if(countryFilter.trim() == countryDict[this.location].trim()){
                                temp.push(this);
                            }else{

                            }
                        });

                        if(temp.length == 0){
                            var teamid = this.id;
                            var loans = this.data;
                            var loanContainer = {"id": teamid, "data": []};

                            filteredTeams.id.push(teamid);
                            filteredTeams.name.push(teams100.name[$.inArray(teamid, teams100.id)]);

                            $(loans).each(function(){
                                loanContainer.data.push(this);
                            });

                            filteredTeams.loans.push(loanContainer);
                            counterTeam++;
                        }

                    });
//                    console.log(filteredTeams);

                    initiateScatterPlot(filteredTeams);
                }

                var id = d.id;
                // SETUP THE GLOBAL VARIABLE THAT WILL FILTER THE TEAMS BASED ON THE COUNTRY SELECTED
                countryFilter = d.id;

                //$('.scatter .scatterHeader').html("Showing teams that have invested most in the <span class='userInput'>" + $('.sectorLayer button').text() + "</span> sector"); // in <span class='userInput'>"+ d.properties.name+ "</span>
                var displayCountryName;
                $(countryDict2).each(function(){
                    if(this["alpha-3"] == d.id){
                        displayCountryName = this.name;
                    }
                });

                var listOfCountries = "<li><a href='#'>All countries</a></li><li class='divider'></a></li>";
                $(filteredObjs).each(function(){
                    var id = this.id;
                    $(countryDict2).each(function(){
                        if(this["alpha-3"] == id){
                            listOfCountries += "<li data-id='"+ this["alpha-3"] +"'><a href='#'>" + this.name + "</a></li>";
                        }
                    });
                });

                var filterButtonHTML = '<div class="btn-group filterTrigger"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+displayCountryName+'<span class="caret"></span></button><ul class="dropdown-menu" role="menu">' + listOfCountries + '</ul></div>';
                $('.scatter .scatterHeader').html("Showing teams that have invested most in "+ filterButtonHTML +" in the <span class='userInput'>" + $('.sectorLayer button').text() + "</span> sector"); // in <span class='userInput'>"+ d.properties.name+ "</span>
                $('.filterTrigger ul li').click(function(){
                    $('.comp').each(function(){
                        $(this).removeClass('occupied');
                        $(this).removeAttr('data-id');
                        $(this).css("border", "1px dashed #bbbbbb");
                        $(this).find('.comp_close').html('');
                        $(this).find('.comp_teamName').html('');
                        $(this).find('.comp_top5countries').html('');
                        $(this).find('.comp_top5sectors').html('');
                    });

                    $('.filterTrigger button').html($(this).text()+'<span class="caret"></span>');
                    if($('.filterTrigger button').text() == "All countries"){
                        initiateScatterPlot(teams100);
//                        console.log(filteredTeams);

                    }else{
                        countryFilter = $(this).attr("data-id");
                        filterFunc(countryFilter);
                    }

                });

                $('.scatter').show();
                $('.scatter').animate({'opacity':1,'transform': 'scale(1,1)'}, 600, 'easeInOutBack', function(){
                    $(".scatter .container").css("left", $(".scatter").position().left + $(".scatter svg.scatterArea").width() - 130 + "px");
                    $(".scatter .container .comparisonPanel").width($(window).innerWidth() - $(".scatter").position().left*2.6 - $(".scatter .container").position().left);
                });

                // FILTER BY COUNTRY
                var counterTeam = 0;
                $(teams100.loans).each(function(i){
                    var loans = this.data;

                    var temp = [];
                    $(loans).each(function(){
                        if(countryFilter.trim() == countryDict[this.location].trim()){
                            temp.push(this);
                        }else{

                        }
                    });

                    if(temp.length == 0){
                        var teamid = this.id;
                        var loans = this.data;
                        var loanContainer = {"id": teamid, "data": []};

                        filteredTeams.id.push(teamid);
                        filteredTeams.name.push(teams100.name[$.inArray(teamid, teams100.id)]);

                        $(loans).each(function(){
                            loanContainer.data.push(this);
                        });

                        filteredTeams.loans.push(loanContainer);
                        counterTeam++;
                    }

                });

                // DRAW SCATTER PLOT WITH THE FILTERED DATA
                initiateScatterPlot(filteredTeams);
            }
        });

        d3.select('#mapGroup').selectAll('path').on('mouseover', function(d,i){
            if(d.teams){
                var id = d.id;
                $('.country-tooltip-'+d.id+', .subunit-label-'+ d.id).show();
            }
        });

        d3.select('#mapGroup').selectAll('path').on('mouseout', function(d,i){
            if(d.teams){
                var id = d.id;
                $('.country-tooltip-'+d.id+', .subunit-label-'+ d.id).hide();
            }
        });

        d3.select('#countryNames').selectAll('text').on('click', function(d,i){
            var id = $(this).attr('id');
            $('.scatter .scatterHeader').html("Showing teams that have invested most in <span class='userInput'>"+ d.properties.name+ "</span> in the <span class='userInput'>" + $('.sectorLayer button').text() + "</span> sector");
//            console.log(d.properties.name);
            $('.scatter').show();
            $('.scatter').animate({'opacity':1,'transform': 'scale(1,1)'}, 600, 'easeInOutBack');
        });
    }

    function updateColorIntensities(map, countries, allObjs){
        for(var i in allObjs){
            for(var j in countries){
                if(allObjs[i].id == countries[j].id){
                    allObjs[i].teams = countries[j].teams;
                }
            }
        }

        // UPDATE THE COLOR INTENSITIES
        map.selectAll('path')
            .data(allObjs)
            .transition()
            .style({'fill': function(d){ if(d.teams){ return colorIntensityFunc(d.teams) }else{ return '#999999'}}, 'cursor': function(d){ if(d.teams){return 'pointer'}} });

        // UPDATE THE LEGEND
        var legendSVG = d3.select('svg.svgLegend').attr({"width": 320, "height": 130});
        var counts = [];

        $(allObjs).filter(function(i){ return this.teams != undefined }).each(function(){
            counts.push(this.teams);
        });

        var legendArray = [200, 400, 600, 800, 1000, 1200]; /// HARD CODED.. IT'S OKAY AS LONG AS WE DON'T UPDATE THE DATA
        if(counts.length != 0){
            $(".legendContainer").show();
            legendSVG.selectAll('rect.bracket').data(legendArray)
                .transition()
                .attr("class", "bracket")
                .attr("x", function(d,i){ return 10 + 50*i; })
                .attr("y", 0)
                .attr("width", 50)
                .attr("height", 50)
                .style("fill", function(d,i){ return colorIntensityFuncLegend(d); });

            legendSVG.selectAll('text.bracket').data(legendArray)
                .attr("class", "bracket")
                .attr("x", function(d,i){ return 35 + 50*i; })
                .attr("y", 68)
                .attr("text-anchor", "middle")
                .text(function(d,i){ if(i == legendArray.length-1){ return d-200+"+"; }else{return d-200+"-"+Math.round(d); } })
                .style({"fill": "#666666", "font-size": "11px"});
        }

    }

    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        return result;
    }

    function getLoans(teams100, world){
        // LOAD THE TEAMS DATA AND THEIR LOANS INFORMATION
        var newTeams100 = {'id':[], 'name': [], 'loans':[]};
        var data = unique(teams100.id);
        for(var i in data){
            newTeams100.id.push(data[i]);
            idx = $(teams100.id).index(data[i]);
            newTeams100.name.push(teams100.name[idx]);
        }

        var query = 'queue()';

        for(var i in data){
            // READ LOAN JSON FILES PER TEAM
            var workingFolder = $('.dropdown-toggle').attr('data-selected');

            query += ".defer(d3.json, 'data/"+workingFolder+"/teams/"+data[i]+"/concatenated.json')";

        }

        // FILTER AND RESTRUCTURE THE TEAMS100 ARRAY
        var funcLoadLoansQuery = "function loadLoans(error,";
        for(var i in data){
            funcLoadLoansQuery += 'd'+i;
            if(i != data.length - 1){
                funcLoadLoansQuery += ',';
            }
        }
        funcLoadLoansQuery += '){ ';
        for(var j in data){
            funcLoadLoansQuery += 'var tempStorage = [];';
            funcLoadLoansQuery += 'var currentFilter = $(".sectorLayer button").text();';
            funcLoadLoansQuery += '$(d'+j+').each(function(){ ';
            funcLoadLoansQuery += 'if(this.sector.trim() == currentFilter.trim()){ tempStorage.push({"location": this.location.country_code, "loan_amount": this.loan_amount, "sector": this.sector}); }';
            funcLoadLoansQuery += '});';
            funcLoadLoansQuery += 'newTeams100.loans.push({"id": ' + data[j] + ', "data": tempStorage});';
        }

        // CALCULATE NUMBERS AND COUNTRIES TO DISPLAY ON THE MAP
        funcLoadLoansQuery += 'aggrByCountry(newTeams100, world);';
        funcLoadLoansQuery += '}';
        eval(funcLoadLoansQuery);

        query += '.await(loadLoans)';
        eval(query);

        return 1;
    }

    function aggrByCountry(teams100Local, world){
        // MAP THE COUNTRY NAMES TO THOSE IMPLEMENTED IN THE WORLD MAP
        var countries = [];
        var countriesCounter = [];
        $(teams100Local.loans).each(function(i){
            $(this.data).each(function(ii){
                countries.push(this.location);
            });
        });

        countries = unique(countries);
        for(var i in countries){
            // SETUP
            tempCounter = 0;
            $(teams100Local.loans).each(function(idx){
                $(this.data).each(function(idx2){
                    if(this.location == countries[i].trim()){
                        tempCounter++;
                    }
                });
            });
            // CONVERT FROM ISO ALPHA-2 CODE TO ISO ALPHA-3 CODE
            countriesCounter.push({"country": countryDict[countries[i]], "count": tempCounter});
        }


//        console.log(countriesCounter);
        // FILTERING WORKS BASED ON USER'S SELECTION OF A SECTOR
        var countriesToShow = []; // ['CAN','RUS','BRA']; // THESE ARE THE KEYS TO BE COUPLED WITH THE KIVA API
        var teamsNum = []; // [122, 480,210];
        for(var i in countriesCounter){
            countriesToShow.push(countriesCounter[i].country);
            teamsNum.push(countriesCounter[i].count);
        }

        var filtered = filterCountries(topojson.feature(world,world.objects.world).features, countriesToShow);
        for(var obj in filtered){
            idx = $.inArray(filtered[obj].id, countriesToShow);
            filtered[obj].teams = teamsNum[idx];
        }

        // SYNC THE GLOBAL ARRAYES WITH THESE
        filteredObjs = filtered;
        teams100 = teams100Local;

        updateCountries(filtered);
        updateColorIntensities(d3.select('#mapGroup'), filtered, topojson.feature(world,world.objects.world).features);
        $("#spinner").hide();
        $('.loadingContainer').fadeOut(300);

    }

    function initiateScatterPlot(teams100){
        var SVGHeight = 720;
        d3.select('.scatter').selectAll('svg').remove();
        d3.selectAll('.wrapper').remove();
        var wrapper = d3.select('.scatter').append('div').attr('class','wrapper').style({'z-index': -1, 'width':'100%', 'height': '50px', 'position': 'relative', 'top': '68px', 'border-top': 'solid 1px #ddd'});
        var svg = d3.select('.scatter').append('svg').attr({'width': $(".scatter").width()*0.9+'px', 'height': SVGHeight}).attr('class','scatterArea');
        var svgCompLayer = d3.select('.scatter').select('.comparisonPanel');
        var D3Global = d3;

        var marginVertical = 50;
        var marginHorizontal = 100;
        // FOR TOP 5 COUNTRIES FROM WHICH MOST PEOPLE COME
        var sorted = [];
        // FOR TOP 5 COUNTRIES THAT THE TEAM HAS INVESTED MOST
        var sorted2 = [];

        function logAxis(array){
            var func = d3.scale.log().domain([d3.min(array), d3.max(array)]).range([parseInt(marginHorizontal), parseInt($('.scatter svg.scatterArea').width() - parseInt(marginHorizontal))]);
            return func;
        }

        function logAxisY(array){
            var func = d3.scale.log().domain([d3.min(array), d3.max(array)]).range([parseInt(marginVertical+50), parseInt($('.scatter svg.scatterArea').height() - parseInt(marginVertical) + 50)]);
            return func;
        }

        function addComparison(item, hasClass){
            function sortWithIndices(toSort) {
                for (var i = 0; i < toSort.length; i++) {
                    toSort[i] = [toSort[i], i];
                }
                toSort.sort(function(left, right) {
                    return right[0] < left[0] ? -1 : 1;
                });
                toSort.sortIndices = [];
                for (var j = 0; j < toSort.length; j++) {
                    toSort.sortIndices.push(toSort[j][1]);
                    toSort[j] = toSort[j][0];
                }
                return toSort;
            }

            console.log(item, hasClass);
            if(hasClass == "selected"){
                // ENTER DATA INTO ONE OF THE EMPTY SLOTS
                for(var i=1; i<=4; i++){
                    if($('.comparisonPanel div[id='+i+']').hasClass('occupied')){
                        continue;
                    }else{
                        var panel = $('.comparisonPanel div[id='+i+']');
                        panel.addClass('occupied');
                        panel.attr('data-id', item.teamId);
                        panel.css("border", "1px solid #428bca");
                        panel.find('.comp_close').html('&times;');
                        panel.find('.comp_close').attr('data-target', item.teamId);
                        panel.find('.comp_teamName').html(item.teamName);
                        panel.find('.comp_top5countries').html("<span class='comp_label'>Membership Nationalities</span><svg class='comp_top5c_unit' style='width: 100%; height: 45px'></svg>");
//                        panel.find('.comp_top5c_unit');

                        var workingFolder = $('.dropdown-toggle').attr('data-selected');
                        $.ajax({
                            'url': "data/"+workingFolder+"/teams/"+item.teamId+"/teamComposition.json",
                            'dataType': 'json',
                            'async': false,
                            'success': function(data){
                                sorted = [];
                                var tempArr = {"country":[], "num":[]};
                                var origArr = {"country":[], "num":[]};
                                for(var key in data){
                                    tempArr.country.push(key);
                                    origArr.country.push(key);
                                    tempArr.num.push(data[key]);
                                    origArr.num.push(data[key]);
                                }
                                sortWithIndices(tempArr.num);
                                var toRun;
                                if(tempArr.num.sortIndices.length > 5){ toRun = 5; }else{ toRun = tempArr.num.sortIndices.length; }
                                for(var i=0; i<toRun; i++){
                                    var idx = tempArr.num.sortIndices[i];
                                    sorted.push({"country": origArr.country[idx], "count": origArr.num[idx], "teamId": item.teamId})
                                }

                            }
                        });

                        var invested = {"country": [], "amount": []};
                        var tempInvested= {"country": [], "amount": []};
                        sorted2 = [];
                        for(var num in teams100.loans){
                            if(teams100.loans[num].id == item.teamId){
                                for(var j in teams100.loans[num].data){
                                    var loan = teams100.loans[num].data[j];

                                    if($.inArray(loan.location, invested.country) == -1){
                                        invested.country.push(loan.location);
                                        tempInvested.country.push(loan.location);
                                        invested.amount.push(loan.loan_amount);
                                        tempInvested.amount.push(loan.loan_amount);
                                    }else{
                                        var idx = $.inArray(loan.location, invested.country);
                                        invested.amount[idx] += loan.loan_amount;
                                        tempInvested.amount[idx] += loan.loan_amount;
                                    }
                                }
                            }else{
                                continue;
                            }
                        }

                        sortWithIndices(tempInvested.amount);
                        var toRun;
                        if(tempInvested.amount.sortIndices.length > 5){ toRun = 5; }else{ toRun = tempInvested.amount.sortIndices.length; }
                        for(var k=0; k<toRun; k++){
                            var idx = tempInvested.amount.sortIndices[k];
                            sorted2.push({"country": invested.country[idx], "amount": invested.amount[idx], "teamId": item.teamId});

                        }

                        panel.find('.comp_top5sectors').html("<span class='comp_label'>Countries receiving funding</span><svg class='comp_top5s_unit' style='width: 100%; height: 50px'></svg>");
                        inComparison.push(item.teamId);
                        break;
                    }
                }
            }else{
                // REMOVE THE ITEM FROM THE SLOT
                var toRemove = $('.comp').filter(function(i){ return parseInt($(this).attr('data-id')) == parseInt(item.teamId) });
                toRemove.removeClass('occupied');
                toRemove.removeAttr('data-id');
                toRemove.css("border", "1px dashed #bbbbbb");
                toRemove.find('.comp_close').html('');
                toRemove.find('.comp_teamName').html('');
                toRemove.find('.comp_top5countries').html('');
                toRemove.find('.comp_top5sectors').html('');

                inComparison.splice($.inArray(item.teamId, inComparison), 1);
            }

            return [sorted,i,sorted2];
        }

        function drawScatter(inComparison){
            svg.select('g.axes').remove();
            svg.select('g.team').remove();

            var gAxes = svg.append('g').attr({'class': 'axes'});

            // DRAW AXES
            gAxes.append('line')
                .attr('x1', marginHorizontal)
                .attr('x2', parseInt($('.scatter svg.scatterArea').width() - marginHorizontal))
                .attr('y1', SVGHeight - marginVertical)
                .attr('y2', SVGHeight - marginVertical)
                .style({'stroke': '#999999', 'stroke-width': 1});

            gAxes.append('line')
                .attr('x1', marginHorizontal)
                .attr('x2', marginHorizontal)
                .attr('y1', SVGHeight - marginVertical)
                .attr('y2', marginVertical)
                .style({'stroke': '#999999', 'fill': 'none', 'stroke-width': 1});

            gAxes.append('text')
                .attr('x', ($('.scatter svg.scatterArea').width())/2)
                .attr('y', SVGHeight - marginVertical + 50)
                .attr('text-anchor', 'middle')
                .text('Number of Members')
                .style({'stroke': '#666', 'stroke-width': 1, 'font-size': '12px'});

            gAxes.append('text')
                .attr('x', -1*(marginHorizontal - 60))
                .attr('y', -1*((SVGHeight - 2*marginVertical)/2))
                .attr('transform',"rotate(180)")
                .text('Amount Lent (USD)')
                .style({'stroke': '#666', 'stroke-width': 1, 'font-size': '12px', 'writing-mode': 'tb'});

            var teamIds = teams100.id;
            var teamInfo = [];
            var memberCountsStorage = [];
            var loanedAmountStorage = [];
            var workingFolder = $('.dropdown-toggle').attr('data-selected');
            var gTeam = svg.append('g').attr({'class': 'team'});

            if(teamIds.length > 0){
                // CREATE THE FUNCTION ONLY IF THERE EXISTS AT LEAST ONE VALUE
                $("text.noResult").remove();

                var funcPrepData = "function prepareData(error,";
                for(var i in teamIds){
                    funcPrepData += 'd'+i;
                    if(i != teamIds.length - 1){
                        funcPrepData += ',';
                    }
                }

                funcPrepData += '){ ';
                for(var i in teamIds){
                    funcPrepData += '$(d'+i+'.teams).each(function(){ '
                    funcPrepData += 'console.log(this);';
                    funcPrepData += 'memberCountsStorage.push(this.member_count);';
                    funcPrepData += 'loanedAmountStorage.push(this.loaned_amount);';
                    funcPrepData += 'teamInfo.push({"teamId": this.id, "teamName": this.name, "shortDesc": this.loan_because, "loanedAmount": this.loaned_amount, "memberCount": this.member_count });';
                    funcPrepData += '});';
                }

                funcPrepData += 'var ticksX = logAxis(memberCountsStorage).ticks(1);';
                funcPrepData += 'var ticksY = logAxisY(loanedAmountStorage).ticks(1);';
                // DRAW X AXIS TICKS
                funcPrepData += 'gAxes.append("g").attr("class", "xAxis");';
                funcPrepData += 'gAxes.select(".xAxis").selectAll("line.tickX").data(ticksX).enter().append("line").attr("x1", function(d,i){ return logAxis(memberCountsStorage)(d) }).attr("x2", function(d,i){ return logAxis(memberCountsStorage)(d) }).attr("y1", SVGHeight - marginVertical).attr("y2", SVGHeight - marginVertical + 5).attr("class", "tickX").style({"stroke": "#999999", "stroke-width": 1});';
                funcPrepData += 'gAxes.select(".xAxis").selectAll("line.gridVertical").data(ticksX).enter().append("line").attr("x1", function(d,i){ return logAxis(memberCountsStorage)(d) }).attr("x2", function(d,i){ return logAxis(memberCountsStorage)(d) }).attr("y1", SVGHeight - marginVertical).attr("y2", marginVertical).attr("class", "gridVertical").style({"stroke": "#dddddd", "stroke-width": 1});';
                funcPrepData += 'gAxes.select(".xAxis").selectAll("text.tickLabel").data(ticksX).enter().append("text").attr("x", function(d,i){ return logAxis(memberCountsStorage)(d); }).attr("y", SVGHeight - marginVertical + 10).attr("class", "tickLabel").style({"writing-mode": "tb", "stroke": "#666666", "stroke-width": 1, "font-size": "9px"}).text(function(d){ return d; });';
                // DRAW Y AXIS TICKS
                funcPrepData += 'gAxes.append("g").attr("class", "yAxis");';
                funcPrepData += 'console.log(logAxisY(loanedAmountStorage)(ticksY[0]));';
                funcPrepData += 'gAxes.select(".yAxis").selectAll("line.tickY").data(ticksY).enter().append("line").attr("x1", marginHorizontal - 5).attr("x2", marginHorizontal).attr("y1", function(d,i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d) }).attr("y2", function(d,i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d) }).attr("class", "tickY").style({"stroke": "#999999", "stroke-width": 1});';
                funcPrepData += 'gAxes.select(".yAxis").selectAll("line.gridHorizontal").data(ticksY).enter().append("line").attr("x1", marginHorizontal).attr("x2", $(".scatter svg.scatterArea").width() - marginHorizontal).attr("y1", function(d, i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d) }).attr("y2", function(d, i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d) }).attr("class", "gridHorizontal").style({"stroke": "#dddddd", "stroke-width": 1});';
                funcPrepData += 'gAxes.select(".yAxis").selectAll("text.tickLabel").data(ticksY).enter().append("text").attr("text-anchor", "end").attr("x", marginHorizontal - 10).attr("y", function(d,i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d) }).attr("class", "tickLabel").style({"stroke": "#666666", "stroke-width": 1, "font-size": "9px"}).text(function(d){ return d; });';
                // FILTER BASED ON THE COUNTRY SELECTED
                funcPrepData += 'gTeam.selectAll("circle").data(teamInfo).enter().append("circle").attr("cx", function(d,i){ return logAxis(memberCountsStorage)(d.memberCount) }).attr("cy", function(d,i){ return SVGHeight + 90 - marginVertical - logAxisY(loanedAmountStorage)(d.loanedAmount) }).attr("r", 5).style({"fill": function(d,i){ if($.inArray(d.teamId, inComparison) != -1){ return "#6fce00" }else{ return "rgba(66,139,202,0.8)"} }}).attr("class", function(d,i){ if($.inArray(d.teamId, inComparison) != -1){ return "selected" }else{ return "" } });';
                funcPrepData += 'gTeam.selectAll("circle").on("click",function(d,i){ if($(this).attr("class") == "selected"){ $(this).attr("class", ""); $(this).css({"fill": "rgba(66,139,202,1)" }); }else{ if($(".comp").not(".occupied").length == 0){ alert("Your comparison slots are full. Deselect at least one team."); $(this).css("fill", "rgba(66,139,202,1)"); }else{$(this).attr("class", "selected"); $(this).css({"fill": "#6fce00"});} } var sorted = addComparison(d, $(this).attr("class")); var team = $(".comp").filter(function(i){ return $(this).attr("data-id") == d.teamId }); team.height(165); if(team.find(".comp_teamName").height() > 20){ team.height(team.height()+(team.find(".comp_teamName").height()-18)); } var compTotalHeight = 0; $(".comp").each(function(){ compTotalHeight += $(this).height() }); if(compTotalHeight > 675){ $(".scatter").height(800+compTotalHeight-675)}else{$(".scatter").height(800) }; var svg1 = svgCompLayer.selectAll("div.comp").filter(function(d){ return $(this).attr("id") == sorted[1] }).select("svg.comp_top5c_unit").append("g").attr("class","graphArea"); svg1.selectAll("rect.fromWhere").data(sorted[0]).enter().append("rect").attr("class","fromWhere").attr("x", function(d,i){ return (38*i+4); }).attr("y", function(d,i){ return 30 - compHeightFunc(sorted[0], d.count) }).attr("width",32).attr("height",function(d,i){ return compHeightFunc(sorted[0], d.count); }).style({"fill": function(d,i){ return compColorFunc(sorted[0], d.count) }}); svg1.selectAll("text.fromWhere").data(sorted[0]).enter().append("text").text(function(d,i){ return d.country+": "+d.count }).attr("x", function(d,i){ return (38*i+19); }).attr("class","fromWhere").attr("y", 40).attr("text-anchor","middle").style({"font-size": "8px"}); var svg2 = svgCompLayer.selectAll("div.comp").filter(function(d){ return $(this).attr("id") == sorted[1] }).select("svg.comp_top5s_unit").append("g").attr("class","graphArea"); svg2.selectAll("rect.investedCountry").data(sorted[2]).enter().append("rect").attr("x", function(d,i){ return (38*i+4); }).attr("y", function(d,i){ return 30 - compHeightFunc(sorted[2], d.amount) }).attr("width",32).attr("height",function(d,i){ return compHeightFunc(sorted[2], d.amount); }).attr("class","investedCountry").style({"fill": function(d,i){ return compColorFunc(sorted[2], d.amount) }}); svg2.selectAll("text.investedCountry").data(sorted[2]).enter().append("text").attr("class","investedCountry").text(function(d,i){ return d.country }).attr("x", function(d,i){ return (38*i+19); }).attr("y", 40).attr("text-anchor","middle").style({"font-size": "8px"}); svg2.selectAll("text.investedAmount").data(sorted[2]).enter().append("text").attr("class","investedAmount").text(function(d,i){ return "$ "+d.amount }).attr("x", function(d,i){ return (38*i+19); }).attr("y", 50).attr("text-anchor","middle").style({"font-size": "8px"}); var selectedDiv = svgCompLayer.selectAll("div.comp").filter(function(d){ return $(this).attr("id") == sorted[1] }); selectedDiv.selectAll("rect.fromWhere").on("mouseenter", function(d,i){ $(".tooltipContainer2").css("left", $(".container").position().left + 16 + "px").css("top", $(".comp").filter(function(i){ return $(this).attr("data-id") == d.teamId }).position().top+100+"px"); $(".tooltipContainer2").show(); $(".tooltipContainer2 .C_tooltip").width($(".comp").width()); $(".tooltipContainer2 .C_tooltip").text(countryParser(d.country) + ": " + d.count); }); selectedDiv.selectAll("rect.fromWhere").on("mouseout", function(d,i){ $(".tooltipContainer2").hide()}); selectedDiv.selectAll("rect.investedCountry").on("mouseenter", function(d,i){ $(".tooltipContainer2").css("left", $(".container").position().left + 16 + "px").css("top", $(".comp").filter(function(i){ return $(this).attr("data-id") == d.teamId }).position().top+165+"px"); $(".tooltipContainer2").show(); $(".tooltipContainer2 .C_tooltip").width($(".comp").width()); $(".tooltipContainer2 .C_tooltip").text(countryParser(d.country) + ": $ " + d.amount); }); selectedDiv.selectAll("rect.investedCountry").on("mouseout", function(d,i){ $(".tooltipContainer2").hide()}); } ); '; // DYNAMIC SIZING OF EACH LAYER
                // CLICKING ON THE X BUTTON WILL DO THE SAME THING AS CLICKING ON THE DATA POINT ON THE SCATTER PLOT
                funcPrepData += '$(".comp_close").click(function(){ delTarget = $(this).attr("data-target"); parentObj = $(this).parent(); parentObj.css({"border": "1px dashed #bbbbbb"}); parentObj.find(".comp_close").html(""); parentObj.find(".comp_teamName").html(""); parentObj.find(".comp_top5countries").html(""); parentObj.find(".comp_top5sectors").html(""); gTeam.selectAll("circle").filter(function(d,i){ return d.teamId == delTarget }).attr("class","").style({"fill": "rgba(66,139,202,0.8)"}); parentObj.removeClass("occupied"); parentObj.removeAttr("data-id"); });';
                var glyphUSD = '<span class="glyphicon glyphicon-usd"></span>';
                var glyphUser = '<span class="glyphicon glyphicon-user"></span>';
                funcPrepData += 'gTeam.selectAll("circle").on("mouseover",function(d,i){ $(".comp").filter(function(){ return $(this).attr("data-id") == d.teamId}).css("border","2px solid #6fce00"); $(this).attr({"r": 10}); $(".tooltipContainer .teamTooltip .teamName").text(d.teamName); $(".tooltipContainer .teamTooltip .shortDesc").text(d.shortDesc); $(".tooltipContainer .teamTooltip .memberCount").html(glyphUser+d.memberCount); $(".tooltipContainer .teamTooltip .loanedAmount").html(glyphUSD+d.loanedAmount);});';
                funcPrepData += '$(".team circle").hover(function(e){ $(this).css("cursor", "pointer"); $(".tooltipContainer").show(); var additional = 0; if($(".teamTooltip .teamName").height() > 22){ additional = 22; } $(".teamTooltip .teamName").height(); $(".tooltipContainer .teamTooltip").height(60+$(this).height() + $(".teamTooltip .shortDesc").height() + additional ); if(e.pageX > $(window).width()/2){ $(".tooltipContainer").css({"left": e.pageX-480, "top": e.pageY-118}); $(".tooltipContainer .arrow").css({"border-top": "solid transparent 7px", "border-bottom": "solid transparent 7px", "border-right": "none", "border-left": "solid #ffffff 15px", "left": 398+"px" }); $(".tooltipContainer .arrow2").css({"border-top": "solid transparent 7px", "border-bottom": "solid transparent 7px", "border-right": "none", "border-left": "solid rgba(66,139,202,0.8) 15px", "left": "400px" }); }else{ $(".tooltipContainer").css({"left": e.pageX-10, "top": e.pageY-118}); $(".tooltipContainer .arrow").css({"border-top": "solid transparent 7px", "border-bottom": "solid transparent 7px", "border-left": "none", "border-right": "solid #ffffff 15px", "left": -13+"px" }); $(".tooltipContainer .arrow2").css({"border-top": "solid transparent 7px", "border-bottom": "solid transparent 7px", "border-left": "none", "border-right": "solid rgba(66,139,202,0.8) 15px", "left": "-15px" });} }, function(){ $(".tooltipContainer").hide(); });';
                funcPrepData += 'gTeam.selectAll("circle").on("mouseout",function(d,i){ $(".comp").filter(function(){ return $(this).attr("data-id") == d.teamId}).css("border","1px solid rgba(66,139,202,1)"); $(this).attr({"r": 5}) });';
                funcPrepData += ' }';


                eval(funcPrepData);
                if($('.scatter').css('display') != 'none'){
                    var query = 'queue()';
                    for(var i in teamIds){
                        query += ".defer(d3.json, 'data/"+workingFolder+"/teams/"+teamIds[i]+"/info.json')";
                    }
                    query += '.await(prepareData)';
                    eval(query);
                }
            }else{
                // HANDLE ZERO RESULTS
                gTeam.append("text").attr("class","noResult").text("There is no teaming matching the criteria")
                    .attr("x", $("svg.scatterArea").width()/2 - 200)
                    .attr("y", $("svg.scatterArea").height()/2)
                    .style({"font-size": "30px", "fill": "#666666"})
            }

        }

        drawScatter([]);


        $(window).resize(debouncer(function(e){
            // REDRAW THE SCATTER PLOT
            drawScatter(inComparison);

            // RELOCATE THE COMPARISON PANEL
//            console.log($(".scatter").position().left + $(".scatter svg.scatterArea").width() - 130);
            $(".scatter .container").css("left", $(".scatter").position().left + $(".scatter svg.scatterArea").width() - 130 + "px");
            $(".scatter .container .comparisonPanel").width($(window).innerWidth() - $(".scatter").position().left*2.6 - $(".scatter .container").position().left);
        }));


    }

    var svg = d3.select('.map').append('svg').style({'height': 600, 'width': '100%', 'position': 'relative', 'top': '-40px', 'border': '1px solid #dddddd'}).attr("class","map");
    $('.map svg.map').height(600);
    var inComparison = [];
    var filteredObjs = [];
    var countryFilter = [];
    var countryDict = {"BD": "BGD", "BF": "BFA", "BG": "BGR", "BA": "BIH", "BB": "BRB", "BE": "BEL", "BL": "BLM", "BM": "BMU", "BN": "BRN", "BO": "BOL", "BH": "BHR", "BI": "BDI", "BJ": "BEN", "BT": "BTN", "JM": "JAM", "BV": "BVT", "BW": "BWA", "WS": "WSM", "BR": "BRA", "BS": "BHS", "JE": "JEY", "BY": "BLR", "BZ": "BLZ", "RU": "RUS", "RW": "RWA", "RS": "SRB", "TL": "TLS", "RE": "REU", "TM": "TKM", "TJ": "TJK", "RO": "ROU", "TK": "TKL", "GW": "GNB", "GU": "GUM", "GT": "GTM", "GS": "SGS", "GR": "GRC", "GQ": "GNQ", "GP": "GLP", "JP": "JPN", "GY": "GUY", "GG": "GGY", "GF": "GUF", "GE": "GEO", "GD": "GRD", "GB": "GBR", "GA": "GAB", "GN": "GIN", "GM": "GMB", "GL": "GRL", "GI": "GIB", "GH": "GHA", "OM": "OMN", "TN": "TUN", "JO": "JOR", "WF": "WLF", "HR": "HRV", "HT": "HTI", "HU": "HUN", "HK": "HKG", "HN": "HND", "HM": "HMD", "VE": "VEN", "PR": "PRI", "PS": "PSE", "PW": "PLW", "PT": "PRT", "KN": "KNA", "AF": "AFG", "IQ": "IRQ", "PA": "PAN", "PF": "PYF", "PG": "PNG", "PE": "PER", "PK": "PAK", "PH": "PHL", "PN": "PCN", "PL": "POL", "PM": "SPM", "ZM": "ZMB", "EH": "ESH", "EE": "EST", "EG": "EGY", "ZA": "ZAF", "EC": "ECU", "IT": "ITA", "VN": "VNM", "SB": "SLB", "ET": "ETH", "SO": "SOM", "ZW": "ZWE", "SA": "SAU", "ES": "ESP", "ER": "ERI", "ME": "MNE", "MD": "MDA", "MG": "MDG", "MF": "MAF", "MA": "MAR", "MC": "MCO", "UZ": "UZB", "MM": "MMR", "ML": "MLI", "MO": "MAC", "MN": "MNG", "MH": "MHL", "MK": "MKD", "MU": "MUS", "MT": "MLT", "MW": "MWI", "MV": "MDV", "MQ": "MTQ", "MP": "MNP", "MS": "MSR", "MR": "MRT", "IM": "IMN", "UG": "UGA", "TZ": "TZA", "MY": "MYS", "MX": "MEX", "IL": "ISR", "FR": "FRA", "AW": "ABW", "SH": "SHN", "SJ": "SJM", "FI": "FIN", "FJ": "FJI", "FK": "FLK", "FM": "FSM", "FO": "FRO", "NI": "NIC", "NL": "NLD", "NO": "NOR", "NA": "NAM", "VU": "VUT", "NC": "NCL", "NE": "NER", "NF": "NFK", "NG": "NGA", "NZ": "NZL", "NP": "NPL", "NR": "NRU", "NU": "NIU", "CK": "COK", "CI": "CIV", "CH": "CHE", "CO": "COL", "CN": "CHN", "CM": "CMR", "CL": "CHL", "CC": "CCK", "CA": "CAN", "CG": "COG", "CF": "CAF", "CD": "COD", "CZ": "CZE", "CY": "CYP", "CX": "CXR", "CR": "CRI", "PY": "PRY", "CV": "CPV", "CU": "CUB", "SZ": "SWZ", "SY": "SYR", "KG": "KGZ", "KE": "KEN", "SS": "SSD", "SR": "SUR", "KI": "KIR", "KH": "KHM", "SV": "SLV", "KM": "COM", "ST": "STP", "SK": "SVK", "KR": "KOR", "SI": "SVN", "KP": "PRK", "KW": "KWT", "SN": "SEN", "SM": "SMR", "SL": "SLE", "SC": "SYC", "KZ": "KAZ", "KY": "CYM", "SG": "SGP", "SE": "SWE", "SD": "SDN", "DO": "DOM", "DM": "DMA", "DJ": "DJI", "DK": "DNK", "DE": "DEU", "YE": "YEM", "DZ": "DZA", "US": "USA", "UY": "URY", "YT": "MYT", "UM": "UMI", "LB": "LBN", "LC": "LCA", "LA": "LAO", "TV": "TUV", "TW": "TWN", "TT": "TTO", "TR": "TUR", "LK": "LKA", "LI": "LIE", "LV": "LVA", "TO": "TON", "LT": "LTU", "LU": "LUX", "LR": "LBR", "LS": "LSO", "TH": "THA", "TF": "ATF", "TG": "TGO", "TD": "TCD", "TC": "TCA", "LY": "LBY", "VA": "VAT", "VC": "VCT", "AE": "ARE", "AD": "AND", "AG": "ATG", "VG": "VGB", "AI": "AIA", "VI": "VIR", "IS": "ISL", "IR": "IRN", "AM": "ARM", "AL": "ALB", "AO": "AGO", "AN": "ANT", "AQ": "ATA", "AS": "ASM", "AR": "ARG", "AU": "AUS", "AT": "AUT", "IO": "IOT", "IN": "IND", "AX": "ALA", "AZ": "AZE", "IE": "IRL", "ID": "IDN", "UA": "UKR", "QA": "QAT", "MZ": "MOZ", "XK": "XKX", "QS": "SSD"};
    var countryDict2 = [{"name":"Afghanistan","alpha-3":"AFG","country-code":"004"},{"name":"Åland Islands","alpha-3":"ALA","country-code":"248"},{"name":"Albania","alpha-3":"ALB","country-code":"008"},{"name":"Algeria","alpha-3":"DZA","country-code":"012"},{"name":"American Samoa","alpha-3":"ASM","country-code":"016"},{"name":"Andorra","alpha-3":"AND","country-code":"020"},{"name":"Angola","alpha-3":"AGO","country-code":"024"},{"name":"Anguilla","alpha-3":"AIA","country-code":"660"},{"name":"Antarctica","alpha-3":"ATA","country-code":"010"},{"name":"Antigua and Barbuda","alpha-3":"ATG","country-code":"028"},{"name":"Argentina","alpha-3":"ARG","country-code":"032"},{"name":"Armenia","alpha-3":"ARM","country-code":"051"},{"name":"Aruba","alpha-3":"ABW","country-code":"533"},{"name":"Australia","alpha-3":"AUS","country-code":"036"},{"name":"Austria","alpha-3":"AUT","country-code":"040"},{"name":"Azerbaijan","alpha-3":"AZE","country-code":"031"},{"name":"Bahamas","alpha-3":"BHS","country-code":"044"},{"name":"Bahrain","alpha-3":"BHR","country-code":"048"},{"name":"Bangladesh","alpha-3":"BGD","country-code":"050"},{"name":"Barbados","alpha-3":"BRB","country-code":"052"},{"name":"Belarus","alpha-3":"BLR","country-code":"112"},{"name":"Belgium","alpha-3":"BEL","country-code":"056"},{"name":"Belize","alpha-3":"BLZ","country-code":"084"},{"name":"Benin","alpha-3":"BEN","country-code":"204"},{"name":"Bermuda","alpha-3":"BMU","country-code":"060"},{"name":"Bhutan","alpha-3":"BTN","country-code":"064"},{"name":"Bolivia, Plurinational State of","alpha-3":"BOL","country-code":"068"},{"name":"Bonaire, Sint Eustatius and Saba","alpha-3":"BES","country-code":"535"},{"name":"Bosnia and Herzegovina","alpha-3":"BIH","country-code":"070"},{"name":"Botswana","alpha-3":"BWA","country-code":"072"},{"name":"Bouvet Island","alpha-3":"BVT","country-code":"074"},{"name":"Brazil","alpha-3":"BRA","country-code":"076"},{"name":"British Indian Ocean Territory","alpha-3":"IOT","country-code":"086"},{"name":"Brunei Darussalam","alpha-3":"BRN","country-code":"096"},{"name":"Bulgaria","alpha-3":"BGR","country-code":"100"},{"name":"Burkina Faso","alpha-3":"BFA","country-code":"854"},{"name":"Burundi","alpha-3":"BDI","country-code":"108"},{"name":"Cambodia","alpha-3":"KHM","country-code":"116"},{"name":"Cameroon","alpha-3":"CMR","country-code":"120"},{"name":"Canada","alpha-3":"CAN","country-code":"124"},{"name":"Cape Verde","alpha-3":"CPV","country-code":"132"},{"name":"Cayman Islands","alpha-3":"CYM","country-code":"136"},{"name":"Central African Republic","alpha-3":"CAF","country-code":"140"},{"name":"Chad","alpha-3":"TCD","country-code":"148"},{"name":"Chile","alpha-3":"CHL","country-code":"152"},{"name":"China","alpha-3":"CHN","country-code":"156"},{"name":"Christmas Island","alpha-3":"CXR","country-code":"162"},{"name":"Cocos (Keeling) Islands","alpha-3":"CCK","country-code":"166"},{"name":"Colombia","alpha-3":"COL","country-code":"170"},{"name":"Comoros","alpha-3":"COM","country-code":"174"},{"name":"Congo","alpha-3":"COG","country-code":"178"},{"name":"Congo, the Democratic Republic of the","alpha-3":"COD","country-code":"180"},{"name":"Cook Islands","alpha-3":"COK","country-code":"184"},{"name":"Costa Rica","alpha-3":"CRI","country-code":"188"},{"name":"Côte d'Ivoire","alpha-3":"CIV","country-code":"384"},{"name":"Croatia","alpha-3":"HRV","country-code":"191"},{"name":"Cuba","alpha-3":"CUB","country-code":"192"},{"name":"Curaçao","alpha-3":"CUW","country-code":"531"},{"name":"Cyprus","alpha-3":"CYP","country-code":"196"},{"name":"Czech Republic","alpha-3":"CZE","country-code":"203"},{"name":"Denmark","alpha-3":"DNK","country-code":"208"},{"name":"Djibouti","alpha-3":"DJI","country-code":"262"},{"name":"Dominica","alpha-3":"DMA","country-code":"212"},{"name":"Dominican Republic","alpha-3":"DOM","country-code":"214"},{"name":"Ecuador","alpha-3":"ECU","country-code":"218"},{"name":"Egypt","alpha-3":"EGY","country-code":"818"},{"name":"El Salvador","alpha-3":"SLV","country-code":"222"},{"name":"Equatorial Guinea","alpha-3":"GNQ","country-code":"226"},{"name":"Eritrea","alpha-3":"ERI","country-code":"232"},{"name":"Estonia","alpha-3":"EST","country-code":"233"},{"name":"Ethiopia","alpha-3":"ETH","country-code":"231"},{"name":"Falkland Islands (Malvinas)","alpha-3":"FLK","country-code":"238"},{"name":"Faroe Islands","alpha-3":"FRO","country-code":"234"},{"name":"Fiji","alpha-3":"FJI","country-code":"242"},{"name":"Finland","alpha-3":"FIN","country-code":"246"},{"name":"France","alpha-3":"FRA","country-code":"250"},{"name":"French Guiana","alpha-3":"GUF","country-code":"254"},{"name":"French Polynesia","alpha-3":"PYF","country-code":"258"},{"name":"French Southern Territories","alpha-3":"ATF","country-code":"260"},{"name":"Gabon","alpha-3":"GAB","country-code":"266"},{"name":"Gambia","alpha-3":"GMB","country-code":"270"},{"name":"Georgia","alpha-3":"GEO","country-code":"268"},{"name":"Germany","alpha-3":"DEU","country-code":"276"},{"name":"Ghana","alpha-3":"GHA","country-code":"288"},{"name":"Gibraltar","alpha-3":"GIB","country-code":"292"},{"name":"Greece","alpha-3":"GRC","country-code":"300"},{"name":"Greenland","alpha-3":"GRL","country-code":"304"},{"name":"Grenada","alpha-3":"GRD","country-code":"308"},{"name":"Guadeloupe","alpha-3":"GLP","country-code":"312"},{"name":"Guam","alpha-3":"GUM","country-code":"316"},{"name":"Guatemala","alpha-3":"GTM","country-code":"320"},{"name":"Guernsey","alpha-3":"GGY","country-code":"831"},{"name":"Guinea","alpha-3":"GIN","country-code":"324"},{"name":"Guinea-Bissau","alpha-3":"GNB","country-code":"624"},{"name":"Guyana","alpha-3":"GUY","country-code":"328"},{"name":"Haiti","alpha-3":"HTI","country-code":"332"},{"name":"Heard Island and McDonald Islands","alpha-3":"HMD","country-code":"334"},{"name":"Holy See (Vatican City State)","alpha-3":"VAT","country-code":"336"},{"name":"Honduras","alpha-3":"HND","country-code":"340"},{"name":"Hong Kong","alpha-3":"HKG","country-code":"344"},{"name":"Hungary","alpha-3":"HUN","country-code":"348"},{"name":"Iceland","alpha-3":"ISL","country-code":"352"},{"name":"India","alpha-3":"IND","country-code":"356"},{"name":"Indonesia","alpha-3":"IDN","country-code":"360"},{"name":"Iran, Islamic Republic of","alpha-3":"IRN","country-code":"364"},{"name":"Iraq","alpha-3":"IRQ","country-code":"368"},{"name":"Ireland","alpha-3":"IRL","country-code":"372"},{"name":"Isle of Man","alpha-3":"IMN","country-code":"833"},{"name":"Israel","alpha-3":"ISR","country-code":"376"},{"name":"Italy","alpha-3":"ITA","country-code":"380"},{"name":"Jamaica","alpha-3":"JAM","country-code":"388"},{"name":"Japan","alpha-3":"JPN","country-code":"392"},{"name":"Jersey","alpha-3":"JEY","country-code":"832"},{"name":"Jordan","alpha-3":"JOR","country-code":"400"},{"name":"Kazakhstan","alpha-3":"KAZ","country-code":"398"},{"name":"Kenya","alpha-3":"KEN","country-code":"404"},{"name":"Kiribati","alpha-3":"KIR","country-code":"296"},{"name":"Korea, Democratic People's Republic of","alpha-3":"PRK","country-code":"408"},{"name":"Korea, Republic of","alpha-3":"KOR","country-code":"410"},{"name":"Kuwait","alpha-3":"KWT","country-code":"414"},{"name":"Kyrgyzstan","alpha-3":"KGZ","country-code":"417"},{"name":"Lao People's Democratic Republic","alpha-3":"LAO","country-code":"418"},{"name":"Latvia","alpha-3":"LVA","country-code":"428"},{"name":"Lebanon","alpha-3":"LBN","country-code":"422"},{"name":"Lesotho","alpha-3":"LSO","country-code":"426"},{"name":"Liberia","alpha-3":"LBR","country-code":"430"},{"name":"Libya","alpha-3":"LBY","country-code":"434"},{"name":"Liechtenstein","alpha-3":"LIE","country-code":"438"},{"name":"Lithuania","alpha-3":"LTU","country-code":"440"},{"name":"Luxembourg","alpha-3":"LUX","country-code":"442"},{"name":"Macao","alpha-3":"MAC","country-code":"446"},{"name":"Macedonia, the former Yugoslav Republic of","alpha-3":"MKD","country-code":"807"},{"name":"Madagascar","alpha-3":"MDG","country-code":"450"},{"name":"Malawi","alpha-3":"MWI","country-code":"454"},{"name":"Malaysia","alpha-3":"MYS","country-code":"458"},{"name":"Maldives","alpha-3":"MDV","country-code":"462"},{"name":"Mali","alpha-3":"MLI","country-code":"466"},{"name":"Malta","alpha-3":"MLT","country-code":"470"},{"name":"Marshall Islands","alpha-3":"MHL","country-code":"584"},{"name":"Martinique","alpha-3":"MTQ","country-code":"474"},{"name":"Mauritania","alpha-3":"MRT","country-code":"478"},{"name":"Mauritius","alpha-3":"MUS","country-code":"480"},{"name":"Mayotte","alpha-3":"MYT","country-code":"175"},{"name":"Mexico","alpha-3":"MEX","country-code":"484"},{"name":"Micronesia, Federated States of","alpha-3":"FSM","country-code":"583"},{"name":"Moldova, Republic of","alpha-3":"MDA","country-code":"498"},{"name":"Monaco","alpha-3":"MCO","country-code":"492"},{"name":"Mongolia","alpha-3":"MNG","country-code":"496"},{"name":"Montenegro","alpha-3":"MNE","country-code":"499"},{"name":"Montserrat","alpha-3":"MSR","country-code":"500"},{"name":"Morocco","alpha-3":"MAR","country-code":"504"},{"name":"Mozambique","alpha-3":"MOZ","country-code":"508"},{"name":"Myanmar","alpha-3":"MMR","country-code":"104"},{"name":"Namibia","alpha-3":"NAM","country-code":"516"},{"name":"Nauru","alpha-3":"NRU","country-code":"520"},{"name":"Nepal","alpha-3":"NPL","country-code":"524"},{"name":"Netherlands","alpha-3":"NLD","country-code":"528"},{"name":"New Caledonia","alpha-3":"NCL","country-code":"540"},{"name":"New Zealand","alpha-3":"NZL","country-code":"554"},{"name":"Nicaragua","alpha-3":"NIC","country-code":"558"},{"name":"Niger","alpha-3":"NER","country-code":"562"},{"name":"Nigeria","alpha-3":"NGA","country-code":"566"},{"name":"Niue","alpha-3":"NIU","country-code":"570"},{"name":"Norfolk Island","alpha-3":"NFK","country-code":"574"},{"name":"Northern Mariana Islands","alpha-3":"MNP","country-code":"580"},{"name":"Norway","alpha-3":"NOR","country-code":"578"},{"name":"Oman","alpha-3":"OMN","country-code":"512"},{"name":"Pakistan","alpha-3":"PAK","country-code":"586"},{"name":"Palau","alpha-3":"PLW","country-code":"585"},{"name":"Palestinian Territory, Occupied","alpha-3":"PSE","country-code":"275"},{"name":"Panama","alpha-3":"PAN","country-code":"591"},{"name":"Papua New Guinea","alpha-3":"PNG","country-code":"598"},{"name":"Paraguay","alpha-3":"PRY","country-code":"600"},{"name":"Peru","alpha-3":"PER","country-code":"604"},{"name":"Philippines","alpha-3":"PHL","country-code":"608"},{"name":"Pitcairn","alpha-3":"PCN","country-code":"612"},{"name":"Poland","alpha-3":"POL","country-code":"616"},{"name":"Portugal","alpha-3":"PRT","country-code":"620"},{"name":"Puerto Rico","alpha-3":"PRI","country-code":"630"},{"name":"Qatar","alpha-3":"QAT","country-code":"634"},{"name":"Réunion","alpha-3":"REU","country-code":"638"},{"name":"Romania","alpha-3":"ROU","country-code":"642"},{"name":"Russian Federation","alpha-3":"RUS","country-code":"643"},{"name":"Rwanda","alpha-3":"RWA","country-code":"646"},{"name":"Saint Barthélemy","alpha-3":"BLM","country-code":"652"},{"name":"Saint Helena, Ascension and Tristan da Cunha","alpha-3":"SHN","country-code":"654"},{"name":"Saint Kitts and Nevis","alpha-3":"KNA","country-code":"659"},{"name":"Saint Lucia","alpha-3":"LCA","country-code":"662"},{"name":"Saint Martin (French part)","alpha-3":"MAF","country-code":"663"},{"name":"Saint Pierre and Miquelon","alpha-3":"SPM","country-code":"666"},{"name":"Saint Vincent and the Grenadines","alpha-3":"VCT","country-code":"670"},{"name":"Samoa","alpha-3":"WSM","country-code":"882"},{"name":"San Marino","alpha-3":"SMR","country-code":"674"},{"name":"Sao Tome and Principe","alpha-3":"STP","country-code":"678"},{"name":"Saudi Arabia","alpha-3":"SAU","country-code":"682"},{"name":"Senegal","alpha-3":"SEN","country-code":"686"},{"name":"Serbia","alpha-3":"SRB","country-code":"688"},{"name":"Seychelles","alpha-3":"SYC","country-code":"690"},{"name":"Sierra Leone","alpha-3":"SLE","country-code":"694"},{"name":"Singapore","alpha-3":"SGP","country-code":"702"},{"name":"Sint Maarten (Dutch part)","alpha-3":"SXM","country-code":"534"},{"name":"Slovakia","alpha-3":"SVK","country-code":"703"},{"name":"Slovenia","alpha-3":"SVN","country-code":"705"},{"name":"Solomon Islands","alpha-3":"SLB","country-code":"090"},{"name":"Somalia","alpha-3":"SOM","country-code":"706"},{"name":"South Africa","alpha-3":"ZAF","country-code":"710"},{"name":"South Georgia and the South Sandwich Islands","alpha-3":"SGS","country-code":"239"},{"name":"South Sudan","alpha-3":"SSD","country-code":"728"},{"name":"Spain","alpha-3":"ESP","country-code":"724"},{"name":"Sri Lanka","alpha-3":"LKA","country-code":"144"},{"name":"Sudan","alpha-3":"SDN","country-code":"729"},{"name":"Suriname","alpha-3":"SUR","country-code":"740"},{"name":"Svalbard and Jan Mayen","alpha-3":"SJM","country-code":"744"},{"name":"Swaziland","alpha-3":"SWZ","country-code":"748"},{"name":"Sweden","alpha-3":"SWE","country-code":"752"},{"name":"Switzerland","alpha-3":"CHE","country-code":"756"},{"name":"Syrian Arab Republic","alpha-3":"SYR","country-code":"760"},{"name":"Taiwan, Province of China","alpha-3":"TWN","country-code":"158"},{"name":"Tajikistan","alpha-3":"TJK","country-code":"762"},{"name":"Tanzania, United Republic of","alpha-3":"TZA","country-code":"834"},{"name":"Thailand","alpha-3":"THA","country-code":"764"},{"name":"Timor-Leste","alpha-3":"TLS","country-code":"626"},{"name":"Togo","alpha-3":"TGO","country-code":"768"},{"name":"Tokelau","alpha-3":"TKL","country-code":"772"},{"name":"Tonga","alpha-3":"TON","country-code":"776"},{"name":"Trinidad and Tobago","alpha-3":"TTO","country-code":"780"},{"name":"Tunisia","alpha-3":"TUN","country-code":"788"},{"name":"Turkey","alpha-3":"TUR","country-code":"792"},{"name":"Turkmenistan","alpha-3":"TKM","country-code":"795"},{"name":"Turks and Caicos Islands","alpha-3":"TCA","country-code":"796"},{"name":"Tuvalu","alpha-3":"TUV","country-code":"798"},{"name":"Uganda","alpha-3":"UGA","country-code":"800"},{"name":"Ukraine","alpha-3":"UKR","country-code":"804"},{"name":"United Arab Emirates","alpha-3":"ARE","country-code":"784"},{"name":"United Kingdom","alpha-3":"GBR","country-code":"826"},{"name":"United States","alpha-3":"USA","country-code":"840"},{"name":"United States Minor Outlying Islands","alpha-3":"UMI","country-code":"581"},{"name":"Uruguay","alpha-3":"URY","country-code":"858"},{"name":"Uzbekistan","alpha-3":"UZB","country-code":"860"},{"name":"Vanuatu","alpha-3":"VUT","country-code":"548"},{"name":"Venezuela, Bolivarian Republic of","alpha-3":"VEN","country-code":"862"},{"name":"Viet Nam","alpha-3":"VNM","country-code":"704"},{"name":"Virgin Islands, British","alpha-3":"VGB","country-code":"092"},{"name":"Virgin Islands, U.S.","alpha-3":"VIR","country-code":"850"},{"name":"Wallis and Futuna","alpha-3":"WLF","country-code":"876"},{"name":"Western Sahara","alpha-3":"ESH","country-code":"732"},{"name":"Yemen","alpha-3":"YEM","country-code":"887"},{"name":"Zambia","alpha-3":"ZMB","country-code":"894"},{"name":"Zimbabwe","alpha-3":"ZWE","country-code":"716"}];
    var isBooked = 0;
    // change the naume of dropdown menu upon change
    var teams100 = {'id': [], 'name': [], 'loans': []};

    $(document).ready(function(){
        // setup the scatter plot area
        $('.scatter').css({'border': '1px solid #dddddd', 'display':'none','opacity': 0,'transform':'scale(0.9)','width': $(window).width()*0.94, 'height': 800, 'position': 'absolute', 'background-color': 'rgba(255,255,255,0.9)', 'top': 55, 'left': $(window).width()*0.03});

        // reposition the loading indicator
        $('.loadingContainer').css("left",$(window).width()/2 - 150/2+"px");
        $('.loadingContainer').css("top",$(window).height()/2 - 200/2+"px");

        d3.json("world_map.json", function(error, world){
            var projection = d3.geo.mercator()
                .scale($(window).width()/7.647058824)
                .translate([$(window).width()/2, 350]);

            var path = d3.geo.path()
                .projection(projection);

            $('#spinner').hide();
            $('.sectorLayer .btn-group').show();

            // FILTERING WORKS BASED ON USER'S SELECTION OF A SECTOR
            var countries = []; // THESE ARE THE KEYS TO BE COUPLED WITH THE KIVA API

            var teamsNum = [];
            filteredObjs = filterCountries(topojson.feature(world,world.objects.world).features, countries);

            // ADD TO THE OBJECT THE NUMBER OF TEAMS PER COUNTRY PER SECTOR SELECTED
            for(var obj in filteredObjs){
                filteredObjs[obj].teams = teamsNum[obj];
            }

            // DRAW THE WORLD MAP
            svg.append('g').attr('id','mapGroup');
            svg.select('#mapGroup').selectAll('path')
                .data(topojson.feature(world, world.objects.world).features)
                .enter()
                .append('path')
                .attr("d", d3.geo.path().projection(d3.geo.mercator().scale($(window).width()/7.647058824).translate([$(window).width()/2, 350])))
                .attr('class', function(d){ return d.properties.name })
                .attr('id', function(d){ return d.id })
                .style({'fill': '#999999', 'stroke-width': 1, 'stroke': '#666666'});

            d3.select('svg.svgLegend').selectAll('rect.bracket').data([1,2,3,4,5,6]).enter().append('rect')
                .attr("class", "bracket")
                .attr("x", 20)
                .attr("y", function(d,i){ return 30 + 20*i; })
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", "#999999");

            d3.select("svg.svgLegend").selectAll('text.bracket').data([1,2,3,4,5,6]).enter().append('text')
                .attr("class", "bracket")
                .attr("x", 35)
                .attr("y", function(d,i){ return 30 + 20*i; })
                .text('-')
                .style({"fill": "#666666", "font-size": "11px"});

            d3.select('#mapGroup').selectAll('path').filter(function(d,i){ return d.teams }).on('click', function(d,i){
                var id = $(this).attr('id');
                $('.scatter .scatterHeader').html("Showing teams that have invested most in <span class='userInput'>"+ d.properties.name+ "</span> in the <span class='userInput'>" + $('.sectorLayer button').text() + "</span> sector");
//                console.log(d.properties.name);
                $('.scatter').show();
                $('.scatter').animate({'opacity':1,'transform': 'scale(1,1)'}, 600, 'easeInOutBack', function(){

                });
            });

            // DRAW COUNTRIES INFORMATION FOR THE FIRST TIME
            svg.append('g').attr('id','countryNames');

            $('.dropdown-menu li').click(function(){
                inComparison = [];
                $('.scatter').animate({'opacity':0, 'transform': 'scale(0.7)'}, 600, 'easeInOutBack').hide(100);

                var source = {};
                var loansId = [];
                var counterTo100 = 0;
                teams100 = {'id': [], 'name': [], 'loans': []};

                $('.loadingContainer').show();
                $('.dropdown-toggle').html($(this).text()+' <span class="caret"></span>');
                $('.dropdown-toggle').attr('data-selected', $(this).find('a').attr('data-sys'));
                var workingFolder = $('.dropdown-toggle').attr('data-selected');
                $('.placeholder').hide();

                $.getJSON('data/'+$(this).find('a').attr('id')+'.json', function(data){
                    source = data;

                    // GET THE IDs OF LOANS THAT HAVE APPROXIMATELY 100 TEAMS
                    for(var i in source.loans){
                        if(source.loans[i].lender_count != 0){
                            loansId.push(source.loans[i].id);
                            counterTo100 += source.loans[i].lender_count;
                        }
                        if(counterTo100 > 100){
                            break;
                        }
                    }

                    // DYNAMIC FUNCTION FOR EXTRACTING TEAMS OUT OF A SECTOR
                    var funcPrepMapQuery = "function preparemap(error,";
                    for(var loan in loansId){
                        funcPrepMapQuery += 'd'+loan;
                        if(loan != loansId.length - 1){
                            funcPrepMapQuery += ',';
                        }
                    }
                    funcPrepMapQuery += '){ ';
                    for(var loan in loansId){
                        funcPrepMapQuery += '$(d'+loan+'.teams).each(function(){ '
                        funcPrepMapQuery += 'teams100.id.push(this.id);';
                        // PREPARE TO CONNECT THE DATA TO THE MAP
                        funcPrepMapQuery += 'teams100.name.push(this.name);';
                        funcPrepMapQuery += '});';
                    }

                    funcPrepMapQuery += 'console.log(teams100);';
                    // GET THE LOANS INVESTED BY EACH INDIVIDUAL TEAM
                    funcPrepMapQuery += 'teams100 = getLoans(teams100,world); }';

                    eval(funcPrepMapQuery);

                    $('#spinner').show();
                    var query = 'queue()';
                    for(var loan in loansId){
                        query += ".defer(d3.json, 'data/"+workingFolder+"/"+loansId[loan]+".json')";
                    }
                    query += '.await(preparemap)';
                    eval(query);

                });

            });

            // resize the map as the browser is resized
            $(window).resize(debouncer(function(e){
                redrawMap();

                // REPOSITION THE LOADING INDICATOR
                $('.loadingContainer').css("left",$(window).width()/2 - 150/2+"px");
                $('.loadingContainer').css("top",$(window).height()/2 - 200/2+"px");

                $('.scatter').css({'width': $(window).width()*0.94, 'height': 800, 'left': $(window).width()*0.03});
                updateCountries(filteredObjs);
                updateColorIntensities(d3.select('#mapGroup'), filteredObjs, topojson.feature(world,world.objects.world).features);
            }));
        });

        // scatter plot window close event listener
        $('.scatter .closeBox').on('click',function(){
            $('.scatter').animate({'opacity':0, 'transform': 'scale(0.7)'}, 600, 'easeInOutBack').hide(100);
            $('g.team circle').each(function(){
                $(this).removeAttr('class');
                $(this).css('fill', 'rgba(66,139,202,0.8)');
            });

            $('.comp').each(function(){
                $(this).removeClass('occupied');
                $(this).removeAttr('data-id');
                $(this).css("border", "1px dashed #bbbbbb");
                $(this).find('.comp_close').html('');
                $(this).find('.comp_teamName').html('');
                $(this).find('.comp_top5countries').html('');
                $(this).find('.comp_top5sectors').html('');
            });

        });

        $('body').on('keyup', function(e){
            if(e.which == 27){
                $('.scatter').animate({'opacity':0, 'transform': 'scale(0.7)'}, 600, 'easeInOutBack').hide(100);
                $('g.team circle').each(function(){
                    $(this).removeAttr('class');
                    $(this).css('fill', 'rgba(66,139,202,0.8)');
                });

                $('.comp').each(function(){
                    $(this).removeClass('occupied');
                    $(this).removeAttr('data-id');
                    $(this).css("border", "1px dashed #bbbbbb");
                    $(this).find('.comp_close').html('');
                    $(this).find('.comp_teamName').html('');
                    $(this).find('.comp_top5countries').html('');
                    $(this).find('.comp_top5sectors').html('');
                });
            }
        });

    });


});