package com.crm.medicalaiservice.config;

import com.azure.ai.formrecognizer.DocumentAnalysisClient;
import com.azure.ai.formrecognizer.DocumentAnalysisClientBuilder;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;
import com.azure.ai.search.SearchClient;
import com.azure.ai.search.SearchClientBuilder;
import com.azure.core.credential.AzureKeyCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureAIConfig {

    @Value("${azure.ai.openai.endpoint}")
    private String openAIEndpoint;

    @Value("${azure.ai.openai.api-key}")
    private String openAIKey;

    @Value("${azure.ai.formrecognizer.endpoint}")
    private String formRecognizerEndpoint;

    @Value("${azure.ai.formrecognizer.api-key}")
    private String formRecognizerKey;

    @Value("${azure.ai.search.endpoint}")
    private String searchEndpoint;

    @Value("${azure.ai.search.api-key}")
    private String searchKey;

    @Bean
    public OpenAIClient openAIClient() {
        return new OpenAIClientBuilder()
                .endpoint(openAIEndpoint)
                .credential(new AzureKeyCredential(openAIKey))
                .buildClient();
    }

    @Bean
    public DocumentAnalysisClient documentAnalysisClient() {
        return new DocumentAnalysisClientBuilder()
                .endpoint(formRecognizerEndpoint)
                .credential(new AzureKeyCredential(formRecognizerKey))
                .buildClient();
    }

    @Bean
    public SearchClient searchClient() {
        return new SearchClientBuilder()
                .endpoint(searchEndpoint)
                .credential(new AzureKeyCredential(searchKey))
                .indexName("medical-documents")
                .buildClient();
    }

    @Bean
    public DefaultAzureCredentialBuilder azureCredentialBuilder() {
        return new DefaultAzureCredentialBuilder();
    }
}
