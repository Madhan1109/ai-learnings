# 🏗️ CRM System Class Diagram

## System Overview

This document provides detailed class diagrams and object relationships for the CRM system, showing the structure of both frontend and backend components.

## 🎯 Frontend Class Architecture

### React Component Hierarchy

```
App (Root Component)
├── Layout
│   ├── Sidebar
│   │   ├── NavigationMenu
│   │   └── UserProfile
│   └── Header
│       ├── SearchBar
│       ├── Notifications
│       └── UserMenu
├── Pages
│   ├── Dashboard
│   │   ├── MetricCard[]
│   │   ├── RecentActivityCard
│   │   └── AIInsightsCard
│   ├── Customers
│   │   ├── CustomerList
│   │   ├── CustomerDetails
│   │   └── CustomerForm
│   ├── Sales
│   │   ├── SalesPipeline
│   │   ├── SalesMetrics
│   │   └── OpportunityForm
│   ├── Analytics
│   │   ├── RevenueChart
│   │   ├── PredictiveAnalytics
│   │   └── AIInsights
│   ├── Notifications
│   │   └── NotificationDrawer
│   └── Settings
└── Shared Components
    ├── UI
    │   ├── LoadingSpinner
    │   ├── Snackbar
    │   └── Modal
    └── Charts
        ├── CustomerChart
        └── SalesChart
```

### Redux Store Structure

```
Root Store
├── authSlice
│   ├── user: User | null
│   ├── token: string | null
│   ├── isAuthenticated: boolean
│   └── loading: boolean
├── customerSlice
│   ├── customers: Customer[]
│   ├── selectedCustomer: Customer | null
│   ├── loading: boolean
│   └── error: string | null
├── salesSlice
│   ├── opportunities: Opportunity[]
│   ├── pipeline: PipelineStage[]
│   ├── metrics: SalesMetrics
│   └── loading: boolean
├── analyticsSlice
│   ├── insights: AIInsight[]
│   ├── predictions: Prediction[]
│   ├── charts: ChartData[]
│   └── loading: boolean
└── notificationSlice
    ├── notifications: Notification[]
    ├── unreadCount: number
    └── loading: boolean
```

## 🏢 Backend Class Architecture

### Microservices Class Structure

#### Customer Service Classes

```
CustomerServiceApplication
├── Controller Layer
│   ├── CustomerController
│   │   ├── +getAllCustomers(): ResponseEntity<List<Customer>>
│   │   ├── +getCustomerById(Long id): ResponseEntity<Customer>
│   │   ├── +createCustomer(CustomerDto customerDto): ResponseEntity<Customer>
│   │   ├── +updateCustomer(Long id, CustomerDto customerDto): ResponseEntity<Customer>
│   │   └── +deleteCustomer(Long id): ResponseEntity<Void>
│   └── ContactController
│       ├── +getCustomerContacts(Long customerId): ResponseEntity<List<Contact>>
│       └── +addContact(Long customerId, ContactDto contactDto): ResponseEntity<Contact>
├── Service Layer
│   ├── CustomerService
│   │   ├── -customerRepository: CustomerRepository
│   │   ├── +findAll(): List<Customer>
│   │   ├── +findById(Long id): Optional<Customer>
│   │   ├── +save(Customer customer): Customer
│   │   ├── +update(Long id, CustomerDto customerDto): Customer
│   │   └── +delete(Long id): void
│   └── ContactService
│       ├── -contactRepository: ContactRepository
│       ├── +findByCustomerId(Long customerId): List<Contact>
│       └── +save(Contact contact): Contact
├── Repository Layer
│   ├── CustomerRepository extends JpaRepository<Customer, Long>
│   │   ├── +findByEmail(String email): Optional<Customer>
│   │   ├── +findByCompany(String company): List<Customer>
│   │   └── +findByStatus(CustomerStatus status): List<Customer>
│   └── ContactRepository extends JpaRepository<Contact, Long>
│       ├── +findByCustomerId(Long customerId): List<Contact>
│       └── +findByType(ContactType type): List<Contact>
├── Entity Layer
│   ├── Customer
│   │   ├── -id: Long
│   │   ├── -name: String
│   │   ├── -email: String
│   │   ├── -phone: String
│   │   ├── -company: String
│   │   ├── -status: CustomerStatus
│   │   ├── -source: String
│   │   ├── -address: String
│   │   ├── -notes: String
│   │   ├── -assignedTo: User
│   │   ├── -tags: List<String>
│   │   ├── -leadScore: Integer
│   │   ├── -createdAt: LocalDateTime
│   │   ├── -updatedAt: LocalDateTime
│   │   └── -lastContact: LocalDateTime
│   └── Contact
│       ├── -id: Long
│       ├── -customer: Customer
│       ├── -type: ContactType
│       ├── -value: String
│       ├── -isPrimary: Boolean
│       └── -createdAt: LocalDateTime
└── DTO Layer
    ├── CustomerDto
    │   ├── +name: String
    │   ├── +email: String
    │   ├── +phone: String
    │   ├── +company: String
    │   ├── +status: String
    │   ├── +source: String
    │   ├── +address: String
    │   ├── +notes: String
    │   ├── +assignedToId: Long
    │   ├── +tags: List<String>
    │   └── +leadScore: Integer
    └── ContactDto
        ├── +type: String
        ├── +value: String
        └── +isPrimary: Boolean
```

