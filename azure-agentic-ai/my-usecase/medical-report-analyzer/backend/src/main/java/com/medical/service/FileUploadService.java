package com.medical.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Service for handling file uploads and storage
 * 
 * Manages:
 * - File validation and security
 * - Secure file storage
 * - File cleanup and management
 * - Upload directory organization
 */
@Service
public class FileUploadService {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadService.class);

    @Value("${app.file.upload.storage-path:./uploads}")
    private String uploadPath;

    @Value("${app.file.upload.max-size:10485760}")
    private long maxFileSize;

    @Value("${app.file.upload.allowed-types:pdf,jpg,jpeg,png}")
    private String allowedTypes;

    /**
     * Save uploaded file to storage
     * 
     * @param file MultipartFile to save
     * @return File path where saved
     */
    public String saveUploadedFile(MultipartFile file) throws IOException {
        try {
            // Validate file
            validateFile(file);
            
            // Create upload directory if it doesn't exist
            createUploadDirectory();
            
            // Generate unique filename
            String uniqueFilename = generateUniqueFilename(file.getOriginalFilename());
            Path filePath = Paths.get(uploadPath, uniqueFilename);
            
            // Save file
            Files.copy(file.getInputStream(), filePath);
            
            logger.info("Successfully saved uploaded file: {} to {}", 
                file.getOriginalFilename(), filePath);
            
            return filePath.toString();
            
        } catch (Exception e) {
            logger.error("Error saving uploaded file: {}", e.getMessage());
            throw new IOException("Failed to save uploaded file: " + e.getMessage(), e);
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                String.format("File size %d exceeds maximum allowed size %d", 
                    file.getSize(), maxFileSize));
        }
        
        String fileExtension = getFileExtension(file.getOriginalFilename());
        if (!isAllowedFileType(fileExtension)) {
            throw new IllegalArgumentException(
                String.format("File type %s is not allowed. Allowed types: %s", 
                    fileExtension, allowedTypes));
        }
    }

    /**
     * Create upload directory if it doesn't exist
     */
    private void createUploadDirectory() throws IOException {
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            logger.info("Created upload directory: {}", uploadDir);
        }
    }

    /**
     * Generate unique filename with timestamp
     */
    private String generateUniqueFilename(String originalFilename) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String extension = getFileExtension(originalFilename);
        
        return String.format("%s_%s.%s", timestamp, uuid, extension);
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    /**
     * Check if file type is allowed
     */
    private boolean isAllowedFileType(String fileExtension) {
        if (fileExtension == null || fileExtension.isEmpty()) {
            return false;
        }
        
        String[] allowedTypeArray = allowedTypes.toLowerCase().split(",");
        for (String allowedType : allowedTypeArray) {
            if (allowedType.trim().equals(fileExtension.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Delete uploaded file
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                logger.info("Successfully deleted file: {}", filePath);
                return true;
            } else {
                logger.warn("File not found for deletion: {}", filePath);
                return false;
            }
        } catch (IOException e) {
            logger.error("Error deleting file {}: {}", filePath, e.getMessage());
            return false;
        }
    }

    /**
     * Get file information
     */
    public FileInfo getFileInfo(String filePath) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                return new FileInfo(
                    path.getFileName().toString(),
                    Files.size(path),
                    Files.getLastModifiedTime(path).toInstant(),
                    getFileExtension(path.getFileName().toString())
                );
            } else {
                return null;
            }
        } catch (IOException e) {
            logger.error("Error getting file info for {}: {}", filePath, e.getMessage());
            return null;
        }
    }

    /**
     * Clean up old files (older than specified days)
     */
    public int cleanupOldFiles(int daysOld) {
        try {
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                return 0;
            }
            
            LocalDateTime cutoff = LocalDateTime.now().minusDays(daysOld);
            final int[] deletedCount = {0};
            
            Files.walk(uploadDir)
                .filter(Files::isRegularFile)
                .filter(path -> {
                    try {
                        return Files.getLastModifiedTime(path).toInstant()
                            .isBefore(cutoff.toInstant(java.time.ZoneOffset.UTC));
                    } catch (IOException e) {
                        return false;
                    }
                })
                .forEach(path -> {
                    try {
                        Files.delete(path);
                        deletedCount[0]++;
                        logger.info("Cleaned up old file: {}", path);
                    } catch (IOException e) {
                        logger.error("Error deleting old file {}: {}", path, e.getMessage());
                    }
                });
            
            logger.info("Cleanup completed. Deleted {} old files.", deletedCount[0]);
            return deletedCount[0];
            
        } catch (IOException e) {
            logger.error("Error during file cleanup: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * Get storage statistics
     */
    public StorageStats getStorageStats() {
        try {
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                return new StorageStats(0, 0, 0);
            }
            
            long totalFiles = Files.walk(uploadDir)
                .filter(Files::isRegularFile)
                .count();
            
            long totalSize = Files.walk(uploadDir)
                .filter(Files::isRegularFile)
                .mapToLong(path -> {
                    try {
                        return Files.size(path);
                    } catch (IOException e) {
                        return 0;
                    }
                })
                .sum();
            
            long freeSpace = uploadDir.toFile().getFreeSpace();
            
            return new StorageStats(totalFiles, totalSize, freeSpace);
            
        } catch (IOException e) {
            logger.error("Error getting storage stats: {}", e.getMessage());
            return new StorageStats(0, 0, 0);
        }
    }

    // Data classes for file information
    public static class FileInfo {
        private String filename;
        private long size;
        private java.time.Instant lastModified;
        private String extension;

        public FileInfo(String filename, long size, java.time.Instant lastModified, String extension) {
            this.filename = filename;
            this.size = size;
            this.lastModified = lastModified;
            this.extension = extension;
        }

        // Getters
        public String getFilename() { return filename; }
        public long getSize() { return size; }
        public java.time.Instant getLastModified() { return lastModified; }
        public String getExtension() { return extension; }
    }

    public static class StorageStats {
        private long totalFiles;
        private long totalSize;
        private long freeSpace;

        public StorageStats(long totalFiles, long totalSize, long freeSpace) {
            this.totalFiles = totalFiles;
            this.totalSize = totalSize;
            this.freeSpace = freeSpace;
        }

        // Getters
        public long getTotalFiles() { return totalFiles; }
        public long getTotalSize() { return totalSize; }
        public long getFreeSpace() { return freeSpace; }
    }
}
