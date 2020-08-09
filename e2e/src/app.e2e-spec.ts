import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message saying Ristorante Con Fusion', () => {
    page.navigateTo('/');
    expect(page.getParagraphText('app-root h1')).toEqual('Ristorante Con Fusion');
  });
  it('should navigate to about us page by clicking on the link', () => {
    page.navigateTo('/');

    const navlink = page.getAllElements('a').get(1);
    navlink.click();

    expect(page.getParagraphText('h3')).toBe('About Us');
  });
  it('it should add a comment to the first dish',()=>{
    page.navigateTo('/dishdetail/0');
    const newAuthor = page.getElement('input[type=text]');
    newAuthor.sendKeys('e2e author');

    const newComment = page.getElement('textarea');
    newComment.sendKeys('e2e comment');

    const newSubmit = page.getElement('button[type=submit]');
    newSubmit.click();

    browser.pause();
  });
});