#### Sales Service Classes

```
SalesServiceApplication
├── Controller Layer
│   ├── OpportunityController
│   │   ├── +getAllOpportunities(): ResponseEntity<List<Opportunity>>
│   │   ├── +getOpportunityById(Long id): ResponseEntity<Opportunity>
│   │   ├── +createOpportunity(OpportunityDto opportunityDto): ResponseEntity<Opportunity>
│   │   ├── +updateOpportunity(Long id, OpportunityDto opportunityDto): ResponseEntity<Opportunity>
│   │   ├── +deleteOpportunity(Long id): ResponseEntity<Void>
│   │   └── +updateStage(Long id, String stage): ResponseEntity<Opportunity>
│   └── PipelineController
│       ├── +getPipelineStages(): ResponseEntity<List<PipelineStage>>
│       ├── +getPipelineMetrics(): ResponseEntity<PipelineMetrics>
│       └── +updateStageOrder(List<PipelineStageDto> stages): ResponseEntity<List<PipelineStage>>
├── Service Layer
│   ├── OpportunityService
│   │   ├── -opportunityRepository: OpportunityRepository
│   │   ├── -customerService: CustomerService
│   │   ├── +findAll(): List<Opportunity>
│   │   ├── +findById(Long id): Optional<Opportunity>
│   │   ├── +save(Opportunity opportunity): Opportunity
│   │   ├── +update(Long id, OpportunityDto opportunityDto): Opportunity
│   │   ├── +delete(Long id): void
│   │   └── +updateStage(Long id, String stage): Opportunity
│   └── PipelineService
│       ├── -pipelineStageRepository: PipelineStageRepository
│       ├── +getAllStages(): List<PipelineStage>
│       ├── +getMetrics(): PipelineMetrics
│       └── +updateStageOrder(List<PipelineStageDto> stages): List<PipelineStage>
├── Repository Layer
│   ├── OpportunityRepository extends JpaRepository<Opportunity, Long>
│   │   ├── +findByCustomerId(Long customerId): List<Opportunity>
│   │   ├── +findByStage(String stage): List<Opportunity>
│   │   ├── +findByAssignedTo(Long userId): List<Opportunity>
│   │   └── +findByAmountBetween(BigDecimal min, BigDecimal max): List<Opportunity>
│   └── PipelineStageRepository extends JpaRepository<PipelineStage, Long>
│       ├── +findByOrderByOrderIndex(): List<PipelineStage>
│       └── +findByName(String name): Optional<PipelineStage>
├── Entity Layer
│   ├── Opportunity
│   │   ├── -id: Long
│   │   ├── -title: String
│   │   ├── -customer: Customer
│   │   ├── -amount: BigDecimal
│   │   ├── -stage: String
│   │   ├── -probability: BigDecimal
│   │   ├── -expectedCloseDate: LocalDate
│   │   ├── -assignedTo: User
│   │   ├── -description: String
│   │   ├── -createdAt: LocalDateTime
│   │   └── -updatedAt: LocalDateTime
│   └── PipelineStage
│       ├── -id: Long
│       ├── -name: String
│       ├── -orderIndex: Integer
│       ├── -color: String
│       └── -probability: BigDecimal
└── DTO Layer
    ├── OpportunityDto
    │   ├── +title: String
    │   ├── +customerId: Long
    │   ├── +amount: BigDecimal
    │   ├── +stage: String
    │   ├── +probability: BigDecimal
    │   ├── +expectedCloseDate: LocalDate
    │   ├── +assignedToId: Long
    │   └── +description: String
    └── PipelineStageDto
        ├── +name: String
        ├── +orderIndex: Integer
        ├── +color: String
        └── +probability: BigDecimal
```

