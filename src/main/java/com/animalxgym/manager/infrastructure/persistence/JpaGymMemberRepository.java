package com.animalxgym.manager.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaGymMemberRepository extends JpaRepository<GymMemberEntity, Long> {
    // Puedes agregar métodos personalizados si lo necesitas
}
