package com.crm.medicalaiservice.service;

import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.models.*;
import com.azure.ai.search.SearchClient;
import com.azure.ai.search.models.SearchOptions;
import com.azure.ai.search.models.SearchResult;
import com.crm.medicalaiservice.entity.MedicalDocument;
import com.crm.medicalaiservice.repository.MedicalDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RAGSearchService {

    private static final Logger logger = LoggerFactory.getLogger(RAGSearchService.class);

    @Autowired
    private OpenAIClient openAIClient;

    @Autowired
    private SearchClient searchClient;

    @Autowired
    private MedicalDocumentRepository medicalDocumentRepository;

    @Value("${azure.ai.openai.deployment-name}")
    private String deploymentName;

    @Value("${azure.ai.openai.max-tokens}")
    private Integer maxTokens;

    /**
     * Search medical literature using RAG approach
     */
    public RAGSearchResult searchMedicalLiterature(String query, String documentType, int maxResults) {
        try {
            // Step 1: Vector search for relevant documents
            List<MedicalDocument> relevantDocs = performVectorSearch(query, documentType, maxResults);
            
            // Step 2: Generate contextual answer using retrieved documents
            String contextualAnswer = generateContextualAnswer(query, relevantDocs);
            
            // Step 3: Create search result with sources
            RAGSearchResult result = new RAGSearchResult();
            result.setQuery(query);
            result.setAnswer(contextualAnswer);
            result.setSourceDocuments(relevantDocs);
            result.setSearchTimestamp(new Date());
            result.setResultCount(relevantDocs.size());
            
            logger.info("RAG search completed for query: '{}'. Found {} relevant documents", query, relevantDocs.size());
            return result;
            
        } catch (Exception e) {
            logger.error("Error during RAG search: {}", e.getMessage(), e);
            throw new RuntimeException("Medical literature search failed", e);
        }
    }

    /**
     * Perform vector search using Azure Cognitive Search
     */
    private List<MedicalDocument> performVectorSearch(String query, String documentType, int maxResults) {
        try {
            // Build search query with filters
            String searchQuery = buildSearchQuery(query, documentType);
            
            SearchOptions searchOptions = new SearchOptions()
                .setTop(maxResults)
                .setIncludeTotalCount(true)
                .setSelect("id", "documentName", "documentType", "extractedText", "aiSummary", "complianceScore")
                .setOrderBy("complianceScore desc, search.score() desc");

            // Perform search
            List<SearchResult> searchResults = searchClient.search(searchQuery, searchOptions)
                .stream()
                .collect(Collectors.toList());

            // Convert search results to MedicalDocument objects
            List<MedicalDocument> documents = new ArrayList<>();
            for (SearchResult result : searchResults) {
                MedicalDocument doc = new MedicalDocument();
                doc.setId(UUID.fromString(result.getDocument().get("id").toString()));
                doc.setDocumentName(result.getDocument().get("documentName").toString());
                doc.setDocumentType(result.getDocument().get("documentType").toString());
                
                if (result.getDocument().get("extractedText") != null) {
                    doc.setExtractedText(result.getDocument().get("extractedText").toString());
                }
                
                if (result.getDocument().get("aiSummary") != null) {
                    doc.setAiSummary(result.getDocument().get("aiSummary").toString());
                }
                
                if (result.getDocument().get("complianceScore") != null) {
                    doc.setComplianceScore(Double.parseDouble(result.getDocument().get("complianceScore").toString()));
                }
                
                documents.add(doc);
            }

            return documents;
            
        } catch (Exception e) {
            logger.error("Error during vector search: {}", e.getMessage(), e);
            // Fallback to simple text search
            return performFallbackSearch(query, documentType, maxResults);
        }
    }

    /**
     * Fallback search using simple text matching
     */
    private List<MedicalDocument> performFallbackSearch(String query, String documentType, int maxResults) {
        try {
            // Simple text-based search using repository
            List<MedicalDocument> allDocs = medicalDocumentRepository.findByDocumentType(documentType);
            
            return allDocs.stream()
                .filter(doc -> doc.getExtractedText() != null && 
                              doc.getExtractedText().toLowerCase().contains(query.toLowerCase()))
                .sorted((a, b) -> Double.compare(
                    b.getComplianceScore() != null ? b.getComplianceScore() : 0.0,
                    a.getComplianceScore() != null ? a.getComplianceScore() : 0.0
                ))
                .limit(maxResults)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            logger.error("Error during fallback search: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Generate contextual answer using retrieved documents
     */
    private String generateContextualAnswer(String query, List<MedicalDocument> relevantDocs) {
        try {
            if (relevantDocs.isEmpty()) {
                return "No relevant medical literature found for your query. Please try rephrasing or expanding your search terms.";
            }

            // Build context from relevant documents
            String context = buildSearchContext(relevantDocs);
            
            // Generate answer using OpenAI
            String prompt = buildSearchPrompt(query, context);
            
            ChatCompletionsOptions options = new ChatCompletionsOptions()
                .setDeploymentName(deploymentName)
                .setMaxTokens(maxTokens)
                .setTemperature(0.1) // Low temperature for more focused medical answers
                .setMessages(List.of(
                    new ChatRequestSystemMessage(
                        "You are a medical research assistant. Provide accurate, evidence-based answers " +
                        "based on the provided medical literature. Always cite sources and indicate confidence levels. " +
                        "If information is insufficient, clearly state what additional research is needed."
                    ),
                    new ChatRequestUserMessage(prompt)
                ));

            ChatCompletions response = openAIClient.getChatCompletions(prompt);
            
            if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            } else {
                return "Unable to generate answer at this time. Please review the source documents manually.";
            }
            
        } catch (Exception e) {
            logger.error("Error generating contextual answer: {}", e.getMessage(), e);
            return "Error generating answer. Please review the source documents manually.";
        }
    }

    /**
     * Build search query for Azure Cognitive Search
     */
    private String buildSearchQuery(String query, String documentType) {
        StringBuilder searchQuery = new StringBuilder();
        
        // Basic query
        searchQuery.append(query);
        
        // Add document type filter if specified
        if (documentType != null && !documentType.trim().isEmpty()) {
            searchQuery.append(" AND documentType:").append(documentType);
        }
        
        // Add compliance score boost
        searchQuery.append(" AND complianceScore:>0.7");
        
        return searchQuery.toString();
    }

    /**
     * Build search context from relevant documents
     */
    private String buildSearchContext(List<MedicalDocument> documents) {
        StringBuilder context = new StringBuilder();
        
        for (int i = 0; i < documents.size(); i++) {
            MedicalDocument doc = documents.get(i);
            context.append("Source ").append(i + 1).append(": ").append(doc.getDocumentName()).append("\n");
            context.append("Type: ").append(doc.getDocumentType()).append("\n");
            context.append("Compliance Score: ").append(doc.getComplianceScore()).append("\n");
            
            if (doc.getAiSummary() != null) {
                context.append("Summary: ").append(doc.getAiSummary()).append("\n");
            }
            
            if (doc.getExtractedText() != null) {
                // Include first 500 characters of extracted text
                String text = doc.getExtractedText().length() > 500 ? 
                    doc.getExtractedText().substring(0, 500) + "..." : 
                    doc.getExtractedText();
                context.append("Content: ").append(text).append("\n");
            }
            
            context.append("\n---\n\n");
        }
        
        return context.toString();
    }

    /**
     * Build search prompt for OpenAI
     */
    private String buildSearchPrompt(String query, String context) {
        return String.format(
            "Based on the following medical literature sources, please answer this question: %s\n\n" +
            "Sources:\n%s\n\n" +
            "Please provide:\n" +
            "1. A comprehensive answer based on the available sources\n" +
            "2. Specific citations to the source documents\n" +
            "3. Confidence level in your answer\n" +
            "4. Any limitations or areas where more research is needed\n" +
            "5. Clinical implications if applicable",
            query, context
        );
    }

    /**
     * Search for similar documents (for recommendation system)
     */
    public List<MedicalDocument> findSimilarDocuments(UUID documentId, int maxResults) {
        try {
            MedicalDocument sourceDoc = medicalDocumentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
            
            // Find documents with similar content or type
            List<MedicalDocument> similarDocs = medicalDocumentRepository
                .findByDocumentTypeAndIdNot(sourceDoc.getDocumentType(), documentId);
            
            // Simple similarity scoring based on content overlap
            return similarDocs.stream()
                .sorted((a, b) -> {
                    double similarityA = calculateSimilarity(sourceDoc, a);
                    double similarityB = calculateSimilarity(sourceDoc, b);
                    return Double.compare(similarityB, similarityA);
                })
                .limit(maxResults)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            logger.error("Error finding similar documents: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    /**
     * Calculate simple similarity between two documents
     */
    private double calculateSimilarity(MedicalDocument doc1, MedicalDocument doc2) {
        if (doc1.getExtractedText() == null || doc2.getExtractedText() == null) {
            return 0.0;
        }
        
        // Simple Jaccard similarity on words
        Set<String> words1 = new HashSet<>(Arrays.asList(doc1.getExtractedText().toLowerCase().split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(doc2.getExtractedText().toLowerCase().split("\\s+")));
        
        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);
        
        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);
        
        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }

    /**
     * RAG Search Result class
     */
    public static class RAGSearchResult {
        private String query;
        private String answer;
        private List<MedicalDocument> sourceDocuments;
        private Date searchTimestamp;
        private int resultCount;
        
        // Getters and setters
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
        
        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
        
        public List<MedicalDocument> getSourceDocuments() { return sourceDocuments; }
        public void setSourceDocuments(List<MedicalDocument> sourceDocuments) { this.sourceDocuments = sourceDocuments; }
        
        public Date getSearchTimestamp() { return searchTimestamp; }
        public void setSearchTimestamp(Date searchTimestamp) { this.searchTimestamp = searchTimestamp; }
        
        public int getResultCount() { return resultCount; }
        public void setResultCount(int resultCount) { this.resultCount = resultCount; }
    }
}