#### Analytics Service Classes

```
AnalyticsServiceApplication
├── Controller Layer
│   ├── AnalyticsController
│   │   ├── +getRevenueAnalytics(): ResponseEntity<RevenueAnalytics>
│   │   ├── +getCustomerAnalytics(): ResponseEntity<CustomerAnalytics>
│   │   ├── +getSalesAnalytics(): ResponseEntity<SalesAnalytics>
│   │   └── +getPredictiveAnalytics(): ResponseEntity<PredictiveAnalytics>
│   └── AIInsightsController
│       ├── +getInsights(): ResponseEntity<List<AIInsight>>
│       ├── +generateInsights(): ResponseEntity<List<AIInsight>>
│       └── +getRecommendations(): ResponseEntity<List<Recommendation>>
├── Service Layer
│   ├── AnalyticsService
│   │   ├── -customerService: CustomerService
│   │   ├── -salesService: SalesService
│   │   ├── +getRevenueAnalytics(): RevenueAnalytics
│   │   ├── +getCustomerAnalytics(): CustomerAnalytics
│   │   ├── +getSalesAnalytics(): SalesAnalytics
│   │   └── +getPredictiveAnalytics(): PredictiveAnalytics
│   ├── AIInsightsService
│   │   ├── -tensorflowService: TensorflowService
│   │   ├── +generateInsights(): List<AIInsight>
│   │   ├── +getRecommendations(): List<Recommendation>
│   │   └── +analyzeSentiment(String text): SentimentAnalysis
│   └── TensorflowService
│       ├── -model: TensorflowModel
│       ├── +predictLeadScore(CustomerData data): Double
│       ├── +predictConversionProbability(OpportunityData data): Double
│       └── +analyzeTextSentiment(String text): SentimentResult
├── Repository Layer
│   ├── AnalyticsRepository extends JpaRepository<AnalyticsData, Long>
│   │   ├── +findByDateBetween(LocalDate start, LocalDate end): List<AnalyticsData>
│   │   └── +findByType(AnalyticsType type): List<AnalyticsData>
│   └── AIInsightRepository extends JpaRepository<AIInsight, Long>
│       ├── +findByType(InsightType type): List<AIInsight>
│       └── +findByDateCreatedAfter(LocalDateTime date): List<AIInsight>
├── Entity Layer
│   ├── AnalyticsData
│   │   ├── -id: Long
│   │   ├── -type: AnalyticsType
│   │   ├── -data: JsonNode
│   │   ├── -date: LocalDate
│   │   └── -createdAt: LocalDateTime
│   ├── AIInsight
│   │   ├── -id: Long
│   │   ├── -type: InsightType
│   │   ├── -title: String
│   │   ├── -description: String
│   │   ├── -confidence: Double
│   │   ├── -data: JsonNode
│   │   └── -createdAt: LocalDateTime
│   └── Recommendation
│       ├── -id: Long
│       ├── -type: RecommendationType
│       ├── -title: String
│       ├── -description: String
│       ├── -priority: Integer
│       ├── -actionItems: List<String>
│       └── -createdAt: LocalDateTime
└── DTO Layer
    ├── RevenueAnalytics
    │   ├── +totalRevenue: BigDecimal
    │   ├── +monthlyRevenue: List<MonthlyRevenue>
    │   ├── +growthRate: Double
    │   └── +projections: List<RevenueProjection>
    ├── CustomerAnalytics
    │   ├── +totalCustomers: Integer
    │   ├── +newCustomers: Integer
    │   ├── +customerRetentionRate: Double
    │   └── +customerSegments: List<CustomerSegment>
    ├── SalesAnalytics
    │   ├── +totalOpportunities: Integer
    │   ├── +conversionRate: Double
    │   ├── +averageDealSize: BigDecimal
    │   └── +pipelineVelocity: Double
    └── PredictiveAnalytics
        ├── +leadScorePredictions: List<LeadScorePrediction>
        ├── +conversionPredictions: List<ConversionPrediction>
        └── +revenueForecast: List<RevenueForecast>
```

