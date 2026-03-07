package com.example.demo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;

public record CodeReviewReport(
    @Min(1) @Max(10)int severityScore,
    boolean isApproved,
    List<String> vulnerabilities
) {}