# Stress testing

## Description

We implemented stress testing in our application. The stress testing focuses mainly on the response time of the server on each endpoint.

### Framework

We decided to use [Apache JMeter](https://jmeter.apache.org/), since it is a simple and widely used stress testing framework. It fits our use case too, because it can make multiple requests on the same endpoint, even for multiple users.

## Testing

### What is tested

All endpoints represented in `swagger.yml` are stress tested.
- `POST /users/login`
- `GET /users/check-token`
- `GET /events`
- `PUT /events`
- `GET /events/{id}`
- `POST /events/{id}`
- `DELETE /events/{id}`

### How the tests work

Due to the nature of these endpoints, they cannot be independently tested. Firstly all the other endpoints require authentication, so a login is required in advance. Then to do anything specific to an event by id, we should acquire it first, and that requires requesing all events first (event id is generated on the go, we cannot use the same id).

So because of these constrains, our tests follow the hierarchy below:
- login
    - check token
    - put events
    - get events
        - get event by id
        - post event by id
        - delete event by id

The children tests run only, if the parent request returned OK. It is also necessary to store the id, so when the get events request is successful, the first event's id is stored, and used by the following requests.

In JMeter the tests can be configured to run for multiple users. Then each test chain runs for each user.

There are to assertions ordered to each test step: Duration Assertion and Response Assertion. A test fails for both, but continues, when there is only Duration Assertion.

### Constraints

Since stress testing results strongly depend on the hardware on which the application is running, it is difficult to decide, when should a test fail.

We decided on some parameters: **50ms** response time and **100 concurrent users**. These are based on our estimation considering the use case of the application. These values can be configured in JMeter.

## Results and Evaluation

The test results can be exported in a `.xml` file, but it is not so fancy. There are some external tools that can be used to visualize it, but in our case it was not necessary. Stress testing is fast and the simplest way to check the results is to rerun them.

We ran the stress tests on an average laptop, and we found out, that most of the requests fit in the 50ms margin for 100 concurrent users, except for login, which took around 60-70ms, so the tests for the login endpoint failed. With this information we could improve our application to make login faster, or we could modify our tests. But again, there would not be a problem if we used a more powerful hardware.

### What could be done

Stress tests could be automated, even for GitHub actions, but would not make sense for our use case.

### Conclusion

Stress testing in this phase of development is not necessary, but it will become handy, when we start hosting on a dedicated server.