package com.pgvaale.backend.repository;

import com.pgvaale.backend.entity.PgDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PgDetailsRepository extends JpaRepository<PgDetails, Long> {

}