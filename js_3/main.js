var $resultsArea,
    resultCollections = 0,
    individualAlgorithms = true; // global variables

$(document).ready(function(){
    $resultsArea = $("#page-replace-visualizer .dataContainer");
        
    // Execute FIFO button
    $("#run-fifo").click(function(){
        if (validatePageData()){
            runFifo();
        }
    });
    
    // Execute LRU button
    $("#run-lru").click(function(){
        if (validatePageData()){
            runLru();
        }
    });
    
    // Execute Random button
    $("#run-random").click(function(){
        if (validatePageData()){
            runRandom();
        }
    });
    
    // Execute Optimal button
    $("#run-optimal").click(function(){
        if (validatePageData()){
            runOptimal();
        }
    });

    // Execute Nfu button
    $("#run-nfu").click(function(){
        if (validatePageData()){
            runNfu();
        }
    });
    
    // Execute Mru button
    $("#run-mru").click(function(){
        if (validatePageData()){
            runMru();
        }
    });
    
    // Execute Second chance button
    $("#run-second-chance").click(function(){
        if (validatePageData()){
            runSecondChance();
        }
    });
    
    // Execute Clock button
    $("#run-clock").click(function(){
        if (validatePageData()){
            runClock();
        }
    });
    
    // Execute Gclock button
    $("#run-gclock").click(function(){
        if (validatePageData()){
            runGClock();
        }
    });
    
    // Execute Aging button
    $("#run-aging").click(function(){
        if (validatePageData()){
            runAging();
        }
    });

    // Reset Everyting: clear tables and graph button
    $("#clear-all").click(function(){
            clearAll();
    });


    // Execute Random data button
    $("#rnd-gen").click(function(){
        randomizeInput();
    });
    
    //Test all algortihms n times button
    $("#test-all").click(function(){
        if (validatePageData()){
            setTimeout(function(){
                showSpinner();
                setProgressBar(0);
            },0);
            // Get how many times to execute
            var times = parseInt($('#execute-times').val());
            // Hardcoded limits 0 - 200 times
            if (times < 0) {
                times = 0;
            }
            else if (times > 200) {
                times = 200;    // should have some upper limit as well for safety :)
            }
            
            individualAlgorithms = false;
            
            if (times === 0) {
                $('#results-wrap').hide();
            }
            
            createNewCollection('All algorithms', times);
            
            setTimeout(function(){
                // I set to execute 0 times, do nothing and return
                if (times === 0){
                    hideSpinner();
                    setProgressBar(100);
                    return 0;
                }
                for (var i=1; i <= times; i++){
                    setTimeout(function(i){
                    randomizeInput();

                    runAllAlgos();

                    setProgressBar((i/times)*100);
                    if (i == times){
                        setTimeout(function(){
                            hideSpinner();
                        },0);
                    individualAlgorithms = true;
                    formatTables();
                    }
                },0,i);
            }
            },10);
        }
    });

    // Run all with input data provided
    $("#run-all").click(function(){
        if (validatePageData()){
            runAllAlgos();
        }
    });
    
    // showHideButton for collections
    $('body').on('click', '.showHideButton', function(){
        if ($(this).text() === 'Hide') {
            $(this).parent().siblings().hide();
            $(this).text('Show');
        } else {
            $(this).parent().siblings().show();
            $(this).text('Hide');
        }
    });
});    

var faultData = {
    'fifo':[],
    'aging':[],
    'secondChance':[],
    'clock':[],
    'clockPro':[],
    'wsclock':[],
    'car':[],
    'lru':[],
    'nfu':[],
    'mru':[],
    'random':[],
    'optimal':[],
    'gclock':[]
};

// Randomize input data
function randomizeInput(){
    var lengthMin = parseInt($('#rnd-page-length-min').val());
    var lengthMax = parseInt($('#rnd-page-length-max').val());
    var bufferMin = $('#rnd-buffer-min').val();
    var bufferMax = $('#rnd-buffer-max').val();
    genRandomData(getRandomInteger(lengthMin,lengthMax));
    genRandomBufferSize(bufferMin,bufferMax);
}

// Check if page-data-input is in valid format
function validatePageData(){
    var valid = /^((([0-9]+),)+[0-9]+)$/.test($('#page-data-input').val());
    if (!valid){
        spawnPageValidationError();
    }
    else{
        despawnPageValidationError();
    }
    return valid;
}

