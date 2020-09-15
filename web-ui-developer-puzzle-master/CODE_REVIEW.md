Problems or code smells in the app
    1) Unsubscribe the subscription in every component using ngOnDestry method
    2) For some function parameters types are not defined
    3) observable $readingList does not contains type

Other Improvements
    1) Add the ratings for the individual book so user will check which book is top rated or popular
    2) At the top after search show the best seller or selected book for reading so user will not be confused which one to select
    3) Category option or dropdown should be available. The user can select category and based on that can search books to read if the user is new and don't know what to write on search text.

Accessibility Issue

    LightHouse
    1) Buttons do not have an accessible name
    2) Background and foreground colors do not have a sufficient contrast ratio

    Three issues that are not found in the automated scan.
    1) Search button - user does not know where to click for search, only icon is available. It should look like a button and if we hover over it should show tooltip to display the search for book.
    2) Color of the description text was very light so changed it to a dark



    Note: pending
    1) For task 4 I was able to mark book as finished, only after it is reflecting after refresh of the page.
    2) Some test cases are not done but tried to do some as I am new to protractor but can be done from my side if more time is available for this project

