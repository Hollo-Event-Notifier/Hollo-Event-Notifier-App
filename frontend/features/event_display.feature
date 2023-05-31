Feature: Homepage feature

  Scenario: User changes display language
    Given the User is on the Homepage
    When the User clicks on the "hu" Button
    Then the text on the button should change to "en" indicating, that the webpage is in English
