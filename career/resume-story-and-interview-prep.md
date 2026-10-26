# Resume story + interview prep

Plain-English read of the full resume (`resume-java-python`): what it claims, what you did, and what to expect in interviews.

---

## The story your resume tells

You are an **Associate Technical Architect with 10+ years**, mainly a **Java / Spring Boot / microservices** engineer who designs and ships systems end-to-end (requirements → design → build → test → production).

Recently (**The Cigna Group**) you also show **full-stack + serverless cloud**: React UI, Python Lambdas, Redis, Databricks, Terraform, Okta.

Interviewers will see: **deep Java backend + newer AWS serverless / frontend at Cigna**.

---

## What you say you did (by section)

### Profile / summary
- Design and deliver **scalable multi-tier apps**
- Take work from **PoC → production**
- Strong in **Spring, REST, OOP, full SDLC**
- Work with **distributed / cross-functional teams**

### Skills brand
- **Core:** Java, Spring Boot, JPA/Hibernate, microservices, Python  
- **Data:** MySQL, PostgreSQL, SQL Server, FHIR, Redis  
- **AWS:** Lambda, API Gateway, ECS, EC2, SNS, SQS, S3, CloudFront, Secrets Manager, EventBridge, VPC, IAM/OIDC, CloudWatch  
- **Way of working:** Agile, Jira, Git/Bitbucket, Cursor  

Cigna bullets also imply: React, TypeScript, Terraform, Databricks, Okta, GitHub Actions, OpenAPI.

### Key highlights (career-wide claims)
- Java/Spring REST microservices and distributed design  
- Full SDLC + estimation + design  
- Code reviews, quality, SonarQube  
- AWS Lambda, SNS, SQS, ECS, ECR, CloudWatch; Jenkins → ECS/ECR  
- Docker; relational DBs + S3; performance tuning  

---

### The Cigna Group — what you claim you built

**Product:** Sales portfolio analytics — account managers / leadership monitor **client health and risk**.

1. Built the platform **from scratch** across **dev / test / prod**  
2. **React SPA** (TypeScript, Vite, MUI, Tailwind) + **Python on AWS Lambda** + **Terraform**  
3. **Okta** OIDC/PKCE: KPIs, client grid, filters, client detail, churn drivers  
4. Data path: **Databricks → daily Lambda load → Redis → API Gateway → CloudFront**  
5. Redis aggregates + REST APIs for manager vs leadership views  
6. **S3 + CloudFront**, VPC Lambdas, Secrets Manager, EventBridge, **GitHub Actions OIDC** deploy  
7. CI/CD for UI/API/infra; tests + CloudWatch; **prototype** env without breaking prod  

**One line:** You owned a greenfield analytics product: UI + serverless API + cache pipeline + infra/CI on AWS.

---

### Medtronic LABS
- Led Java/Spring Boot microservices for high-volume healthcare  
- FHIR integration layer (REST + FHIR) with third parties  
- QuickSight reporting backends; legacy → Java/Spring Boot migration  
- Hibernate/JPA + PostgreSQL; Maven, JUnit  
- Healthcare security (IAM, encryption, OAuth2/OIDC)  
- Logging, dashboards, alerting, performance/capacity  

### Roche
- Java/Spring Boot healthcare microservices on **AWS ECS**  
- REST APIs for clinical / patient workflows  
- Docker + ECS, autoscaling, load balancing; CloudWatch  
- JUnit / Spring Boot Test; Agile; US stakeholder support  
- Healthcare security / auth patterns  

### Oracle
- Java/Spring Boot integrations between internal systems  
- Full SDLC for services; JPA on PostgreSQL + MySQL; Redis caching  
- Code review, production support, API docs  

### Ericsson
- Led end-to-end Java/Spring Boot microservices on PostgreSQL  
- Team coordination + stakeholder requirements  
- Production support + performance tuning  

---

## What interviewers will assume you “own”

| Area | Expect to explain |
|------|-------------------|
| Java/Spring | Services, APIs, transactions, failures |
| Microservices | Boundaries, communication, consistency, deploy |
| AWS | Lambda vs ECS; SNS/SQS; IAM; observability |
| Cigna stack | Why Redis cache; why not live Databricks per click |
| Auth | Okta OIDC/PKCE vs OAuth2 for APIs |
| Healthcare | FHIR basics, PHI/security |
| Leadership | How you led/coordinated (Ericsson/Medtronic) |

---

## Topics & sample questions

### 1. Architecture (ATA title)
- Walk through **Cigna** end-to-end (browser → CloudFront → API → Redis → load → Databricks).  
- Why daily load/cache instead of Databricks on every UI click?  
- Cache miss / stale data / load job failure?  
- Lambda in VPC tradeoffs; **ECS vs Lambda** when?

### 2. Java / Spring (core depth)
- App layering; JPA N+1 and `@Transactional`.  
- REST design (errors, versioning, idempotency).  
- Sync REST vs SNS/SQS; SonarQube / review standards.

### 3. AWS (services you listed)
- Lambda triggers, timeouts, concurrency, IAM.  
- API Gateway + Lambda; SQS/SNS retries and DLQ.  
- ECS/ECR/Docker; S3 + CloudFront SPA; Secrets Manager; EventBridge; GitHub Actions OIDC; CloudWatch.

### 4. Cigna-specific
- Okta PKCE for SPA; role-based portfolio scope.  
- Redis key design; Terraform ownership; OpenAPI contracts.

### 5. Frontend (if they noticed React)
- How SPA calls API (auth, errors); stay honest about depth.

### 6. Healthcare / FHIR
- What is FHIR? Example resources; PHI controls you actually used.

### 7. Data / SQL
- Indexing, slow queries; Redis TTL/invalidation; Databricks batch vs online.

### 8. CI/CD & quality
- Jenkins → ECS vs GitHub Actions → Lambda/S3; JUnit / Spring Boot Test.

### 9. Soft / architect
- PoC → production story; estimation; mentoring/lead; a real tradeoff.

### 10. AI tooling (Cursor)
- How you use AI with review/security gates.

---

## Likely gotchas
1. OIDC vs OAuth2  
2. Whiteboard Cigna architecture  
3. ElastiCache in VPC — how Lambda reaches it  
4. FHIR — name resources + one real integration  
5. Design a new feature as ATA (export, DR, etc.)  
6. Python vs Java — when each  
7. Deep dive on **one** real security control (not copy-paste wording)  
8. Performance tuning — specific bottleneck + metric  

---

## Prep priority

| Priority | Focus |
|----------|--------|
| 1 | Whiteboard Cigna flow cold |
| 2 | Java/Spring + JPA + microservices |
| 3 | AWS Lambda/ECS/SQS/IAM with real examples |
| 4 | One Medtronic FHIR + one Roche ECS story |
| 5 | One leadership/delivery story with outcome |

---

## Cheat sheet answers (short)

### Cigna in 30 seconds
“Greenfield sales portfolio app: React SPA with Okta; Python Lambdas behind API Gateway/CloudFront; nightly Databricks load into Redis so the UI reads cache, not the warehouse; Terraform + GitHub Actions OIDC across env.”

### Why Redis
“Book-sized reads need low latency and predictable cost. Warehouse is source of truth once per day; API serves Redis; fail clearly if cache not ready.”

### Lambda vs ECS
“Cigna: event/schedule + HTTP APIs → Lambda. Roche: long-running healthcare services → Docker on ECS with scaling and health checks.”
