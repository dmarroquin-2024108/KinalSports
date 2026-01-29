using AuthService.Api.Extensions;
using AuthService.Persistence.Data;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

using(var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Chequeando la conexión a la base de datos...");
        await context.Database.EnsureCreatedAsync();

        logger.LogInformation("Insertando datos iniciales");
        await DataSeeder.SeedAsync(context);
        logger.LogInformation("Data insetada correctamente.");
    }
    catch(Exception ex)
    {
        logger.LogError(ex, "Ocurrió un error al insertar los datos iniciales.");
    }//try catch
}//using

app.Run();