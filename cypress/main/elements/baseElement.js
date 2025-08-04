require('cypress-xpath');
const BaseElement = require('./baseElement');

class Button extends BaseElement {
  constructor(selector) {
    super(selector);
  }

  click() {
    cy.xpath(this.selector).click();
  }

  isVisible() {
    return cy.xpath(this.selector).should('be.visible');
  }

  isEnabled() {
    return cy.xpath(this.selector).should('not.be.disabled');
  }
}

module.exports = Button;