// Execute all made algorithms
function runAllAlgos(){
    runFifo();
    runLru();
    runRandom();
    runOptimal();
    //runNfu();
    runMru();
//    runSecondChance();
    //runClock();
    //runGClock();
    //runAging();
    // TODO add all other algorithms
}

// Create new collection (HTML container) for results
function createNewCollection(algorithm, executionsCount) {
    resultCollections++;
    var htmlContents = '<div class="collection collection' + resultCollections + '"><div class="buttonContainer"><button class="showHideButton">Hide</button><span class="details">';
    if (algorithm) {
        htmlContents += algorithm + ' - ';
    }
    
    var dateTime = new Date();
    var day = (dateTime.getDate().length > 1)? dateTime.getDate() : '0'+dateTime.getDate();
    var month = parseInt(dateTime.getMonth()) + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var seconds = (dateTime.getSeconds() > 9)? dateTime.getSeconds() : '0'+dateTime.getSeconds();
    var minutes = (dateTime.getMinutes() > 9)? dateTime.getMinutes() : '0'+dateTime.getMinutes();
    var hours = (dateTime.getHours() > 9)? dateTime.getHours() : '0'+dateTime.getHours();
    
    htmlContents += day + '.' + month + '.' + dateTime.getFullYear() + '. ' + hours + ':' + minutes + ':' + seconds + ' ';
    if (executionsCount) {
        htmlContents += '/ ' + executionsCount + ' execution times';
    }
    htmlContents += '</span></div></div>';
    $resultsArea.append(htmlContents);
}

// Make show/hide button visible for each collection, if there are several of them
function processCollections() {
    var collections = $('.collection');
    if (collections.length > 1) {
        $('.showHideButton').show();
    }
}

// Return random integer in range [min,max]
function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

// Place random page input data in textarea
function genRandomData(length,min,max){
    if (length === undefined){
        length = 16;
    }
    if (min === undefined){
        min = 1;
    }
    if (max === undefined){
        max = 9;
    }
    var pageData = '';
    for (var i=1; i <= length; i++){
        pageData += getRandomInteger(min,max);
        if (i != length){
            pageData += ',';
        }
    }
    $('#page-data-input').val(pageData);
}

function genRandomBufferSize(min,max){
    if (min === undefined){
        var min = 3;
    }
    if (max === undefined){
        var max = 6;
    }
    var num = getRandomInteger(parseInt(min),parseInt(max));
    $('#buffer-size-input').val(num);
}

// Get average page faults
function getAveragePageFault(algo){
    if (faultData[algo].length == 0){
        return 0;
    }
    var sum = 0;
    for (var i in faultData[algo]){
        sum += parseInt(faultData[algo][i]);
    }
    return sum/faultData[algo].length;
}

function showSpinner(){
    $('#spinner').show();
}

function hideSpinner(){
    $('#spinner').hide();
}

