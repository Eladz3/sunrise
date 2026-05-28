using FirebaseAdmin;
using FirebaseAdmin.Auth;

public class FirebaseAuthMiddleware
{
    private readonly RequestDelegate _next;

    public FirebaseAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        if (FirebaseApp.DefaultInstance == null)
        {
            FirebaseInit.Initialize();
        }

        var authHeader = context.Request.Headers["Authorization"].ToString();

        if (context.Request.Path.StartsWithSegments("/swagger") ||
            context.Request.Path.StartsWithSegments("/health"))
        {
            await _next(context);
            return;
        }

        // ❌ BLOCK if missing header
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Missing or invalid Authorization header");
            return;
        }

        var token = authHeader.Substring("Bearer ".Length);

        try
        {
            Console.WriteLine("BEFORE VERIFY");

            var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);

            Console.WriteLine("AFTER VERIFY");
            context.Items["User"] = decoded;
        }
        catch (Exception ex)
        {
            Console.WriteLine("FIREBASE AUTH FAILED:");
            Console.WriteLine(ex.ToString());

            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid token");
            return;
        }

        await _next(context);
    }
}