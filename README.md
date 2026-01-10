# AI-Driven Cable Design Validation System

## Overview
This is a production-grade AI-driven validation system for the wire & cable industry. It leverages Google Gemini to act as a reasoning engine rather than a static rule-checker. The system validates cable designs against IEC standards probabilistically, providing explanations, confidence scores, and structured validation statuses (PASS, WARN, FAIL).

## Architecture
### Backend (NestJS)
- **Modular Design**: Separated into `DesignValidationModule` (Orchestration) and `AIGatewayModule` (AI Interaction).
- **AI-First Logic**: No hardcoded IEC tables. All compliance checks are inferred by the LLM based on its training data and prompt context.
- **DTOs**: Strict validation of incoming requests using `class-validator`.

### Frontend (Next.js + MUI)
- **Professional UI**: Material UI DataGrid for clear result presentation.
- **Interactive**: Real-time validation with detailed reasoning drawers.

## Core Philosophy
1. **AI as Reasoning Engine**: We interpret standards, we don't look them up in a CSV.
2. **Warn implies Uncertainty**: Borderline cases are flagged, not rejected.
3. **Transparency**: Every decision comes with an assumption and confidence score.

## AI Limitations & Engineering Judgment
- **Probabilistic Nature**: The AI may hallucinate or misinterpret obscure standards. Engineers must verify critical "WARN" or borderline "PASS" results.
- **Context Window**: Extremely complex multi-core cable designs may need split processing.
- **Data Cutoff**: Newer IEC amendments post-model-training may not be reflected without RAG (not implemented in this V1 core).

## Setup Instructions
1. **Backend**:
   ```bash
   cd backend
   npm install
   # Set GEMINI_API_KEY in .env
   npm run start
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables
Create a `.env` file in `backend/`:
```
GEMINI_API_KEY=your_key_here
PORT=3001
```