// Update page faults chart
function updateChart(){
    // Update data
    chartData[getLabelIndex('FIFO')].y = getAveragePageFault('fifo');
    chartData[getLabelIndex('FIFO')].toolTipContent = "{label}: {y} page faults \n"+faultData['fifo'].length+" executions";
    
    //chartData[getLabelIndex('Aging')].y = getAveragePageFault('aging');
    //chartData[getLabelIndex('Aging')].toolTipContent = "{label}: {y} page faults \n"+faultData['aging'].length+" executions";
    
//    chartData[getLabelIndex('Second chance')].y = getAveragePageFault('secondChance');
//    chartData[getLabelIndex('Second chance')].toolTipContent = "{label}: {y} page faults \n"+faultData['secondChance'].length+" executions";
    
    //chartData[getLabelIndex('Clock')].y = getAveragePageFault('clock');
    //chartData[getLabelIndex('Clock')].toolTipContent = "{label}: {y} page faults \n"+faultData['clock'].length+" executions";
    
//    chartData[getLabelIndex('Clock pro')].y = getAveragePageFault('clockPro');
//    chartData[getLabelIndex('Clock pro')].toolTipContent = "{label}: {y} page faults \n"+faultData['clockPro'].length+" executions";
    
//    chartData[getLabelIndex('WSclock')].y = getAveragePageFault('wsclock');
//    chartData[getLabelIndex('WSclock')].toolTipContent = "{label}: {y} page faults \n"+faultData['wsclock'].length+" executions";
    
//    chartData[getLabelIndex('CAR')].y = getAveragePageFault('car');
//    chartData[getLabelIndex('CAR')].toolTipContent = "{label}: {y} page faults \n"+faultData['car'].length+" executions";
    
    chartData[getLabelIndex('LRU')].y = getAveragePageFault('lru');
    chartData[getLabelIndex('LRU')].toolTipContent = "{label}: {y} page faults \n"+faultData['lru'].length+" executions";
    
    chartData[getLabelIndex('MRU')].y = getAveragePageFault('mru');
    chartData[getLabelIndex('MRU')].toolTipContent = "{label}: {y} page faults \n"+faultData['mru'].length+" executions";
    
    //chartData[getLabelIndex('NFU')].y = getAveragePageFault('nfu');
    //chartData[getLabelIndex('NFU')].toolTipContent = "{label}: {y} page faults \n"+faultData['nfu'].length+" executions";
    
    chartData[getLabelIndex('Random')].y = getAveragePageFault('random');
    chartData[getLabelIndex('Random')].toolTipContent = "{label}: {y} page faults \n"+faultData['random'].length+" executions";
    
    chartData[getLabelIndex('Optimal')].y = getAveragePageFault('optimal');
    chartData[getLabelIndex('Optimal')].toolTipContent = "{label}: {y} page faults \n"+faultData['optimal'].length+" executions";
    
    //chartData[getLabelIndex('GClock')].y = getAveragePageFault('gclock');
    //chartData[getLabelIndex('GClock')].toolTipContent = "{label}: {y} page faults \n"+faultData['gclock'].length+" executions";
    
    // Order data
    chartData.sort(compareChartColumns);
    for (var i in chartData){
        chartData[i].x = parseInt(i);
    }
    
    faultChart.render();
}

// Get chart index from chart label
function getLabelIndex(label){
    for (var i in chartData){
        if (chartData[i].label == label){
            return i;
        }
    }
    return -1;
}

// Helper comparison function for sorting chart columns
function compareChartColumns(first,second){
    if (first.y < second.y){
        return -1;
    }
    if (first.y == second.y){
        return 0;
    }
    if (first.y > second.y){
        return 1;
    }
}

// Reset all charts / data
function clearAll(){
    for (var obj in faultData){
        faultData[obj]=[];
        updateChart();
    }
    $(".dataContainer *").remove();
    $("#results-wrap").hide();
    resultCollections = 0;
    individualAlgorithms = true;
    setProgressBar(0);
    hideSpinner();
}

function formatTables() {
    $('table').each(function() {
        var $frames = $(this).find('.frame');
        if ($frames.length > 1) {
            $frames.each(function(index) {
                if (index === 0) {
                    $(this).attr('rowspan', $frames.length);
                } else {
                    $(this).remove();
                }
            });
        }
    });
}

// ---------- Functions for running all algorithms ----------------------------- //

// Run fifo algo
function runFifo(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var fifoStart = new Date(); 
    var results = fifo(data,buffSize);
    var fifoEnd = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in FIFO");
        return;
    }

    // Add data to array
    faultData['fifo'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>FIFO : "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>FIFO Time: " + (fifoEnd-fifoStart)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    updateChart();
}

// Run lru algo
function runLru(){
    // Read input data
        var data = $('#page-data-input').val().split(',').map(Number);
        var buffSize = parseInt($('#buffer-size-input').val());
        
        // Mesure execution time
        var lruStart = new Date(); 
        var results = lru(data,buffSize);
        var lruEnd = new Date();
        
        // Return if erros where found
        if(results == null){
            console.log("Error in LRU");
            return;
        }

        // Add data to array
        faultData['lru'].push(results.pageFaults);
        
        // Append and display results
        $("#results-wrap").show();
        var $collection = $resultsArea.children('.collection' + resultCollections);
        $collection.append("<h4>LRU : "+results.pageFaults+" page faults!</h4>");
        $collection.append("<h4>LRU Time: " + (lruEnd-lruStart)/1000 + "s</h4>");
        $collection.append("<hr>");
        processCollections();
        
        // Update chart
        updateChart();
}

