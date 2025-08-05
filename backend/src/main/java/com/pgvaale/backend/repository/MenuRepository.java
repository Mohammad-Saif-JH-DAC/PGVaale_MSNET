package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    
    List<Menu> findByTiffinIdAndIsActiveTrue(Long tiffinId);
    
    List<Menu> findByTiffinId(Long tiffinId);
    
    Optional<Menu> findByTiffinIdAndDayOfWeekAndIsActiveTrue(Long tiffinId, String dayOfWeek);
    
    Optional<Menu> findByTiffinIdAndMenuDateAndIsActiveTrue(Long tiffinId, LocalDate menuDate);
    
    @Query("SELECT m FROM Menu m WHERE m.tiffin.id = :tiffinId AND m.menuDate >= :startDate AND m.menuDate <= :endDate AND m.isActive = true")
    List<Menu> findByTiffinIdAndDateRange(@Param("tiffinId") Long tiffinId, 
                                         @Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);
} 