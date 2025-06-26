package com.ai.learnings.healthinsurance.addon.service;

import com.ai.learnings.healthinsurance.addon.model.Addon;
import com.ai.learnings.healthinsurance.addon.repository.AddonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AddonServiceImplTest {
    @Mock
    private AddonRepository addonRepository;

    @InjectMocks
    private AddonServiceImpl addonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAddon() {
        Addon addon = Addon.builder().name("Roadside Assistance").build();
        when(addonRepository.save(addon)).thenReturn(addon);
        Addon saved = addonService.createAddon(addon);
        assertEquals("Roadside Assistance", saved.getName());
    }

    @Test
    void testGetAllAddons() {
        List<Addon> addons = Arrays.asList(Addon.builder().name("A").build(), Addon.builder().name("B").build());
        when(addonRepository.findAll()).thenReturn(addons);
        List<Addon> result = addonService.getAllAddons();
        assertEquals(2, result.size());
    }

    @Test
    void testGetAddonById() {
        Addon addon = Addon.builder().name("Roadside Assistance").build();
        when(addonRepository.findById(1L)).thenReturn(Optional.of(addon));
        Optional<Addon> found = addonService.getAddonById(1L);
        assertTrue(found.isPresent());
        assertEquals("Roadside Assistance", found.get().getName());
    }

    @Test
    void testDeleteAddon() {
        addonService.deleteAddon(1L);
        verify(addonRepository, times(1)).deleteById(1L);
    }
} 