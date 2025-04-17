# Expenny – The Subscription Tracker 💸

Track, manage, and stay on top of your subscriptions with real-time insights and a powerful C#/.NET backend.
A full-stack Next.js + ASP.NET Core Web API project built to showcase professional software design patterns, clean architecture, and scalable backend logic.

🔗 **Live Demo** (Coming Soon)
🧠 **Portfolio Goal**: Showcase .NET backend + full-stack integration

---

## 📌 Overview

Expenny lets users monitor recurring expenses like Netflix, Spotify, memberships etc. After logging in, users can view a live analytics dashboard, add new subscriptions, and update or delete existing ones. This rebuilt version features:

- Secure JWT authentication (ASP.NET Identity)
- SQL-backed persistence (EF Core + SQLite)
- Clean service and repository layers
- React frontend powered by Next.js App Router

---

## 🚀 Features

🔐 **User Authentication**
- Register + login via email and password
- JWT-based token auth with protected endpoints

📊 **Analytics Dashboard**
- Total monthly cost
- Total yearly cost
- Average monthly spending
- Active subscription count
- Top spending category
- Most expensive subscription
- Upcoming bills in the next 7 days

🧩 **Subscription CRUD**
- Add, update, and delete subscriptions
- Filter data by userId (multi-user support)

🛠️ **Built Using**
- **Frontend**: Next.js, React
- **Backend**: ASP.NET Core Web API (C#), Entity Framework Core
- **Database**: SQLite (dev), Azure SQL (deploy target)
- **Auth**: ASP.NET Identity + JWT
- **Testing & Docs**: Swagger UI
- **Deployment**: Azure (planned)

---

## 🧠 Backend Highlights

### Clean Architecture

- **Controllers** handle routing and validation
- **Repositories** abstract DB logic
- **DTOs** protect input/output shapes
- **Service layer** runs calculations and business logic

### Analytics Endpoint Logic

When a user requests analytics, the backend:

1. Extracts their user ID from the JWT token
2. Fetches their subscriptions from the database
3. Calculates total costs, averages, and top categories
4. Returns a clean `SubscriptionAnalyticsDTO` to the frontend

```csharp
[HttpGet]
public ActionResult<SubscriptionAnalyticsDTO> GetAnalytics()
{
    var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
    var subs = _repo.GetByUserId(userId).ToList();
    var result = _analytics.CalculateMetrics(subs);
    return Ok(result);
}
```

---

## 📈 What I’ve Learned (So Far)

- ✅ EF Core + SQL modeling and migrations
- ✅ Repository & DTO patterns for clean code separation
- ✅ Auth with JWT and secure route protection
- ✅ Swagger UI for live API testing
- ✅ Full React + fetch integration replacing Firebase
- ✅ CORS, tokens, and local dev debugging flow
- ✅ Structured project layout with `Services/`, `Data/`, `Controllers/`, and `Models/` folders

---

## 🚧 In Progress

- ☁️ Deploy backend + database to Azure
- 📊 Add charts for expense trends
- 🔔 Reminder system for upcoming charges
- ✨ Add unit tests for services and controllers
