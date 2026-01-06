package com.animalxgym.manager.infrastructure.persistence;

import com.animalxgym.manager.domain.GymMember;
import com.animalxgym.manager.domain.GymMemberRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class JpaGymMemberRepositoryAdapter implements GymMemberRepository {
    private final JpaGymMemberRepository jpaRepository;

    public JpaGymMemberRepositoryAdapter(JpaGymMemberRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void saveOrUpdate(GymMember member) {
        jpaRepository.save(MemberEntityMapper.toEntity(member));
    }

    @Override
    public GymMember findById(Long id) {
        Optional<GymMemberEntity> entity = jpaRepository.findById(id);
        return entity.map(MemberEntityMapper::toDomain).orElse(null);
    }

    @Override
    public List<GymMember> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(MemberEntityMapper::toDomain)
                .collect(Collectors.toList());
    }
    @Override
    public void deleteAll() {
        jpaRepository.deleteAll();
    }
}
