using System;
using System.Diagnostics.Tracing;
using System.Runtime.CompilerServices;
using System.Text;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string roleName);

    Task<int> CountUsersInRoleAsync(StringBuilder roleName);

    Task<IReadOnlyList<User>> GetUsersByRoleAsync(string roleName);

    Task<IReadOnlyList<string>> GetUserRoleNamesAsync(string userId);
}