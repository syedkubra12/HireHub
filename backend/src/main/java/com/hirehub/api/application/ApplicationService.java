package com.hirehub.api.application;

import com.hirehub.api.notification.NotificationClient;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ApplicationService {
    private static final Set<String> ALLOWED_STAGES = Set.of("New", "Review", "Shortlisted", "Interview", "Offer", "Hired", "Rejected");
    private final CandidateApplicationRepository repository;
    private final NotificationClient notifications;

    public ApplicationService(CandidateApplicationRepository repository, NotificationClient notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }

    @Transactional(readOnly = true)
    public List<CandidateApplication> findAll() {
        return repository.findAllByOrderByAppliedAtDescIdDesc();
    }

    @Transactional
    public CandidateApplication create(CreateApplicationRequest request) {
        CandidateApplication application = repository.save(new CandidateApplication(
            request.candidateName().trim(), request.email().trim().toLowerCase(), request.role().trim(), "New", 80, LocalDate.now()
        ));
        notifications.publish("candidate.created", application.getId(), application.getCandidateName() + " applied for " + application.getRole());
        return application;
    }

    @Transactional
    public CandidateApplication updateStage(Long id, String stage) {
        if (!ALLOWED_STAGES.contains(stage)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown candidate stage");
        }
        CandidateApplication application = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));
        String previousStage = application.getStage();
        application.setStage(stage);
        CandidateApplication saved = repository.save(application);
        notifications.publish("candidate.stage_changed", id,
            saved.getCandidateName() + " moved from " + previousStage + " to " + stage);
        return saved;
    }
}