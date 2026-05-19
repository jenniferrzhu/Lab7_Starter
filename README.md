# CSE 110 Lab 7

**Members**: Jennifer Zhu

## Check Your Understanding
1. Where would you fit your automated tests in your Recipe project development pipeline? Select one of the following and explain why.

I would put the automated tests in a GitHub Action that runs whenever code is pushed. This is the best option because it automatically checks if the new code breaks anything in the project. Running tests throughout development is better than waiting until the very end because bugs can be found and fixed earlier, which makes the project easier to manage overall.

2. Would you use an end to end test to check if a function is returning the correct output? (yes/no)

No, because end-to-end tests are mainly used to test how the whole application works from the user’s perspective. To check if a function returns the correct output, I would use a unit test instead because it focuses on testing individual functions or pieces of code.


