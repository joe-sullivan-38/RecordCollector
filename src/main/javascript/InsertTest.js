import wixData from 'wix-data';
$w.onReady(function () {
	$w('#text20').hide();
	//https://en.wikipedia.org/wiki/John_Denver

});

export function button1_click(event) {
	var artistArray = [];
	var insertValue = $w('#input1').value.replace("https://en.wikipedia.org/wiki/", "");
	insertValue = insertValue.replaceAll("_", " ");

	wixData.query("ArtistName")
		.limit(500)
		.ascending("title")
		.find()
		.then((results) => {
			var i;
			for (i = 0; i < results.length; i++) {
				artistArray.push(results.items[i].title);
			}

			if (artistArray.includes(insertValue)) {
				setValues(insertValue + " already exists");
			} else {
				insertArtist(insertValue);
				setValues(insertValue + " added");
			}

		});

}

function insertArtist(insertValue) {
	let toInsert = {
		"title": insertValue
	};
	wixData.insert("ArtistName", toInsert)
		.then((resultsInsert) => {
			let item = resultsInsert; //see item below
		})
		.catch((err) => {
			let errorMsg = err;
			console.log(errorMsg);
		});


}

function setValues(inputString) {
	$w('#text20').text = inputString;
	$w('#text20').show();
	$w('#input1').value = "";
}
