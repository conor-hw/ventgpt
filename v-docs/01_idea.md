# 01 – Project Idea / Product Canvas

**Project Name:** ventgpt-docs

## 1. Executive Summary

VentGPT is an AI-powered "buddy" and therapist web application designed to provide users with personalized advice and a confidential space to express their thoughts. Leveraging Google's Gemini API, the application will feature configurable AI personalities, allowing users to select a conversational partner that aligns with their preferences. The project will be built on Nuxt3 to ensure a modern, responsive, and engaging user experience.

**Key Safety Features:**
- **Strict AI Safety Rules:** Each personality operates under strict guidelines to prevent harmful, illegal, or dangerous suggestions
- **Location-Based Crisis Support:** Optional location input enables the AI to recommend local mental health services when appropriate (e.g., HSE services in Ireland)

## 2. Problem Statement

- **What pain point or gap exists today?** Many individuals seek a non-judgmental and readily available outlet to discuss their concerns, stresses, or daily experiences but may find traditional channels inaccessible, untimely, or uncomfortable.
- **Who is affected and how severe is the impact?** This affects anyone needing a safe space for expression, from those with mild daily stress to individuals feeling isolated. The lack of such an outlet can contribute to feelings of anxiety and loneliness.
- **What change or improvement do we seek?** VentGPT aims to provide an on-demand, empathetic AI companion. By offering customizable personalities, we seek to create a more personal and supportive interaction, making it easier for users to engage in meaningful conversation and receive constructive advice.

## 3. Target Users / Personas

| Persona | Description | Primary Needs |
| --- | --- | --- |
| **The Young Professional** | A busy individual in their 20s-30s juggling career, social life, and personal growth. | - A quick and private way to de-stress after a long day. <br> - A sounding board for ideas and decisions without fear of judgment. |
| **The Student** | A university student navigating academic pressure, social challenges, and future uncertainties. | - A confidential space to talk about anxieties and pressures. <br> - An unbiased source of encouragement and advice. |

## 4. Value Proposition

Explain why solving this problem matters to the business or organisation. Consider:

- Revenue growth
- Cost reduction
- Risk mitigation
- Strategic positioning

## 5. Goals & Objectives (SMART)

| Goal | Success Criteria            | Priority |
| ---- | --------------------------- | -------- |
| G1   | Specific, measurable result | High     |
| G2   | …                           | Medium   |

## 6. Non-Goals / Out of Scope

- VentGPT is not a replacement for professional medical or psychiatric help.
- The first release will not include user accounts or persistent memory of conversations.

**Critical Safety Requirements:**
- **AI Safety Rulesets:** Each AI personality must operate under strict guidelines that:
  - Prohibit suggestions of illegal behavior
  - Prevent recommendations that could cause harm to the user or others
  - Avoid content that could negatively impact mental health
  - Recognize crisis situations and redirect to professional help
- **Location-Based Crisis Support:** When users provide location information, the AI can:
  - Identify when professional intervention may be needed
  - Recommend local mental health services and crisis support
  - Provide specific contact information for regional services (e.g., [HSE Mental Health Services](https://www2.hse.ie/mental-health/services-support/supports-services/) in Ireland)

## 7. Assumptions & Constraints

- **Assumptions:** Users will find value in and trust an AI-driven conversational partner.
- **Constraints:** The application must be built using Nuxt3 and rely on the Gemini API for its core conversational logic.

## 8. Success Metrics / KPIs

| Metric         | Baseline | Target                      | Measurement Method   |
| -------------- | -------- | --------------------------- | -------------------- |
| Example Metric | 0        | 100 active users in 30 days | Mixpanel daily users |

## 9. Milestones & Timeline

| Milestone | Description              | Target Date |
| --------- | ------------------------ | ----------- |
| M1        | MVP feature set complete | YYYY-MM-DD  |

## 10. Risks & Mitigations

| Risk         | Likelihood | Impact | Mitigation          |
| ------------ | ---------- | ------ | ------------------- |
| Example risk | Medium     | High   | Proposed mitigation |

## 11. Stakeholders & Communication Plan

| Role          | Name | Contact | Engagement          |
| ------------- | ---- | ------- | ------------------- |
| Product Owner |      |         | Weekly sync         |
| Tech Lead     |      |         | Slack / Code Review |

## 12. Glossary

| Term | Definition |
| --- | --- |
| **VentGPT** | The name of the AI Buddy / therapist web application. |
| **Nuxt3** | The Vue.js framework used to build the frontend application. |
| **Gemini API** | The Google AI service that will power the chatbot's responses and personalities. |
| **AI Safety Rulesets** | Strict guidelines programmed into each AI personality to prevent harmful or dangerous responses. |
| **Location-Based Crisis Support** | Feature that uses optional user location data to recommend local mental health services when needed. |
| **HSE** | Health Service Executive - Ireland's public health service that provides mental health supports and services. |

---

_Document generated by lets-vibe. Feel free to remove sections that do not apply._
