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
var artistString, extractStringTemp, artistStringTemp, urlTemp, imageStringTemp;

$w.onReady(function () {

	inputFunction();

});

function inputFunction() {
	$w('#image1').hide();
	$w('#text20').hide();

	$w('#input').onKeyPress((event) => {
		setTimeout(() => {
			if ($w('#input').value.length === 0 || $w('#input').value.length < 3) {
				currIndex = -1;
				$w("#rptDropdown").collapse()
					.then(() => {
						//console.log("Done with collapse");
					});
			} else {

				switch (event.key) {
					case "Enter":
						$w('#input').value = $w('#rptDropdown').data[currIndex].title;
						$w("#rptDropdown").collapse()
							.then(() => {
								//console.log("Done with collapse");
							});
						break;
					case "ArrowLeft":
					case "ArrowRight":
						break;
					case "ArrowUp":
						if (currIndex > 0) {
							currIndex -= 1;
							refresh_repeater();
						}
						break;
					case "ArrowDown":
						if (currIndex < listSize - 1) {
							currIndex += 1;
							refresh_repeater();
						}
						break;
					case "Escape":
						$w('#input').value = '';
						currIndex = -1;
						$w("#rptDropdown").collapse()
							.then(() => {
								//console.log("Done with collapse");
							});
						break;
					default:
						currIndex = -1;
						wixData.query("ArtistName")
							.startsWith("title", $w('#input').value)
							.ascending("title")
							.limit(5)
							.find()
							.then((res) => {
								$w('#rptDropdown').data = [];
								$w('#rptDropdown').data = res.items;
								listSize = res.items.length;
								$w('#rptDropdown').expand();
							});
						break;
				}
			}
		}, 50)
	});

}

function refresh_repeater() {
	console.log("refresh_repeater");
	$w("#rptDropdown").forEachItem(($item, itemData, index) => {
		$item('#name').text = itemData.title;

		if (index === currIndex) {
			$item("#rptBox").style.backgroundColor = HL_COLOR;
		} else {
			$item("#rptBox").style.backgroundColor = REG_COLOR;
		}

		$item('#container1').onClick(() => {
			$w('#input').value = itemData.title;
			$w('#rptDropdown').collapse();
		});
	});
}

export function rptDropdown_itemReady_1($item, itemData, index) {
	//console.log("rptDropdown_itemReady_1");
	$item('#name').text = itemData.title;

	if (index === currIndex) {
		$item("#rptBox").style.backgroundColor = HL_COLOR;
	} else {
		$item("#rptBox").style.backgroundColor = REG_COLOR;
	}

	$item('#container1').onClick(() => {
		$w('#input').value = itemData.title;
		$w('#rptDropdown').collapse();
		getContent();
	});

}


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
	//console.log("Fetch URL: " + url);
	fetch(url)
		.then(function (response) {

			//console.log("Response: " + response.status);
			return response.json();

		})
		.then(function (response) {
			var pages = response.query.pages;
			for (var page in pages) {
				if (isImage === false) {
					setTimeout(() => {
						console.log("Wait text!");
						extractValue = pages[page].extract;
						//console.log("extractValue: " + extractValue);
						//if (extractValue.includes("may refer to:")) {
						//	resetUrl(extractStringTemp, artistStringTemp + "_(band)", urlTemp, imageStringTemp + "_(band)");
						//} else {
						$w(element).html = extractValue;
					}, 1000);
					//}
				} else {
					try {
						setTimeout(() => {
							console.log("Wait image!");

							origString = pages[page].thumbnail.source;

							//console.log("origString: " + origString);

							origString = origString.split(((pages[page].pageimage).replace("(", "%28")).replace(")", "%29"));


							updatedString = origString[0].split("thumb/")

							//console.log("updatedString: " + updatedString);
							//console.log("updatedString updated: "+ updatedString[0] + updatedString[1] + ((pages[page].pageimage).replace("(", "%28")).replace(")", "%29"));

							$w(element).src = updatedString[0] + updatedString[1] + pages[page].pageimage;

						}, 1000);
					} catch (err) {}
				}

			}
		})
		.catch(function (error) {
			console.log(error);
		});

}


function getContent() {
	//console.log("getContent");
	$w("#image1").show();
	$w("#text20").show();
	var url = "https://en.wikipedia.org/w/api.php";
	var extractString = "extracts&exsentences=10";
	var imageString = "pageimages";
	artistString = ("title", $w("#input").value).replaceAll(" ", "_");
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

export function input_change(event) {
	//console.log("input_change");
	getContent();
}

export function input_click(event) {
	//console.log("input_click");
	$w('#input').value = "";
}
