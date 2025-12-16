package com.medical;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main Spring Boot application for Medical Report Analyzer
 * 
 * This application provides AI-powered analysis of medical reports using Azure services:
 * - Azure Document Intelligence for OCR and text extraction
 * - Azure OpenAI for medical analysis and solution generation
 * - Azure Cognitive Search for medical knowledge base
 * 
 * Optimized for Azure free tier usage with efficient token and page management.
 */
@SpringBootApplication
@EnableAsync
public class MedicalReportAnalyzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalReportAnalyzerApplication.class, args);
        System.out.println("🏥 Medical Report Analyzer started successfully!");
        System.out.println("📊 Health check available at: http://localhost:8080/actuator/health");
        System.out.println("📚 API documentation available at: http://localhost:8080/swagger-ui.html");
    }
}
