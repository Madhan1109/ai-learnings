# Skills category guide

Where to put common tools so the resume reads cleanly.

## Your question: Docker, Jenkins, ECR, Maven, JUnit

**Best single heading (recommended):**

```text
Build, Test & CI/CD: Maven, JUnit, Jenkins, Docker, Amazon ECR
```

| Skill | Why this category |
|-------|-------------------|
| **Maven** | Java build tool |
| **JUnit** | Unit / automated testing |
| **Jenkins** | CI/CD pipeline |
| **Docker** | Container images for services |
| **ECR** | AWS registry that stores those Docker images (pairs with ECS) |

### Optional split (if you want Cloud vs Build separate)

```text
Build & Test: Maven, JUnit
CI/CD & Containers: Jenkins, Docker, Amazon ECR
```

Put **ECR** next to **ECS** under Cloud if you prefer:

```text
Cloud / AWS: … ECS, ECR, …
Build, Test & CI/CD: Maven, JUnit, Jenkins, Docker
```

Do **not** put Maven/JUnit under “Methodology” or only under “Tools” — interviewers look for them under build/test/CI.

---

## Suggested full SKILLS block (drop-in)

```text
Backend: Java, Spring Boot, Spring Data JPA/Hibernate, REST APIs, Microservices, Python
Frontend: React, TypeScript, Vite, MUI, Tailwind CSS
Database / Cache: MySQL, PostgreSQL, SQL Server, FHIR, Amazon ElastiCache (Redis)
Cloud / AWS: Lambda, API Gateway, ECS, ECR, EC2, S3, CloudFront, SNS, SQS, Secrets Manager, EventBridge, VPC, IAM/OIDC, CloudWatch
Data / Platform: Databricks, Terraform, OpenAPI, Okta OIDC
Build, Test & CI/CD: Maven, JUnit, Jenkins, Docker, GitHub Actions, Git, Bitbucket
Methodology & tools: Agile, Jira, Confluence, IntelliJ, Cursor (AI-assisted development)
```
