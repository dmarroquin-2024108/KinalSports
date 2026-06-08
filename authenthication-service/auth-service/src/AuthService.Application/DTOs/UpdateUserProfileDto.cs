using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class UpdateUserProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public IFileData? ProfilePicture { get; set; }
}
