Feature: Event display feature

  Scenario: The website loads properly
    Given the website is operational
    When the user connects to the website
    Then the user sees by default a calendar for the actual week, with days from monday to sunday

  Scenario: User changes display language from Hungarian to English
    Given the User is on the Homepage
    When the User clicks on the "hu" Button on the hungarian page
    Then the text on the button should change to "en" indicating, that the webpage is in English

  Scenario: User changes display language from English to Hungarian
    Given the User is on the Homepage that is set on English language so, that someone clicked on "hu" button before
    When the User clicks on the "en" Button on the english page
    Then the text on the button should change to "hu" indicating, that the webpage is in Hungarian

  Scenario: The user changes from month view to day view
    Given the User is on the Homepage
    And does not see the day view
    When the User clicks on the "Nap" Button on the page to see the day view
    Then the calendar should change to day view

  Scenario: The user changes from month view to month view
    Given the User is on the Homepage
    And does not see the month view
    When the User clicks on the "Hónap" Button on the page to see the month view
    Then the calendar should change to month view

  Scenario: The user changes from month view to list view
    Given the User is on the Homepage
    And does not see the list view
    When the User clicks on the "Lista" Button on the page to see the list view
    Then the calendar should change to list view
