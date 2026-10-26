#manual
## SKILLS (overall resume — Java career + Cigna)

**Backend:** Java, Spring Boot, Spring Data JPA / Hibernate, REST APIs, Microservices, Python  
**Frontend:** React, TypeScript, Vite, MUI, Tailwind CSS  
**Database / Cache:** MySQL, PostgreSQL, SQL Server, FHIR, Amazon ElastiCache (Redis)  
**Cloud / AWS:** API Gateway, Lambda, ECS, EC2, SNS, SQS, S3, CloudFront, Secrets Manager, EventBridge, VPC, IAM / OIDC, CloudWatch  
**Data / Analytics:** Databricks (SQL Statements API)  
**Auth / Security:** Okta OIDC (PKCE), JWT  
**Infra / DevOps:** Terraform, GitHub Actions, Git, Bitbucket  
**API / Contracts:** OpenAPI  
**Methodology & tools:** Agile, Jira, Confluence, IntelliJ, Cursor (AI-assisted development)

### Notes / suggestions (for you — delete before pasting to resume)
- Keep **Java + Spring** first; you have 10+ years — that is your primary brand. Put **React / Python / serverless** next as recent Cigna depth.
- Prefer **Spring Data JPA** over “Spring JPA”; **Git** / **Bitbucket** / **GitHub** (Cigna used GitHub Actions).
- **FHIR** — if this was FHIR APIs or FHIR-shaped data (not a product named “FHIR DB”), write **FHIR** or **FHIR APIs** so recruiters understand.
- Avoid listing every AWS service if space is tight; a short line like **AWS (Lambda, API Gateway, S3, CloudFront, ElastiCache, ECS, EC2, SNS/SQS)** scans better.
- Tools like IntelliJ / Jira / Confluence are optional on modern resumes; keep if your template has a Tools row.
- Do **not** duplicate the full skills dump under every project — use this block once at the top of the resume; under Cigna keep only project-relevant keywords (section below).

---

# Client Health Monitor — Resume Key Points

*The Cigna Group · Full-stack · AWS Serverless*  
*Saved for resume / contribution updates — professional wording (no internal jargon).*

## Project title

**Client Health Monitor — Sales Portfolio Analytics Platform**

## Summary (one sentence above bullets)

Built from the ground up a sales portfolio analytics platform at The Cigna Group that helps account managers and leadership monitor client health and risk—delivering a React SPA, Python/AWS serverless APIs, and a Databricks-to-Redis data pipeline across multi-environment releases.

## Skills (Cigna / this project only — for under the job entry)

React, TypeScript, Vite, MUI, Tailwind CSS, Python, AWS Lambda, API Gateway, ElastiCache Redis, S3, CloudFront, Secrets Manager, EventBridge, VPC, IAM/OIDC, Terraform, Databricks, Okta, OpenAPI, GitHub Actions, Cursor (AI-assisted development)

## Experience bullets

- Built from the ground up a multi-environment (dev/test/prod) sales portfolio analytics platform using **React, TypeScript, Vite, MUI, Tailwind**, and **Python** on **AWS Lambda**, with infrastructure as code in **Terraform**.
- Developed an authenticated SPA with **Okta OIDC (PKCE)** featuring KPI dashboards, client grids, advanced filters/search, client-detail domain metrics, and churn-driver views.
- Implemented a serverless data path: **Databricks** → scheduled **Lambda** load → **ElastiCache Redis** → **API Gateway** → **CloudFront**, with OpenAPI contracts and cache-ready error handling.
- Designed Redis portfolio aggregates and REST APIs for account-manager and leadership views (summary, priority clients, risk, renewals, map, client detail, KPI history).
- Owned **S3** static hosting, **CloudFront** UI/API routing, **VPC** Lambdas, **Secrets Manager**, **EventBridge** schedules, and **GitHub Actions OIDC** deploys (no long-lived AWS keys).
- Delivered CI/CD across UI/API/infra repos; validated load/API Lambdas with tests and CloudWatch; stood up an isolated **S3/CloudFront** prototype pipeline for UX validation without impacting production.
