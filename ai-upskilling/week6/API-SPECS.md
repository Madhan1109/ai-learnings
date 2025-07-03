# LMS API Specifications

## User Service
| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/users/register | Register a new user |
| POST   | /api/auth/login     | Login and receive JWT token |
| GET    | /api/users/by-username/{username} | Get user by username (JWT required) |
| GET    | /api/users/by-email/{email} | Get user by email (JWT required) |

## Course Service
| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/courses        | Create a new course |
| PUT    | /api/courses/{id}   | Update a course (increments version) |
| DELETE | /api/courses/{id}   | Delete a course |
| GET    | /api/courses/{id}   | Get course by ID |
| GET    | /api/courses        | List all courses |
| GET    | /api/courses/search?title=... | Search by title |
| GET    | /api/courses/search?tag=...   | Search by tag |
| POST   | /api/courses/content/upload   | Upload course content file |

## Enrollment Service
| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/enrollments    | Enroll a user in a course |
| PUT    | /api/enrollments/{id}/complete?certificateUrl=... | Mark enrollment as completed and attach certificate |
| GET    | /api/enrollments/user/{userId} | Get enrollments by user |
| GET    | /api/enrollments/course/{courseId} | Get enrollments by course |
| GET    | /api/enrollments/{id} | Get enrollment by ID |
| GET    | /api/enrollments      | List all enrollments |
| POST   | /api/progress         | Mark lesson as completed (with quiz score) |
| GET    | /api/progress/enrollment/{enrollmentId} | Get progress by enrollment |
| GET    | /api/progress/lesson/{lessonId} | Get progress by lesson |
| GET    | /api/progress         | List all progress records |

## Assessment Service
| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/quizzes         | Create a new quiz |
| PUT    | /api/quizzes/{id}    | Update a quiz |
| DELETE | /api/quizzes/{id}    | Delete a quiz |
| GET    | /api/quizzes/{id}    | Get quiz by ID |
| GET    | /api/quizzes/course/{courseId} | Get quizzes by course |
| GET    | /api/quizzes         | List all quizzes |
| POST   | /api/questions       | Create a new question |
| PUT    | /api/questions/{id}  | Update a question |
| DELETE | /api/questions/{id}  | Delete a question |
| GET    | /api/questions/{id}  | Get question by ID |
| GET    | /api/questions/quiz/{quizId} | Get questions by quiz |
| GET    | /api/questions       | List all questions |

## Notification Service
| Method | Path | Description |
|--------|------|-------------|
| POST   | /api/notifications   | Send a notification |
| GET    | /api/notifications/{id} | Get notification by ID |
| GET    | /api/notifications   | List all notifications |
| WebSocket | /ws (STOMP)      | Real-time chat and announcements |

## API Gateway
| Method | Path | Description |
|--------|------|-------------|
| Any    | /api/*              | Routes to appropriate microservice |

---
**Note:** All APIs are RESTful. GraphQL is not implemented in this project. 