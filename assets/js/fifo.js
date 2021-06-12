var input2=document.getElementsByClassName("userinput2")[0];
var input1=document.getElementsByClassName("userinput1")[0];
var Add= document.getElementsByClassName("Add")[0];
var Enter= document.getElementsByClassName("Enter")[0];
var refresh= document.getElementsByClassName("refresh")[0];
var show= document.getElementsByClassName("show-output")[0];
var input_list=document.getElementsByClassName("input-list")[0];
var list=document.getElementsByClassName("list")[0];


var array=[];
var input_array=[];
var frames=-1;
var page_fault=0;
var ptr=0;
var graph_inputs=[]


function FIFO(index){

	//console.log("in OPR");


    var element_inside=array.length;
    for(var i=0;i< element_inside;i++)
    {
        if(array[i]===input_array[index]){
            return 1;
        }
    }
    if(element_inside<frames){
        array.push(input_array[index]);
        page_fault++;
        return 0;
    }
	page_fault++;
	array[ptr]=input_array[index];
	console.log("repeat: ",array[ptr]);
	ptr++;
	if(ptr===element_inside)
	{
		ptr=0;
	}
	return 0;
	/*
    var visited=[];
    for(var i=0;i<element_inside;i++)
    {
        visited.push(0);
    }
    var count=0;
    var find=-1;
    for(var i=0;i<element_inside;i++)
    {
        var index2=index+1;
        while(index2<input_array.length){
            if(input_array[index2]===array[i]){
                visited[i]=1;
                if(index2>find){
                    find=index2;
                }
                count++;
                break;
            }
            index2++;
        }
    }
    if(count===element_inside){
        for(var i=0;i<element_inside;i++)
        {
            if(array[i]===input_array[find]){
                array[i]=input_array[index];
                return 0;
            }
        }
    }
    for(var i=0;i<element_inside;i++)
    {
        if(visited[i]===0){
            array[i]=input_array[index];
            return 0;
        }
	}
	*/
}

function Calculate() {
	//console.log("in calculate");
	document.getElementById("Calculate").innerHTML = page_fault;
}

function Refresh() {
	//console.log("in Refresh");
	array=[];
	input_array=[];
	page_fault=0;
	ptr=0;
	//blocks.innerHTML="";
    list.innerHTML="";
    input_list.innerHTML="";
	document.getElementById("Calculate").innerHTML = "";
	frames=-1;
	input2.value="";
	graph_inputs=[];
	document.getElementById("linechart_material").innerHTML="";
}




function inputLength2() {
	//console.log("in inputlen2"+ input2.value);
	return input2.value.length;
	// body...
}

function inputLength1() {
	//console.log("in inputlen1 ="+ input1.value);
	return input1.value.length;
	// body...
}



function update_element(value,ptr)
{
	//console.log("in update_ele");
	blocks.childNodes[ptr].innerHTML=value;
}


function add_element(value){
	//console.log("in add_ele");
	let newElement=document.createElement('span');
	newElement.className="badge badge-secondary";
	newElement.innerText=value;
	return newElement;
	//blocks.appendChild(newElement);
}


function add_element_input(value){
	//console.log("in add_ele_inp");
    let newElement=document.createElement('span');
	newElement.className="badge badge-secondary";
	newElement.innerText=value;
	return newElement;
}


function create(index){
	//console.log("in create");
	let newElement=document.createElement('li');
	newElement.className="list-block";
	let newblock=document.createElement('ul');
	newblock.className="blocks";
	let miss_hit=document.createElement('span');
	let value_added=document.createElement('span');
	miss_hit.className="badge badge-secondary miss_hit";
	value_added.className="badge badge-secondary miss_hit";
	var hit_or_miss=FIFO(index);
	if(hit_or_miss===1)
	{
		miss_hit.innerText="Hit"
		newblock.appendChild(miss_hit);
	}
	else{
		miss_hit.innerText="Miss"
		newblock.appendChild(miss_hit);
	}
	value_added.innerText=input_array[index] +" added";
	newblock.appendChild(value_added);
	for(var i=0;i< array.length;i++){
		//add_element(array[i]);
		newblock.appendChild(add_element(array[i]));
	}
	newElement.appendChild(newblock);
	list.appendChild(newElement);

}



