package com.hirehub.api.application;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DemoDataSeeder implements ApplicationRunner {
    private final CandidateApplicationRepository repository;

    public DemoDataSeeder(CandidateApplicationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) return;
        LocalDate today = LocalDate.now();
        repository.saveAll(List.of(
            new CandidateApplication("Amara Okafor", "amara.okafor@email.com", "Senior Product Designer", "Interview", 94, today.minusDays(1)),
            new CandidateApplication("Luca Moretti", "luca.moretti@email.com", "Frontend Engineer", "Review", 88, today.minusDays(1)),
            new CandidateApplication("Priya Nair", "priya.nair@email.com", "Product Marketing Manager", "Shortlisted", 91, today.minusDays(2)),
            new CandidateApplication("Noah Williams", "noah.williams@email.com", "Senior Product Designer", "New", 76, today.minusDays(2)),
            new CandidateApplication("Sofia Andersson", "sofia.andersson@email.com", "Backend Engineer", "Interview", 89, today.minusDays(3)),
            new CandidateApplication("Ethan Chen", "ethan.chen@email.com", "Frontend Engineer", "Review", 82, today.minusDays(4)),
            new CandidateApplication("Maya Patel", "maya.patel@email.com", "Product Marketing Manager", "New", 72, today.minusDays(5))
        ));
    }
}