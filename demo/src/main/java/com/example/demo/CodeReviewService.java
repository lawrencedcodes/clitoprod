package com.example.demo;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class CodeReviewService {

    private final ChatClient chatClient;

    // Spring automatically injects the configured builder (with your API key)
    public CodeReviewService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public CodeReviewReport reviewCode(String pythonCode) {
        String promptText = "Review this code for security vulnerabilities:\n\n" + pythonCode;

        // The Act 3 Mic Drop:
        return this.chatClient.prompt()
                .user(promptText)
                .call()
                .entity(CodeReviewReport.class);
    }
}