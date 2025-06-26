package com.ai.learnings.healthinsurance.addon.controller;

import com.ai.learnings.healthinsurance.addon.model.Addon;
import com.ai.learnings.healthinsurance.addon.service.AddonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for Addon operations.
 */
@RestController
@RequestMapping("/api/addons")
public class AddonController {
    private final AddonService addonService;

    /**
     * Constructor for dependency injection.
     * @param addonService AddonService instance
     */
    @Autowired
    public AddonController(AddonService addonService) {
        this.addonService = addonService;
    }

    /**
     * Create a new addon.
     * @param addon Addon to create
     * @return Created Addon
     */
    @PostMapping
    public ResponseEntity<Addon> createAddon(@RequestBody Addon addon) {
        return ResponseEntity.ok(addonService.createAddon(addon));
    }

    /**
     * Get all addons.
     * @return List of addons
     */
    @GetMapping
    public ResponseEntity<List<Addon>> getAllAddons() {
        return ResponseEntity.ok(addonService.getAllAddons());
    }

    /**
     * Get an addon by ID.
     * @param id Addon ID
     * @return Addon if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Addon> getAddonById(@PathVariable Long id) {
        return addonService.getAddonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an addon by ID.
     * @param id Addon ID
     * @return No content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddon(@PathVariable Long id) {
        addonService.deleteAddon(id);
        return ResponseEntity.noContent().build();
    }
} 