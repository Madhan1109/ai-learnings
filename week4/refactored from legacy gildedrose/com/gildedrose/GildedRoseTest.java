package com.gildedrose;

import org.junit.Test;
import static org.junit.Assert.*;

public class GildedRoseTest {
    @Test
    public void foo() {
        Item[] items = new Item[] { new Item("foo", 0, 0) };
        GildedRose app = new GildedRose(items);
        app.updateQuality();
        assertEquals("foo", app.getItems()[0].getName());
    }
} 