function input_frames(){
	//console.log("in inp_frames");
    input_array.push(input2.value);
    input_list.appendChild(add_element_input(input2.value));
    input2.value="";
}




function addListAfterClick() {
	//console.log("in addlistafterclick");
	if(inputLength2()>0)
	{
		if(frames===-1)
		{
			input2.value="";
			window.alert("enter number of frames!");
			return;
		}
		else
		{
            inp_2=input2.value;
            input_frames();
            //FIFO();
		}
	}
}
function addListAfterKeypress(event) {
	console.log("in addlistafterkeypress");
	if(inputLength2()>0 && event.keyCode===13)
	{
		if(frames===-1)
		{
			input2.value="";
			window.alert("enter maximum number of frames!");
			return;
		}
		else
		{
            inp_2=input2.value;
            input_frames();
			//FIFO();
			//create();
		}
	}
}



function Update_frame() {
	//console.log("in update_frames");
	if(inputLength1()>0)
	{
		Refresh();
		frames=input1.value;
        input1.value="";
		return;
	}
}


function Update_frame_AfterKeypress() {
	//console.log("in updateframesafterkeypress");
	//console.log(inputLength1());
	if(inputLength1()>0 && event.keyCode===13)
	{
		Refresh();
		frames=input1.value;
        input1.value="";
		return;
	}
}


function drawChart() {

	var data = new google.visualization.DataTable();
      data.addColumn('number', 'Number Of Frames');
      data.addColumn('number', 'Page fault line');

	  for(var i=0;i<graph_inputs.length;i++)
	  {
		data.addRow(graph_inputs[i]);
	  }

      var options = {
        chart: {
          title: "Belady's Anomaly",
          subtitle: 'First In First Out'
		},
		series: {
			0: {
				axis: 'num_page_fault'
			}
		},
		axes: {
			y: {
				num_page_fault: {label: 'Number of Page Faults'}
			}
		},
        width: 900,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('linechart_material'));

      chart.draw(data, google.charts.Line.convertOptions(options));
}


function draw_graph(){

	google.charts.load('current', {'packages':['line']});
	google.charts.setOnLoadCallback(drawChart);
	
	for(var i=0;i<graph_inputs.length;i++)
	{
		console.log(graph_inputs[i]);
	}
	
}

function coordintes(num_frames){
	var array1=[];
	var count_page_fault=0;
	var ptr1=0;
	for(var i=0;i<input_array.length;i++)
	{
		var if_break=0;
		for(var j=0;j<array1.length;j++)
		{
			if(array1[j]===input_array[i])
			{
				if_break=1;
				break;
			}
		}
		if(if_break===1)
		{
			continue;
		}
		if(array1.length<num_frames)
		{
			array1.push(input_array[i]);
			count_page_fault++;
		}
		else if(array1.length===num_frames){
			array1[ptr1]=input_array[i];
			count_page_fault++;
			ptr1++;
			if(ptr1===num_frames)
			{
				ptr1=0;
			}
		}
	}
	return [num_frames,count_page_fault];
}

function create_graph_inputs(){
	for(var i=1;i<=frames;i++)
	{
		graph_inputs.push(coordintes(i));
	}

}


function show_graph(){
	create_graph_inputs();
	draw_graph();
}


function show_output(){
    console.log("in showoutput");
    if(list.innerHTML!="")
    {
        list.innerHTML="";
		document.getElementById("Calculate").innerHTML = "";
		array=[];
		ptr=0;
		page_fault=0;
		graph_inputs=[];
	}
	if(document.getElementById("linechart_material").innerHTML!="")
	{
		document.getElementById("linechart_material").innerHTML="";
	}
    if(input_array.length===0 || frames===-1){
        console.log("input_array.length= "+input_array.length);
        console.log("array.length= "+array.length);
        console.log("frames= "+frames);
        input2.value="";
		window.alert("enter maximum number of frames and sequence of pages!");
		return;
    }
    for(var i=0 ;i < input_array.length;i++)
    {
        create(i);
	}
	show_graph();
    Calculate();
}


Enter.addEventListener("click",Update_frame);
Add.addEventListener("click",addListAfterClick);
input2.addEventListener("keypress",addListAfterKeypress);
input1.addEventListener("keypress",Update_frame_AfterKeypress);
refresh.addEventListener("click",Refresh);
show.addEventListener("click",show_output);