// Run Random algo
function runRandom(){
    // Read input data
        var data = $('#page-data-input').val().split(',').map(Number);
        var buffSize = parseInt($('#buffer-size-input').val());
        
        // Mesure execution time
        var randStart = new Date(); 
        var results = random(data,buffSize);
        var randEnd = new Date();
        
        // Return if erros where found
        if(results == null){
            console.log("Error in Random");
            return;
        }

        // Add data to array
        faultData['random'].push(results.pageFaults);
        
        // Append and display results
        $("#results-wrap").show();
        var $collection = $resultsArea.children('.collection' + resultCollections);
        $collection.append("<h4>Random : "+results.pageFaults+" page faults!</h4>");
        $collection.append("<h4>Random Time: " + (randEnd-randStart)/1000 + "s</h4>");
        $collection.append("<hr>");
        processCollections();
        
        // Update chart
        updateChart();
}

// Run Optimal algo
function runOptimal(){
    // Read input data
        var data = $('#page-data-input').val().split(',').map(Number);
        var buffSize = parseInt($('#buffer-size-input').val());
        
        // Mesure execution time
        var Start = new Date(); 
        var results = optimal(data,buffSize);
        var End = new Date();
        
        // Return if erros where found
        if(results == null){
            console.log("Error in Optimal");
            return;
        }

        // Add data to array
        faultData['optimal'].push(results.pageFaults);
        
        // Append and display results
        $("#results-wrap").show();
        var $collection = $resultsArea.children('.collection' + resultCollections);
        $collection.append("<h4>Optimal : "+results.pageFaults+" page faults!</h4>");
        $collection.append("<h4>Optimal Time: " + (End-Start)/1000 + "s</h4>");
        $collection.append("<hr>");
        processCollections();
        
        // Update chart
        updateChart();
}

function runMru(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var Start = new Date(); 
    var results = mru(data,buffSize);
    var End = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in Mru");
        return;
    }

    // Add data to array
    faultData['mru'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>MRU : "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>MRU Time: " + (End-Start)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    updateChart();
    
}
// Run Nfu algo
function runNfu(){
    // Read input data
        var data = $('#page-data-input').val().split(',').map(Number);
        var buffSize = parseInt($('#buffer-size-input').val());
        
        // Mesure execution time
        var Start = new Date(); 
        var results = nfu(data,buffSize);
        var End = new Date();
        
        // Return if erros where found
        if(results == null){
            console.log("Error in Nfu");
            return;
        }

        // Add data to array
        faultData['nfu'].push(results.pageFaults);
        
        // Append and display results
        $("#results-wrap").show();
        var $collection = $resultsArea.children('.collection' + resultCollections);
        $collection.append("<h4>NFU : "+results.pageFaults+" page faults!</h4>");
        $collection.append("<h4>NFU Time: " + (End-Start)/1000 + "s</h4>");
        $collection.append("<hr>");
        processCollections();
      
        // Update chart
        updateChart();
}




function runSecondChance(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var Start = new Date(); 
    var results = secondChance(data,buffSize);
    var End = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in Second chance");
        return;
    }

    // Add data to array
    faultData['secondChance'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>Second chance : "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>Second chance Time: " + (End-Start)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    updateChart();
    
}

function runClock(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var Start = new Date(); 
    var results = clock(data,buffSize);
    var End = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in Clock");
        return;
    }

    // Add data to array
    faultData['clock'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>Clock: "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>Clock Time: " + (End-Start)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    //updateChart();
    
}

function runGClock(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var Start = new Date(); 
    var results = gClock(data,buffSize);
    var End = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in GClock");
        return;
    }

    // Add data to array
    faultData['gclock'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>GClock: "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>GClock Time: " + (End-Start)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    //updateChart();
    
}

function runAging(){
    // Read input data
    var data = $('#page-data-input').val().split(',').map(Number);
    var buffSize = parseInt($('#buffer-size-input').val());

    // Mesure execution time
    var Start = new Date(); 
    var results = aging(data,buffSize);
    var End = new Date();

    // Return if erros where found
    if(results == null){
        console.log("Error in Aging");
        return;
    }

    // Add data to array
    faultData['aging'].push(results.pageFaults);

    // Append and display results
    $("#results-wrap").show();
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<h4>Aging: "+results.pageFaults+" page faults!</h4>");
    $collection.append("<h4>Aging Time: " + (End-Start)/1000 + "s</h4>");
    $collection.append("<hr>");
    processCollections();

    // Update chart
    //updateChart();
    
}


