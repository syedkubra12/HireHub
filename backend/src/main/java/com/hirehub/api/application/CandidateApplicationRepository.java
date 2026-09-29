package com.hirehub.api.application;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, Long> {
    List<CandidateApplication> findAllByOrderByAppliedAtDescIdDesc();
}