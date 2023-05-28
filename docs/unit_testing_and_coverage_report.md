# Unit testing and coverage report

## Description
In our application we implemented unit tests for the 2 major
self written software components the frontend (UI layer in Angular)
and the backend (Business Logic Layer in Kotlin Spring)

This document compromises our testing tools and their usage.

## Frontend - Angular
On the frontend side we used Angular for building a single page web
application, this web development framework includes all necessary
tools for unit testing. These tools and libraries are described below.

### Unit test runner
To run our tests, we use the [Karma test runner](https://karma-runner.github.io/latest/index.html).
Which is pre-built into angular, and comes with all necessary configurations
to run our unit tests.

### Implementation and mocking
Our unit tests are implemented using the [Jasmine Library](https://jasmine.github.io/).
Which is a very popular behaviour driven testing tool. It can be used
also to write unit tests on the frontend.

### Code coverage report
For generating our code coverage report we used the [Istanbul Code Coverage Report tool](https://istanbul.js.org/).
It can be invoked with the ``--code-coverage`` parameter while testing, and
it generates a `.html` based output.

## Backend - Kotlin Spring
On the backend side we used Kotlin Spring Boot to build our Web API.
This framework includes a Unit test runner and a mocking library,
besides that we needed to include some more tools to test our application.
These are described below.

### Unit test runner
For running our unit tests, we used [JUnit 5](https://junit.org/junit5/),
which is the latest version of JUnit. Our unit tests are represented as
Kotlin classes, where all test case is organized into an `inner class`.

### Separation and mocking
To ensure separation we used two different libraries:
- [Mockito](https://site.mockito.org/) - used for all general mocking tasks on JVM based languages
- [MockK](https://mockk.io/) - used for mocking some Kotlin specific language elements, like first order functions

These libraries provided us with the tools to test our different components
in full separation, as well as in the Spring IoC container.


### Code coverage report
Sadly the basic configuration of Spring Boot doesn't include a code
coverage report generator. Since we needed it, we included [JaCoCo](https://www.jacoco.org/),
it can be invoked with the `jacocoTestReport` parameter, and it creates
a `.html` based output.

## Unit testing in GitHub Actions
One of our other tasks included implementing a GitHub Actions pipeline.
Our implementations includes a pull request validation check, which runs all unit tests 
and creates code coverage reports. These reports are later uploaded to our SonarCloud instance.