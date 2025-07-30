package com.crm.customerservice.service;

import com.crm.customerservice.entity.Customer;
import com.crm.customerservice.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private AIService aiService;

    // Basic CRUD operations
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        // AI-powered lead scoring
        customer.setLeadScore(aiService.calculateLeadScore(customer));
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setName(customerDetails.getName());
            customer.setEmail(customerDetails.getEmail());
            customer.setPhone(customerDetails.getPhone());
            customer.setCompany(customerDetails.getCompany());
            customer.setIndustry(customerDetails.getIndustry());
            customer.setStatus(customerDetails.getStatus());
            customer.setAssignedTo(customerDetails.getAssignedTo());
            
            // Recalculate lead score with AI
            customer.setLeadScore(aiService.calculateLeadScore(customer));
            
            return customerRepository.save(customer);
        }
        return null;
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    // AI-Powered Features
    @Cacheable(value = "highValueLeads", key = "#minScore")
    public List<Customer> getHighValueLeads(Integer minScore) {
        return customerRepository.findHighValueLeads(minScore);
    }

    public List<Customer> getCustomersByIndustry(String industry) {
        return customerRepository.findByIndustry(industry);
    }

    public List<Customer> getCustomersByStatus(String status) {
        return customerRepository.findByStatus(status);
    }

    public List<Customer> getCustomersByAssignedUser(Long assignedTo) {
        return customerRepository.findByAssignedTo(assignedTo);
    }

    public List<Customer> searchCustomersByName(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Customer> searchCustomersByCompany(String company) {
        return customerRepository.findByCompanyContainingIgnoreCase(company);
    }

    // AI-Powered Analytics
    public CompletableFuture<Double> getAverageLeadScoreAsync() {
        return CompletableFuture.supplyAsync(() -> {
            Double avgScore = customerRepository.getAverageLeadScore();
            return avgScore != null ? avgScore : 0.0;
        });
    }

    public CompletableFuture<Long> getCustomerCountByStatusAsync(String status) {
        return CompletableFuture.supplyAsync(() -> 
            customerRepository.countByStatus(status)
        );
    }

    public List<Customer> getRecentCustomers(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return customerRepository.findRecentCustomers(startDate);
    }

    // AI-Powered Recommendations
    public String getNextBestAction(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            return aiService.getNextBestAction(customerOpt.get());
        }
        return "No recommendation available";
    }

    public Integer predictConversionProbability(Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isPresent()) {
            return aiService.predictConversionProbability(customerOpt.get());
        }
        return 0;
    }

    // Cache management
    public void clearCustomerCache() {
        redisTemplate.delete("highValueLeads");
    }

    // Bulk operations
    public List<Customer> createCustomers(List<Customer> customers) {
        customers.forEach(customer -> {
            customer.setLeadScore(aiService.calculateLeadScore(customer));
        });
        return customerRepository.saveAll(customers);
    }

    // Advanced search with multiple criteria
    public List<Customer> advancedSearch(String name, String company, String industry, String status) {
        // This would typically use a more sophisticated search implementation
        // For now, we'll use basic filtering
        List<Customer> allCustomers = customerRepository.findAll();
        
        return allCustomers.stream()
                .filter(customer -> name == null || customer.getName().toLowerCase().contains(name.toLowerCase()))
                .filter(customer -> company == null || (customer.getCompany() != null && 
                        customer.getCompany().toLowerCase().contains(company.toLowerCase())))
                .filter(customer -> industry == null || industry.equals(customer.getIndustry()))
                .filter(customer -> status == null || status.equals(customer.getStatus()))
                .toList();
    }
} 