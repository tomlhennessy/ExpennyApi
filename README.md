# Expenny API – C#/.NET Backend

This is the backend rebuild of my subscription tracker app, [Expenny](https://github.com/tomlhennessy/expenny), originally built using Firebase.

Now powered by:
- ✅ ASP.NET Core Web API
- ✅ Entity Framework Core + SQLite
- ✅ RESTful CRUD for subscriptions
- ✅ Repositories, DTOs, and service layer patterns
- ✅ Ready for auth integration (Week 2)

## Endpoints

- `GET /api/subscriptions/{userId}` – Get subscriptions for user
- `POST /api/subscriptions` – Add subscription
- `PUT /api/subscriptions/{id}` – Update subscription
- `DELETE /api/subscriptions/{id}` – Delete subscription

## Next Up

Add:
- ASP.NET Identity or JWT auth
- Analytics service (C# port of Firebase logic)
- Deployment to Azure

