package com.gildedrose;

/**
 * Strategy interface for updating an Item's quality and sellIn values.
 */
public interface ItemUpdater {
    void update(Item item);
} 