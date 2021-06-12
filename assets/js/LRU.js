var input2=document.getElementsByClassName("userinput2")[0];
var input1=document.getElementsByClassName("userinput1")[0];
var Add= document.getElementsByClassName("Add")[0];
var Enter= document.getElementsByClassName("Enter")[0];
var refresh= document.getElementsByClassName("refresh")[0];
//var blocks=document.getElementsByClassName("blocks")[0];
var input_list=document.getElementsByClassName("input-list")[0];
var list=document.getElementsByClassName("list")[0];

var array=[];
var input_array=[];
var visited=[];
var frames=-1;
var ptr=0;
var page_fault=0;
var element_inside=0;
var miss_or_hit=0;
var ptr_last=-1;

function lru(){
	//console.log("in lru");
    var n=input_array.push(input2.value);
    for (var i = 0; i < element_inside; i++) {
		if(array[i]===input2.value)
		{
			//console.log("same element found = "+input2.value);
			input2.value="";
			miss_or_hit=1;
			return;
		}
    }
    if(element_inside<frames)
	{
		//console.log("ele_ins<frames = "+input2.value);
		miss_or_hit=0;
		//add_element(input2.value);
		var num=array.push(input2.value);
		ptr_last++;
		element_inside++;
		page_fault++;
		ptr++;

		document.getElementById("Calculate").innerHTML = page_fault;
		input2.value="";
		return;
	}
	miss_or_hit=0;
	//console.log("update = "+input2.value);
	//console.log("element_in = "+element_inside);
    for(var i = 0; i < element_inside; i++)
    {
		visited.push([array[i],0]);
    }
    var pointer=n-2;
    var count=0;
	var ans=n;
    while(pointer>=0 && count<element_inside)
    {
		//var find=input_array[pointer];
		var find=input_array[pointer];
		//console.log("find = "+find);
        for(var i = 0;i < element_inside; i++)
        {
            if(visited[i][0]===find)
            {
				//console.log("i = "+i);
                if(visited[i][1]===0)
                {
					//console.log("visited[i][1]==0  i = " +i);
					visited[i][1]=1;
					console.log(visited[i]);
                    count++;
                }
                if(count===element_inside)
                {
					//console.log("count==element_inside = i = " +i);
					ans=find;
					break;      
                }
			}
		}
		pointer--;
	}
	for(var i=0;i<element_inside;i++)
	{
		if(array[i]===ans)
		{
			array[i]=input2.value;
			page_fault++;
			document.getElementById("Calculate").innerHTML = page_fault;
			input2.value="";
			visited=[];
			return;
		}
	}
}

function Calculate() {
	document.getElementById("Calculate").innerHTML = page_fault;
}

function Refresh() {
	array=[];
	input_array=[];
	ptr=0;
	page_fault=0;
	element_inside=0;
	//blocks.innerHTML="";
	input_list.innerHTML="";
	list.innerHTML="";
	document.getElementById("Calculate").innerHTML = "";
	frames=-1;
	input2.value="";
}






function inputLength2() {
	return input2.value.length;
	// body...
}
function inputLength1() {
	return input1.value.length;
	// body...
}


function update_element(value,ptr)
{
	blocks.childNodes[ptr].innerHTML=value;
}


function add_element(value){
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

function create(){
	let newElement=document.createElement('li');
	newElement.className="list-block";
	let newblock=document.createElement('ul');
	newblock.className="blocks";
	let miss_hit=document.createElement('span');
	let value_added=document.createElement('span');
	miss_hit.className="badge badge-secondary miss_hit";
	value_added.className="badge badge-secondary miss_hit";
	lru();
	if(miss_or_hit===1)
	{
		miss_hit.innerText="Hit"
		newblock.appendChild(miss_hit);
	}
	else{
		miss_hit.innerText="Miss"
		newblock.appendChild(miss_hit);
	}
	value_added.innerText=inp_2 +" added";
	newblock.appendChild(value_added);
	for(var i=0;i< element_inside;i++){
		//add_element(array[i]);
		newblock.appendChild(add_element(array[i]));
	}
	newElement.appendChild(newblock);
	list.appendChild(newElement);

}

function input_frames(){
	//console.log("in inp_frames");
    input_list.appendChild(add_element_input(input2.value));
    //input2.value="";
}


function addListAfterClick() {
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
			//FIFO();
			input_frames();
			create();
		}
	}
}
function addListAfterKeypress(event) {
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
			//FIFO();
			input_frames();
			create();
		}
	}
}

function Update_frame() {
	if(inputLength1()>0)
	{
		Refresh();
		frames=input1.value;
		input1.value="";
		return;
	}
}
function Update_frame_AfterKeypress() {
	if(inputLength1()>0 && event.keyCode===13)
	{
		Refresh();
		frames=input1.value;
		input1.value="";
		return;
	}
}




Enter.addEventListener("click",Update_frame);
Add.addEventListener("click",addListAfterClick);
input2.addEventListener("keypress",addListAfterKeypress);
input1.addEventListener("keypress",Update_frame_AfterKeypress);
refresh.addEventListener("click",Refresh);