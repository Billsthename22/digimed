// lib/triageService.ts

export enum TriageLevel {
    RED = "RED",       // Emergency: Immediate attention
    YELLOW = "YELLOW", // Urgent: See within 1-2 hours
    GREEN = "GREEN",   // Non-urgent: Routine booking
  }
  
  export interface TriageResponse {
    level: TriageLevel;
    score: number;
    message: string;
  }
  
  export function analyzeSymptoms(symptoms: Record<string, boolean | number>): TriageResponse {
    let score = 0;
  
    // Critical Indicators (RED)
    if (symptoms.chestPain || symptoms.difficultyBreathing || symptoms.unconscious) {
      return { 
        level: TriageLevel.RED, 
        score: 100, 
        message: "Emergency: Please proceed to the clinic immediately." 
      };
    }
  
    // Urgent Indicators (YELLOW)
    if (symptoms.fever >= 39) score += 40;
    if (symptoms.severePain) score += 30;
    if (symptoms.persistentVomiting) score += 30;
  
    // Standard Logic
    if (score >= 60) return { level: TriageLevel.YELLOW, score, message: "Urgent: Priority booking assigned." };
    
    return { 
      level: TriageLevel.GREEN, 
      score, 
      message: "Standard: Available slots shown based on your timetable." 
    };
  }