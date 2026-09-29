CREATE TABLE IF NOT EXISTS candidate_applications (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    candidate_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    role VARCHAR(160) NOT NULL,
    stage VARCHAR(24) NOT NULL,
    score INTEGER NOT NULL,
    applied_at DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidate_applications_stage (stage),
    INDEX idx_candidate_applications_role (role)
);