#### Auth Service Classes

```
AuthServiceApplication
├── Controller Layer
│   ├── AuthController
│   │   ├── +login(LoginRequest request): ResponseEntity<AuthResponse>
│   │   ├── +register(RegisterRequest request): ResponseEntity<AuthResponse>
│   │   ├── +refreshToken(RefreshTokenRequest request): ResponseEntity<AuthResponse>
│   │   ├── +logout(): ResponseEntity<Void>
│   │   └── +validateToken(String token): ResponseEntity<Boolean>
│   └── UserController
│       ├── +getCurrentUser(): ResponseEntity<User>
│       ├── +updateProfile(UserUpdateRequest request): ResponseEntity<User>
│       └── +changePassword(PasswordChangeRequest request): ResponseEntity<Void>
├── Service Layer
│   ├── AuthService
│   │   ├── -userRepository: UserRepository
│   │   ├── -passwordEncoder: PasswordEncoder
│   │   ├── -jwtTokenProvider: JwtTokenProvider
│   │   ├── +authenticate(String email, String password): Authentication
│   │   ├── +login(LoginRequest request): AuthResponse
│   │   ├── +register(RegisterRequest request): AuthResponse
│   │   ├── +refreshToken(String refreshToken): AuthResponse
│   │   └── +logout(String token): void
│   ├── UserService
│   │   ├── -userRepository: UserRepository
│   │   ├── +findById(Long id): Optional<User>
│   │   ├── +findByEmail(String email): Optional<User>
│   │   ├── +save(User user): User
│   │   ├── +update(Long id, UserUpdateRequest request): User
│   │   └── +changePassword(Long id, String oldPassword, String newPassword): void
│   └── JwtTokenProvider
│       ├── -secretKey: String
│       ├── -expirationTime: Long
│       ├── +generateToken(Authentication authentication): String
│       ├── +generateRefreshToken(String email): String
│       ├── +getEmailFromToken(String token): String
│       ├── +validateToken(String token): Boolean
│       └── +getExpirationDateFromToken(String token): Date
├── Repository Layer
│   └── UserRepository extends JpaRepository<User, Long>
│       ├── +findByEmail(String email): Optional<User>
│       ├── +findByRole(Role role): List<User>
│       └── +existsByEmail(String email): Boolean
├── Entity Layer
│   ├── User
│   │   ├── -id: Long
│   │   ├── -email: String
│   │   ├── -password: String
│   │   ├── -firstName: String
│   │   ├── -lastName: String
│   │   ├── -role: Role
│   │   ├── -company: String
│   │   ├── -phone: String
│   │   ├── -avatarUrl: String
│   │   ├── -isActive: Boolean
│   │   ├── -lastLogin: LocalDateTime
│   │   ├── -createdAt: LocalDateTime
│   │   └── -updatedAt: LocalDateTime
│   └── Role
│       ├── -id: Long
│       ├── -name: String
│       ├── -description: String
│       └── -permissions: List<Permission>
└── DTO Layer
    ├── LoginRequest
    │   ├── +email: String
    │   └── +password: String
    ├── RegisterRequest
    │   ├── +email: String
    │   ├── +password: String
    │   ├── +firstName: String
    │   ├── +lastName: String
    │   ├── +company: String
    │   └── +phone: String
    ├── AuthResponse
    │   ├── +token: String
    │   ├── +refreshToken: String
    │   ├── +user: UserDto
    │   └── +expiresIn: Long
    ├── UserDto
    │   ├── +id: Long
    │   ├── +email: String
    │   ├── +firstName: String
    │   ├── +lastName: String
    │   ├── +role: String
    │   ├── +company: String
    │   ├── +phone: String
    │   └── +avatarUrl: String
    └── UserUpdateRequest
        ├── +firstName: String
        ├── +lastName: String
        ├── +company: String
        └── +phone: String
```

