package com.medical.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for medical report analysis requests
 * 
 * This DTO contains:
 * - The medical report file to be analyzed
 * - Optional analysis preferences
 * - User context for personalized recommendations
 */
public class ReportAnalysisRequest {

    @NotNull(message = "Report file is required")
    private byte[] file;

    @Size(max = 255, message = "Filename must be less than 255 characters")
    private String fileName;

    @Size(max = 100, message = "MIME type must be less than 100 characters")
    private String fileType;

    @Size(max = 100, message = "Injury type must be less than 100 characters")
    private String injuryType;

    @Size(max = 100, message = "File size must be less than 100 characters")
    private long fileSize;

    @Size(max = 500, message = "Additional context must be less than 500 characters")
    private String additionalContext;

    // Constructors
    public ReportAnalysisRequest() {}

    public ReportAnalysisRequest(byte[] file, String fileName, String fileType, String injuryType, long fileSize) {
        this.file = file;
        this.fileName = fileName;
        this.fileType = fileType;
        this.injuryType = injuryType;
        this.fileSize = fileSize;
    }

    // Getters and Setters
    public byte[] getFile() { return file; }
    public void setFile(byte[] file) { this.file = file; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getInjuryType() { return injuryType; }
    public void setInjuryType(String injuryType) { this.injuryType = injuryType; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getAdditionalContext() { return additionalContext; }
    public void setAdditionalContext(String additionalContext) { this.additionalContext = additionalContext; }

    // Utility methods
    public boolean hasInjuryType() {
        return injuryType != null && !injuryType.trim().isEmpty();
    }

    public boolean hasAdditionalContext() {
        return additionalContext != null && !additionalContext.trim().isEmpty();
    }

    public String getFileExtension() {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        }
        return null;
    }

    public boolean isImageFile() {
        String extension = getFileExtension();
        return extension != null && (extension.equals("jpg") || extension.equals("jpeg") || extension.equals("png"));
    }

    public boolean isPdfFile() {
        String extension = getFileExtension();
        return extension != null && extension.equals("pdf");
    }

    public boolean isSupportedFileType() {
        return isImageFile() || isPdfFile();
    }
}
