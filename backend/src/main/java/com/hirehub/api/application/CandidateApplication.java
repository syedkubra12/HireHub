package com.hirehub.api.application;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "candidate_applications")
public class CandidateApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_name", nullable = false, length = 120)
    private String candidateName;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(nullable = false, length = 160)
    private String role;

    @Column(nullable = false, length = 24)
    private String stage;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "applied_at", nullable = false)
    private LocalDate appliedAt;

    protected CandidateApplication() {
    }

    public CandidateApplication(String candidateName, String email, String role, String stage, Integer score, LocalDate appliedAt) {
        this.candidateName = candidateName;
        this.email = email;
        this.role = role;
        this.stage = stage;
        this.score = score;
        this.appliedAt = appliedAt;
    }

    public Long getId() { return id; }
    public String getCandidateName() { return candidateName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getStage() { return stage; }
    public Integer getScore() { return score; }
    public LocalDate getAppliedAt() { return appliedAt; }
    public void setStage(String stage) { this.stage = stage; }
}