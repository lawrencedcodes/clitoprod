Bounding the AI: From Vibes to Enterprise Architecture (DataTune 2026)
Welcome to the companion repository for my DataTune talk!

If you just watched the presentation, you know that integrating Generative AI into a production system requires a massive paradigm shift. We have to stop treating LLMs like magical chatbots and start treating them like untrusted external services that must be bound by strict architectural contracts.

This repository contains the exact code from the live demo, broken down into the three acts of our architectural journey.

The Victim: main.py
Before you run anything, look at main.py. This is a deliberately vulnerable Python Flask application containing a textbook Command Injection flaw. This script serves as the "subject" that our AI agent will be reviewing across all three acts.

Act 1: The Hacker Phase (Python)
File: act1.py

This is how most developers start using AI. We write a quick script, pass in our vulnerable code, and ask the Gemini 2.5 Flash model for a review.

The Result: The AI gives us a beautifully written paragraph of Markdown explaining the vulnerability.

The Problem: It's architecturally useless. You cannot pipe a conversational paragraph into a database, an if/else statement, or an automated CI/CD pipeline. "Vibes" are not architecture.

Act 2: The Architect Phase (TypeScript & Genkit)
File: main2.ts

Here, we stop asking the AI to talk to us and start forcing it to execute functions. Using Google Genkit, we define a strict data contract using a Zod schema.

The Result: The AI stops generating conversational text. Instead, it natively structures its response into a JSON payload and executes our submitReviewTool.

The Problem: We successfully bounded the AI to a schema (rating the severity as a 9.5), but Zod is often a separate, bolted-on validation layer detached from our core compiled business logic.

Act 3: The Enterprise Phase (Java & Spring Boot)
Folder: /demo

This is the climax of the integration journey. We move the AI into a strictly typed, enterprise-grade Spring Boot microservice using Spring AI.

The Result: We eliminate custom parsing entirely. We define a Java CodeReviewReport Record and use standard jakarta.validation annotations (@Min(1) and @Max(10)). Spring AI uses reflection to translate our existing enterprise domain model directly into the JSON Schema sent to the LLM.

The Takeaway: The AI is no longer allowed to hallucinate a severity score of 9.5. It is violently corralled into returning an integer strictly between 1 and 10, completely bound by the exact same rules that govern the rest of our enterprise application.

🚀 How to Run the Code
Prerequisites
Get a free Gemini API key from Google AI Studio.

Set it in your terminal environment:

Bash
export GEMINI_API_KEY="your_api_key_here"
Running Act 1 (Python)
Requires Python 3 and the Google GenAI SDK.

Bash
pip install google-genai
python3 act1.py
Running Act 2 (Genkit / Node)
Requires Node.js.

Bash
npm install
# Starts the Genkit Developer UI and watches the TypeScript file
npx genkit start -- npx tsx --watch main2.ts
Open http://localhost:4000, run the flow, and check the "Trace" tab to see the raw JSON tool call.

Running Act 3 (Spring Boot)
Requires Java 17+ and Maven.

Bash
cd demo
./mvnw spring-boot:run
Once the Tomcat server is running on port 8080, use an API client like Postman to send a POST request to http://localhost:8080/api/review.

The Payload (Raw JSON):

JSON
{
  "code": "import subprocess\nfrom flask import Flask, request\n\napp = Flask(__name__)\n\n@app.route(\"/ping\")\ndef ping_host():\n    target = request.args.get(\"target\", \"localhost\")\n    command = f\"ping -c 1 {target}\"\n    result = subprocess.run(command, shell=True, capture_output=True, text=True)\n    return result.stdout"
}
The Philosophy
As Chad Fowler notes in The Passionate Programmer, professionals build systems that reflect the reality of their business domains.

We do not adapt our enterprise systems to accommodate the probabilistic nature of Generative AI. We force the AI to adapt to the deterministic, compiled reality of our enterprise systems. When AI is treated as just another tool bound by strict interfaces, we unlock its true potential in production.
