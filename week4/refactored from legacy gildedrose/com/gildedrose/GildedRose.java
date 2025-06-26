package com.gildedrose;

import java.util.HashMap;
import java.util.Map;

/**
 * The main GildedRose inventory class, refactored to use the strategy pattern for item updates.
 */
public class GildedRose {
    private final Item[] items;
    private final Map<String, ItemUpdater> updaters;

    /**
     * Constructs a GildedRose inventory.
     * @param items the array of items to manage
     */
    public GildedRose(Item[] items) {
        this.items = items;
        this.updaters = new HashMap<>();
        updaters.put("Aged Brie", new AgedBrieUpdater());
        updaters.put("Backstage passes to a TAFKAL80ETC concert", new BackstagePassUpdater());
        updaters.put("Sulfuras, Hand of Ragnaros", new SulfurasUpdater());
    }

    /**
     * Updates the quality and sellIn values for all items in the inventory.
     */
    public void updateQuality() {
        for (Item item : items) {
            ItemUpdater updater = updaters.getOrDefault(item.getName(), new DefaultItemUpdater());
            updater.update(item);
        }
    }

    /**
     * Returns the array of items managed by this inventory.
     * @return the array of items
     */
    public Item[] getItems() {
        return items;
    }
} 