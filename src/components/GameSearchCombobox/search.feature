Feature: Search games

  As a user
  I want to search for games
  To see if they're currently live in a particular state
  So that I can assemble them into game tiles for a ticket build

  Scenario: User clicks/focuses on empty searchbox
    Given the searchbox is empty
    When the user clicks/focuses on the searchbox
    Then nothing happens

  Scenario: User clicks/focuses on non-empty searchbox
    Given the searchbox contains an existing query
    When the user clicks/focuses on the searchbox
    Then search results from the existing query appear

  Scenario: User enters text into the searchbox
    Given the searchbox is focused
    When the user starts typing
    Then a loading spinner appears
    And search results appear

  Scenario: User navigates through search results via keyboard
    Given the searchbox is focused and contains a query
    And search results are visible
    And the first search result is highlighted
    When the user presses the down arrow key
    Then the second search result is highlighted

  Scenario: User selects a game
    Given the search results are visible
    And a game is highlighted
    When the user presses Enter or clicks on the game
    Then the game is added to the list of selected games
    And the searchbox is focused and cleared for the next query
