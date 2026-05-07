using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

public static class FirebaseInit
{
    public static void Initialize()
    {
        if (FirebaseApp.DefaultInstance != null)
            return;

        var json = Environment.GetEnvironmentVariable("FIREBASE_SERVICE_ACCOUNT");

        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromJson(json)
        });
    }
}