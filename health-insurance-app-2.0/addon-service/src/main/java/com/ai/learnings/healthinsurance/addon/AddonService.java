package com.ai.learnings.healthinsurance.addon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AddonService {
    @Autowired
    private AddonRepository addonRepository;

    public Addon saveAddon(Addon addon) {
        return addonRepository.save(addon);
    }

    public List<Addon> getAllAddons() {
        return addonRepository.findAll();
    }

    public Optional<Addon> getAddonById(Long id) {
        return addonRepository.findById(id);
    }

    public void deleteAddon(Long id) {
        addonRepository.deleteById(id);
    }
} 