// ---------- Functions used by all algorithms ----------------------------- //

// Render buffer in current state
// Used by every page replacement algorithm
function renderBuffer(page, buffer, bs){
    var table = $("#page-replace-visualizer tbody").last();
    var i = -2; // index for buffer (escape 1.row)
    table.children("tr").each(function(){
        $this = $(this);
        var content = $this.html();
        var existingColumns = $this.children().length;
        // Add heading row
        if(i === -2){
            if ($this.children("th").length === 0) {
                content += "<th class='firstColumn'></th>";
                existingColumns = 1;
            }
            content+="<th>Step" + existingColumns + "</th>";
            $this.html(content);
            i++;
            return;
        }
        // Add page number (1.row)
        if(i === -1){
            if ($this.children("td").length === 0) {
                content += "<td class='firstColumn'>Page to load</td>";
            }
            content+="<td>"+page+"</td>";
            $this.html(content);
            i++;
            return;
        }
        // Add F/H identifier (last row)
        if(i === bs){
            if ($this.children("td").length === 0) {
                content += "<td class='firstColumn'>Status</td>";
            }
            if(buffer.pageFaultIdx == -1){
                content += "<td class=\"green\">H</td>";
            }else{
                content += "<td class=\"red\">F</td>";
            }
            $this.html(content);
            i++;
            return;
        }
        // Add page buffer (2.row -> last row-1)
        if(i > buffer.data.length - 1){
            if ($this.children("td").length === 0) {
                content += "<td class='frame firstColumn'>Page frames</td>";
            }
            content += "<td></td>";
            $this.html(content);
            i++;
            return;
        }
        // Add red class for page fault
        if(buffer.pageFaultIdx === i){
            if ($this.children("td").length === 0) {
                content += "<td class='frame firstColumn'>Page frames</td>";
            }
            content += "<td class=\"red\">"+buffer.data[i]+"</td>";
            $this.html(content);
            i++;
            return;
        }
        content+="<td>"+buffer.data[i]+"</td>"
        $this.html(content);
        i++;
    })
}

// Initialize new render area 
function renderBufferInit(bs){
    // Make new table and initialize with empty rows
    var $collection = $resultsArea.children('.collection' + resultCollections);
    $collection.append("<table><tbody></tbody></table>");
    var table = $("#page-replace-visualizer tbody").last();
    var data = "";
    for (var i = 0; i <= bs+2; i++){
        data += "<tr></tr>";
    }
    table.append(data);
}

// ---------- Functions used by multiple algorithms ------------------------ //

// Find page in history using page number
function findPage(page, history){
    for (var i = 0; i < history.length; i++){
        if(history[i].page==page){
            return i;
        }
    }
    return -1;
}

// Copy data from history objects to buffer array for easier rendering 
function updateBuffer(buffer,history,pageFaultIdx){
    for (var i = 0; i < history.length; i++){
        buffer.data[i]=history[i].page;
    }
    buffer.pageFaultIdx = pageFaultIdx;
}

// Fing oldest indes in history object
function findOldestIndex(history){
    var index = null;// index of oldest element
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    sAge = history[0].age;
    for (var i = 1; i < history.length; i++){
        if(history[i].age<sAge){
            sAge = history[i].age;
            index = i;
        }
    }
    return index;
}
// ========================================================================= //
// ------------------------------ FIFO ------------------------------------- //
// ========================================================================= //

// First in first out
// fifo(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function fifo(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 } ;
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest
      
    if (individualAlgorithms) {
        createNewCollection('FIFO');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findOldestIndex(history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

//---- FIFO END ---- //


// ========================================================================= //
// ------------------------------ LRU -------------------------------------- //
// ========================================================================= //

// Least reacently used
// lru(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function lru(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('LRU');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            history[idx].age = age;
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age})
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findOldestIndex(history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

// ========================================================================= //
// ------------------------------ Random ------------------------------------- //
// ========================================================================= //

// Random algorithm
// random(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function random(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('Random');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = getRandomInteger(0,bs-1);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

//---- Random END ---- //


// ========================================================================= //
// ------------------------------ Optimal ---------------------------------- //
// ========================================================================= //


// Fing oldest indes in history object
function findOptimalPageToReplace(data, history){
    var index = null;// index of element to replace
    var notUsedTheLongest = 0;

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }
    
    for (var i = 0; i < history.length; i++)
    {
        var currElem = history[i].page;
        var elemFound = false;
        for (var j = 0; j < data.length; j++)
        {
            if(currElem == data[j])
            {
                elemFound = true;
                if(notUsedTheLongest < j)
                {
                    notUsedTheLongest = j;
                    index = i;
                }
                
                break;
            }
        }
        
        if (elemFound === false)
        {
            index = i;
            return index;
        }
    }
    
    return index;
}

