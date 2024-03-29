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
                (path.StartsWithSegments("/chatHub")) || (path.StartsWithSegments("/auctionHub")))
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
    //User policies and claims
    options.AddPolicy("UserGet", policy =>
        policy.RequireClaim("RoleClaim", "UserGetClaim"));
    options.AddPolicy("UserUpdate", policy =>
        policy.RequireClaim("RoleClaim", "UserUpdateClaim"));
    options.AddPolicy("UserDelete", policy =>
        policy.RequireClaim("RoleClaim", "UserDeleteClaim"));

    //Listing policies and claims
    options.AddPolicy("ListingGet", policy =>
        policy.RequireClaim("RoleClaim", "ListingGetClaim"));
    options.AddPolicy("ListingAdd", policy =>
        policy.RequireClaim("RoleClaim", "ListingAddClaim"));
    options.AddPolicy("ListingUpdate", policy =>
        policy.RequireClaim("RoleClaim", "ListingUpdateClaim"));
    options.AddPolicy("ListingDelete", policy =>
        policy.RequireClaim("RoleClaim", "ListingDeleteClaim"));

    //Role policies and claims
    options.AddPolicy("RoleGet", policy =>
        policy.RequireClaim("RoleClaim", "RoleGetClaim"));
    options.AddPolicy("RoleAdd", policy =>
        policy.RequireClaim("RoleClaim", "RoleAddClaim"));
    options.AddPolicy("RoleUpdate", policy =>
        policy.RequireClaim("RoleClaim", "RoleUpdateClaim"));
    options.AddPolicy("RoleDelete", policy =>
        policy.RequireClaim("RoleClaim", "RoleDeleteClaim"));

    //Listing category policies and claims
    options.AddPolicy("ListingCategoryGet", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryGetClaim"));
    options.AddPolicy("ListingCategoryAdd", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryAddClaim"));
    options.AddPolicy("ListingCategoryUpdate", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryUpdateClaim"));
    options.AddPolicy("ListingCategoryDelete", policy =>
        policy.RequireClaim("RoleClaim", "ListingCategoryDeleteClaim"));

    //Chat policies and claims
    options.AddPolicy("ChatGet", policy =>
        policy.RequireClaim("RoleClaim", "ChatGetClaim"));
    options.AddPolicy("ChatAdd", policy =>
        policy.RequireClaim("RoleClaim", "ChatAddClaim"));
    options.AddPolicy("ChatDelete", policy =>
        policy.RequireClaim("RoleClaim", "ChatDeleteClaim"));

    //Message policies and claims
    options.AddPolicy("MessageGet", policy =>
        policy.RequireClaim("RoleClaim", "MessageGetClaim"));
    options.AddPolicy("MessageAdd", policy =>
        policy.RequireClaim("RoleClaim", "MessageAddClaim"));
    options.AddPolicy("MessageUpdate", policy =>
        policy.RequireClaim("RoleClaim", "MessageUpdateClaim"));
    options.AddPolicy("MessageDelete", policy =>
        policy.RequireClaim("RoleClaim", "MessageDeleteClaim"));

    //Auction policies and claims
    options.AddPolicy("AuctionGet", policy =>
        policy.RequireClaim("RoleClaim", "AuctionGetClaim"));
    options.AddPolicy("AuctionAdd", policy =>
        policy.RequireClaim("RoleClaim", "AuctionAddClaim"));
    options.AddPolicy("AuctionDelete", policy =>
        policy.RequireClaim("RoleClaim", "AuctionDeleteClaim"));

    //Bid policies and claims
    options.AddPolicy("BidGet", policy =>
        policy.RequireClaim("RoleClaim", "BidGetClaim"));
    options.AddPolicy("BidAdd", policy =>
        policy.RequireClaim("RoleClaim", "BidAddClaim"));
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
builder.Services.AddScoped<IValidationTokenService, ValidationTokenService>();

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
app.MapHub<AuctionHub>("/auctionHub");

app.UseCors(builder =>
/*builder.WithOrigins("http://localhost:5000")*/
builder.AllowAnyOrigin()
/*builder.WithOrigins("https://eclipse-market.eu")*/

.AllowAnyHeader()
/*.AllowCredentials()*/
.AllowAnyMethod());


app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();
