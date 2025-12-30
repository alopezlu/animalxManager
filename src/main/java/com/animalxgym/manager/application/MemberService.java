package com.animalxgym.manager.application;

import com.animalxgym.manager.domain.GymMember;
import com.animalxgym.manager.domain.GymMemberRepository;
import java.util.List;

@org.springframework.stereotype.Service
public class MemberService {
    private final GymMemberRepository repository;

    public MemberService(GymMemberRepository repository) {
        this.repository = repository;
    }

    public void saveOrUpdateMember(GymMember member) {
        repository.saveOrUpdate(member);
    }

    public GymMember getMemberById(Long id) {
        return repository.findById(id);
    }

    public List<GymMember> getAllMembers() {
        return repository.findAll();
    }
}
