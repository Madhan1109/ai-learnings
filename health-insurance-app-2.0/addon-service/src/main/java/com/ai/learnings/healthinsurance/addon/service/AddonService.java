package com.ai.learnings.healthinsurance.addon.service;

import com.ai.learnings.healthinsurance.addon.model.Addon;
import java.util.List;
import java.util.Optional;

/**
 * Service contract for Addon operations.
 */
public interface AddonService {
    /**
     * Create a new addon.
     * @param addon Addon to create
     * @return Created Addon
     */
    Addon createAddon(Addon addon);

    /**
     * Get all addons.
     * @return List of addons
     */
    List<Addon> getAllAddons();

    /**
     * Get an addon by its ID.
     * @param id Addon ID
     * @return Optional Addon
     */
    Optional<Addon> getAddonById(Long id);

    /**
     * Delete an addon by its ID.
     * @param id Addon ID
     */
    void deleteAddon(Long id);
} 