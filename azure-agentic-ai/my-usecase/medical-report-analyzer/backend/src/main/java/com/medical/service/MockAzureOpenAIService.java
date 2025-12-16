package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Mock implementation of Azure OpenAI Service
 * 
 * This service provides mock functionality for development and testing
 * when Azure OpenAI services are not available or configured.
 */
@Service
public class MockAzureOpenAIService {

    private static final Logger logger = LoggerFactory.getLogger(MockAzureOpenAIService.class);

    /**
     * Mock medical report analysis
     * 
     * @param extractedText Text extracted from medical report
     * @param injuryType Type of injury (if known)
     * @return Mock AI-generated analysis and recommendations
     */
    public String analyzeMedicalReport(String extractedText, String injuryType) {
        try {
            logger.info("Mock analyzing medical report with OpenAI (injury type: {})", injuryType);
            
            // Simulate processing delay
            Thread.sleep(2000);
            
            // Generate mock analysis based on injury type
            String mockAnalysis = generateMockAnalysis(extractedText, injuryType);
            
            logger.info("Mock successfully generated medical analysis");
            return mockAnalysis;
            
        } catch (Exception e) {
            logger.error("Mock error analyzing medical report: {}", e.getMessage());
            throw new RuntimeException("Mock AI analysis failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generate mock exercise recommendations
     */
    public String generateExerciseRecommendations(String injuryType, String severity) {
        try {
            logger.info("Mock generating exercise recommendations for {} injury with {} severity", 
                injuryType, severity);
            
            // Simulate processing delay
            Thread.sleep(1500);
            
            // Generate mock exercise recommendations
            String mockExercises = generateMockExercises(injuryType, severity);
            
            logger.info("Mock successfully generated exercise recommendations");
            return mockExercises;
            
        } catch (Exception e) {
            logger.error("Mock error generating exercise recommendations: {}", e.getMessage());
            return "Unable to generate exercise recommendations due to mock service limitations.";
        }
    }

    /**
     * Generate mock analysis based on injury type
     */
    private String generateMockAnalysis(String extractedText, String injuryType) {
        StringBuilder analysis = new StringBuilder();
        
        analysis.append("AI Medical Analysis Report\n");
        analysis.append("==========================\n\n");
        
        if ("knee".equalsIgnoreCase(injuryType)) {
            analysis.append("Injury Assessment: ACL Tear (Grade 2)\n");
            analysis.append("Severity: Moderate\n");
            analysis.append("Recovery Time: 6-12 weeks\n\n");
            
            analysis.append("Recommended Treatment Solutions:\n");
            analysis.append("1. RICE Protocol (Rest, Ice, Compression, Elevation)\n");
            analysis.append("2. Physical therapy focusing on quadriceps and hamstring strengthening\n");
            analysis.append("3. Gradual return to activity program\n");
            analysis.append("4. Consider bracing for stability\n\n");
            
            analysis.append("Physical Therapy Exercises:\n");
            analysis.append("1. Straight leg raises (3 sets of 10)\n");
            analysis.append("2. Wall sits (hold for 30 seconds)\n");
            analysis.append("3. Calf raises (3 sets of 15)\n");
            analysis.append("4. Stationary bike (low resistance)\n\n");
            
            analysis.append("Recovery Timeline:\n");
            analysis.append("Weeks 1-2: Rest and ice\n");
            analysis.append("Weeks 3-6: Physical therapy begins\n");
            analysis.append("Weeks 7-12: Gradual return to activities\n\n");
            
            analysis.append("Medication Recommendations:\n");
            analysis.append("- Ibuprofen 400mg every 6 hours as needed\n");
            analysis.append("- Acetaminophen for pain management\n\n");
            
            analysis.append("Follow-up Care:\n");
            analysis.append("- Weekly physical therapy sessions\n");
            analysis.append("- Monthly progress evaluations\n");
            analysis.append("- Return to sports clearance at 12 weeks\n");
            
        } else if ("back".equalsIgnoreCase(injuryType)) {
            analysis.append("Injury Assessment: Lumbar Strain\n");
            analysis.append("Severity: Mild to Moderate\n");
            analysis.append("Recovery Time: 2-6 weeks\n\n");
            
            analysis.append("Recommended Treatment Solutions:\n");
            analysis.append("1. Heat and ice therapy\n");
            analysis.append("2. Gentle stretching exercises\n");
            analysis.append("3. Core strengthening program\n");
            analysis.append("4. Posture correction\n\n");
            
            analysis.append("Physical Therapy Exercises:\n");
            analysis.append("1. Cat-cow stretches (10 repetitions)\n");
            analysis.append("2. Pelvic tilts (3 sets of 10)\n");
            analysis.append("3. Bird-dog exercises (3 sets of 10 each side)\n");
            analysis.append("4. Plank holds (30 seconds)\n\n");
            
            analysis.append("Recovery Timeline:\n");
            analysis.append("Week 1: Rest and gentle movement\n");
            analysis.append("Weeks 2-4: Stretching and light strengthening\n");
            analysis.append("Weeks 5-6: Full activity return\n\n");
            
            analysis.append("Medication Recommendations:\n");
            analysis.append("- Muscle relaxants as prescribed\n");
            analysis.append("- Topical pain relief creams\n\n");
            
            analysis.append("Follow-up Care:\n");
            analysis.append("- Bi-weekly physical therapy\n");
            analysis.append("- Ergonomic assessment\n");
            analysis.append("- Progress monitoring\n");
            
        } else {
            analysis.append("Injury Assessment: General Musculoskeletal Injury\n");
            analysis.append("Severity: To be determined\n");
            analysis.append("Recovery Time: Variable\n\n");
            
            analysis.append("Recommended Treatment Solutions:\n");
            analysis.append("1. Rest and protection of injured area\n");
            analysis.append("2. Ice application for swelling\n");
            analysis.append("3. Gradual range of motion exercises\n");
            analysis.append("4. Professional medical evaluation\n\n");
            
            analysis.append("General Recovery Guidelines:\n");
            analysis.append("1. Listen to your body\n");
            analysis.append("2. Avoid activities that cause pain\n");
            analysis.append("3. Gradual return to normal activities\n");
            analysis.append("4. Seek medical attention if symptoms worsen\n\n");
            
            analysis.append("Follow-up Care:\n");
            analysis.append("- Regular medical check-ups\n");
            analysis.append("- Monitor for any changes\n");
            analysis.append("- Adjust treatment as needed\n");
        }
        
        return analysis.toString();
    }

    /**
     * Generate mock exercise recommendations
     */
    private String generateMockExercises(String injuryType, String severity) {
        StringBuilder exercises = new StringBuilder();
        
        exercises.append("Exercise Recommendations for ").append(injuryType).append(" Injury\n");
        exercises.append("Severity: ").append(severity).append("\n");
        exercises.append("=====================================\n\n");
        
        if ("knee".equalsIgnoreCase(injuryType)) {
            exercises.append("1. Straight Leg Raises\n");
            exercises.append("   - Lie on back, lift leg straight up\n");
            exercises.append("   - 3 sets of 10 repetitions\n");
            exercises.append("   - Hold for 2 seconds at top\n\n");
            
            exercises.append("2. Wall Sits\n");
            exercises.append("   - Back against wall, slide down to sitting position\n");
            exercises.append("   - Hold for 30 seconds\n");
            exercises.append("   - 3 repetitions\n\n");
            
            exercises.append("3. Calf Raises\n");
            exercises.append("   - Stand on edge of step, rise up on toes\n");
            exercises.append("   - 3 sets of 15 repetitions\n");
            exercises.append("   - Slow and controlled movement\n\n");
            
            exercises.append("4. Stationary Bike\n");
            exercises.append("   - Low resistance, 20 minutes\n");
            exercises.append("   - Maintain comfortable pace\n");
            exercises.append("   - 3 times per week\n\n");
            
        } else if ("back".equalsIgnoreCase(injuryType)) {
            exercises.append("1. Cat-Cow Stretches\n");
            exercises.append("   - On hands and knees, arch and round back\n");
            exercises.append("   - 10 repetitions\n");
            exercises.append("   - Slow, controlled movement\n\n");
            
            exercises.append("2. Pelvic Tilts\n");
            exercises.append("   - Lie on back, flatten lower back to floor\n");
            exercises.append("   - 3 sets of 10 repetitions\n");
            exercises.append("   - Hold for 5 seconds\n\n");
            
            exercises.append("3. Bird-Dog Exercises\n");
            exercises.append("   - On hands and knees, extend opposite arm and leg\n");
            exercises.append("   - 3 sets of 10 each side\n");
            exercises.append("   - Hold for 3 seconds\n\n");
            
            exercises.append("4. Plank Holds\n");
            exercises.append("   - Forearm plank position\n");
            exercises.append("   - Hold for 30 seconds\n");
            exercises.append("   - 3 repetitions\n\n");
            
        } else {
            exercises.append("1. Gentle Range of Motion\n");
            exercises.append("   - Move injured area through comfortable range\n");
            exercises.append("   - 10 repetitions in each direction\n");
            exercises.append("   - Stop if pain increases\n\n");
            
            exercises.append("2. Light Stretching\n");
            exercises.append("   - Gentle stretches for surrounding muscles\n");
            exercises.append("   - Hold for 30 seconds\n");
            exercises.append("   - 3 repetitions each\n\n");
            
            exercises.append("3. Walking\n");
            exercises.append("   - Light walking as tolerated\n");
            exercises.append("   - Start with 10 minutes\n");
            exercises.append("   - Gradually increase duration\n\n");
        }
        
        exercises.append("Safety Precautions:\n");
        exercises.append("- Stop if you experience sharp pain\n");
        exercises.append("- Start slowly and gradually increase intensity\n");
        exercises.append("- Consult with healthcare provider before starting\n");
        exercises.append("- Maintain proper form throughout exercises\n");
        
        return exercises.toString();
    }

    /**
     * Check if service is available (always true for mock)
     */
    public boolean isServiceAvailable() {
        return true;
    }

    /**
     * Get mock usage information
     */
    public String getUsageInfo() {
        return "Mock Azure OpenAI - Simulated AI analysis for development";
    }
}
