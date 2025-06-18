package com.example.insurance.controller;

import com.example.insurance.model.Policy;
import com.example.insurance.service.PolicyService;
import com.example.insurance.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PolicyController.class)
class PolicyControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PolicyService policyService;
    @MockBean
    private UserService userService;

    @Test
    void testGetPolicy() throws Exception {
        Policy policy = Policy.builder().id(1L).policyNumber("POL123").build();
        when(policyService.getPolicyById(1L)).thenReturn(Optional.of(policy));

        mockMvc.perform(get("/api/policies/1").principal(() -> "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.policyNumber").value("POL123"));
    }
} 