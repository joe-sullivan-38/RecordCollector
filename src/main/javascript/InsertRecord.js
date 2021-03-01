import wixData from 'wix-data';

const HL_COLOR = "rgba(190,190,250)";
const REG_COLOR = "rgba(222,222,222)";

let listSize;
let currIndex = -1;
import {
	fetch
} from 'wix-fetch';

let artistSize = 500;
let name;
var returnVal = 1;
var artistString, extractStringTemp, artistStringTemp, urlTemp, imageStringTemp;

$w.onReady(function () {


});


function setUrl(prop, titles, element, isImage, url) {
	//console.log("setUrl");
	var params = {
		action: "query",
		prop: prop,
		titles: titles,
		format: "json"
	};
	url = "https://en.wikipedia.org/w/api.php";
	url = url + "?origin=*";
	Object.keys(params).forEach(function (key) {
		url += "&" + key + "=" + params[key];
	});
	fetchContent(url, element, isImage);

}

function fetchContent(url, element, isImage) {
	//console.log("fetchContent");
	var origString = "";
	var updatedString = "";
	var extractValue = "";
	var testVal = "";
	var testVal2 = "";
	console.log("Fetch URL: " + url);
	fetch(url)
		.then(function (response) {
			console.log("Response: " + response.status);
			return response.json();
		})
		.then(function (response) {
			var pages = response.query.pages;
			for (var page in pages) {
				extractValue = JSON.parse(JSON.stringify(pages[page].revisions[0].slots.main).replace("\"\*\"", "\"content\"")).content;
				splitString(extractValue, "name", "#text20", "name");
				splitString(extractValue, "artist", "#text21", "artist");
				splitString(extractValue, "cover", "#image1", "image");
				splitString(extractValue, "released", "#text22", "released");
			}
		})
		.catch(function (error) {
			console.log(error);
		});

}


function getContent() {
	//console.log("getContent");
	var url = "https://en.wikipedia.org/w/api.php";
	//var extractString = "extracts&exsentences=10";
	var extractString = "revisions&rvslots=*&rvprop=content";
	var imageString = "images";
	//artistString = ("title", $w("#input1").value).replaceAll(" ", "_");
	artistString = ("title", $w("#input1").value).replaceAll("https://en.wikipedia.org/wiki/", "");
	resetUrl(extractString, artistString, url, imageString);

}

function resetUrl(extractString, artistStringval, url, imageString) {
	//console.log("resetUrl");
	extractStringTemp = extractString;
	artistStringTemp = artistString;
	urlTemp = url;
	imageStringTemp = imageString;
	setUrl(extractString, artistStringval, "#text20", false, url);
	setUrl(imageString, artistStringval, "#image1", true, url);

}

export function input_click(event) {
	$w('#input1').value = "";
}

function splitString(inputString, searchVal, elementName, type) {
	let contentArray =  ";"
	if(inputString.substr(0, 1000).toLowerCase().includes("cover")){
	contentArray = inputString.split(searchVal);
	}else{
		contentArray = inputString.split(type);
	}
	let contentArray2 = "";
	let contentArray3 = "";
	let newString = "";
	if (type === 'artist' || type === 'name') {
		contentArray2 = (contentArray[1] + contentArray[2]).split("|");
		$w(elementName).text = contentArray2[0].replaceAll('[', '').replaceAll(']', '').replace('=', '').trim();

	} else if (type === "released") {

		if ((contentArray[1] + contentArray[2]).substring(0, 20).toLowerCase().includes("start date")) {
			contentArray2 = (contentArray[1].toLowerCase() + contentArray[2].toLowerCase()).split("}");
			contentArray3 = contentArray2[0].replaceAll("{", "").replaceAll("}", "").replaceAll("=", "").replace("start date", "").trim();
			var d = new Date(contentArray3.substring(1, 11).replaceAll("|", "-"));
			var n = d.toDateString();
			$w(elementName).text = n.substring(4);
		} else {
			contentArray2 = (contentArray[1] + contentArray[2]).split("|");
			$w(elementName).text = contentArray2[0].replaceAll('[', '').replaceAll(']', '').replace('=', '').trim();
		}

	} else {
		contentArray2 = (contentArray[1] + contentArray[2]).split("|");
		//returnVal = 1;
		getImages($w("#input1").value, parseContent(contentArray[1]));
		getImages($w("#input1").value, parseContent(contentArray2[0]));
		//console.log("returnVal 2nd: " + returnVal);

	}

}

function parseContent(inputValue){
return inputValue.replaceAll('[', '').replaceAll(']', '')
			.replace('=', '').trim().replace(/\s+/g, '_').replace('(', '%28').replace(')', '%29');

}


function getImages(inputVal, urlSubstring) {
	var url = "https://en.wikipedia.org/w/api.php";
	var parseInput = inputVal.replaceAll("https://en.wikipedia.org/wiki/", "");
	var params = {
		action: "query",
		prop: "images",
		titles: parseInput,
		format: "json"
	};

	url = url + "?origin=*";
	Object.keys(params).forEach(function (key) {
		url += "&" + key + "=" + params[key];
	});
    console.log("url: " + url);
	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (response) {
			var pages = response.query.pages;
			for (var page in pages) {
				for (var img of pages[page].images) {
					name = img.title.slice(5);
					//console.log(name);
					pop(urlSubstring);
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}

function pop(inputVal) {
	//console.log("InputVal: " + inputVal);
	var url = "https://en.wikipedia.org/w/api.php";
	returnVal = 1;
	var params = {
		action: "query",
		format: "json",
		list: "allimages",
		aifrom: name,
		ailimit: "1"
	};

	url = url + "?origin=*";
	Object.keys(params).forEach(function (key) {
		url += "&" + key + "=" + params[key];
	});

	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (response) {
			var images = response.query.allimages;
			for (var img in images) {
				if (images[img].url.includes(inputVal)) {
					console.log("PoP: " + images[img].url); //here we will get the url of the image.
					setImage(images[img].url);
					returnVal = 0;
					break;
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
}

function setImage(parameter) {
	$w('#image1').src = parameter;
}

export function button1_click_1(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	getContent();
	// 
}

export function test(event) {
}

function insertRecord(insertValue) {
	let toInsert = {
		"title": insertValue
	};
	wixData.insert("Collection", toInsert)
		.then((resultsInsert) => {
			let item = resultsInsert; //see item below
		})
		.catch((err) => {
			let errorMsg = err;
			console.log(errorMsg);
		});


}

export function button2_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	
	var recordArray = [];
	var insertValue = $w('#input1').value;//.replace("https://en.wikipedia.org/wiki/", "");
	//insertValue = insertValue.replaceAll("_", " ");

	wixData.query("Collection")
		.limit(500)
		.ascending("title")
		.find()
		.then((results) => {
			var i;
			for (i = 0; i < results.length; i++) {
				recordArray.push(results.items[i].title);
			}

			if (recordArray.includes(insertValue)) {
				$w('#text23').text = insertValue + " already exists";
			} else {
				insertRecord(insertValue);
				$w('#text23').text = insertValue + " added";
			}

		});

}
