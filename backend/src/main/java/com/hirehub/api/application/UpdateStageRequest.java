package com.hirehub.api.application;

import jakarta.validation.constraints.NotBlank;

public record UpdateStageRequest(@NotBlank String stage) {
}