// Random algorithm
// int random(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function optimal(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('Optimal');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findOptimalPageToReplace(data.slice(i,data.length),history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

//---- Optimal END ---- //


// ========================================================================= //
// -------------------------- NFU/LFU -------------------------------------- //
// ========================================================================= //

// Not frequently used
// nfu(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function nfu(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 };
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('NFU');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            history[idx].count++;
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age, count: 1});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findLeastFrequentlyUsed(history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

// Finds least frequently usef page
// if there are two then use fifo to break the tie
// return index for least frequently used element
function findLeastFrequentlyUsed(history){
    var index = null;// index for element of interest
    var sCount = null; // smallest count
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    // Find smallest count
    index = 0;
    sCount = history[0].count;
    for (var i = 1; i < history.length; i++){
        if(history[i].count<sCount){
            sCount = history[i].count;
            index = i;
        }
    }
    // Find smallest age
    sAge = history[index].age;
    for (var i = 0; i < history.length; i++){
        if(history[i].count == sCount && history[i].age<sAge){
            sAge = history[i].age;
            index = i;
        }
    }

    return index;
}

//---- NFU/LFU END ---- //



// ========================================================================= //
// ------------------------------ MRU -------------------------------------- //
// ========================================================================= //

// Most reacently used
// mru(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function mru(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest

        
    if (individualAlgorithms) {
        createNewCollection('MRU');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            history[idx].age = age;
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findJungestIndex(history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

// Finds most reacently used page
function findJungestIndex(history){
    var index = null;// index of oldest element
    var lAge = null; // largest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    lAge = history[0].age;
    for (var i = 1; i < history.length; i++){
        if(history[i].age>lAge){
            lAge = history[i].age;
            index = i;
        }
    }
    return index;
}

//---- MRU END ---- //


// ========================================================================= //
// ------------------------------ Second Chance ---------------------------- //
// ========================================================================= //

// Second Chance
// secondChance(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function secondChance(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var age = 0; // page place time
    var idx; // Index for element of interest
    
    if (individualAlgorithms) {
        createNewCollection('Second chance');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            history[idx].referenced = 1;
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: age});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            age++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findSecondChanceIndex(history,age);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = age;
        history[idx].referenced = 0;
        pageFaults++;
        age++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}


// Most reacently used
// mru(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
//      
// Fing oldest indes in history object
function findSecondChanceIndex(history,currentAge){
    var index = null;// index of oldest element
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    sAge = history[0].age;
    for (var i = 1; i < history.length; i++){
        if(history[i].age<sAge){
            sAge = history[i].age;
            index = i;
        }
    }
    
    if (history[index].referenced == 1)
    {
        history[index].referenced = 0;
        history[index].age = currentAge;
        
        index = findSecondChanceIndex(history,currentAge);
    }
    
    return index;
}

//---- Second Chance END ---- //

// ========================================================================= //
// ------------------------------ Clock ---------------------------- //
// ========================================================================= //

// Clock
// clock(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function clock(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;
    var hand = 0;

    var history = []; // page replacement history
    var idx; // Index for element of interest
    
    if (individualAlgorithms) {
        createNewCollection('Clock');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            history[idx].referenced = 1;
            hand++;
            hand = hand % (bs);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i]});
            var currElem = history.length - 1;
            history[currElem].referenced = 0;
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findClockIndex(history,bs,hand);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].referenced = 0;
        pageFaults++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}


// Most reacently used
// mru(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
//      
// Fing oldest indes in history object
function findClockIndex(history,bufferSize,handPos){
    var index = null;// index of oldest element
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    
    while(true)
    {
        if (history[handPos].referenced == 0)
        {
            //If hand is of not referenced, repleace it
            index = handPos;
            break;
        }
        else 
        {
            //If hand is on referenced
            //Remove referenced
            history[handPos].referenced = 0;
            //Get next postion
            handPos++;
            handPos = handPos % (bufferSize);
        }
    }
    
    return index;
}

