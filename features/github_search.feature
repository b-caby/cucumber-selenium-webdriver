# features/github_search.feature
Feature: Reading documentation
  As a user of Cucumber.js
  I want to have documentation on Cucumber
  So that I can concentrate on building awesome applications

  Scenario: Reading CLI documentation
    Given I am on the Cucumber.js GitHub repository
    When I click on "CLI"
    Then I should see "Running specific features"

  Scenario: Reading Formatters documentation
    Given I am on the Cucumber.js GitHub repository
    When I click on "Custom Formatters"
    Then I should see "formatters"

  @bar
  Scenario: Searching API documentation
    Given I am on the Cucumber.js GitHub repository
    When I type "After" on the "Search" field and press "Enter"
    And I click on "docs/support_files/hooks.md"
    Then I should see "hooks"
