package com.hirehub.api.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateApplicationRequest(
    @NotBlank @Size(max = 120) String candidateName,
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(max = 160) String role
) {
}