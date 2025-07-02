package com.ai.learnings.healthinsurance.addon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addons")
public class AddonController {
    @Autowired
    private AddonService addonService;

    @PostMapping
    public ResponseEntity<Addon> createAddon(@RequestBody Addon addon) {
        return ResponseEntity.ok(addonService.saveAddon(addon));
    }

    @GetMapping
    public ResponseEntity<List<Addon>> getAllAddons() {
        return ResponseEntity.ok(addonService.getAllAddons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Addon> getAddonById(@PathVariable Long id) {
        return addonService.getAddonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddon(@PathVariable Long id) {
        addonService.deleteAddon(id);
        return ResponseEntity.noContent().build();
    }
} 