//---- Clock END ---- //

// ========================================================================= //
// ------------------------------ GClock ---------------------------- //
// ========================================================================= //

// GClock
// gClock(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function gClock(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;
    var hand = 0;

    var history = []; // page replacement history
    var idx; // Index for element of interest

    if (individualAlgorithms) {
        createNewCollection('gClock');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findPage(data[i], history);
        if(idx != -1){
            updateBuffer(buffer,history,-1);
            history[idx].counter++;
            hand++;
            hand = hand % (bs);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i]});
            var currElem = history.length - 1;
            history[currElem].counter = 0;
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findGClockIndex(history,bs,hand);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].referenced = 0;
        pageFaults++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}


// Most reacently used
// mru(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
//      
// Fing oldest indes in history object
function findGClockIndex(history,bufferSize,handPos){
    var index = null;// index of oldest element
    //
    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }

    index = 0;
    
    while(true)
    {
        if (history[handPos].counter == 0)
        {
            //If hand is of not referenced, repleace it
            index = handPos;
            break;
        }
        else 
        {
            //If hand is on referenced
            //Remove referenced
            history[handPos].counter--;
            //Get next postion
            handPos++;
            handPos = handPos % (bufferSize);
        }
    }
    
    return index;
}

//---- Clock END ---- //


// ========================================================================= //
// -------------------------- Aging ---------------------------------------- //
// ========================================================================= //

// Aging
// aging(data, buffer size)
// return: 
//      >=0 : { page faults:int, page hits: int } 
//      null  : error
function aging(data, bs){ 
    var buffer = { 
                    data:[], // buffer data
                    pageFaultIdx: -1    // index where was page fault
                                        // -1 for page hit
                 }; 
    var pageFaults = 0;
    var pageHits = 0;

    var history = []; // page replacement history
    var idx; // Index for element of interest

    if (individualAlgorithms) {
        createNewCollection('Aging');
    }
    renderBufferInit(bs);
    for (var i = 0; i < data.length; i++){
        // Render buffer after first cycle
        if (i>0){
            renderBuffer(data[i-1],buffer,bs); 
        }

        // If page is in buffer/history: page hit
        idx = findAgingPage(data[i], history);
        if(idx != -1){
            history[idx].count++;           
            updateBuffer(buffer,history,-1);
            pageHits++;
            continue;
        }

        // If buffer not full: add new page
        if(buffer.data.length<bs){
            history.push({page:data[i],age: 128, count: 1});
            updateBuffer(buffer,history,history.length-1);
            pageFaults++;
            continue;
        }
        
        // If page is not in buffer: page fault
        idx = findAgingVictim(history);
        // If element was not found
        if(idx == -1){
            return null; // Error state
        }
        history[idx].page = data[i];
        history[idx].age = 128;
        history[idx].count = 1; 
        pageFaults++;
        updateBuffer(buffer,history,idx);
    }
    renderBuffer(data[data.length-1],buffer,bs);
    if (individualAlgorithms) {
        formatTables();
    }
    return {pageFaults:pageFaults,pageHits:pageHits};
}

// Find page in history using page number
function findAgingPage(page, history){
    var index = -1;
    
    for (var i = 0; i < history.length; i++){
        if(history[i].page==page){
            index = i;
            history[i].age + 128;
        }
        history[i].age /= 2;
    }
    return index;
}


// Finds least frequently usef page
// if there are two then use fifo to break the tie
// return index for least frequently used element
function findAgingVictim(history){
    var index = null;// index for element of interest
    var sCount = null; // smallest count
    var sAge = null; // smallest age

    // Abort if there is no elements in history
    if(history.length<1){
        return -1;
    }


    // Find smallest count
    index = 0;

    // Find smallest age
    sAge = history[0].age;
    for (var i = 0; i < history.length; i++){
        if(history[i].age<sAge){
            sAge = history[i].age;
            index = i;
        }
    }
    
    sCount = history[index].count;
    for (var i = 1; i < history.length; i++){
        if(history[i].age==sAge && history[i].count<sCount){
            sCount = history[i].count;
            index = i;
        }
    }

    return index;
}

//---- Aging END ---- //
