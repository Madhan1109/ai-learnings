package com.ai.learnings.healthinsurance.addon;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AddonServiceTest {
    @Mock
    private AddonRepository addonRepository;

    @InjectMocks
    private AddonService addonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveAddon() {
        Addon addon = Addon.builder().name("Roadside Assistance").description("24/7 help").price(500).build();
        when(addonRepository.save(addon)).thenReturn(addon);
        Addon saved = addonService.saveAddon(addon);
        assertEquals("Roadside Assistance", saved.getName());
    }

    @Test
    void testGetAddonById() {
        Addon addon = Addon.builder().name("Roadside Assistance").description("24/7 help").price(500).build();
        when(addonRepository.findById(1L)).thenReturn(Optional.of(addon));
        Optional<Addon> found = addonService.getAddonById(1L);
        assertTrue(found.isPresent());
        assertEquals("Roadside Assistance", found.get().getName());
    }
} 