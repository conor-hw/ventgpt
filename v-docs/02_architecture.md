# 02 – Architecture Overview

## 1. System Context

This diagram illustrates how VentGPT fits into its environment.

- **Users:** Interact with the application through a web browser.
- **VentGPT Web App:** A Single-Page Application (SPA) built with Nuxt3. It handles the user interface, state management, and communication with the backend service.
- **Gemini API:** The core AI engine provided by Google. It receives prompts from our application and returns the generated responses.
- **Local Mental Health Services:** External crisis support services that can be recommended based on user location.

<!-- PlantUML Code -->
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(user, "User")
System(spa, "VentGPT Web App", "Nuxt3 Single-Page Application")
System_Ext(gemini, "Google Gemini API", "AI Language Model")
System_Ext(services, "Local Mental Health Services", "HSE, Crisis Hotlines, etc.")

Rel(user, spa, "Uses", "HTTPS")
Rel(spa, gemini, "Sends prompts to / gets responses from", "HTTPS/JSON")
Rel(spa, services, "Recommends contact with", "External Links/Phone")

@enduml
```

## 2. Container Diagram

This diagram zooms into the **VentGPT Web App** to show its high-level technical structure.

- **Web Browser:** Renders the Nuxt3 application.
- **Nuxt3 Frontend:** The user-facing application responsible for all UI rendering and user interaction. It communicates with the Gemini API via a server route.
- **Nuxt3 Server:** A thin backend-for-frontend (BFF) layer that proxies requests to the Gemini API. This is crucial for securely managing API keys and handling communication with the external service.
- **Safety Rule Engine:** Validates and filters all AI responses to ensure compliance with safety guidelines.
- **Location Service Matcher:** Matches user location data with appropriate local mental health services.
- **Gemini API:** The external AI service.

<!-- PlantUML Code -->
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "User", "Interacts with VentGPT")

System_Boundary(c1, "VentGPT System (Nuxt3)") {
    Container(frontend, "Frontend", "JavaScript, Vue.js, Nuxt3", "The user-facing web application")
    Container(backend, "Server Routes", "JavaScript, Nitro", "Backend-for-Frontend (BFF) to proxy API calls securely")
    Container(safety, "Safety Rule Engine", "JavaScript", "Validates AI responses against safety guidelines")
    Container(location, "Location Service Matcher", "JavaScript", "Maps user location to local mental health services")
}

System_Ext(gemini, "Google Gemini API", "AI Language Model")
System_Ext(services, "Mental Health Services DB", "JSON/Static Data", "Database of local crisis support services")

Rel(user, frontend, "Uses", "HTTPS")
Rel(frontend, backend, "Makes API calls to", "HTTPS/JSON")
Rel(backend, safety, "Validates responses with", "Internal")
Rel(backend, location, "Checks location services with", "Internal")
Rel(backend, gemini, "Proxies requests to", "HTTPS/JSON")
Rel(location, services, "Queries", "Static Data")

@enduml
```

## 3. Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| **Frontend** | [Nuxt3](https://nuxt.com/) | A modern Vue.js framework for building fast, server-rendered applications. Its file-based routing and auto-imports simplify development. |
| **AI Service** | [Google Gemini API](https://ai.google.dev/) | Provides powerful, state-of-the-art language models for generating human-like text and managing different personalities. |
| **Safety Validation** | Custom JavaScript Rules Engine | Implements strict rulesets to filter harmful content and detect crisis situations. |
| **Location Services** | Static JSON Database + Geolocation API | Maps user locations to local mental health services (e.g., HSE services for Ireland). |
| **Deployment** | _To be determined_ | |
| **Styling** | _To be determined_ | |
| **State Management** | _To be determined (e.g., Pinia)_ | |

## 4. Safety & Compliance Features

### AI Safety Rulesets
- **Content Filtering:** All AI responses are validated against strict guidelines
- **Harm Prevention:** Blocks suggestions of illegal activities, violence, or self-harm
- **Crisis Detection:** Identifies when users may need professional intervention
- **Professional Redirect:** Automatically suggests contacting mental health professionals when appropriate

### Location-Based Crisis Support
- **Optional Location Input:** Users can provide location data for personalized service recommendations
- **Service Database:** Curated database of local mental health services by region
- **Ireland Example:** Integration with [HSE Mental Health Services](https://www2.hse.ie/mental-health/services-support/supports-services/) contact information
- **Crisis Hotlines:** Immediate access to emergency mental health contacts based on location

## 4. Architectural Decisions (ADRs)

| ADR-002 | [Decision Title] | YYYY-MM-DD |

---

_Document generated by lets-vibe._
