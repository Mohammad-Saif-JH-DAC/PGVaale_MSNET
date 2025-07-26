package com.pgvaale.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/** BASE ENTITY */
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {
    @NotBlank
    protected String name;

    @Email
    @NotBlank
    protected String email;

    @NotBlank
    protected String username;

    @NotBlank
    protected String password;
} 