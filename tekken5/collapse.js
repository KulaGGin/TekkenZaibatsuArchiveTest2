// #############################################################################
// lets define the browser we have instead of multiple calls throughout the file
var userAgent = navigator.userAgent.toLowerCase();
var is_opera  = (userAgent.indexOf('opera') != -1);
var is_saf    = ((userAgent.indexOf('safari') != -1) || (navigator.vendor == "Apple Computer, Inc."));
var is_webtv  = (userAgent.indexOf('webtv') != -1);
var is_ie     = ((userAgent.indexOf('msie') != -1) && (!is_opera) && (!is_saf) && (!is_webtv));
var is_ie4    = ((is_ie) && (userAgent.indexOf("msie 4.") != -1));
var is_moz    = ((navigator.product == 'Gecko') && (!is_saf));
var is_kon    = (userAgent.indexOf('konqueror') != -1);
var is_ns     = ((userAgent.indexOf('compatible') == -1) && (userAgent.indexOf('mozilla') != -1) && (!is_opera) && (!is_webtv) && (!is_saf));
var is_ns4    = ((is_ns) && (parseInt(navigator.appVersion) == 4));

// catch possible bugs with WebTV and other older browsers
var is_regexp = (window.RegExp) ? true : false;

// #############################################################################
// let's find out what DOM functions we can use
var vbDOMtype = '';
if (document.getElementById)
{
	vbDOMtype = "std";
}
else if (document.all)
{
	vbDOMtype = "ie4";
}
else if (document.layers)
{
	vbDOMtype = "ns4";
}

// make an array to store cached locations of objects called by fetch_object
var vBobjects = new Array();

// #############################################################################
// function to emulate document.getElementById
function fetch_object(idname, forcefetch)
{
	if (forcefetch || typeof(vBobjects[idname]) == "undefined")
	{
		switch (vbDOMtype)
		{
			case "std":
			{
				vBobjects[idname] = document.getElementById(idname);
			}
			break;

			case "ie4":
			{
				vBobjects[idname] = document.all[idname];
			}
			break;

			case "ns4":
			{
				vBobjects[idname] = document.layers[idname];
			}
			break;
		}
	}
	return vBobjects[idname];
}

// #############################################################################
// function to handle the different event models of different browsers
// and prevent event bubbling
function do_an_e(eventobj)
{
	if (!eventobj || is_ie)
	{
		window.event.returnValue = false;
		window.event.cancelBubble = true;
		return window.event;
	}
	else
	{
		eventobj.stopPropagation();
		eventobj.preventDefault();
		return eventobj;
	}
}

// #############################################################################
// function to do a single-line conditional
function iif(condition, trueval, falseval)
{
	return condition ? trueval : falseval;
}

// #############################################################################
// function to search an array for a value
function in_array(ineedle, haystack, caseinsensitive)
{
	var needle = new String(ineedle);

	if (caseinsensitive)
	{
		needle = needle.toLowerCase();
		for (i in haystack)
		{
			if (haystack[i].toLowerCase() == needle)
			{
				return i;
			}
		}
	}
	else
	{
		for (i in haystack)
		{
			if (haystack[i] == needle)
			{
				return i;
			}
		}
	}
	return -1;
}

// #############################################################################
// function to set a cookie
function set_cookie(name, value, expires)
{
	if (!expires)
	{
		expires = new Date();
	}
	document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() +  "; path=/";
}

// #############################################################################
// function to retrieve a cookie
function fetch_cookie(name)
{
	cookie_name = name + "=";
	cookie_length = document.cookie.length;
	cookie_begin = 0;
	while (cookie_begin < cookie_length)
	{
		value_begin = cookie_begin + cookie_name.length;
		if (document.cookie.substring(cookie_begin, value_begin) == cookie_name)
		{
			var value_end = document.cookie.indexOf (";", value_begin);
			if (value_end == -1)
			{
				value_end = cookie_length;
			}
			return unescape(document.cookie.substring(value_begin, value_end));
		}
		cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
		if (cookie_begin == 0)
		{
			break;
		}
	}
	return null;
}

// #############################################################################
// function to delete a cookie
function delete_cookie(name)
{
	var expireNow = new Date();
	document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" +  "; path=/";
}

// #############################################################################
// function to toggle the collapse state of an object, and save to a cookie
function toggle_collapse(objid)
{
	if (!is_regexp)
	{
		return false;
	}
	
	obj = fetch_object("collapseobj_" + objid);
	obj_note = fetch_object("collapseobj_" + objid + "_note");
	img = fetch_object("collapseimg_" + objid);
	
	if (!obj)
	{
		// nothing to collapse!
		if (img)
		{
			// hide the clicky image if there is one
			img.style.display = "none";
		}
		return false;
	}

	if (obj.style.display == "none")
	{
		obj.style.display = "";
                obj_note.style.display = "";
		save_collapsed(objid, false);
		if (img)
		{
			img_re = new RegExp("_collapsed\\.gif$");
			img.src = img.src.replace(img_re, '.gif');
		}
	}
	else
	{
		obj.style.display = "none";
                obj_note.style.display = "none";
		save_collapsed(objid, true);
		if (img)
		{
			img_re = new RegExp("\\.gif$");
			img.src = img.src.replace(img_re, '_collapsed.gif');
		}
	}
	return false;
}

// #############################################################################
// update collapse cookie with collapse preferences
function save_collapsed(objid, addcollapsed)
{
	var collapsed = fetch_cookie("t5collapse");
	var tmp = new Array();

	if (collapsed != null)
	{
		collapsed = collapsed.split("\n");

		for (i in collapsed)
		{
			if (collapsed[i] != objid && collapsed[i] != "")
			{
				tmp[tmp.length] = collapsed[i];
			}
		}
	}

	if (addcollapsed)
	{
		tmp[tmp.length] = objid;
	}

	expires = new Date();
	expires.setTime(expires.getTime() + (1000 * 86400 * 365));
	set_cookie("t5collapse", tmp.join("\n"), expires);
}
