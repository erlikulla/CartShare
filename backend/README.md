# CartShare Backend

Spring Boot backend API for CartShare grocery shopping application.

## Technology Stack

- Java 17
- Spring Boot 3.2.0
- PostgreSQL
- Spring Security with JWT
- JPA/Hibernate
- Maven

## Prerequisites

- JDK 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Database Setup

1. Install PostgreSQL
2. Create database:
```bash
psql -U postgres
CREATE DATABASE cartshare;
```

3. Run the schema:
```bash
psql -U postgres -d cartshare -f database/schema.sql
```

Or let Spring Boot auto-create tables (configured in `application.yml`).

## Configuration

Update `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cartshare
    username: YOUR_USERNAME
    password: YOUR_PASSWORD

jwt:
  secret: YOUR_SECRET_KEY_AT_LEAST_256_BITS
  expiration: 86400000
```

## Running the Application

```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Or using the Maven wrapper
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Households
- `POST /api/households/create` - Create household
- `POST /api/households/join` - Join household

### Grocery Items
- `POST /api/items` - Create item
- `GET /api/items/active` - Get active items
- `GET /api/items/history` - Get purchase history
- `PATCH /api/items/{id}/claim` - Claim/unclaim item
- `PATCH /api/items/{id}/complete` - Mark as purchased
- `DELETE /api/items/{id}` - Delete item

## Testing with curl

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Create household (replace TOKEN)
curl -X POST http://localhost:8080/api/households/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"My Household"}'

# Add item
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Milk","quantity":2,"category":"Dairy"}'
```
