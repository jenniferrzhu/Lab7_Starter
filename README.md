# CSE 110 Lab 7

**Members**: Jennifer Zhu

## Check Your Understanding
1. Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

I would put the automated tests in a GitHub Action that runs whenever code is pushed. This is the best option because it automatically checks if the new code breaks anything in the project. Running tests throughout development is better than waiting until the very end because bugs can be found and fixed earlier, which makes the project easier to manage overall.

2. Would you use an end to end test to check if a function is returning the correct output? (yes/no)

No, because end-to-end tests are mainly used to test how the whole application works from the user’s perspective. To check if a function returns the correct output, I would use a unit test instead because it focuses on testing individual functions or pieces of code.

3. What is the difference between navigation and snapshot mode?

Navigation mode analyzes the webpage as it loads from the beginning, so it measures things like loading speed and overall performance during page load. Snapshot mode only looks at the page in its current state and is mainly used to find accessibility problems, but it does not measure loading performance or user interactions.

4. Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.

We could resize and optimize the images so they load more efficiently. We could also remove unused JavaScript to improve performance. Finally, we could use preconnect for important origins so the browser can establish connections faster.