package com.ai.learnings.healthinsurance.addon.service;

import com.ai.learnings.healthinsurance.addon.model.Addon;
import com.ai.learnings.healthinsurance.addon.repository.AddonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of AddonService.
 */
@Service
public class AddonServiceImpl implements AddonService {
    private final AddonRepository addonRepository;

    /**
     * Constructor for dependency injection.
     * @param addonRepository AddonRepository instance
     */
    @Autowired
    public AddonServiceImpl(AddonRepository addonRepository) {
        this.addonRepository = addonRepository;
    }

    /** {@inheritDoc} */
    @Override
    public Addon createAddon(Addon addon) {
        return addonRepository.save(addon);
    }

    /** {@inheritDoc} */
    @Override
    public List<Addon> getAllAddons() {
        return addonRepository.findAll();
    }

    /** {@inheritDoc} */
    @Override
    public Optional<Addon> getAddonById(Long id) {
        return addonRepository.findById(id);
    }

    /** {@inheritDoc} */
    @Override
    public void deleteAddon(Long id) {
        addonRepository.deleteById(id);
    }
} 