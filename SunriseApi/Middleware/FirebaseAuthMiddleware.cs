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
        var authHeader = context.Request.Headers["Authorization"].ToString();

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
            var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
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