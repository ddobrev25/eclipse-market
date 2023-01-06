using Eclipse_Market;
using Eclipse_Market.Hubs;
using Eclipse_Market.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<EclipseMarketDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateActor = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // If the request is for our hub...
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/chatHub")))
            {
                // Read the token out of the query string
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UserGet", policy =>
        policy.RequireClaim("RoleClaim", "UserGetClaim"));
    options.AddPolicy("UserUpdate", policy =>
        policy.RequireClaim("RoleClaim", "UserUpdateClaim"));
    options.AddPolicy("UserDelete", policy =>
        policy.RequireClaim("RoleClaim", "UserDeleteClaim"));

    options.AddPolicy("ListingGet", policy =>
        policy.RequireClaim("RoleClaim", "ListingGetClaim"));
    options.AddPolicy("ListingUpdate", policy =>
        policy.RequireClaim("RoleClaim", "ListingUpdateClaim"));
    options.AddPolicy("ListingDelete", policy =>
        policy.RequireClaim("RoleClaim", "ListingDeleteClaim"));

    options.AddPolicy("RoleGet", policy =>
        policy.RequireClaim("RoleClaim", "RoleGetClaim"));
    options.AddPolicy("RoleAdd", policy =>
        policy.RequireClaim("RoleClaim", "RoleAddClaim"));
    options.AddPolicy("RoleUpdate", policy =>
        policy.RequireClaim("RoleClaim", "RoleUpdateClaim"));
    options.AddPolicy("RoleDelete", policy =>
        policy.RequireClaim("RoleClaim", "RoleDeleteClaim"));

    options.AddPolicy("ListingCategoryGet", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryGetClaim"));
    options.AddPolicy("ListingCategoryAdd", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryAddClaim"));
    options.AddPolicy("ListingCategoryUpdate", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryUpdateClaim"));
    options.AddPolicy("ListingCategoryDelete", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryDeleteClaim"));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
                   {
                     new OpenApiSecurityScheme
                     {
                       Reference = new OpenApiReference
                       {
                         Type = ReferenceType.SecurityScheme,
                         Id = "Bearer"
                       }
                      },
                      new string[] { }
                    }
                  });
    options.MapType<TimeSpan>(
        () => new OpenApiSchema
        {
            Type = "string",
            Example = new OpenApiString("00:00:00"),
        });
});

builder.Services.AddSignalR(e => 
{ 
    e.MaximumReceiveMessageSize = 10240000; 
    e.EnableDetailedErrors = true; 
});
builder.Services.AddCors();

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}
app.UseHttpsRedirection();

app.UseRouting();

app.MapHub<ChatHub>("/chatHub");

app.UseCors(builder =>
builder.WithOrigins("http://localhost:5000")
.AllowAnyHeader()
.AllowCredentials()
.AllowAnyMethod());


app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();
