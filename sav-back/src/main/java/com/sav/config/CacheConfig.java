package com.sav.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                // Sites : rarement modifiés — TTL 1 heure
                new CaffeineCache("sites",
                        Caffeine.newBuilder()
                                .maximumSize(100)
                                .expireAfterWrite(Duration.ofHours(1))
                                .build()),
                // Compteur d'alertes stock : mis à jour à chaque mouvement — TTL 5 min
                new CaffeineCache("alertesCount",
                        Caffeine.newBuilder()
                                .maximumSize(10)
                                .expireAfterWrite(Duration.ofMinutes(5))
                                .build())
        ));
        return manager;
    }
}