#### Notification Service Classes

```
NotificationServiceApplication
├── Controller Layer
│   ├── NotificationController
│   │   ├── +getUserNotifications(): ResponseEntity<List<Notification>>
│   │   ├── +markAsRead(Long notificationId): ResponseEntity<Void>
│   │   ├── +markAllAsRead(): ResponseEntity<Void>
│   │   └── +deleteNotification(Long notificationId): ResponseEntity<Void>
│   └── WebSocketController
│       ├── +handleWebSocketConnection(Session session): void
│       ├── +handleWebSocketMessage(String message, Session session): void
│       └── +handleWebSocketDisconnection(Session session): void
├── Service Layer
│   ├── NotificationService
│   │   ├── -notificationRepository: NotificationRepository
│   │   ├── -emailService: EmailService
│   │   ├── -smsService: SmsService
│   │   ├── +createNotification(NotificationRequest request): Notification
│   │   ├── +getUserNotifications(Long userId): List<Notification>
│   │   ├── +markAsRead(Long notificationId): void
│   │   ├── +markAllAsRead(Long userId): void
│   │   └── +deleteNotification(Long notificationId): void
│   ├── EmailService
│   │   ├── -javaMailSender: JavaMailSender
│   │   ├── -templateEngine: TemplateEngine
│   │   ├── +sendEmail(String to, String subject, String content): void
│   │   ├── +sendWelcomeEmail(User user): void
│   │   └── +sendPasswordResetEmail(User user, String resetToken): void
│   ├── SmsService
│   │   ├── -twilioClient: Twilio
│   │   ├── +sendSms(String to, String message): void
│   │   └── +sendVerificationCode(String to, String code): void
│   └── WebSocketService
│       ├── -sessions: Map<String, Session>
│       ├── +addSession(String userId, Session session): void
│       ├── +removeSession(String userId): void
│       ├── +sendNotification(String userId, Notification notification): void
│       └── +broadcastNotification(Notification notification): void
├── Repository Layer
│   └── NotificationRepository extends JpaRepository<Notification, Long>
│       ├── +findByUserId(Long userId): List<Notification>
│       ├── +findByUserIdAndReadFalse(Long userId): List<Notification>
│       └── +countByUserIdAndReadFalse(Long userId): Long
├── Entity Layer
│   ├── Notification
│   │   ├── -id: Long
│   │   ├── -userId: Long
│   │   ├── -type: NotificationType
│   │   ├── -title: String
│   │   ├── -message: String
│   │   ├── -data: JsonNode
│   │   ├── -isRead: Boolean
│   │   ├── -isEmailSent: Boolean
│   │   ├── -isSmsSent: Boolean
│   │   └── -createdAt: LocalDateTime
│   └── NotificationTemplate
│       ├── -id: Long
│       ├── -name: String
│       ├── -type: NotificationType
│       ├── -subject: String
│       ├── -body: String
│       ├── -emailTemplate: String
│       └── -smsTemplate: String
└── DTO Layer
    ├── NotificationRequest
    │   ├── +userId: Long
    │   ├── +type: String
    │   ├── +title: String
    │   ├── +message: String
    │   ├── +data: Map<String, Object>
    │   ├── +sendEmail: Boolean
    │   └── +sendSms: Boolean
    ├── NotificationDto
    │   ├── +id: Long
    │   ├── +type: String
    │   ├── +title: String
    │   ├── +message: String
    │   ├── +data: Map<String, Object>
    │   ├── +isRead: Boolean
    │   └── +createdAt: LocalDateTime
    └── NotificationSettings
        ├── +emailNotifications: Boolean
        ├── +smsNotifications: Boolean
        ├── +pushNotifications: Boolean
        └── +notificationTypes: List<String>
```

