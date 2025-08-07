package com.crm.customerservice.controller;

import com.crm.customerservice.entity.Customer;
import com.crm.customerservice.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Basic CRUD Operations
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer createdCustomer = customerService.createCustomer(customer);
        return ResponseEntity.ok(createdCustomer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        Customer updatedCustomer = customerService.updateCustomer(id, customer);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }

    // AI-Powered Features
    @GetMapping("/ai/high-value-leads")
    public ResponseEntity<List<Customer>> getHighValueLeads(
            @RequestParam(defaultValue = "70") Integer minScore) {
        List<Customer> highValueLeads = customerService.getHighValueLeads(minScore);
        return ResponseEntity.ok(highValueLeads);
    }

    @GetMapping("/ai/next-best-action/{customerId}")
    public ResponseEntity<String> getNextBestAction(@PathVariable Long customerId) {
        String recommendation = customerService.getNextBestAction(customerId);
        return ResponseEntity.ok(recommendation);
    }

    @GetMapping("/ai/conversion-probability/{customerId}")
    public ResponseEntity<Integer> getConversionProbability(@PathVariable Long customerId) {
        Integer probability = customerService.predictConversionProbability(customerId);
        return ResponseEntity.ok(probability);
    }

    // Search and Filter Operations
    @GetMapping("/search/name")
    public ResponseEntity<List<Customer>> searchByName(@RequestParam String name) {
        List<Customer> customers = customerService.searchCustomersByName(name);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/search/company")
    public ResponseEntity<List<Customer>> searchByCompany(@RequestParam String company) {
        List<Customer> customers = customerService.searchCustomersByCompany(company);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/filter/industry/{industry}")
    public ResponseEntity<List<Customer>> getCustomersByIndustry(@PathVariable String industry) {
        List<Customer> customers = customerService.getCustomersByIndustry(industry);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/filter/status/{status}")
    public ResponseEntity<List<Customer>> getCustomersByStatus(@PathVariable String status) {
        List<Customer> customers = customerService.getCustomersByStatus(status);
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/filter/assigned/{assignedTo}")
    public ResponseEntity<List<Customer>> getCustomersByAssignedUser(@PathVariable Long assignedTo) {
        List<Customer> customers = customerService.getCustomersByAssignedUser(assignedTo);
        return ResponseEntity.ok(customers);
    }

    // Advanced Search
    @GetMapping("/advanced-search")
    public ResponseEntity<List<Customer>> advancedSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String status) {
        List<Customer> customers = customerService.advancedSearch(name, company, industry, status);
        return ResponseEntity.ok(customers);
    }

    // Analytics Endpoints
    @GetMapping("/analytics/average-lead-score")
    public CompletableFuture<ResponseEntity<Double>> getAverageLeadScore() {
        return customerService.getAverageLeadScoreAsync()
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/count-by-status/{status}")
    public CompletableFuture<ResponseEntity<Long>> getCustomerCountByStatus(@PathVariable String status) {
        return customerService.getCustomerCountByStatusAsync(status)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/analytics/recent-customers")
    public ResponseEntity<List<Customer>> getRecentCustomers(@RequestParam(defaultValue = "30") int days) {
        List<Customer> customers = customerService.getRecentCustomers(days);
        return ResponseEntity.ok(customers);
    }

    // Bulk Operations
    @PostMapping("/bulk")
    public ResponseEntity<List<Customer>> createCustomers(@RequestBody List<Customer> customers) {
        List<Customer> createdCustomers = customerService.createCustomers(customers);
        return ResponseEntity.ok(createdCustomers);
    }

    // Cache Management
    @DeleteMapping("/cache/clear")
    public ResponseEntity<Void> clearCache() {
        customerService.clearCustomerCache();
        return ResponseEntity.ok().build();
    }

    // Health Check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Customer Service is running!");
    }

    // AI Analytics Summary
    @GetMapping("/ai/analytics-summary")
    public ResponseEntity<String> getAnalyticsSummary() {
        // This would typically return a comprehensive analytics summary
        return ResponseEntity.ok("AI Analytics Summary: High-value leads identified, conversion probabilities calculated, and next best actions recommended.");
    }
} 