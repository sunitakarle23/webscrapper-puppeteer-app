const puppeteer = require('puppeteer');

let run = async () => {
	/**
	 * 1. Setup headless browser
	 */

	// pupppeteer  creates browser using launch / connect
  const browser = await puppeteer.launch({
	  headless: false
	});

  const page = await browser.newPage();

  await page.goto('http://books.toscrape.com/');
  await page.waitFor(1000);

  // inject js files
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

  // taking screenshot
  await page.screenshot({ path: 'screenshots/book.png' });

	/**
	 * 2. Scraping (select the first book on the page return the title,price of that book)
	 * Use Puppeteer API to allows us to click on a page( page.click(selector[, options]) )
	 * e.g - selector <string> (search for ele to click if multiple found clik first ele)
	 */

		// get list of books title & prices without navigating or using home page data

			const books = await page.evaluate(() => {
				let books = [];
				$('.product_pod').each( function() {
					let title = $(this).children('h3').text();
					let price = $(this).children().find('.price_color').text();
					books.push({
						title,
						price
					})
				})

				return books;
			});

			// this allows to click on image & navigate selected page

			await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');

			// In order to retrieve these values, we’ll use the page.evaluate() method. This method allows us to use built in DOM selectors like querySelector().
			// create our page.evaluate() function and save the returned value

			const book = await page.evaluate(() => {

				//select the BOOK TITLE
				let title = document.querySelector('h1').innerText;
				console.log("@@@@@ Book title =>", title);

				//select the book price
				let price = document.querySelector('.price_color').innerText;
				console.log("@@@@@ Book Price =>", price);

				return {
					title,
					price
				}

			});

	  // to close browser or disconnect
 		browser.close();

		return {
			bookList: books,
			selectedBook: book
		};
}

run().then((value) => {
  console.log(value); // Success!
});