## 🔄 Database Entity Relationships

### Entity Relationship Diagram

```
User (1) ──── (N) Customer
User (1) ──── (N) Opportunity
User (1) ──── (N) Notification

Customer (1) ──── (N) Contact
Customer (1) ──── (N) Opportunity
Customer (1) ──── (N) Activity

Opportunity (N) ──── (1) PipelineStage
Opportunity (N) ──── (1) Customer
Opportunity (N) ──── (1) User

Notification (N) ──── (1) User
Notification (N) ──── (1) NotificationTemplate

AnalyticsData (N) ──── (1) AnalyticsType
AIInsight (N) ──── (1) InsightType
Recommendation (N) ──── (1) RecommendationType
```

### Database Schema Classes

```
Database Schema
├── Tables
│   ├── users
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── email (VARCHAR(255) UNIQUE NOT NULL)
│   │   ├── password_hash (VARCHAR(255) NOT NULL)
│   │   ├── first_name (VARCHAR(100) NOT NULL)
│   │   ├── last_name (VARCHAR(100) NOT NULL)
│   │   ├── role (VARCHAR(20) DEFAULT 'user')
│   │   ├── company (VARCHAR(255))
│   │   ├── phone (VARCHAR(20))
│   │   ├── avatar_url (VARCHAR(500))
│   │   ├── is_active (BOOLEAN DEFAULT true)
│   │   ├── last_login (TIMESTAMP)
│   │   ├── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   │   └── updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── customers
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── name (VARCHAR(255) NOT NULL)
│   │   ├── email (VARCHAR(255) UNIQUE NOT NULL)
│   │   ├── phone (VARCHAR(20))
│   │   ├── company (VARCHAR(255))
│   │   ├── status (VARCHAR(20) DEFAULT 'lead')
│   │   ├── source (VARCHAR(50))
│   │   ├── address (TEXT)
│   │   ├── notes (TEXT)
│   │   ├── assigned_to (BIGINT REFERENCES users(id))
│   │   ├── tags (TEXT[])
│   │   ├── lead_score (INTEGER DEFAULT 0)
│   │   ├── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   │   ├── updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   │   └── last_contact (TIMESTAMP)
│   ├── opportunities
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── title (VARCHAR(255) NOT NULL)
│   │   ├── customer_id (BIGINT REFERENCES customers(id))
│   │   ├── amount (DECIMAL(15,2) NOT NULL)
│   │   ├── stage (VARCHAR(50) DEFAULT 'prospecting')
│   │   ├── probability (DECIMAL(3,2) DEFAULT 0.0)
│   │   ├── expected_close_date (DATE)
│   │   ├── assigned_to (BIGINT REFERENCES users(id))
│   │   ├── description (TEXT)
│   │   ├── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   │   └── updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── contacts
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── customer_id (BIGINT REFERENCES customers(id))
│   │   ├── type (VARCHAR(50) NOT NULL)
│   │   ├── value (VARCHAR(255) NOT NULL)
│   │   ├── is_primary (BOOLEAN DEFAULT false)
│   │   └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── activities
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── type (VARCHAR(50) NOT NULL)
│   │   ├── subject (VARCHAR(255) NOT NULL)
│   │   ├── description (TEXT)
│   │   ├── customer_id (BIGINT REFERENCES customers(id))
│   │   ├── opportunity_id (BIGINT REFERENCES opportunities(id))
│   │   ├── assigned_to (BIGINT REFERENCES users(id))
│   │   ├── due_date (TIMESTAMP)
│   │   ├── completed_at (TIMESTAMP)
│   │   └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── notifications
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── user_id (BIGINT REFERENCES users(id))
│   │   ├── type (VARCHAR(50) NOT NULL)
│   │   ├── title (VARCHAR(255) NOT NULL)
│   │   ├── message (TEXT)
│   │   ├── data (JSONB)
│   │   ├── is_read (BOOLEAN DEFAULT false)
│   │   ├── is_email_sent (BOOLEAN DEFAULT false)
│   │   ├── is_sms_sent (BOOLEAN DEFAULT false)
│   │   └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── analytics_data
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── type (VARCHAR(50) NOT NULL)
│   │   ├── data (JSONB)
│   │   ├── date (DATE)
│   │   └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   ├── ai_insights
│   │   ├── id (BIGSERIAL PRIMARY KEY)
│   │   ├── type (VARCHAR(50) NOT NULL)
│   │   ├── title (VARCHAR(255) NOT NULL)
│   │   ├── description (TEXT)
│   │   ├── confidence (DECIMAL(3,2))
│   │   ├── data (JSONB)
│   │   └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
│   └── recommendations
│       ├── id (BIGSERIAL PRIMARY KEY)
│       ├── type (VARCHAR(50) NOT NULL)
│       ├── title (VARCHAR(255) NOT NULL)
│       ├── description (TEXT)
│       ├── priority (INTEGER DEFAULT 0)
│       ├── action_items (JSONB)
│       └── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
└── Indexes
    ├── idx_users_email (users.email)
    ├── idx_customers_email (customers.email)
    ├── idx_customers_assigned_to (customers.assigned_to)
    ├── idx_opportunities_customer_id (opportunities.customer_id)
    ├── idx_opportunities_assigned_to (opportunities.assigned_to)
    ├── idx_opportunities_stage (opportunities.stage)
    ├── idx_contacts_customer_id (contacts.customer_id)
    ├── idx_activities_customer_id (activities.customer_id)
    ├── idx_activities_assigned_to (activities.assigned_to)
    ├── idx_notifications_user_id (notifications.user_id)
    ├── idx_notifications_is_read (notifications.is_read)
    ├── idx_analytics_data_type (analytics_data.type)
    ├── idx_analytics_data_date (analytics_data.date)
    ├── idx_ai_insights_type (ai_insights.type)
    └── idx_recommendations_type (recommendations.type)
```

