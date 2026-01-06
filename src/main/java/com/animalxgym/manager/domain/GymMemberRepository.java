package com.animalxgym.manager.domain;

import java.util.List;

public interface GymMemberRepository {
    void saveOrUpdate(GymMember member);
    GymMember findById(Long id);
    List<GymMember> findAll();
    void deleteAll();
}
