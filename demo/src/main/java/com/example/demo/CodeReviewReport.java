package com.example.demo;

import java.util.List;

public record CodeReviewReport(
    int severityScore,
    boolean isApproved,
    List<String> vulnerabilities
) {}