## 🔧 Configuration Classes

### Application Configuration

```
Configuration Classes
├── SecurityConfig
│   ├── +passwordEncoder(): PasswordEncoder
│   ├── +jwtAuthenticationFilter(): JwtAuthenticationFilter
│   ├── +jwtAuthorizationFilter(): JwtAuthorizationFilter
│   └── +securityFilterChain(): SecurityFilterChain
├── WebConfig
│   ├── +corsConfigurationSource(): CorsConfigurationSource
│   ├── +webMvcConfigurer(): WebMvcConfigurer
│   └── +objectMapper(): ObjectMapper
├── RedisConfig
│   ├── +redisTemplate(): RedisTemplate<String, Object>
│   ├── +redisConnectionFactory(): RedisConnectionFactory
│   └── +cacheManager(): CacheManager
├── KafkaConfig
│   ├── +producerFactory(): ProducerFactory<String, Object>
│   ├── +consumerFactory(): ConsumerFactory<String, Object>
│   ├── +kafkaTemplate(): KafkaTemplate<String, Object>
│   └── +kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, Object>
└── SwaggerConfig
    ├── +api(): ApiInfo
    ├── +customImplementation(): CustomImplementation
    └── +apiSelector(): ApiSelectorBuilder
```

## 🔐 Security Class Architecture

### JWT Token Management

```
JwtTokenProvider
├── Token Generation
│   ├── +generateToken(Authentication authentication): String
│   ├── +generateRefreshToken(String email): String
│   └── +generateAccessToken(String email): String
├── Token Validation
│   ├── +validateToken(String token): Boolean
│   ├── +getEmailFromToken(String token): String
│   └── +getExpirationDateFromToken(String token): Date
├── Token Claims
│   ├── +getClaimsFromToken(String token): Claims
│   ├── +getAllClaimsFromToken(String token): Claims
│   └── +isTokenExpired(String token): Boolean
└── Token Configuration
    ├── -secretKey: String
    ├── -expirationTime: Long
    ├── -refreshExpirationTime: Long
    └── -signatureAlgorithm: SignatureAlgorithm
```

