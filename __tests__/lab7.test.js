describe("Basic user flow for Website", () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto("https://cse110-sp25.github.io/CSE110-Shop/");
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it("Initial Home Page - Check for 20 product items", async () => {
    console.log("Checking for 20 product items...");

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval("product-item", (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO.
  it("Make sure <product-item> elements are populated", async () => {
    console.log(
      "Checking to make sure <product-item> elements are populated...",
    );

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval("product-item", (prodItems) => {
      return prodItems.map((item) => {
        // Grab all of the json data stored inside
        return (data = item.data);
      });
    });

    console.log(`Checking product items 1/${prodItemsData.length}`);

    // Make sure the title, price, and image are populated in the JSON for ALL items
    for (let i = 0; i < prodItemsData.length; i++) {
      const item = prodItemsData[i];
      if (item.title.length == 0) {
        allArePopulated = false;
      }
      if (item.price == null || item.price == undefined) {
        allArePopulated = false;
      }
      if (item.image.length == 0) {
        allArePopulated = false;
      }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    // Query the first product-item element
    const productItem = await page.$("product-item");

    // Get the shadowRoot of that element
    const shadowRoot = await productItem.getProperty("shadowRoot");

    // Query the button from the shadowRoot
    const button = await shadowRoot.$("button");

    // Get the button's innerText before clicking
    const textBefore = await button.evaluate((el) => el.innerText);
    console.log(`Button text before: ${textBefore}`);

    // Click the button
    await button.click();

    // Get the button's innerText after clicking
    const textAfter = await button.evaluate((el) => el.innerText);
    console.log(`Button text after: ${textAfter}`);

    // Expect the text to have changed from "Add to Cart" to "Remove from Cart"
    expect(textAfter).toBe("Remove from Cart");
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it("Checking number of items in cart on screen", async () => {
    console.log("Checking number of items in cart on screen...");

    // Query select all of the <product-item> elements
    const productItems = await page.$$("product-item");

    // Click only the buttons that still say "Add to Cart"
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty("shadowRoot");
      const button = await shadowRoot.$("button");
      const buttonText = await button.evaluate((el) => el.innerText);
      if (buttonText === "Add to Cart") {
        await button.click();
      }
    }

    // Check to see if the innerText of #cart-count is 20
    const cartCount = await page.$eval("#cart-count", (el) => el.innerText);
    expect(cartCount).toBe("20");
  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it("Checking number of items in cart on screen after reload", async () => {
    console.log("Checking number of items in cart on screen after reload...");

    // Reload the page and wait for the product items to finish loading
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("product-item");
    await page.waitForFunction(
      () => document.querySelectorAll("product-item").length === 20,
    );

    // Select all of the <product-item> elements
    const productItems = await page.$$("product-item");

    // Check every element to make sure all buttons say "Remove from Cart"
    let allButtonsCorrect = true;
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty("shadowRoot");
      const button = await shadowRoot.$("button");
      const buttonText = await button.evaluate((el) => el.innerText);
      if (buttonText !== "Remove from Cart") {
        allButtonsCorrect = false;
      }
    }

    // Check to make sure that #cart-count is still 20
    const cartCount = await page.$eval("#cart-count", (el) => el.innerText);
    expect(cartCount).toBe("20");
    expect(allButtonsCorrect).toBe(true);
  }, 20000);

  // Check to make sure that the cart in localStorage is what you expect
  it("Checking the localStorage to make sure cart is correct", async () => {
    // Get the cart from localStorage
    const cartJSON = await page.evaluate(() => {
      return localStorage.getItem("cart");
    });

    // Parse the JSON string to get the array
    const cart = JSON.parse(cartJSON);

    // At this point the item 'cart' in localStorage should be [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    const expectedCart = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    expect(cart).toEqual(expectedCart);
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it("Checking number of items in cart on screen after removing from cart", async () => {
    console.log("Checking number of items in cart on screen...");

    // Query select all of the <product-item> elements
    const productItems = await page.$$("product-item");

    // Go through and click the button on every single product item that is in the cart
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty("shadowRoot");
      const button = await shadowRoot.$("button");
      const buttonText = await button.evaluate((el) => el.innerText);
      if (buttonText === "Remove from Cart") {
        await button.click();
      }
    }

    // Check to make sure that #cart-count is now 0
    const cartCount = await page.$eval("#cart-count", (el) => el.innerText);
    expect(cartCount).toBe("0");
  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it("Checking number of items in cart on screen after reload", async () => {
    console.log("Checking number of items in cart on screen after reload...");

    // Reload the page once more and wait for the product items to finish loading
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector("product-item");
    await page.waitForFunction(
      () => document.querySelectorAll("product-item").length === 20,
    );

    // Select all of the <product-item> elements and check that all buttons say "Add to Cart"
    const productItems = await page.$$("product-item");
    let allButtonsCorrect = true;
    for (let i = 0; i < productItems.length; i++) {
      const shadowRoot = await productItems[i].getProperty("shadowRoot");
      const button = await shadowRoot.$("button");
      const buttonText = await button.evaluate((el) => el.innerText);
      if (buttonText !== "Add to Cart") {
        allButtonsCorrect = false;
      }
    }

    // Check to make sure that #cart-count is still 0
    const cartCount = await page.$eval("#cart-count", (el) => el.innerText);
    expect(cartCount).toBe("0");
    expect(allButtonsCorrect).toBe(true);
  }, 20000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it("Checking the localStorage to make sure cart is correct", async () => {
    console.log("Checking the localStorage...");

    // Get the cart from localStorage
    const cartJSON = await page.evaluate(() => {
      return localStorage.getItem("cart");
    });

    // Parse the JSON string to get the array
    const cart = JSON.parse(cartJSON);

    // At this point the item 'cart' in localStorage should be '[]'
    expect(cart).toEqual([]);
  });
});
