﻿namespace AuthService.Contracts;

public record RegisterRequest(string Email, string Password, string FullName);