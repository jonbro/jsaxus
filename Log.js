/*Copyright (c) 2008 Seneca College

Licenced under the MIT License (http://www.c3dl.org/index.php/mit-license/)
*/
// Hopefully these can be turned into browser-indpenedent functions,
// but for now they're most likely firefox-specific.

var GBLisSetUp = false;
var GBLlogIframe;
var GBLlogDiv;
var GBLnumLinesLogged = 0;
var GBLmaxLinesToLog = 100; // a sanity limit

function logError(str)
{
	doLog(str, 'Error', '#FF6666');
}

function logWarning(str)
{
	doLog(str, 'Warning', 'yellow');
}

function logInfo(str)
{
	doLog(str, 'Info',  'lightblue');
}

function doLog(str, type, colour)
{
	if (GBLnumLinesLogged == GBLmaxLinesToLog)
	{
		str = "Too many lines to log (" + GBLnumLinesLogged + "). Will not do any more to prevent the browser from freaking out.";
		type = "Warning";
		colour = "yellow";
	}
	if (GBLnumLinesLogged > GBLmaxLinesToLog)
		return;
	
	if(!GBLisSetUp)
		errorSetup();
	
	var currentTime = new Date();
	
	var node = document.createElement('P');
	node.innerHTML = currentTime.getHours() + ':' + 
					 currentTime.getMinutes() + ':' + 
					 currentTime.getSeconds() + ' ' +
					 type + ': ' + str;
	node.style.background = colour;
	GBLlogDiv.insertBefore(node, GBLlogDiv.firstChild);
	
	GBLnumLinesLogged++;
	
	//var node = document.createTextNode(str + "<br />");
	
	//GBLlogDiv.style.position = 'relative';
	
	//GBLlogIframe.appendChild(node);
	//GBLlogIframe.src = "javascript:'asd<br />'";
	
	//GBLlogIframe = document.getElementById('logiframe');
	//GBLlogIframe.appendChild(node);
	//alert(GBLlogIframe.src);
	//GBLlogIframe.src = "javascript:'" + str + "<br />";
	//GBLlogIframe.src += str + "<br />'";
	
	//document.getElementById('logdiv').appendChild(node);
	//alert(document.getElementById('logiframe').contentWindow.document.getElementById('logdiv'));
	//var adiv = document.getElementById('logiframe').contentWindow.document.createElement('div');
	//adiv.style.color = "green";
	//document.getElementById('logiframe').contentWindow.document.appendChild(node);
}

function errorSetup()
{
	windowWidth = document.body.clientWidth - 50;
	windowHeight = document.body.clientHeight;
	logWindowWidth = windowWidth;
	logWindowHeight = 200;
	
	/*
	GBLlogIframe = document.createElement("IFRAME"); 
	//ifrm.setAttribute("src", "http://developerfusion.com/"); 
	GBLlogIframe.style.width = logWindowWidth + "px";
	GBLlogIframe.style.height = logWindowHeight + "px";
	GBLlogIframe.style.position = 'absolute';
	GBLlogIframe.style.top = windowHeight - logWindowHeight;
	GBLlogIframe.style.left = 5;
	//GBLlogIframe.src = "javascript:";
	GBLlogIframe.id = 'logiframe';
	GBLlogIframe.name = 'logiframe';
	document.body.appendChild(GBLlogIframe);
	//document.getElementById('logiframe').src = "javascript:'asd<br />'";
	//document.getElementById('logiframe').src = "javascript:'qwe<br />'";
	*/
	
	/*
	GBLlogIframe = document.createElement("IFRAME"); 
	GBLlogIframe.style.width = logWindowWidth + "px";
	GBLlogIframe.style.height = logWindowHeight + "px";
	GBLlogIframe.style.position = 'absolute';
	GBLlogIframe.style.top = windowHeight - logWindowHeight;
	GBLlogIframe.style.left = 5;
	GBLlogIframe.src = "javascript:<div id='logdiv' name='logdiv'>originaldiv</div>";
	GBLlogIframe.id = 'logiframe';
	GBLlogIframe.name = 'logiframe';
	document.body.appendChild(GBLlogIframe);
	*/
	
	
	GBLlogDiv = document.createElement("DIV");
	GBLlogDiv.style.width = logWindowWidth + "px"; 
	//GBLlogDiv.style.height = logWindowHeight + "px"; 
	GBLlogDiv.style.position = 'absolute';
	GBLlogDiv.style.top = windowHeight - logWindowHeight;
	GBLlogDiv.style.left = 5;
	GBLlogDiv.style.padding = 5;
	GBLlogDiv.style.border = '4px solid #000';
	//GBLlogDiv.style.background = 'lightgrey';
	GBLlogDiv.id = 'logdiv';
	GBLlogDiv.name = 'logdiv';
	document.body.appendChild(GBLlogDiv);
	
	
	GBLisSetUp = true;
}
