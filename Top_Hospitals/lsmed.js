google.charts.load('visualization', '1', {
    'packages': ['corechart', 'geochart']
});

$(document).ready(function() {
    $('#vennSetSelect').multiselect();
    $('#vennTopNSelect').multiselect();

    function drawRadar(divId, radarData) {
        var w = 180;
        var h = 180;
        RadarChart.defaultConfig.radius = 1;
        RadarChart.defaultConfig.maxValue = 120;
        RadarChart.defaultConfig.w = w;
        RadarChart.defaultConfig.h = h;
        RadarChart.defaultConfig.color = function() {};
        RadarChart.draw('#' + divId, radarData);
    }

    var getUrlParameter = function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var contactLsmed = function() {
        $('#message-result').html('');
        $.ajax({
            url: "https://www.linksciences.com/contactLSMed.do",
            type: 'GET',
            data: {
                "uFirstName": $('#fname').val(),
                "uLastName": $('#lname').val(),
                "uEmail": $('#email').val(),
                "uMessage": $('#message').val()
            },
            dataType: "json",
            success: function(data) {
                $('#message-result').html(data.result);
            }
        });
    }

    $('#contactLsmed').click(function() {
        contactLsmed();
    });

    var generateCompareTable = function() {
        $.ajax({
            url: 'https://www.linksciences.com/compareHospitals.do?compare=' + $('#compare').val(),
            success: function(data) {
                // $.ajax({url:
                // 'https://localhost:8080/LSWebApp2015/compareHospitals.do?compare='
                // + $('#compare').val(), success:
                // function(data){
                console.log(data.selectedHospList);
                $('#compareArea').html('');
                var tableHtml = '';

                // logo
                tableHtml += '<table class="table table-striped"><thead><tr><th></th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<th>';
                    tableHtml += '<img class="hosp_logo" src="https://linkmedicine.com/wp-content/uploads/hosp_logos/' + element['logUrl'] + '" alt="">';
                    tableHtml += '</th>';
                });
                tableHtml += '</thead>';

                tableHtml += '<tbody>';

                // name
                tableHtml += '<tr><th>Name</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<th>';
                    tableHtml += element['name'];
                    tableHtml += '</th>';
                });
                tableHtml += '</tr>';

                // Location
                tableHtml += '<tr><th>Location</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += element['city'] + ', ' + element['state'];
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // year
                tableHtml += '<tr><th>Since</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += element['year'];
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // bedNum
                tableHtml += '<tr><th>#Bed</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += element['bedNum'];
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // radar
                tableHtml += '<tr><th>Overall</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += '<div id="radar' + n + '"></div>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // Rank
                tableHtml += '<tr><th>Rank</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += element['overallRankDisplay'];
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                var maxProjCnt = 1;
                var maxPiCnt = 1;
                var maxTrialsCnt = 1;
                var maxTrtmntCnt = 1;
                var maxFunding = 1;

                $.each(data.selectedHospList, function(n, element) {
                    if (element['projectCount'] > maxProjCnt) {
                        maxProjCnt = element['projectCount'];
                    }

                    if (element['piCount'] > maxPiCnt) {
                        maxPiCnt = element['piCount'];
                    }

                    if (element['nctCount'] > maxTrialsCnt) {
                        maxTrialsCnt = element['nctCount'];
                    }

                    if (element['interverntionCount'] > maxTrtmntCnt) {
                        maxTrtmntCnt = element['interverntionCount'];
                    }

                    if (element['funding'] > maxFunding) {
                        maxFunding = element['funding'];
                    }
                });

                // Project
                tableHtml += '<tr class="moreCircle"><th>Frontier Research</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';

                    // flipper from tf
                    tableHtml += '<div class="tophospRank" ontouchstart="this.classList.toggle(\'hover\');">';
                    tableHtml += '<div class="flipper">';
                    tableHtml += '<div class="front"><b class="ng-binding">#' + element['projectCountRankDisplay'] + '</b></div>';
                    tableHtml += '<div class="back ng-binding">Projects: ' + element['projectCount'] + '</div>';
                    tableHtml += '</div></div>';
                    tableHtml += '<input id="projCnt' + n + '" data-slider-id="projCntSlider' + n + '" type="text" data-slider-min="0" data-slider-max="' + maxProjCnt + '" data-slider-step="1" data-slider-value="' + element['projectCount'] + '"/>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // piCount
                tableHtml += '<tr class="moreCircle"><th>Associated Experts</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';

                    // flipper from tf
                    tableHtml += '<div class="tophospRank" ontouchstart="this.classList.toggle(\'hover\');">';
                    tableHtml += '<div class="flipper">';
                    tableHtml += '<div class="front"><b class="ng-binding">#' + element['piCountRankDisplay'] + '</b></div>';
                    tableHtml += '<div class="back ng-binding">PI: ' + element['piCount'] + '</div>';
                    tableHtml += '</div></div>';
                    tableHtml += '<input id="piCnt' + n + '" data-slider-id="piCntSlider' + n + '" type="text" data-slider-min="0" data-slider-max="' + maxPiCnt + '" data-slider-step="1" data-slider-value="' + element['piCount'] + '"/>';

                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // Trials
                tableHtml += '<tr class="moreCircle"><th>Clinical Excellence</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';

                    // flipper from tf
                    tableHtml += '<div class="tophospRank" ontouchstart="this.classList.toggle(\'hover\');">';
                    tableHtml += '<div class="flipper">';
                    tableHtml += '<div class="front"><b class="ng-binding">#' + element['nctCountRankDisplay'] + '</b></div>';
                    tableHtml += '<div class="back ng-binding">Trials: ' + element['nctCount'] + '</div>';
                    tableHtml += '</div></div>';
                    tableHtml += '<input id="trialsCnt' + n + '" data-slider-id="trialsCntSlider' + n + '" type="text" data-slider-min="0" data-slider-max="' + maxTrialsCnt + '" data-slider-step="1" data-slider-value="' + element['nctCount'] + '"/>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // interverntionCount
                tableHtml += '<tr class="moreCircle"><th>Therapeutic Investigation</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';

                    // flipper from tf
                    tableHtml += '<div class="tophospRank" ontouchstart="this.classList.toggle(\'hover\');">';
                    tableHtml += '<div class="flipper">';
                    tableHtml += '<div class="front"><b class="ng-binding">#' + element['interverntionCountRankDisplay'] + '</b></div>';
                    tableHtml += '<div class="back ng-binding">Treatment: ' + element['interverntionCount'] + '</div>';
                    tableHtml += '</div></div>';
                    tableHtml += '<input id="trtmntCnt' + n + '" data-slider-id="trtmntCntSlider' + n + '" type="text" data-slider-min="0" data-slider-max="' + maxTrtmntCnt + '" data-slider-step="1" data-slider-value="' + element['interverntionCount'] + '"/>';

                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // funding
                tableHtml += '<tr class="moreCircle"><th>Federal Support</th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';

                    // flipper from tf
                    tableHtml += '<div class="tophospRank" ontouchstart="this.classList.toggle(\'hover\');">';
                    tableHtml += '<div class="flipper">';
                    tableHtml += '<div class="front"><b class="ng-binding">#' + element['fundingRankDisplay'] + '</b></div>';
                    tableHtml += '<div class="back ng-binding">Funding: ' + accounting.formatMoney(element['funding']) + '</div>';
                    tableHtml += '</div></div>';
                    tableHtml += '<input id="funding' + n + '" data-slider-id="fundingSlider' + n + '" type="text" data-slider-min="0" data-slider-max="' + maxFunding + '" data-slider-step="1" data-slider-value="' + element['funding'] + '"/>';

                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // show and hide second row
                tableHtml += '<tr class="lessRows"><th><img class="lessLink" src="https://www.linkmedicine.com/wp-content/uploads/2016/11/arrow-up.png"></th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // show and hide first row
                tableHtml += '<tr class="moreRows"><th><img class="moreLink" src="https://www.linkmedicine.com/wp-content/uploads/2016/11/arrow-down.png"></th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                // contact
                tableHtml += '<tr><th></th>';
                $.each(data.selectedHospList, function(n, element) {
                    tableHtml += '<td>';
                    tableHtml += '<a class="btn-primary" href="#">Contact</a>';
                    tableHtml += '</td>';
                });
                tableHtml += '</tr>';

                tableHtml += '</tbody>';
                tableHtml += '</table>';
                $('#compareArea').html(tableHtml);


                // show and hide function
                $(document).ready(function() {
                    $('.moreCircle').hide();
                    $('.lessRows').hide();
                    $('.moreLink').click(function() {
                        $('.moreCircle').show();
                        $('.moreRows').hide();
                        $('.lessRows').show();
                    });
                });

                $(document).ready(function() {
                    $('.lessLink').click(function() {
                        $('.moreCircle').hide();
                        $('.moreRows').show();
                        $('.lessRows').hide();
                    });
                });

                console.log(maxProjCnt);
                console.log(maxPiCnt);
                console.log(maxTrtmntCnt);
                console.log(maxTrialsCnt);
                console.log(maxFunding);

                $.each(data.selectedHospList, function(n, element) {
                    var radarData = [{
                        className: element['shortName'],
                        axes: [{
                            axis: 'Frontier Research',
                            value: (element['projectCount'] / maxProjCnt) * 100
                        }, {
                            axis: 'Associated Experts',
                            value: (element['piCount'] / maxPiCnt) * 100
                        }, {
                            axis: 'Clinical Excellence',
                            value: (element['nctCount'] / maxTrialsCnt) * 100
                        }, {
                            axis: 'Federal Support',
                            value: (element['funding'] / maxFunding) * 100
                        }, {
                            axis: 'Therapeutic Investigation',
                            value: (element['interverntionCount'] / maxTrtmntCnt) * 100
                        }]
                    }];
                    drawRadar('radar' + n, radarData);
                });

                // sliders
                $.each(data.selectedHospList, function(n, element) {
                    $('#projCnt' + n).bootstrapSlider({
                        formatter: function(value) {
                            return 'Current value: ' + value;
                        }
                    }).bootstrapSlider("disable");
                    $('#piCnt' + n).bootstrapSlider({
                        formatter: function(value) {
                            return 'Current value: ' + value;
                        }
                    }).bootstrapSlider("disable");
                    $('#trialsCnt' + n).bootstrapSlider({
                        formatter: function(value) {
                            return 'Current value: ' + value;
                        }
                    }).bootstrapSlider("disable");
                    $('#trtmntCnt' + n).bootstrapSlider({
                        formatter: function(value) {
                            return 'Current value: ' + value;
                        }
                    }).bootstrapSlider("disable");
                    $('#funding' + n).bootstrapSlider({
                        formatter: function(value) {
                            return 'Current value: ' + value;
                        }
                    }).bootstrapSlider("disable");
                });

            }
        });

    }

    // if ($('#compare').val() != null) {
    // generateCompareTable();
    // }
    // $('#compareBtn').click(function() {
    // generateCompareTable()
    // });

    //console.log(getUrlParameter('compare'));
    $('#compare').val(getUrlParameter('compare'));
    if ($('#compare').val() != undefined && $('#compare').val().length > 0) {
        generateCompareTable();
    }

    // auto complete
    $("#dkwInput").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://www.linksciences.com/getAutoCompleteDkws.do",
                data: {
                    "dkw": $('#dkwInput').val()
                },
                dataType: "json",
                success: function(data) {
                    response(data);
                }
            });
        },
        minLength: 3
    });

    // --diseaseInfo
    var displayDiseasesList = function() {
        $.ajax({
            url: 'https://www.linksciences.com/getDiseases.do',
            success: function(data) {

                // A-z tab
                $('#byAZ').html('');
                var byAZHtml = '';
                $.each(data.daMapByAZ, function(n, dArray) {
                    if (dArray[0].lsdaId.length > 0) {
                        byAZHtml += '<div class="byLetter"><h3>' + dArray[0].mplusTitle.charAt(0) + '</h3>';
                        byAZHtml += '<div class="container">';
                        $.each(dArray, function(n, diseaseInfo) {
                            byAZHtml += '<div class="col-sm-4 col-xs-6 ls-disease-cell">';
                            byAZHtml += '<a href="#" class="btn ls-disease-btn" data-lskey="' + diseaseInfo.cnName + '"><div class="col-xs-10 text-truncate ls-disease-title" title="' + diseaseInfo.mplusTitle + '">' + diseaseInfo.mplusTitle + '</div><span class="ls-disease-chevron-right"><i class="fas fa-chevron-right"></i></span></a>';
                            byAZHtml += '</div>';
                        });
                        byAZHtml += '</div></div>';
                    }
                });
                $('#byAZ').html(byAZHtml);

                // A-Z letters click event:
                $.each($('.disease-letters > a'), function(n, e) {
                    var curLetter = $(this).html().trim();
                    $(this).click(function() {
                        if ($(this).html() == 'All') {
                            $.each($('.byLetter'), function(n, el) {
                                $(this).show();
                            });
                        } else {
                            $.each($('.byLetter'), function(n, el) {
                                if (curLetter == $($(this).children()[0]).html().trim()) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            });
                        }
                    });
                });


                // area tab
                $('#byArea').html('');
                var byAreaHtml = '';
                $.each(data.daMap, function(n, dArray) {
                    if (dArray[0].lsdaId.length > 0) {
                        byAreaHtml += '<h3>' + dArray[0].lsdaId + '</h3>';
                        byAreaHtml += '<div class="container">';
                        $.each(dArray, function(n, diseaseInfo) {
                            byAreaHtml += '<div class="col-sm-4 col-xs-6 ls-disease-cell">';
                            byAreaHtml += '<a href="#" class="btn ls-disease-btn" data-lskey="' + diseaseInfo.cnName + '"><div class="col-xs-10 text-truncate ls-disease-title" title="' + diseaseInfo.mplusTitle + '">' + diseaseInfo.mplusTitle + '</div><span class="ls-disease-chevron-right"><i class="fas fa-chevron-right"></i></span></a>';
                            byAreaHtml += '</div>';
                        });
                        byAreaHtml += '</div>';
                    }
                });
                $('#byArea').html(byAreaHtml);

                var allDiseaseList = data.diseaseList;
                // modal events
                $.each($('.ls-disease-cell > a'), function(n, e) {
                    $(this).click(function() {
                        var targetKey = $(this).attr("data-lskey");
                        // diseaseModal
                        $.each(allDiseaseList, function(n, dizz) {
                            if (dizz.cnName == targetKey) {
                                $('#ls-dmodal-title').html(dizz.mplusTitle);
                                $('#ls-dmodal-content1').html(dizz.mplusMeta);
                                $('#ls-dmodal-dareas > .ls-dmodal-darea').html(dizz.lsdaId);
                                $('#viewDiseaseLink').attr('href', 'https://linkmedicine.com/disease-sitemap/view-disease/?diseaseId=' + dizz.mplusId);
                            }
                        });
                        $('#diseaseModal').modal('show');
                    });
                });
            }
        });
    }

    if ($('#disease-view-by')) {
        displayDiseasesList();
    }

    var urlParams = new URLSearchParams(window.location.search);
    // --view disease page:
    var currentDisease = urlParams.get("diseaseId");
    var viewDiseaseDetail = function(diseaseId) {
        $.ajax({
            url: 'https://www.linksciences.com/viewDisease.do?diseaseId=' + diseaseId,
            success: function(data) {
                $('#ls-disease-page-title').html(data.dTitle);
                $('#ls-disease-page-overview').html(data.dOverview);
                // $('#ha-hosplogo').attr("src",
                // "https://linkmedicine.com/wp-content/uploads/hosp_logos/" +
                // curHosp.logUrl);
                var relatedAreaHtml = '';
                $.each(data.diseaseInfoList, function(n, xdis) {
                    console.log(xdis.daId);
                    relatedAreaHtml += '<a href="#">' + '<img src="https://linkmedicine.com/wp-content/uploads/disease_area_logos/' + xdis.daId + '.png" class="ls-disease-area-logo">' + '</a>';
                });
                $('#ls-disease-page-das').html(relatedAreaHtml);
                $('#ls-disease-page-summary').html(data.dSummary);
            }
        });
    }

    if (currentDisease) {
        viewDiseaseDetail(currentDisease);
    }

    // --DA ranking page:
    var viewCurrentDARanking = function(daid) {
        $.ajax({
            url: 'https://www.linksciences.com/daRank.do?daid=' + daid,
            success: function(data) {
                var rankingHtml = '';
                $.each(data.daRankList, function(n, xhosp) {
                    rankingHtml += '<div class="ls-daranking-hosp"><div class="row">';
                    rankingHtml += '<div class="col-sm-1 rank-da-hosp-rank text-center">#' + xhosp.overallRank + '</div>';
                    rankingHtml += '<div class="col-sm-1"><img class="hosp_logo" src="https://linkmedicine.com/wp-content/uploads/hosp_logos/SQ_' + xhosp.logUrl + '" alt=""></div>';
                    rankingHtml += '<div class="col-sm-3"><div class="rank-da-hosp-name">' + xhosp.name + '</div><div>' + xhosp.city + '&nbsp;' + xhosp.state + '</div><i class="fas fa-chevron-down moreLink"></i>';
                    rankingHtml += '<div class="rank-da-hosp-descrp lessRows">' + xhosp.descrp + '</div><i class="fas fa-chevron-up lessLink"></i></div>';
                    rankingHtml += '<div class="col-sm-6">';
                    rankingHtml += '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: ' + xhosp.overallSCore + '%"></div></div>';
                    rankingHtml += '<div class="lessRows"><div class="rank-da-hosp-expertise">Science</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: ' + xhosp.starSR + '%"></div></div></div>';
                    rankingHtml += '<div class="lessRows"><div class="rank-da-hosp-expertise">Translational Research</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: ' + xhosp.starAT + '%"></div></div></div>';
                    rankingHtml += '<div class="lessRows"><div class="rank-da-hosp-expertise">Clinical Excellence</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: ' + xhosp.starCE + '%"></div></div></div>';
                    rankingHtml += '</div>'
                    rankingHtml += '<div class="col-sm-1 rank-da-hosp-rank text-center">' + xhosp.overallSCore + '</div>';
                    rankingHtml += '</div></div><hr>';
                });
                $('#ls-da-ranking').html(rankingHtml);

                //hide all the lessrows and lesslinks.
                $('.lessRows').hide();
                $('.lessLink').hide();

                //click moreLink, only the siblings lessrows will be shown.
                $('.moreLink').click(function() {
                    $(this).siblings('.lessRows').show();
                    $(this).hide();
                    $(this).siblings('.lessLink').show();
                    $(this).parent().next().children('.lessRows').show();
                });
                //click lessLink, only the siblings lessrows will be hide.
                $('.lessLink').click(function() {
                    $(this).siblings('.lessRows').hide();
                    $(this).parent().next().children('.lessRows').hide();
                    $(this).hide();
                    $(this).siblings('.moreLink').show();
                });
            }
        });
    }



    if ($('#da_ranking_id')) {
        viewCurrentDARanking($('#da_ranking_id').html());
    }


    // --hospAnalysis.html

    function showPanel(panelIndex, colorCode) {
        tabButtons.forEach(function(node) {
            node.style.backgroundColor = "";
            node.style.color = "";
        });
        tabButtons[panelIndex].style.backgroundColor = '#1eb0bc';
        tabButtons[panelIndex].style.color = "white";
        tabPanels.forEach(function(node) {
            node.style.display = "none";
        });
        tabPanels[panelIndex].style.display = "block";
        tabPanels[panelIndex].style.backgroundColor = 'white';
        tabPanels[panelIndex].style.color = '#1eb0bc'
    }

    function showPanel2(panelIndex, colorCode) {
        tabButtons2.forEach(function(node) {
            node.style.backgroundColor = "";
            node.style.color = "";
        });
        tabButtons2[panelIndex].style.backgroundColor = '#e3f5f7';
        tabButtons2[panelIndex].style.color = "#1eb0bc";
        tabPanels2.forEach(function(node) {
            node.style.display = "none";
        });
        console.log('showPanel2 index: ' + tabPanels2.length);
        console.log('showPanel2 index: ' + panelIndex);
        tabPanels2[panelIndex].style.display = "block";
        tabPanels2[panelIndex].style.backgroundColor = 'white';
        tabPanels2[panelIndex].style.color = '#1eb0bc'
    }

    function initMap(curhosp) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': curhosp.city + ' ' + curhosp.state }, function(results, status) {
            var location = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 4,
                center: location,
            });
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                title: curhosp.name
            });
        });
    }

    function drawDonutChart() {
        var data = google.visualization.arrayToDataTable([
            ['Content', 'Size'],
            ['SR', 80],
            ['AT', 88],
            ['CPD', 58]
        ]);

        var options = {
            height: 400,
            width: 400,
            title: "",
            pieHole: 0.5,
            pieSliceBorderColor: "none",
            colors: ['#BC1E61', '#FF7E0D', '#1E61BC'],
            legend: {
                position: "none"
            },
            pieSliceText: "none"
                /*
                 * tooltip: { trigger: "none" }
                 */
        };
        var chart = new google.visualization
            .PieChart(document.getElementById('donut-chart'));
        chart.draw(data, options);
    }

    function drawHARadarChart(curHosp) {
        var ctx = document.getElementById('radar-chart');
        var radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Frontier Research', 'Associated Experts', 'Clinical Excellence',
                    'Therapeutic Investigation', 'Federal Support', 'Physicians'
                ],
                datasets: [{
                    label: "dataset",
                    backgroundColor: 'rgba(205, 86, 196, 0.15)',
                    borderWidth: 2,
                    borderColor: '#CD56C4',
                    pointHoverRadius: 10,
                    data: [curHosp.projectCountRadarScore, curHosp.piCountRadarScore, curHosp.nctCountRadarScore, curHosp.interverntionCountRadarScore, curHosp.fundingRadarScore, curHosp.physiciabCountRadarScore]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100
                    },
                    pointLabels: {
                        fontSize: 14
                    }
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: false
                }
            }
        });
    }

    function drawMaterial(curHosp) {
        console.log(curHosp);
        var data = google.visualization.arrayToDataTable([
            ['', 'Score', { role: 'style' }],
            ['', curHosp.projectCountRadarScore, 'color: #BC1E61'], // RGB value
            ['', curHosp.piCountRadarScore, 'color: #FF7E0D'], // English color
            // name
            ['', curHosp.nctCountRadarScore, 'color: #B0BC1E'],
            ['', curHosp.interverntionCountRadarScore, 'color: #1EB0BC'],
            ['', curHosp.fundingRadarScore, 'color: #1E61BC'] // CSS-style
            // declaration
        ]);

        var materialOptions = {
            width: 500,
            height: 350,
            padding: 'none',
            chart: {
                title: 'FACT$'
            },
            chartArea: { 'left': 60, 'right': 20, 'width': '100%', 'height': '80%' },
            legend: {
                position: 'none'
            },
            hAxis: {
                minValue: 0
            },
            bars: 'horizontal',
            colors: ['#BC1E61', '#FF7E0D', '#B0BC1E', '#1EB0BC', '#1E61BC'],
        };
        var materialChart = new google.visualization.BarChart(document.getElementById('bar-chart'));
        materialChart.draw(data, materialOptions);
    }

    function drawSRATCPD(curHosp) {

    }

    function drawHAHospitalsMap(hsplist) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'City');
        data.addColumn('number', 'Count');
        data.addColumn({
            type: 'string',
            role: 'tooltip'
        });
        $.each(hsplist, function(n, hsp) {
            data.addRow([hsp.city + ' ' + hsp.state, hsp.overallSCore, hsp.name]);
        });
        var options = {
            height: 500,
            region: 'US',
            displayMode: 'markers',
            resolution: 'provinces',
            legend: 'none',
            colorAxis: {
                colors: ['#f2f2f2', '#1EB0BC', '#CD56C4']
            }
        };
        var chart = new google.visualization.GeoChart(document.getElementById('hospitals_map'));
        chart.draw(data, options);
    };

    function drawCurrentHAHospitalsMap(hsp) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'City');
        data.addColumn('number', 'Count');
        data.addColumn({
            type: 'string',
            role: 'tooltip'
        });
        data.addRow([hsp.city + ' ' + hsp.state, hsp.overallSCore, hsp.name]);
        var options = {
            height: 500,
            region: 'US',
            displayMode: 'markers',
            resolution: 'provinces',
            legend: 'none',
            colorAxis: {
                colors: ['#f2f2f2', '#1EB0BC', '#CD56C4']
            }
        };
        var chart = new google.visualization.GeoChart(document.getElementById('current_hospital_map'));
        chart.draw(data, options);
    };

    $("input[name='showMaps']").click(function() {
        if (this.value == 'all') {
            $('#hospitals_map').show();
            $('#current_hospital_map').hide();
        } else {
            $('#hospitals_map').hide();
            $('#current_hospital_map').show();
        }
    });

    $("#tab1").click(function() {
        showPanel(0, 'white')
    });
    $("#tab2").click(function() {
        showPanel(1, 'white')
    });
    $("#tab3").click(function() {
        showPanel(2, 'white')
    });
    $("#tablinks1").click(function() {
        showPanel2(0, 'white')
    });
    $("#tablinks2").click(function() {
        showPanel2(0, 'white')
    });
    $("#tablinks3").click(function() {
        showPanel2(0, 'white')
    });

    // tabs
    var tabButtons = document.querySelectorAll(".tab-container .button-container button");
    var tabPanels = document.querySelectorAll(".tab-container .tab-panel");
    var tabButtons2 = document.querySelectorAll(".tab-panel .vert-tabs button");
    var tabPanels2 = document.querySelectorAll(".second-tab .tabcontent");

    showPanel(0, 'white');
    showPanel2(0, 'white');

    var tophospLocaldata = JSON.parse(localStorage.getItem('tophosp-localdata'));
    console.log('tophospLocaldata: ' + tophospLocaldata);
    var currentHospsn = urlParams.get("hospsn");
    if (currentHospsn) {
        var curHosp;
        $.each(tophospLocaldata.topHospList, function(n, element) {
            if (currentHospsn == element.shortName) {
                curHosp = element;
            }
        });

        $('.hosp-sr-bar').width((curHosp.starSR / curHosp.maxSR) * 100 + '%')
        $('.hosp-tr-bar').width((curHosp.starAT / curHosp.maxAt) * 100 + '%')
        $('.hosp-cpd-bar').width((curHosp.starCE / curHosp.maxCE) * 100 + '%')

        //physician list
        var physicianHtml = '';
        $.each(tophospLocaldata.physicianList, function(n, element) {
            if (curHosp.lmID == element.lmId && tophospLocaldata.dkwDAs == element.daId) {
                physicianHtml +=

                    '<tr><td><div class="panel panel-default">' +

                    '<div class="panel-body"><div class="row"><div class="col-sm-6 ">' +

                    '<h3 class="pull-left">' + element.firstName + ', ' + element.lastName + '</h3>' + '</div>'


                +
                '<div class="col-sm-6 ">' +

                '<button class="pull-right book-appt">Book Appointment</button></div></div><hr/>' +

                '<div class="row"><div class="col-sm-6 "><h4 class="pull-left">Location:</h4><br/><br/><span class="pull-left">' +
                element.addr + ', ' + element.city + ' ' + element.state + ' ' + element.zip

                    +
                    '</span></div><div class="col-sm-6 "><h4 class="pull-left">Phone:</h4><br/><br/><span class="pull-left">' + (!element.phone ? '-' : element.phone) + '</span></div></div>' +


                    '</div>' +

                    '</div></td></tr>'
            }
        });
        $('#physician-list').html(physicianHtml);


        let hospSrTxt = 'For ' + tophospLocaldata.dkwName + ', ' + curHosp.name + ' is #' +
            curHosp.starSRRank + ' in Therapeutic Investigation, #' +
            curHosp.starATRank + ' in Associated Experts, #' +
            curHosp.starCERank + ' in Clinical Excellence, #' +
            curHosp.projectCountRankDisplay + ' in Frontier Research, and #' +
            curHosp.fundingRankDisplay + ' in Federal Support.'

        // data
        $('#ha-hosplogo').attr("src", "https://linkmedicine.com/wp-content/uploads/hosp_logos/" + curHosp.logUrl);
        $('#ha-hospname').html(curHosp.name);
        $('#ha-hospname3').html(curHosp.name);
        $('#ha-dkw').html(tophospLocaldata.dkwName);
        $('#ha-all-tophosps-count').html(tophospLocaldata.instCount);
        $('#ha-all-hosps-count').html('200+');
        $('#ha-dkw2').html(tophospLocaldata.dkwName);
        $('#ha-dkw3-title').html(tophospLocaldata.dkwName);
        $('#ha-dkw3').html(tophospLocaldata.dkwName);
        $('#ha-dkw-descrp111').html(curHosp.fullDescrp + '<br><br>' + hospSrTxt);
        $('#ha-hospcity').html(curHosp.city);
        $('#ha-hospstate').html(curHosp.state);
        $('#ha-hosprank').html(curHosp.overallRankDisplay);
        $('#ha-hosprank2').html(curHosp.overallRankDisplay);
        $('#ha-hosp-rankintervention').html(curHosp.interverntionCountRank);
        $('#ha-hosp-rankPi').html(curHosp.piCountRank);
        $('#ha-hosp-ranknct').html(curHosp.nctCountRank);
        $('#ha-hosp-rankproj').html(curHosp.projectCountRank);
        $('#ha-hosp-rankfunding').html(curHosp.fundingRank);
        $('#ha-hospdscrp').html(curHosp.fullDescrp);
        $('#ha-dkw-descrp').html(tophospLocaldata.dkwDescription);
        $('#radarScore1').html(Math.round(curHosp.projectCountRank));
        $('#radarScore2').html(Math.round(curHosp.piCountRank));
        $('#radarScore3').html(Math.round(curHosp.nctCountRank));
        $('#radarScore4').html(Math.round(curHosp.interverntionCountRank));
        $('#radarScore5').html(Math.round(curHosp.fundingRank));
        $('#ha-location').html(curHosp.city + ', ' + curHosp.state);
        $('#ha-hospcreate').html(curHosp.year);
        $('#ha-hospbeds').html(curHosp.bedNum);

        // charts

        // create GaugeChart
        am4core.useTheme(am4themes_animated);
        var chart = am4core.create("gauge-chart", am4charts.GaugeChart);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade
        // in effect

        chart.innerRadius = -25;

        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = 0;
        axis.max = 100;
        axis.valueInterval = 20;
        axis.strictMinMax = true;
        axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor("background");
        axis.renderer.grid.template.strokeOpacity = 0.3;

        var colorSet = new am4core.ColorSet();

        var range0 = axis.axisRanges.create();
        range0.value = 0;
        range0.endValue = 70;
        range0.axisFill.fillOpacity = 0.5;
        range0.axisFill.fill = '#d572ce';
        range0.axisFill.zIndex = -1;

        var range2 = axis.axisRanges.create();
        range2.value = 70;
        range2.endValue = 100;
        range2.axisFill.fillOpacity = 1;
        range2.axisFill.fill = '#d572ce';
        range2.axisFill.zIndex = -1;

        var hand = chart.hands.push(new am4charts.ClockHand());

        // using chart.setTimeout method as the timeout will be disposed
        // together with a chart
        chart.setTimeout(randomValue, 1250);

        function randomValue() {
            hand.showValue(curHosp.overallSCore, 1000, am4core.ease.cubicOut);
        }

        //google.setOnLoadCallback(function () { drawMaterial(curHosp); });
        google.setOnLoadCallback(function() { drawHAHospitalsMap(tophospLocaldata.topHospList); });
        google.setOnLoadCallback(function() { drawCurrentHAHospitalsMap(curHosp); });
        //google.setOnLoadCallback(drawDonutChart);
        drawHARadarChart(curHosp);
        initMap(curHosp)
    }

});
var app = angular.module("TopHospApp", ["ngTagsInput", "ui.multiselect", "ngProgress"]);
app.controller("TopHospCtrl", function($scope, $http, $timeout, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();

    // user selected hospitals to compare
    $scope.maxHospitalsNumberToCompare = 5;
    $scope.hospitalsToCompare = [];
    // TAGS
    $scope.tags = [];
    $scope.tagAdded = function(tag) {
        // console.log('Added: ' + tag);
    };
    $scope.tagRemoved = function(tag) {
        var idx = $scope.hospitalsToCompare.indexOf(tag.rank);
        if (idx > -1) {
            $scope.hospitalsToCompare.splice(idx, 1);
        }
        $scope.resetCompareUrl();
    };

    $scope.resetCompareUrl = function() {
        var para = $('#comparetest').val().trim() + 'at';
        var compareFlag = false;
        $.each($scope.hospitalsToCompare, function(n, element) {
            para += element;
            para += 'and';
            compareFlag = true
        });
        if (compareFlag) {
            // remove last 'and'
            para = para.slice(0, -3);
        }
        console.log(para);
        $('#compareURL').attr("href", "https://linkmedicine.com/compare-hospitals/?compare=" + para);
        // for tf debug, remove when copy this file to wordpress
        // $('#compareURL').html("Compare " + para);
    }

    $scope.isItSelected = function(rankFromHtml) {
        return $scope.hospitalsToCompare.indexOf(rankFromHtml) > -1;
    }

    $scope.shouldCheckItOrNot = function(rankFromHtml) {
        // unchecked hospitals will be disabled when 5 hospitals
        // are already selected
        return ($scope.hospitalsToCompare.length >= 5) && !($scope.hospitalsToCompare.indexOf(rankFromHtml) > -1);
    }

    $scope.toggleHospSelection = function(theRank, theHospName) {
        var idx = $scope.hospitalsToCompare.indexOf(theRank);
        // is currently selected
        if (idx > -1) {
            $scope.hospitalsToCompare.splice(idx, 1);
            $scope.tags.splice(idx, 1);
        }
        // is newly selected
        else {
            if ($scope.hospitalsToCompare.length >= 5) {
                alert('You can not compare more than 5 hospitals.');
                // $("input[value='" + theRank +
                // "']").attr('checked', false);
            } else {
                $scope.hospitalsToCompare.push(theRank);
                $scope.tags.push({
                    rank: theRank,
                    text: theHospName
                });
                // if($scope.hospitalsToCompare.length == 5) {
                // alert('You have reached the max number of
                // hospitals to compare.');
                // }
            }
        }
        // console.log($scope.tags);
        $scope.resetCompareUrl();

    }

    // selected options for venn set
    $scope.vennSetSelectOptions = ["Frontier Research", "Associated Expert", "Federal Support", "Clinical Excellence", "Therapeutic Investigation"];

    $scope.mapSetSelectOptions = ["Overall Score", "Frontier Research", "Associated Expert", "Federal Support", "Clinical Excellence", "Therapeutic Investigation"];

    // defalt selected values for venn set
    $scope.vennSetSelected = ["Frontier Research", "Associated Expert", "Clinical Excellence"];

    // selected options for venn top N
    $scope.venTopNSelectOptions = ["TOP 1", "TOP 2", "TOP 3", "TOP 4", "TOP 5"];

    // defalt selected value for venn top N
    $scope.vennTopNSelected = "TOP 5";

    // selected options for line hospitals
    $scope.linesHospitalOptions = [];
    $scope.linesHospitalSelected = [];

    $scope.mapDataScale = ["Top Hospitals", "All Hospitals"];

    $scope.mapDataScaleSelected = "Top Hospitals";

    // ----VENN CHART
    $scope.vennSets = {};
    $scope.projectCountRankValues = [];
    $scope.projectCountRankValuesWithNumber = [];
    $scope.piCountRankValues = [];
    $scope.piCountRankValuesWithNumber = [];
    $scope.nctCountRankValues = [];
    $scope.nctCountRankValuesWithNumber = [];
    $scope.fundingRankValues = [];
    $scope.fundingRankValuesWithNumber = [];
    $scope.treatCountRankValues = [];
    $scope.treatCountRankValuesWithNumber = [];

    // the hospitals user clicked on venn CHART
    $scope.userClickHospitals = [];

    //
    $scope.seriesChartData = [];

    // defalt lines data: proj Count
    $scope.lineSetSelected = "Frontier Research"

    // defalt map data: proj Count
    $scope.mapDataSelected = "Overall Score"

    var generateRankValues = function(rankName) {
        $scope.topHospList.sort(function(a, b) {
            return a[rankName] - b[rankName]
        });
        var result = [];
        $.each($scope.topHospList, function(n, element) {
            result.push(element['name']);
        });
        // console.log(result.slice(0,5));
        return result;
    };

    var generateRankValuesWithNumber = function(rankName) {
        $scope.topHospList.sort(function(a, b) {
            return a[rankName] - b[rankName]
        });
        var result = [];
        $.each($scope.topHospList, function(n, element) {
            result.push(element[rankName]);
        });
        // console.log(result);
        return result;
    };

    $scope.drawSeriesChart = function() {
        var dataArray = [
            ['ID', 'Frontier Research', 'Associated Expert', 'Clinical Excellence', 'Federal Support']
        ];
        for (var i = 0; i < $scope.seriesChartData.length; i++) {
            dataArray.push([$scope.seriesChartData[i].name, $scope.seriesChartData[i].projectCount, $scope.seriesChartData[i].piCount, $scope.seriesChartData[i].nctCount, $scope.seriesChartData[i].funding]);
        }
        // console.log(dataArray);
        var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
            height: 500,
            title: 'TOP ' + 'Hospitals',
            hAxis: {
                title: 'Frontier Research'
                    // maxValue: 450
            },
            vAxis: {
                title: 'Associated Expert'
                    // maxValue: 70
            },
            colorAxis: {
                colors: ['#f2f2f2', '#1EB0BC', '#CD56C4']
            },
            sizeAxis: {
                // maxValue: 100000000
            },
            bubble: {
                textStyle: {
                    fontSize: 11
                }
            }
        };
        var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
        chart.draw(data, options);
    }

    $scope.drawLineChart = function() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Year');
        if ($scope.lineSetSelected == 'Frontier Research') {
            data.addColumn('number', 'Frontier Research');
            $.each($scope.lsData.yearlyNIHCountList, function(n, element) {
                data.addRow([element['rankId'].toString(), element['rankCount']]);
            });
        }
        if ($scope.lineSetSelected == 'Associated Expert') {
            data.addColumn('number', 'Associated Expert');
            $.each($scope.lsData.yearlyNIHPICountList, function(n, element) {
                data.addRow([element['rankId'].toString(), element['rankCount']]);
            });
        }
        if ($scope.lineSetSelected == 'Clinical Excellence') {
            data.addColumn('number', 'Clinical Excellence');
            $.each($scope.lsData.yearlyNIHCountList, function(n, element) {
                data.addRow([element['rankId'].toString(), element['rankCount']]);
            });
        }
        if ($scope.lineSetSelected == 'Federal Support') {
            data.addColumn('number', 'Federal Support');
            $.each($scope.lsData.yearlyNIHCostList, function(n, element) {
                data.addRow([element['rankId'].toString(), element['rankCount']]);
            });
        }
        if ($scope.lineSetSelected == 'Therapeutic Investigation') {
            //
        }
        var options = {
            height: 500,
            hAxis: {
                title: 'Year'
            },
            vAxis: {
                title: 'Count'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('lines_chart_div'));
        chart.draw(data, options);
    }

    $scope.drawHospitalsMap = function() {
        console.log('Into $scope.drawHospitalsMap()');
        $.blockUI({
            message: null
        });
        var indicator = "Overall Score";
        if ($scope.mapDataSelected == "Frontier Research") {
            indicator = "Project Count";
        }
        if ($scope.mapDataSelected == "Associated Expert") {
            indicator = "PI Count";
        }
        if ($scope.mapDataSelected == "Clinical Excellence") {
            indicator = "Clinical Trial Count";
        }
        if ($scope.mapDataSelected == "Federal Support") {
            indicator = "Funding";
        }
        if ($scope.mapDataSelected == "Therapeutic Investigation") {
            indicator = "Treatment";
        }
        mapDataSelectedInitializing = false;
        mapDataScaleSelectedInitializing = false;
        $http.get('https://www.linksciences.com/getHospitalsMap.do?dkw=' + $('#dkwInput').val() +
            // $http.get('https://localhost:8080/LSWebApp2015/getHospitalsMap.do?dkw='
            // + $('#dkwInput').val() +
            '&mapDataSelected=' + indicator + '&mapDataScaleSelected=' + $scope.mapDataScaleSelected + '&timpstamp=' + $('#comparetest').val()).success(function(repData, status, headers, config) {
            $scope.cityCountList = repData.cityCountList;
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'City');
            data.addColumn('number', 'Count');
            data.addColumn({
                type: 'string',
                role: 'tooltip'
            });

            $.each($scope.cityCountList, function(n, element) {
                data.addRow([element['geoCity'], element['rankCount'], element['rankString']]);
            });

            var options = {
                height: 500,
                region: 'US',
                displayMode: 'markers',
                resolution: 'provinces',
                colorAxis: {
                    colors: ['#f2f2f2', '#1EB0BC', '#CD56C4']
                }
            };
            var chart = new google.visualization.GeoChart(document.getElementById('hospitals_map'));
            chart.draw(data, options);
            $.unblockUI();
        }).error(function(repData, status, headers, config) {
            // log error
            $.unblockUI();
        });
    };

    $scope.drawLinesChart = function() {
        $.blockUI({
            message: null
        });
        lineSetSelectedInitializing = false;
        linesHospitalSelectedInitializing = false;
        var indicator = "Project Count";
        if ($scope.lineSetSelected == "Frontier Research") {
            indicator = "Project Count";
        }
        if ($scope.lineSetSelected == "Associated Expert") {
            indicator = "PI Count";
        }
        if ($scope.lineSetSelected == "Clinical Excellence") {
            indicator = "Clinical Trial Count";
        }
        if ($scope.lineSetSelected == "Federal Support") {
            indicator = "Funding";
        }
        if ($scope.lineSetSelected == "Therapeutic Investigation") {
            indicator = "Treatment";
        }


        $http.get('https://www.linksciences.com/getHospitalsTrend.do?dkw=' + $('#dkwInput').val() +
            // $http.get('https://localhost:8080/LSWebApp2015/getHospitalsTrend.do?dkw='
            // + $('#dkwInput').val() +
            '&lineSetSelected=' + indicator + '&linesHospitalSelected=' + $scope.linesHospitalSelected).success(function(repData, status, headers, config) {
            $scope.yearlyTrendMap = repData.yearlyTrendMap;
            // Draw lines
            var data = new google.visualization.DataTable();
            var startYear = 2000;
            var endYear = 2015;
            data.addColumn('string', 'Year');
            for (var key in $scope.yearlyTrendMap) {
                data.addColumn('number', key);
                // console.log(key,
                // $scope.yearlyTrendMap[key]);
            }
            for (var eachYear = startYear; eachYear <= endYear; eachYear++) {
                var eachRow = [];
                eachRow.push(eachYear.toString());
                for (var key in $scope.yearlyTrendMap) {
                    var theValue = 0;
                    $.each($scope.yearlyTrendMap[key], function(n, element) {
                        if (element['rankId'] == eachYear) {
                            theValue = element['rankCount'];
                        }
                    });
                    eachRow.push(theValue);
                }
                data.addRow(eachRow);
            }
            var options = {
                height: 500,
                hAxis: {
                    title: 'Year'
                },
                vAxis: {
                    title: 'Count'
                }
            };
            var chart = new google.visualization.LineChart(document.getElementById('lines_chart_div'));
            chart.draw(data, options);

            $.unblockUI();
        }).error(function(repData, status, headers, config) {
            // log error
            $.unblockUI();
        });
    };

    $scope.drawLinesChartOld = function() {
        var data = new google.visualization.DataTable();
        var startYear = 2000;
        var endYear = 2015;
        data.addColumn('string', 'Year');
        if ($scope.lineSetSelected == 'Frontier Research') {
            for (var key in $scope.lsData.yearlyNIHCountMap) {
                data.addColumn('number', key);
                console.log(key, $scope.lsData.yearlyNIHCountMap[key]);
            }
            for (var eachYear = startYear; eachYear <= endYear; eachYear++) {
                var eachRow = [];
                eachRow.push(eachYear.toString());
                for (var key in $scope.lsData.yearlyNIHCountMap) {
                    var theValue = 0;
                    $.each($scope.lsData.yearlyNIHCountMap[key], function(n, element) {
                        if (element['rankId'] == eachYear) {
                            theValue = element['rankCount'];
                        }
                    });
                    eachRow.push(theValue);
                }
                data.addRow(eachRow);
            }
        }

        if ($scope.lineSetSelected == 'Associated Expert') {
            for (var key in $scope.lsData.yearlyNIHPICountMap) {
                data.addColumn('number', key);
                console.log(key, $scope.lsData.yearlyNIHPICountMap[key]);
            }
            for (var eachYear = startYear; eachYear <= endYear; eachYear++) {
                var eachRow = [];
                eachRow.push(eachYear.toString());
                for (var key in $scope.lsData.yearlyNIHPICountMap) {
                    var theValue = 0;
                    $.each($scope.lsData.yearlyNIHPICountMap[key], function(n, element) {
                        if (element['rankId'] == eachYear) {
                            theValue = element['rankCount'];
                        }
                    });
                    eachRow.push(theValue);
                }
                data.addRow(eachRow);
            }
        }
        if ($scope.lineSetSelected == 'Clinical Excellence') {
            for (var key in $scope.lsData.yearlyNIHCountMap) {
                data.addColumn('number', key);
                console.log(key, $scope.lsData.yearlyNIHCountMap[key]);
            }
            for (var eachYear = startYear; eachYear <= endYear; eachYear++) {
                var eachRow = [];
                eachRow.push(eachYear.toString());
                for (var key in $scope.lsData.yearlyNIHCountMap) {
                    var theValue = 0;
                    $.each($scope.lsData.yearlyNIHCountMap[key], function(n, element) {
                        if (element['rankId'] == eachYear) {
                            theValue = element['rankCount'];
                        }
                    });
                    eachRow.push(theValue);
                }
                data.addRow(eachRow);
            }
        }
        if ($scope.lineSetSelected == 'Federal Support') {
            for (var key in $scope.lsData.yearlyNIHCostMap) {
                data.addColumn('number', key);
                console.log(key, $scope.lsData.yearlyNIHCostMap[key]);
            }
            for (var eachYear = startYear; eachYear <= endYear; eachYear++) {
                var eachRow = [];
                eachRow.push(eachYear.toString());
                for (var key in $scope.lsData.yearlyNIHCostMap) {
                    var theValue = 0;
                    $.each($scope.lsData.yearlyNIHCostMap[key], function(n, element) {
                        if (element['rankId'] == eachYear) {
                            theValue = element['rankCount'];
                        }
                    });
                    eachRow.push(theValue);
                }
                data.addRow(eachRow);
            }
        }
        var options = {
            height: 500,
            hAxis: {
                title: 'Year'
            },
            vAxis: {
                title: 'Count'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('lines_chart_div'));
        chart.draw(data, options);
    }

    $scope.drawHospitalsMapOld = function() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'City');
        data.addColumn('number', 'Count');
        data.addColumn({
            type: 'string',
            role: 'tooltip'
        });
        var whatCnt = 'projectCount';
        if ($scope.mapDataSelected == 'Project Count') {
            whatCnt = 'projectCount';
        }
        if ($scope.mapDataSelected == 'PI Count') {
            whatCnt = 'piCount';
        }
        if ($scope.mapDataSelected == 'Clinical Trial Count') {
            whatCnt = 'nctCount';
        }
        if ($scope.mapDataSelected == 'Funding') {
            whatCnt = 'funding';
        }
        if ($scope.mapDataSelected == 'Treatment') {
            whatCnt = 'interverntionCount';
        }
        // console.log('mapDataSelected' + whatCnt);
        $.each($scope.topHospList, function(n, element) {
            data.addRow([element['geoCity'], element[whatCnt], element['name']]);
        });
        var options = {
            height: 500,
            region: 'US',
            displayMode: 'markers',
            resolution: 'provinces',
            colorAxis: {
                colors: ['#f2f2f2', '#1EB0BC', '#CD56C4']
            }
        };
        var chart = new google.visualization.GeoChart(document.getElementById('hospitals_map'));
        chart.draw(data, options);
    };

    $scope.reloadVennChart = function() {
        // generate series from vennset
        var vennSeries = [];
        var vennTopN = 5;
        if ($scope.vennTopNSelected == 'TOP 1') {
            vennTopN = 1;
        }
        if ($scope.vennTopNSelected == 'TOP 2') {
            vennTopN = 2;
        }
        if ($scope.vennTopNSelected == 'TOP 3') {
            vennTopN = 3;
        }
        if ($scope.vennTopNSelected == 'TOP 4') {
            vennTopN = 4;
        }
        if ($scope.vennTopNSelected == 'TOP 5') {
            vennTopN = 5;
        }
        // console.log('vennTopN: ' + vennTopN);
        $.each($scope.vennSetSelected, function(n, element) {
            if (element == 'Frontier Research') {
                var i = 0;
                while (i < $scope.projectCountRankValuesWithNumber.length && $scope.projectCountRankValuesWithNumber[i] <= vennTopN) {
                    i++;
                }
                vennSeries.push({
                    name: 'Top Frontier Research',
                    data: $scope.projectCountRankValues.slice(0, i)
                });
            }
            if (element == 'Associated Expert') {
                var i = 0;
                while (i < $scope.piCountRankValuesWithNumber.length && $scope.piCountRankValuesWithNumber[i] <= vennTopN) {
                    i++;
                }
                vennSeries.push({
                    name: 'Top Associated Expert',
                    data: $scope.piCountRankValues.slice(0, i)
                });
            }
            if (element == 'Federal Support') {
                var i = 0;
                while (i < $scope.fundingRankValuesWithNumber.length && $scope.fundingRankValuesWithNumber[i] <= vennTopN) {
                    i++;
                }
                vennSeries.push({
                    name: 'Top Federal Support',
                    data: $scope.fundingRankValues.slice(0, i)
                });
            }
            if (element == 'Clinical Excellence') {
                var i = 0;
                while (i < $scope.nctCountRankValuesWithNumber.length && $scope.nctCountRankValuesWithNumber[i] <= vennTopN) {
                    i++;
                }

                vennSeries.push({
                    name: 'Top Clinical Excellence',
                    data: $scope.nctCountRankValues.slice(0, i)
                });
            }
            if (element == 'Therapeutic Investigation') {
                var i = 0;
                while (i < $scope.treatCountRankValuesWithNumber.length && $scope.treatCountRankValuesWithNumber[i] <= vennTopN) {
                    i++;
                }
                vennSeries.push({
                    name: 'Top Therapeutic Investigation',
                    data: $scope.treatCountRankValues.slice(0, i)
                });
            }
        });

        // table should be clear when vennChart reloaded
        $scope.userClickHospitals = [];

        $('#vennChart').jvenn({
            colors: ["rgb(250,220,91)", "rgb(90,155,212)", "rgb(241,90,96)", "rgb(0,102,0)", "rgb(255,117,0)", "rgb(192,152,83)"],
            series: vennSeries,
            // displayMode: 'edwards',
            exporting: false,
            fnClickCallback: function() {
                var userClickHospitals = [];
                $.each(this.list, function(n, element1) {
                    $.each($scope.topHospList, function(n, element2) {
                        if (element1 == element2['name']) {
                            userClickHospitals.push(element2);
                        }
                    });
                });

                $scope = angular.element('[ng-controller=TopHospCtrl]').scope();
                $scope.$apply(function() {
                    $scope.userClickHospitals = userClickHospitals;
                });
            }
        });
    };

    var lineSetSelectedInitializing = true;
    var linesHospitalSelectedInitializing = true;
    var mapDataSelectedInitializing = true;
    var mapDataScaleSelectedInitializing = true;

    $scope.loadData = function() {
        $.blockUI({
            message: null
        });
        $scope.progressbar.start();
        $http.get('https://www.linksciences.com/getTopHospitals.do?dkw=' + $('#dkwInput').val()).success(function(data, status, headers, config) {
            // $http.get('https://localhost:8080/LSWebApp2015/getTopHospitals.do?dkw='
            // +
            // $('#dkwInput').val()).success(function(data,
            // status, headers, config) {
            //console.log(datadd);
            $scope.topHospList = data.topHospList;
            $scope.lsData = data;
            $scope.projectCountRankValues = generateRankValues("projectCountRank");
            $scope.projectCountRankValuesWithNumber = generateRankValuesWithNumber("projectCountRankDisplay");
            $scope.piCountRankValues = generateRankValues("piCountRank");
            $scope.piCountRankValuesWithNumber = generateRankValuesWithNumber("piCountRankDisplay");
            $scope.nctCountRankValues = generateRankValues("nctCountRank");
            $scope.nctCountRankValuesWithNumber = generateRankValuesWithNumber("nctCountRankDisplay");
            $scope.fundingRankValues = generateRankValues("fundingRank");
            $scope.fundingRankValuesWithNumber = generateRankValuesWithNumber("fundingRankDisplay");
            $scope.treatCountRankValues = generateRankValues("interverntionCountRank");
            $scope.treatCountRankValuesWithNumber = generateRankValuesWithNumber("interverntionCountRankDisplay");
            $scope.seriesChartData = $scope.topHospList;
            lineSetSelectedInitializing = true;
            linesHospitalSelectedInitializing = true;
            mapDataSelectedInitializing = true;
            mapDataScaleSelectedInitializing = true;
            $scope.linesHospitalOptions = [];
            // compare
            $scope.hospitalsToCompare = [];
            $scope.tags = [];

            for (var i = 0; i < 10 && i < $scope.topHospList.length; i++) {
                $scope.linesHospitalOptions.push($scope.topHospList[i].name);
            }
            $scope.linesHospitalSelected = $scope.linesHospitalOptions.slice(0, 5);
            $scope.reloadVennChart();
            // $scope.drawSeriesChart();
            // $scope.drawLinesChart();
            // $scope.drawHospitalsMap();
            // show tab 1 when data ready.
            $('.nav-tabs a[href="#1"]').tab('show');
            $scope.progressbar.complete();
            $('#comparetest').val(data.timestamp);
            $.unblockUI();
        }).error(function(data, status, headers, config) {
            // log error
            $scope.progressbar.complete();
            $.unblockUI();
        });
    };

    var getUrlParameter = function(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    console.log(getUrlParameter('dkwInput'));

    $('#dkwInput').val(getUrlParameter('dkwInput'));
    if ($('#dkwInput').val() != undefined && $('#dkwInput').val().length > 0) {
        $scope.loadData();
    }

    $scope.$watch(function() {
        return {
            vennTopNSelected: $scope.vennTopNSelected,
            vennSetSelected: $scope.vennSetSelected
        }
    }, function(value) {
        // //console.log('vennTopNSelected: ' +
        // $scope.vennTopNSelected);
        // //console.log('vennSetSelected: ' +
        // $scope.vennSetSelected);
        $scope.reloadVennChart();
    }, true);

    // lines chart
    $scope.$watch('lineSetSelected', function(newValue, oldValue) {
        // console.log('lineSetSelectedInitializing: ' +
        // lineSetSelectedInitializing);
        // console.log('lineSetSelected: ' + $scope.lineSetSelected);
        if (lineSetSelectedInitializing) {
            $timeout(function() {
                lineSetSelectedInitializing = false;
            });
        } else {
            if (newValue === oldValue || $scope.lineSetSelected.length == 0 || $scope.linesHospitalSelected.length == 0) {
                return;
            }
            $scope.drawLinesChart();
        }
    });

    $scope.$watch('linesHospitalSelected', function(newValue, oldValue) {
        console.log('linesHospitalSelectedInitializing: ' + linesHospitalSelectedInitializing);
        console.log('linesHospitalSelected changed: ' + $scope.linesHospitalSelected);
        if (linesHospitalSelectedInitializing) {
            $timeout(function() {
                linesHospitalSelectedInitializing = false;
            });
        } else {
            if (newValue === oldValue || $scope.lineSetSelected.length == 0 || $scope.linesHospitalSelected.length == 0) {
                return;
            }
            $scope.drawLinesChart();
        }
    });

    // map mapDataSelectedInitializing
    // mapDataScaleSelectedInitializing
    $scope.$watch('mapDataSelected', function(newValue, oldValue) {
        if (mapDataSelectedInitializing) {
            $timeout(function() {
                mapDataSelectedInitializing = false;
            });
        } else {
            if (newValue === oldValue) {
                return;
            }
            $scope.drawHospitalsMap();
        }
    });

    $scope.$watch('mapDataScaleSelected', function(newValue, oldValue) {
        if (mapDataScaleSelectedInitializing) {
            $timeout(function() {
                mapDataScaleSelectedInitializing = false;
            });
        } else {
            if (newValue === oldValue) {
                return;
            }
            $scope.drawHospitalsMap();
        }
    });

    // $scope.$watch(function() {
    // return {
    // lineSetSelected: $scope.lineSetSelected,
    // linesHospitalSelected: $scope.linesHospitalSelected
    // }
    // },
    // function(value) {
    // if (linesInitializing) {
    // $timeout(function() { linesInitializing = false; });
    // } else {
    // if ($scope.lineSetSelected.length == 0 ||
    // $scope.linesHospitalSelected.length == 0) {
    // return;
    // }
    // console.log('lineSetSelected changed to: ' +
    // $scope.lineSetSelected);
    // console.log('linesHospitalSelected changed to: ' +
    // $scope.linesHospitalSelected);
    // $scope.drawLinesChart();
    // }
    // },
    // true
    // );

    // sorting
    $scope.orderByValue = 'overallOrder';
    $scope.sorting = {
        id: "1",
        order: "overallRank",
        direction: false
    };

    $scope.orderByChanged = function() {
        if ($scope.orderByValue == 'overallOrder') {
            $scope.sorting.order = 'overallRank';
            $scope.sorting.direction = false;
        }
        if ($scope.orderByValue == 'projcntOrder') {
            $scope.sorting.order = 'projectCountRank';
            $scope.sorting.direction = false;
        }
        if ($scope.orderByValue == 'picntOrder') {
            $scope.sorting.order = 'piCountRank';
            $scope.sorting.direction = false;
        }
        if ($scope.orderByValue == 'nctcntOrder') {
            $scope.sorting.order = 'nctCountRank';
            $scope.sorting.direction = false;
        }
        if ($scope.orderByValue == 'fundingOrder') {
            $scope.sorting.order = 'fundingRank';
            $scope.sorting.direction = false;
        }
        if ($scope.orderByValue == 'treatmentOrder') {
            $scope.sorting.order = 'treatCountRank';
            $scope.sorting.direction = false;
        }
    };

    $scope.reloadSeriesChart = function() {
        console.log('reloadSeriesChart');
        setTimeout($scope.drawSeriesChart, 200);
    };
    $scope.reloadLinesChart = function() {
        console.log('reloadLinesChart');
        setTimeout($scope.drawLinesChart, 200);
    };
    $scope.reloadHospitalsMap = function() {
        console.log('reloadHospitalsMap');
        setTimeout($scope.drawHospitalsMap, 200);
    };
    $scope.loadData = function() {
        $.blockUI({
            message: null
        });
        $http.get('https://www.linksciences.com/getTopHospitals.do?dkw=' + $('#dkwInput').val()).success(function(data, status, headers, config) {
            // $http.get('https://localhost:8080/LSWebApp2015/getTopHospitals.do?dkw='
            // +
            // $('#dkwInput').val()).success(function(data,
            // status, headers, config) {
            console.log(data);
            localStorage.setItem('tophosp-localdata', JSON.stringify(data));
            var retrievedObject = localStorage.getItem('tophosp-localdata');
            console.log('retrievedObject: ', JSON.parse(retrievedObject));
            $scope.topHospList = data.topHospList;
            $scope.lsData = data;
            $scope.projectCountRankValues = generateRankValues("projectCountRank");
            $scope.projectCountRankValuesWithNumber = generateRankValuesWithNumber("projectCountRankDisplay");
            $scope.piCountRankValues = generateRankValues("piCountRank");
            $scope.piCountRankValuesWithNumber = generateRankValuesWithNumber("piCountRankDisplay");
            $scope.nctCountRankValues = generateRankValues("nctCountRank");
            $scope.nctCountRankValuesWithNumber = generateRankValuesWithNumber("nctCountRankDisplay");
            $scope.fundingRankValues = generateRankValues("fundingRank");
            $scope.fundingRankValuesWithNumber = generateRankValuesWithNumber("fundingRankDisplay");
            $scope.treatCountRankValues = generateRankValues("interverntionCountRank");
            $scope.treatCountRankValuesWithNumber = generateRankValuesWithNumber("interverntionCountRankDisplay");
            $scope.seriesChartData = $scope.topHospList;
            lineSetSelectedInitializing = true;
            linesHospitalSelectedInitializing = true;
            mapDataSelectedInitializing = true;
            mapDataScaleSelectedInitializing = true;
            $scope.linesHospitalOptions = [];
            // compare
            $scope.hospitalsToCompare = [];
            $scope.tags = [];

            for (var i = 0; i < 10 && i < $scope.topHospList.length; i++) {
                $scope.linesHospitalOptions.push($scope.topHospList[i].name);
            }
            $scope.linesHospitalSelected = $scope.linesHospitalOptions.slice(0, 5);
            // $scope.drawSeriesChart();
            // $scope.drawLinesChart();
            // $scope.drawHospitalsMap();
            // show tab 1 when data ready.
            $('.nav-tabs a[href="#1"]').tab('show');
            $scope.progressbar.complete();
            $('#comparetest').val(data.timestamp);
            $.unblockUI();
        }).error(function(data, status, headers, config) {
            // log error
            $scope.progressbar.complete();
            $.unblockUI();
        });
    };
});