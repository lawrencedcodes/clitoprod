package com.example.demo;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CodeReviewController {

    private final CodeReviewService codeReviewService;

    // Constructor injection
    public CodeReviewController(CodeReviewService codeReviewService) {
        this.codeReviewService = codeReviewService;
    }

    // A simple record to map the incoming JSON request
    public record CodeRequest(String code) {}

    @PostMapping("/api/review")
    public CodeReviewReport review(@RequestBody CodeRequest request) {
        // The service does the AI heavy lifting, the controller just routes the traffic
        return codeReviewService.reviewCode(request.code());
    }
}