### Security Filters

```
JwtAuthenticationFilter
├── Authentication Process
│   ├── +doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain): void
│   ├── +getJwtFromRequest(HttpServletRequest request): String
│   └── +setAuthentication(String token): void
├── Token Processing
│   ├── +validateToken(String token): Boolean
│   ├── +getUsernameFromToken(String token): String
│   └── +getAuthentication(String token): UsernamePasswordAuthenticationToken
└── Error Handling
    ├── +handleAuthenticationError(HttpServletResponse response, String message): void
    └── +handleAuthorizationError(HttpServletResponse response, String message): void
```

## 📊 Data Transfer Objects (DTOs)

### Request/Response DTOs

```
DTO Structure
├── Request DTOs
│   ├── LoginRequest
│   │   ├── +email: String
│   │   └── +password: String
│   ├── RegisterRequest
│   │   ├── +email: String
│   │   ├── +password: String
│   │   ├── +firstName: String
│   │   ├── +lastName: String
│   │   ├── +company: String
│   │   └── +phone: String
│   ├── CustomerRequest
│   │   ├── +name: String
│   │   ├── +email: String
│   │   ├── +phone: String
│   │   ├── +company: String
│   │   ├── +status: String
│   │   ├── +source: String
│   │   ├── +address: String
│   │   ├── +notes: String
│   │   ├── +assignedToId: Long
│   │   ├── +tags: List<String>
│   │   └── +leadScore: Integer
│   └── OpportunityRequest
│       ├── +title: String
│       ├── +customerId: Long
│       ├── +amount: BigDecimal
│       ├── +stage: String
│       ├── +probability: BigDecimal
│       ├── +expectedCloseDate: LocalDate
│       ├── +assignedToId: Long
│       └── +description: String
├── Response DTOs
│   ├── AuthResponse
│   │   ├── +token: String
│   │   ├── +refreshToken: String
│   │   ├── +user: UserDto
│   │   └── +expiresIn: Long
│   ├── CustomerResponse
│   │   ├── +id: Long
│   │   ├── +name: String
│   │   ├── +email: String
│   │   ├── +phone: String
│   │   ├── +company: String
│   │   ├── +status: String
│   │   ├── +source: String
│   │   ├── +address: String
│   │   ├── +notes: String
│   │   ├── +assignedTo: UserDto
│   │   ├── +tags: List<String>
│   │   ├── +leadScore: Integer
│   │   ├── +contacts: List<ContactDto>
│   │   ├── +opportunities: List<OpportunityDto>
│   │   ├── +createdAt: LocalDateTime
│   │   ├── +updatedAt: LocalDateTime
│   │   └── +lastContact: LocalDateTime
│   └── OpportunityResponse
│       ├── +id: Long
│       ├── +title: String
│       ├── +customer: CustomerDto
│       ├── +amount: BigDecimal
│       ├── +stage: String
│       ├── +probability: BigDecimal
│       ├── +expectedCloseDate: LocalDate
│       ├── +assignedTo: UserDto
│       ├── +description: String
│       ├── +createdAt: LocalDateTime
│       └── +updatedAt: LocalDateTime
└── Analytics DTOs
    ├── RevenueAnalytics
    │   ├── +totalRevenue: BigDecimal
    │   ├── +monthlyRevenue: List<MonthlyRevenue>
    │   ├── +growthRate: Double
    │   └── +projections: List<RevenueProjection>
    ├── CustomerAnalytics
    │   ├── +totalCustomers: Integer
    │   ├── +newCustomers: Integer
    │   ├── +customerRetentionRate: Double
    │   └── +customerSegments: List<CustomerSegment>
    └── SalesAnalytics
        ├── +totalOpportunities: Integer
        ├── +conversionRate: Double
        ├── +averageDealSize: BigDecimal
        └── +pipelineVelocity: Double
```

This class diagram provides a comprehensive view of the CRM system's object-oriented design, showing the relationships between classes, their responsibilities, and how they interact to deliver the complete CRM functionality. 