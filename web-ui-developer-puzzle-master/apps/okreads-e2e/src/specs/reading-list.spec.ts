import { $, browser, ExpectedConditions, protractor, element, by } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
});

describe('When: I use the undo Add and Remove from the reading list', () => {
  it('Then: I should undo my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();


    const addToList = await $('#wantToRead');

    browser.wait(protractor.ExpectedConditions.elementToBeClickable(addToList), 10000)
    .then ( function () {
        addToList.click();
      });

      const EC = protractor.ExpectedConditions;   
      const snackBar = element(by.tagName('simple-snack-bar'));
      browser.wait(EC.visibilityOf(snackBar), 30000);
      element(by.tagName('simple-snack-bar')).getText().then(async function (val) {
        expect(val).toEqual('Added');
        await snackBar.element(by.className('mat-button-wrapper')).click();
      });
  });
});
