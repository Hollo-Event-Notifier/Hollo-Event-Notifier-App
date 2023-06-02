# Continuous Integration Report
## Description
We introduced GitHub Actions in our GitHub repository in order to have a continuous integration tool. Via this tool, we analyze whether the backend and the frontend of our application meets the following criteria:
- builds successfully 
- passes the written tests
- passes a quality gate defined in Sonarcloud.

### GitHub Actions specifications
- The CI runs each time a new *pull request* is issued.
- Jobs are defined in the [./github/workflows/pull_request_validation.yml](https://github.com/Hollo-Event-Notifier/Hollo-Event-Notifier-App/tree/development/.github/workflows) file, and are the following:
	- Frontend Build
	- Backend Build
	- Unit Tests & Sonarcloud Analysis

### Frontend Build
On the frontend side we used Angular to create our application.
To test whether the frontend of the application builds successfully, the CI runs the `npm run build` command in the `frontend` folder of the repository.

### Backend Build
On the backend side we used Kotlin Spring Boot to create our application, and the Gradle as a build tool.
To test whether the backend of the application builds successfully, the CI runs the `./gradlew build` command in the `backend` folder of the repository.

### Unit Tests
To run our tests on the **frontend** side, we use the [Karma test runner](https://karma-runner.github.io/latest/index.html), which made unit testing possible via the `npm run test` command.
For running our unit tests on the **backend** side, we used [JUnit 5](https://junit.org/junit5/) which made unit testing possible via the `./gradlew test` command.
In both cases we generated a **code coverage** report in order to later upload it into SonarCloud. During this job, a `lcov.info`  and a `jacocoTestReport.xml` file was generated respectively. 

### Sonarcloud Analysis
To have a tool for automated clean code checks and code feedback, we used Sonarcloud, which analyses our code and detects duplications, bugs, security hotspots and much more. 
This is done by the CI uploading our code automatically to Sonarcloud, also including the code coverage files to calculate coverage on our code.
The configuration for the code coverage calculation including exclusions for the analysis can be found in the [sonar-project.properties](https://github.com/Hollo-Event-Notifier/Hollo-Event-Notifier-App/blob/development/sonar-project.properties "sonar-project.properties") file in the `root` directory of our project.
